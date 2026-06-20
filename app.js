// ==============================================
// ADULTING — HOME MAINTENANCE TRACKER
// app.js v5
// ==============================================

const SUPABASE_URL  = 'https://vzgozesfrdluibzvqdcp.supabase.co';
const SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6Z296ZXNmcmRsdWlienZxZGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTYwNjYsImV4cCI6MjA5NzQ3MjA2Nn0.Wv3mRrRCXImCFQNWnfysGazwWrq_KfUfxq4_uL8xA68';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ==============================================
// STATE
// ==============================================
let currentUser     = null;
let allAssets       = [];
let allTasks        = [];
let allLog          = [];
let defaultTasks    = [];
let selectedCat     = 'hvac';
let selectedAssetId = null;
let selectedTaskId  = null;
let editingAssetId  = null;   // null = adding new, string = editing existing
let editingLogId    = null;   // null = new log entry, string = editing existing

// Estimated repair cost avoided per task completion (rough averages)
const REPAIR_VALUE = {
  hvac: 180, water: 150, appliance: 120,
  electrical: 100, plumbing: 130, roof: 200, other: 80
};

// ==============================================
// INIT
// ==============================================
document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await sb.auth.getSession();
  if (session) {
    currentUser = session.user;
    showApp();
  }

  sb.auth.onAuthStateChange((_event, session) => {
    if (session) {
      currentUser = session.user;
      showApp();
    } else {
      currentUser = null;
      showAuthScreen();
    }
  });
});

// ==============================================
// AUTH
// ==============================================
let authMode = 'signin';

function switchAuthTab(mode) {
  authMode = mode;
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-tab')[mode === 'signin' ? 0 : 1].classList.add('active');
  document.getElementById('name-field').style.display    = mode === 'signup' ? 'block' : 'none';
  document.getElementById('auth-submit-btn').textContent = mode === 'signup' ? 'Create account' : 'Sign in';
  document.getElementById('auth-switch-link').textContent = mode === 'signup' ? 'Already have an account? Sign in' : 'Create an account';
  document.getElementById('auth-error').style.display = 'none';
  document.getElementById('auth-password').autocomplete = mode === 'signup' ? 'new-password' : 'current-password';
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  const email    = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  const errEl    = document.getElementById('auth-error');
  errEl.style.display = 'none';

  const btn = document.getElementById('auth-submit-btn');
  btn.textContent = authMode === 'signup' ? 'Creating account…' : 'Signing in…';
  btn.disabled = true;

  let error;
  if (authMode === 'signup') {
    const name = document.getElementById('auth-name').value.trim();
    const { error: e } = await sb.auth.signUp({
      email, password,
      options: { data: { full_name: name } }
    });
    error = e;
    if (!error) {
      errEl.style.display = 'block';
      errEl.style.background = '#f0fdf4';
      errEl.style.color = '#166534';
      errEl.textContent = 'Account created! Check your email to confirm, then sign in.';
    }
  } else {
    const { error: e } = await sb.auth.signInWithPassword({ email, password });
    error = e;
  }

  btn.disabled = false;
  btn.textContent = authMode === 'signup' ? 'Create account' : 'Sign in';

  if (error) {
    errEl.style.display = 'block';
    errEl.style.background = '';
    errEl.style.color = '';
    errEl.textContent = error.message;
  }
}

async function signInWithGoogle() {
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  });
  if (error) alert(error.message);
}

async function handleForgotPassword() {
  const email = document.getElementById('auth-email').value.trim();
  if (!email) { alert('Enter your email address first.'); return; }
  const { error } = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin
  });
  if (error) alert(error.message);
  else alert('Password reset email sent! Check your inbox.');
}

async function signOut() {
  await sb.auth.signOut();
  toggleUserMenu(true);
}

// ==============================================
// APP / AUTH SCREEN TOGGLE
// ==============================================
function showAuthScreen() {
  document.getElementById('auth-screen').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
}

async function showApp() {
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('app').style.display = 'block';

  // Populate user menu
  const name  = currentUser.user_metadata?.full_name || '';
  const email = currentUser.email || '';
  document.getElementById('user-menu-name').textContent  = name;
  document.getElementById('user-menu-email').textContent = email;

  await loadDefaultTasks();
  await refreshAll();
}

// ==============================================
// DATA LOADING
// ==============================================
async function loadDefaultTasks() {
  const { data } = await sb.from('default_tasks')
    .select('id, category, name, interval_days, description, tips_parts, tips_tools, tips_how');
  defaultTasks = data || [];
}

async function refreshAll() {
  await Promise.all([loadAssets(), loadLog()]);
  await loadTasks();
  renderDashboard();
  renderAssets();
  renderLog();
  renderSavings();
}

async function loadAssets() {
  const { data } = await sb
    .from('assets')
    .select('*')
    .order('created_at', { ascending: false });
  allAssets = data || [];
}

async function loadTasks() {
  const { data } = await sb
    .from('maintenance_tasks')
    .select('*, assets(name, category)')
    .eq('is_active', true)
    .order('next_due_at', { ascending: true });
  allTasks = data || [];
}

async function loadLog() {
  const { data } = await sb
    .from('maintenance_log')
    .select('*, assets(name, category), maintenance_tasks(name)')
    .order('completed_at', { ascending: false })
    .limit(50);
  allLog = data || [];
}

// ==============================================
// DASHBOARD
// ==============================================
function renderDashboard() {
  const now   = new Date();
  const soon  = new Date(now); soon.setDate(soon.getDate() + 60);

  const overdue  = allTasks.filter(t => t.next_due_at && new Date(t.next_due_at) < now && t.last_completed_at);
  const upcoming = allTasks.filter(t => {
    const d = t.next_due_at ? new Date(t.next_due_at) : null;
    return d && d >= now && d <= soon;
  });

  document.getElementById('stat-overdue').textContent = overdue.length;
  document.getElementById('stat-soon').textContent    = upcoming.length;
  document.getElementById('stat-assets').textContent  = allAssets.length;

  const overdueWrap = document.getElementById('dash-overdue-wrap');
  overdueWrap.style.display = overdue.length ? 'block' : 'none';
  document.getElementById('dash-overdue').innerHTML = overdue.map(t => taskItemHTML(t, 'overdue')).join('') || '';

  const upcomingEl = document.getElementById('dash-upcoming');
  upcomingEl.innerHTML = upcoming.length
    ? upcoming.map(t => taskItemHTML(t, 'upcoming')).join('')
    : '<div class="empty-state"><i class="fa-solid fa-circle-check"></i><p>All caught up!</p></div>';
}

function taskItemHTML(task, type) {
  const due    = task.next_due_at ? new Date(task.next_due_at) : null;
  const now    = new Date();
  const assetName = task.assets?.name || 'Unknown asset';
  const interval  = intervalLabel(task.interval_days);

  let dueLabel = '', dueClass = 'ok';
  if (due) {
    const diff = Math.round((due - now) / 86400000);
    if (diff < 0) {
      if (!task.last_completed_at) { dueLabel = 'Initial'; dueClass = 'initial'; }
      else { dueLabel = `${Math.abs(diff)}d overdue`; dueClass = 'overdue'; }
    }
    else if (diff === 0) { dueLabel = 'Due today'; dueClass = 'soon'; }
    else if (diff <= 14) { dueLabel = `In ${diff}d`; dueClass = 'soon'; }
    else { dueLabel = `In ${Math.round(diff / 7)}w`; dueClass = 'ok'; }
  }

  return `
    <div class="task-item ${dueClass}" onclick="openTaskDetail('${task.id}')">
      <button class="task-check-btn" onclick="event.stopPropagation(); completeTask('${task.id}')" title="Mark done">
        <i class="fa-solid fa-check" style="display:none"></i>
      </button>
      <div class="task-info">
        <div class="task-name">${task.name}</div>
        <div class="task-meta">${assetName} · ${interval}</div>
      </div>
      <div class="task-due ${dueClass}">${dueLabel}</div>
      <i class="fa-solid fa-chevron-right task-chevron"></i>
    </div>`;
}

function intervalLabel(days) {
  if (days <= 30) return 'Monthly';
  if (days <= 95) return 'Quarterly';
  if (days <= 200) return 'Every 6 months';
  return 'Annual';
}

// ==============================================
// ASSETS
// ==============================================
const CATEGORY_ICONS = {
  hvac: 'fa-wind', water: 'fa-droplet', appliance: 'fa-plug',
  electrical: 'fa-bolt', plumbing: 'fa-faucet', roof: 'fa-house', other: 'fa-box'
};

function renderAssets() {
  const el = document.getElementById('asset-list');
  if (!allAssets.length) {
    el.innerHTML = '<div class="empty-state"><i class="fa-solid fa-wrench"></i><p>No assets yet. Add your first one!</p></div>';
    return;
  }

  const grouped = {};
  allAssets.forEach(a => {
    if (!grouped[a.category]) grouped[a.category] = [];
    grouped[a.category].push(a);
  });

  const catOrder = ['hvac','water','appliance','electrical','plumbing','roof','other'];
  el.innerHTML = catOrder.filter(c => grouped[c]).map(cat => {
    const label = { hvac:'HVAC', water:'Water', appliance:'Appliances',
      electrical:'Electrical', plumbing:'Plumbing', roof:'Roof & Exterior', other:'Other' }[cat];
    return `
      <div class="asset-section">
        <div class="asset-section-title">${label}</div>
        ${grouped[cat].map(a => assetCardHTML(a)).join('')}
      </div>`;
  }).join('');
}

function assetCardHTML(asset) {
  const tasks    = allTasks.filter(t => t.asset_id === asset.id);
  const overdue  = tasks.filter(t => t.next_due_at && new Date(t.next_due_at) < new Date()).length;
  const icon     = CATEGORY_ICONS[asset.category] || 'fa-box';
  const yearStr  = asset.install_year ? `Installed ${asset.install_month ? monthName(asset.install_month) + ' ' : ''}${asset.install_year}` : '';

  let badgeHTML = '';
  if (overdue > 0) badgeHTML = `<span class="badge badge-overdue">${overdue} overdue</span>`;
  else if (tasks.length > 0) badgeHTML = `<span class="badge badge-ok">${tasks.length} tasks</span>`;
  else badgeHTML = `<span class="badge badge-gray">No tasks</span>`;

  return `
    <div class="asset-card" onclick="openAsset('${asset.id}')">
      <div class="asset-icon ${asset.category}"><i class="fa-solid ${icon}"></i></div>
      <div class="asset-info">
        <div class="asset-name">${asset.name}</div>
        <div class="asset-sub">${yearStr}</div>
      </div>
      ${badgeHTML}
    </div>`;
}

function monthName(m) {
  return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m - 1] || '';
}

function openAsset(id) {
  const asset = allAssets.find(a => a.id === id);
  if (!asset) return;
  selectedAssetId = id;

  document.getElementById('detail-title').textContent = asset.name;

  // Info grid
  const fields = [];
  if (asset.brand)  fields.push(['Brand', asset.brand]);
  if (asset.model)  fields.push(['Model', asset.model]);
  if (asset.install_year) {
    const yr = (asset.install_month ? monthName(asset.install_month) + ' ' : '') + asset.install_year;
    fields.push(['Installed', yr]);
  }
  const catLabel = { hvac:'HVAC', water:'Water', appliance:'Appliance',
    electrical:'Electrical', plumbing:'Plumbing', roof:'Roof/Exterior', other:'Other' }[asset.category] || asset.category;
  fields.push(['Category', catLabel]);

  let gridHTML = '<div class="detail-info-grid">';
  fields.forEach(([label, val]) => {
    gridHTML += `<div class="detail-info-item"><div class="detail-info-label">${label}</div><div class="detail-info-value">${val}</div></div>`;
  });
  if (asset.notes) {
    gridHTML += `<div class="detail-info-item full-width"><div class="detail-info-label">Notes</div><div class="detail-info-value">${asset.notes}</div></div>`;
  }
  gridHTML += '</div>';
  document.getElementById('detail-meta').innerHTML = gridHTML;

  // Tasks
  const tasks = allTasks.filter(t => t.asset_id === id);
  const tasksEl = document.getElementById('detail-tasks');
  tasksEl.innerHTML = tasks.length
    ? tasks.map(t => taskItemHTML(t, 'detail')).join('')
    : '<div class="empty-state" style="padding:16px 0"><p>No tasks added yet.</p></div>';

  openDrawer('asset-detail-drawer');
}

async function confirmDeleteAsset() {
  if (!confirm('Delete this asset and all its maintenance data? This can\'t be undone.')) return;
  await deleteAsset(selectedAssetId);
}

async function deleteAsset(id) {
  await sb.from('maintenance_log').delete().eq('asset_id', id);
  await sb.from('maintenance_tasks').delete().eq('asset_id', id);
  const { error } = await sb.from('assets').delete().eq('id', id);
  if (error) { alert('Error deleting asset: ' + error.message); return; }
  closeDrawer('asset-detail-drawer');
  await refreshAll();
}

// ==============================================
// TASK DETAIL
// ==============================================
function openTaskDetail(taskId) {
  const task = allTasks.find(t => t.id === taskId);
  if (!task) return;
  selectedTaskId = taskId;

  // Header
  document.getElementById('td-name').textContent = task.name;

  // Status / meta pills
  const due     = task.next_due_at ? new Date(task.next_due_at) : null;
  const now     = new Date();
  const asset   = allAssets.find(a => a.id === task.asset_id);
  const icon    = asset ? (CATEGORY_ICONS[asset.category] || 'fa-box') : 'fa-box';

  let statusLabel = '', statusClass = 'ok';
  if (due) {
    const diff = Math.round((due - now) / 86400000);
    if (diff < 0) {
      if (!task.last_completed_at) { statusLabel = 'Initial setup'; statusClass = 'initial'; }
      else { statusLabel = `${Math.abs(diff)} days overdue`; statusClass = 'overdue'; }
    } else if (diff === 0) { statusLabel = 'Due today'; statusClass = 'soon'; }
    else if (diff <= 14)   { statusLabel = `Due in ${diff} days`; statusClass = 'soon'; }
    else { statusLabel = `Due in ${Math.round(diff/7)} weeks`; statusClass = 'ok'; }
  }

  const lastDone = task.last_completed_at
    ? 'Last done ' + new Date(task.last_completed_at).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })
    : 'Never completed';

  document.getElementById('td-meta').innerHTML = `
    ${statusLabel ? `<span class="td-pill ${statusClass}"><i class="fa-solid fa-clock"></i>${statusLabel}</span>` : ''}
    <span class="td-pill"><i class="fa-solid ${icon}"></i>${asset?.name || 'Unknown asset'}</span>
    <span class="td-pill"><i class="fa-solid fa-rotate"></i>${intervalLabel(task.interval_days)}</span>
    <span class="td-pill"><i class="fa-solid fa-history"></i>${lastDone}</span>`;

  // Rich content — match against default_tasks by name
  const def = defaultTasks.find(d =>
    d.name.toLowerCase() === task.name.toLowerCase() ||
    task.name.toLowerCase().includes(d.name.toLowerCase()) ||
    d.name.toLowerCase().includes(task.name.toLowerCase())
  );

  function showSection(sectionId, textId, content) {
    const el = document.getElementById(sectionId);
    if (content) { el.style.display = 'block'; document.getElementById(textId).textContent = content; }
    else { el.style.display = 'none'; }
  }

  if (def) {
    showSection('td-description', 'td-description-text', def.description);
    showSection('td-parts',       'td-parts-text',        def.tips_parts);
    showSection('td-tools',       'td-tools-text',        def.tips_tools);

    const howEl = document.getElementById('td-how');
    if (def.tips_how) {
      howEl.style.display = 'block';
      const steps = def.tips_how.split('\n').filter(s => s.trim());
      document.getElementById('td-how-steps').innerHTML = steps
        .map(s => `<li>${s.replace(/^\d+\.\s*/, '')}</li>`)
        .join('');
    } else {
      howEl.style.display = 'none';
    }
  } else {
    ['td-description','td-how','td-parts','td-tools'].forEach(id => {
      document.getElementById(id).style.display = 'none';
    });
  }

  openDrawer('task-detail-drawer');
}

async function completeCurrentTask() {
  if (!selectedTaskId) return;
  const btn = document.getElementById('td-complete-btn');
  btn.disabled = true;
  btn.textContent = 'Saving…';
  await completeTask(selectedTaskId);
  closeDrawer('task-detail-drawer');
  btn.disabled = false;
  btn.innerHTML = '<i class="fa-solid fa-check"></i> Mark done';
}

// ==============================================
// ADD ASSET
// ==============================================
function showAddAsset() {
  editingAssetId = null;
  selectedCat = 'hvac';
  document.getElementById('asset-drawer-title').textContent = 'Add asset';
  document.getElementById('asset-save-btn').textContent = 'Save asset';
  document.getElementById('suggested-tasks-section').style.display = 'block';
  document.querySelectorAll('#category-chips .chip').forEach(c => {
    c.classList.toggle('active', c.dataset.cat === 'hvac');
  });
  ['asset-name','asset-brand','asset-model','asset-notes'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('asset-install-year').value  = '';
  document.getElementById('asset-install-month').value = '';
  renderSuggestedTasks('hvac');
  openDrawer('asset-drawer');
}

function showEditAsset(id) {
  const asset = allAssets.find(a => a.id === id);
  if (!asset) return;
  editingAssetId = id;
  selectedCat = asset.category;

  document.getElementById('asset-drawer-title').textContent = 'Edit asset';
  document.getElementById('asset-save-btn').textContent = 'Update asset';
  document.getElementById('suggested-tasks-section').style.display = 'none';

  // Set category chip
  document.querySelectorAll('#category-chips .chip').forEach(c => {
    c.classList.toggle('active', c.dataset.cat === asset.category);
  });

  // Fill fields
  document.getElementById('asset-name').value          = asset.name || '';
  document.getElementById('asset-brand').value         = asset.brand || '';
  document.getElementById('asset-model').value         = asset.model || '';
  document.getElementById('asset-notes').value         = asset.notes || '';
  document.getElementById('asset-install-year').value  = asset.install_year || '';
  document.getElementById('asset-install-month').value = asset.install_month || '';

  document.getElementById('asset-save-error').style.display = 'none';
  closeDrawer('asset-detail-drawer');
  openDrawer('asset-drawer');
}

function selectCategory(btn) {
  document.querySelectorAll('#category-chips .chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  selectedCat = btn.dataset.cat;
  renderSuggestedTasks(selectedCat);
}

function renderSuggestedTasks(cat) {
  const tasks = defaultTasks.filter(t => t.category === cat);
  document.getElementById('suggested-tasks').innerHTML = tasks.map(t => `
    <label class="task-check-item">
      <input type="checkbox" checked data-task-id="${t.id}" data-name="${t.name}" data-interval="${t.interval_days}">
      <div class="task-check-item-info">
        <div class="task-check-item-name">${t.name}</div>
        <div class="task-check-item-interval">${intervalLabel(t.interval_days)}</div>
      </div>
    </label>`).join('');
}

async function saveAsset() {
  const name = document.getElementById('asset-name').value.trim();
  if (!name) { showError('asset-save-error', 'Please enter an asset name.'); return; }

  const installYear  = parseInt(document.getElementById('asset-install-year').value) || null;
  const installMonth = parseInt(document.getElementById('asset-install-month').value) || null;
  const payload = {
    category:      selectedCat,
    name,
    brand:         document.getElementById('asset-brand').value.trim() || null,
    model:         document.getElementById('asset-model').value.trim() || null,
    install_year:  installYear,
    install_month: installMonth,
    notes:         document.getElementById('asset-notes').value.trim() || null
  };

  if (editingAssetId) {
    // UPDATE existing asset
    const { error } = await sb.from('assets').update(payload).eq('id', editingAssetId);
    if (error) { showError('asset-save-error', error.message); return; }
  } else {
    // INSERT new asset + suggested tasks
    const { data: asset, error } = await sb.from('assets')
      .insert({ ...payload, user_id: currentUser.id }).select().single();
    if (error) { showError('asset-save-error', error.message); return; }

    const checked = document.querySelectorAll('#suggested-tasks input[type="checkbox"]:checked');
    if (checked.length > 0) {
      const taskRows = Array.from(checked).map(cb => {
        const nextDue = computeNextDue(installYear, installMonth, parseInt(cb.dataset.interval));
        return {
          asset_id:      asset.id,
          user_id:       currentUser.id,
          name:          cb.dataset.name,
          interval_days: parseInt(cb.dataset.interval),
          next_due_at:   nextDue
        };
      });
      await sb.from('maintenance_tasks').insert(taskRows);
    }
  }

  closeDrawer('asset-drawer');
  await refreshAll();
}

function computeNextDue(installYear, installMonth, intervalDays) {
  // Start from install date if known, otherwise from today
  let base = new Date();
  if (installYear) {
    base = new Date(installYear, (installMonth || 1) - 1, 1);
  }
  // Roll forward by interval until next_due is in the future
  const now = new Date();
  while (base < now) {
    base = new Date(base.getTime() + intervalDays * 86400000);
  }
  return base.toISOString();
}

// ==============================================
// COMPLETE TASK
// ==============================================
async function completeTask(taskId) {
  const task = allTasks.find(t => t.id === taskId);
  if (!task) return;

  const now     = new Date();
  const nextDue = new Date(now.getTime() + task.interval_days * 86400000);

  // Log the completion
  await sb.from('maintenance_log').insert({
    task_id:      taskId,
    asset_id:     task.asset_id,
    user_id:      currentUser.id,
    completed_at: now.toISOString(),
    cost:         0
  });

  // Update task's next due date
  await sb.from('maintenance_tasks').update({
    last_completed_at: now.toISOString(),
    next_due_at:       nextDue.toISOString()
  }).eq('id', taskId);

  await refreshAll();
}

// ==============================================
// LOG ENTRY
// ==============================================
function showLogEntry() {
  editingLogId = null;
  document.getElementById('log-drawer-title').textContent = 'Log maintenance';
  document.getElementById('log-save-btn').textContent = 'Save entry';
  document.getElementById('log-asset').disabled = false;
  document.getElementById('log-task').disabled  = false;

  const assetSel = document.getElementById('log-asset');
  assetSel.innerHTML = '<option value="">Select asset…</option>' +
    allAssets.map(a => `<option value="${a.id}">${a.name}</option>`).join('');

  document.getElementById('log-task').innerHTML = '<option value="">Select asset first…</option>';
  document.getElementById('log-date').value    = new Date().toISOString().split('T')[0];
  document.getElementById('log-cost').value    = '';
  document.getElementById('log-done-by').value = '';
  document.getElementById('log-notes').value   = '';
  document.getElementById('log-save-error').style.display = 'none';
  openDrawer('log-drawer');
}

function showEditLogEntry(entryId) {
  const entry = allLog.find(e => e.id === entryId);
  if (!entry) return;
  editingLogId = entryId;

  document.getElementById('log-drawer-title').textContent = 'Edit log entry';
  document.getElementById('log-save-btn').textContent = 'Update entry';

  // Populate asset dropdown and lock it (can't change asset on edit)
  const assetSel = document.getElementById('log-asset');
  assetSel.innerHTML = allAssets.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
  assetSel.value    = entry.asset_id;
  assetSel.disabled = true;

  // Populate task dropdown
  const tasks = allTasks.filter(t => t.asset_id === entry.asset_id);
  const taskSel = document.getElementById('log-task');
  taskSel.innerHTML = '<option value="">General maintenance</option>' +
    tasks.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  taskSel.value    = entry.task_id || '';
  taskSel.disabled = true;

  document.getElementById('log-date').value    = entry.completed_at.split('T')[0];
  document.getElementById('log-cost').value    = entry.cost || '';
  document.getElementById('log-done-by').value = entry.done_by || '';
  document.getElementById('log-notes').value   = entry.notes || '';
  document.getElementById('log-save-error').style.display = 'none';
  openDrawer('log-drawer');
}

async function loadLogTasks() {
  const assetId = document.getElementById('log-asset').value;
  const taskSel = document.getElementById('log-task');
  if (!assetId) { taskSel.innerHTML = '<option>Select asset first…</option>'; return; }

  const tasks = allTasks.filter(t => t.asset_id === assetId);
  taskSel.innerHTML = '<option value="">General maintenance</option>' +
    tasks.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
}

async function saveLogEntry() {
  const assetId = document.getElementById('log-asset').value;
  if (!assetId) { showError('log-save-error', 'Please select an asset.'); return; }

  const taskId = document.getElementById('log-task').value || null;
  const date   = document.getElementById('log-date').value;
  const cost   = parseFloat(document.getElementById('log-cost').value) || 0;
  const payload = {
    completed_at: new Date(date).toISOString(),
    cost,
    done_by: document.getElementById('log-done-by').value.trim() || null,
    notes:   document.getElementById('log-notes').value.trim() || null
  };

  if (editingLogId) {
    // UPDATE existing log entry
    const { error } = await sb.from('maintenance_log').update(payload).eq('id', editingLogId);
    if (error) { showError('log-save-error', error.message); return; }
    // If a task is linked, recalculate its next_due based on the new date
    if (taskId) {
      const task    = allTasks.find(t => t.id === taskId);
      const nextDue = new Date(new Date(date).getTime() + task.interval_days * 86400000);
      await sb.from('maintenance_tasks').update({
        last_completed_at: new Date(date).toISOString(),
        next_due_at:       nextDue.toISOString()
      }).eq('id', taskId);
    }
  } else {
    // INSERT new log entry
    const { error } = await sb.from('maintenance_log').insert({
      ...payload, task_id: taskId, asset_id: assetId, user_id: currentUser.id
    });
    if (error) { showError('log-save-error', error.message); return; }
    if (taskId) {
      const task    = allTasks.find(t => t.id === taskId);
      const nextDue = new Date(new Date(date).getTime() + task.interval_days * 86400000);
      await sb.from('maintenance_tasks').update({
        last_completed_at: new Date(date).toISOString(),
        next_due_at:       nextDue.toISOString()
      }).eq('id', taskId);
    }
  }

  closeDrawer('log-drawer');
  await refreshAll();
}

async function deleteLogEntry(entryId) {
  const entry = allLog.find(e => e.id === entryId);
  if (!confirm('Remove this log entry?')) return;

  await sb.from('maintenance_log').delete().eq('id', entryId);

  // If the entry was linked to a task, roll back the task's last_completed_at / next_due
  if (entry?.task_id) {
    const task = allTasks.find(t => t.id === entry.task_id);
    // Find the most recent remaining log entry for this task (excluding the one we just deleted)
    const { data: remaining } = await sb.from('maintenance_log')
      .select('completed_at')
      .eq('task_id', entry.task_id)
      .order('completed_at', { ascending: false })
      .limit(1);

    if (remaining && remaining.length > 0) {
      const prevDate = remaining[0].completed_at;
      const nextDue  = new Date(new Date(prevDate).getTime() + (task?.interval_days || 365) * 86400000);
      await sb.from('maintenance_tasks').update({
        last_completed_at: prevDate,
        next_due_at:       nextDue.toISOString()
      }).eq('id', entry.task_id);
    } else {
      // No remaining entries — restore to initial state
      const asset = allAssets.find(a => a.id === entry.asset_id);
      const nextDue = computeNextDue(asset?.install_year, asset?.install_month, task?.interval_days || 365);
      await sb.from('maintenance_tasks').update({
        last_completed_at: null,
        next_due_at:       nextDue
      }).eq('id', entry.task_id);
    }
  }

  await refreshAll();
}

// ==============================================
// LOG & SAVINGS RENDER
// ==============================================
function renderLog() {
  const el = document.getElementById('log-list');
  if (!allLog.length) {
    el.innerHTML = '<div class="empty-state"><i class="fa-solid fa-clipboard-list"></i><p>No entries yet.</p></div>';
    return;
  }
  el.innerHTML = allLog.map(entry => {
    const taskName  = entry.maintenance_tasks?.name || 'General maintenance';
    const assetName = entry.assets?.name || '';
    const date      = new Date(entry.completed_at).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
    const costStr   = entry.cost > 0 ? `$${entry.cost.toFixed(2)}` : 'Free';
    const by        = entry.done_by ? ` · ${entry.done_by}` : '';
    return `
      <div class="log-item">
        <div class="log-dot"></div>
        <div class="task-info">
          <div class="log-title">${taskName}</div>
          <div class="log-meta">${assetName} · ${date}${by}</div>
        </div>
        <div class="log-cost">${costStr}</div>
        <div class="log-actions">
          <button class="log-action-btn" onclick="showEditLogEntry('${entry.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
          <button class="log-action-btn danger" onclick="deleteLogEntry('${entry.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>`;
  }).join('');
}

function renderSavings() {
  const totalSpent  = allLog.reduce((sum, e) => sum + (e.cost || 0), 0);
  const avoided     = allLog.reduce((sum, e) => {
    const cat = e.assets?.category || 'other';
    return sum + (REPAIR_VALUE[cat] || 80);
  }, 0);
  const ret = totalSpent > 0 ? (avoided / totalSpent).toFixed(1) + '×' : '—';

  document.getElementById('savings-spent').textContent  = '$' + totalSpent.toLocaleString();
  document.getElementById('savings-avoided').textContent = '$' + avoided.toLocaleString();
  document.getElementById('savings-return').textContent  = ret;

  // Bar chart by asset
  const byAsset = {};
  allLog.forEach(e => {
    const name = e.assets?.name || 'Unknown';
    const cat  = e.assets?.category || 'other';
    if (!byAsset[name]) byAsset[name] = { avoided: 0, cat };
    byAsset[name].avoided += REPAIR_VALUE[cat] || 80;
  });

  const maxAvoided = Math.max(...Object.values(byAsset).map(v => v.avoided), 1);
  const el = document.getElementById('savings-log');

  if (!allLog.length) {
    el.innerHTML = '<div class="empty-state"><i class="fa-solid fa-chart-bar"></i><p>Log maintenance to see your savings.</p></div>';
    return;
  }

  el.innerHTML = Object.entries(byAsset).map(([name, v]) => `
    <div class="savings-bar-item">
      <div class="savings-bar-label">
        <span>${name}</span>
        <span>$${v.avoided.toLocaleString()} avoided</span>
      </div>
      <div class="savings-bar-track">
        <div class="savings-bar-fill" style="width:${Math.round(v.avoided / maxAvoided * 100)}%"></div>
      </div>
    </div>`).join('');
}

// ==============================================
// UI HELPERS
// ==============================================
function showPage(name, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  btn.classList.add('active');
}

function openDrawer(id) {
  document.getElementById(id).style.display = 'block';
  document.getElementById('drawer-overlay').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeDrawer(id) {
  document.getElementById(id).style.display = 'none';
  document.getElementById('drawer-overlay').style.display = 'none';
  document.body.style.overflow = '';
}

function closeAllDrawers() {
  ['asset-drawer','log-drawer','asset-detail-drawer','task-detail-drawer'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
  document.getElementById('drawer-overlay').style.display = 'none';
  document.body.style.overflow = '';
}

function toggleUserMenu(forceClose) {
  const menu = document.getElementById('user-menu');
  menu.style.display = (forceClose || menu.style.display !== 'none') ? 'none' : 'block';
}

function showError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.style.display = 'block';
}

// Close user menu on outside click
document.addEventListener('click', e => {
  const menu = document.getElementById('user-menu');
  if (menu && menu.style.display !== 'none') {
    if (!e.target.closest('.topbar-right')) menu.style.display = 'none';
  }
});
