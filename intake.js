// ==============================================
// HOME SETUP WIZARD — intake.js v2
// ==============================================

// ── ICON MAP ──────────────────────────────────
const INTAKE_ICON_MAP = {
  ac:              'fa-snowflake',
  furnace:         'fa-fire',
  boiler:          'fa-fire',
  minisplit:       'fa-wind',
  rtu:             'fa-building',
  'water-heater':  'fa-droplet',
  tankless:        'fa-bolt',
  softener:        'fa-filter',
  filter:          'fa-filter',
  sump:            'fa-water',
  well:            'fa-droplet',
  radon:           'fa-circle-exclamation',
  crawl:           'fa-layer-group',
  'garage-door':   'fa-warehouse',
  opener:          'fa-door-open',
  generator:       'fa-plug',
  'ev-charger':    'fa-car',
  fridge:          'fa-snowflake',
  dishwasher:      'fa-faucet',
  range:           'fa-fire',
  disposal:        'fa-trash',
  washer:          'fa-rotate',
  dryer:           'fa-wind',
  roof:            'fa-house-chimney',
  gutters:         'fa-angles-down',
  deck:            'fa-sun',
  driveway:        'fa-road',
  irrigation:      'fa-seedling',
  toilet:          'fa-toilet',
  'exhaust-fan':   'fa-fan',
  shower:          'fa-shower',
  insulation:      'fa-layer-group',
  'house-fan':     'fa-fan',
  vent:            'fa-fan',
  solar:           'fa-sun',
  other:           'fa-plus-circle',
};

const INTAKE_CAT_OPTIONS = [
  { value: 'hvac',      label: 'Heating & Cooling' },
  { value: 'water',     label: 'Water & Plumbing' },
  { value: 'electrical',label: 'Electrical' },
  { value: 'appliance', label: 'Appliance' },
  { value: 'plumbing',  label: 'Plumbing' },
  { value: 'roof',      label: 'Roof / Exterior' },
  { value: 'other',     label: 'Other' },
];

// ── ROOM / ITEM DATA ──────────────────────────
const INTAKE_ROOMS = [
  {
    id: 'hvac',
    icon: 'fa-wind',
    name: 'Heating & cooling',
    intro: 'Check the basement, utility closet, or attic for the furnace — then walk outside to see if there\'s a unit on a concrete pad beside the house.',
    items: [
      {
        id: 'central-ac',
        name: 'Central AC / heat pump (outdoor unit)',
        category: 'hvac',
        svgKey: 'ac',
        location: 'Outside on a concrete pad beside the house',
        tip: 'Large metal box (2–4 ft square) with fins around the sides and a fan on top. Copper refrigerant lines wrapped in black foam run from it into the house. If it also runs in winter for heating, it\'s a heat pump.',
        labelTip: 'Side panel of the outdoor unit. The serial number first 4 digits often encode the manufacture year (e.g. "2018" = 2018).',
        sub: { q: 'Does it also heat your home in winter?', opts: ['Yes — it\'s a heat pump', 'No — cooling only', 'Not sure'] },
        excludes: [],
      },
      {
        id: 'gas-furnace',
        name: 'Gas furnace',
        category: 'hvac',
        svgKey: 'furnace',
        location: 'Basement · utility closet · attic',
        tip: 'Tall metal cabinet (3–5 ft) with a metal flue pipe going up through the ceiling and a gas line at the bottom. High-efficiency models have 2 PVC pipes going outside instead of a metal flue.',
        labelTip: 'Inside the front panel door, on the left side wall. Year and model are usually both printed there.',
        sub: null,
        excludes: ['electric-furnace'],
      },
      {
        id: 'electric-furnace',
        name: 'Electric furnace',
        category: 'hvac',
        svgKey: 'furnace',
        location: 'Basement · utility closet · attic',
        tip: 'Same tall cabinet shape as a gas furnace but no flue pipe or gas line — just thick electrical wires entering from the top or side. Common in areas without natural gas service.',
        labelTip: 'Inside the front access panel.',
        sub: null,
        excludes: ['gas-furnace'],
      },
      {
        id: 'boiler',
        name: 'Boiler',
        category: 'hvac',
        svgKey: 'boiler',
        location: 'Basement · utility room',
        tip: 'Compact appliance connected to pipes instead of ducts — it heats water that circulates to radiators, baseboard heaters, or radiant floor tubing. Has a pressure/temperature gauge on the front. Gas models have a flue pipe; electric do not.',
        labelTip: 'Side or front panel of the unit.',
        sub: { q: 'What does it heat?', opts: ['Radiators / baseboard heaters', 'Radiant floor tubing', 'Both'] },
        excludes: [],
      },
      {
        id: 'mini-split',
        name: 'Mini-split system',
        category: 'hvac',
        svgKey: 'minisplit',
        location: 'Wall-mounted head units inside · small outdoor unit outside',
        tip: 'A slim rectangular unit (30–40" wide) mounted high on an interior wall, connected to a small outdoor unit via refrigerant lines through a hole in the wall. Each indoor head unit has its own remote.',
        labelTip: 'Open the front grille on the indoor head unit — the model label is on the filter access panel inside.',
        sub: null,
        excludes: [],
      },
      {
        id: 'rtu',
        name: 'Rooftop Unit (RTU)',
        category: 'hvac',
        svgKey: 'rtu',
        location: 'On the roof — common in townhouses and condos',
        tip: 'A large self-contained metal cabinet (3–5 ft wide) sitting directly on the roof. Contains both heating and cooling in one unit. Ductwork and refrigerant lines connect through a roof penetration below. Brands: Carrier, Trane, Lennox. Common in townhouses, condos, and light commercial buildings.',
        labelTip: 'On the end or side panel of the roof cabinet — may need roof access. Serial number first digits typically encode the manufacture year.',
        sub: { q: 'Type?', opts: ['Heat & cool (combo)', 'Cooling only', 'Not sure'] },
        excludes: [],
      },
      { id: 'other-hvac', isOther: true, name: 'Other HVAC equipment', category: 'hvac' },
    ],
  },

  {
    id: 'water',
    icon: 'fa-droplet',
    name: 'Water & plumbing',
    intro: 'Check the basement or utility room for water heaters and softeners. Look at the basement floor for a sump pit, and outside for well equipment.',
    items: [
      {
        id: 'tank-wh',
        name: 'Tank water heater',
        category: 'water',
        svgKey: 'water-heater',
        location: 'Basement · garage · utility closet',
        tip: 'Tall cylinder (40–80 gallons). Gas: flue pipe at top + gas line at bottom. Electric: two side access panels, no flue. Heat pump: large tank with a compressor/fan on top that hums when running.',
        labelTip: 'On the side of the tank. The first 4 digits of the serial number usually encode the year and week of manufacture.',
        sub: { q: 'What type?', opts: ['Gas', 'Electric', 'Heat pump (hybrid)', 'Not sure'] },
        excludes: ['tankless-wh'],
      },
      {
        id: 'tankless-wh',
        name: 'Tankless water heater',
        category: 'water',
        svgKey: 'tankless',
        location: 'Wall-mounted — basement, utility room, garage, or outside',
        tip: 'Flat box (~18×28") mounted on a wall, much smaller than a tank. Gas models have 2 PVC pipes or a stainless exhaust going through the wall; electric models have thick wires and no vent.',
        labelTip: 'Front panel or inside the unit access cover.',
        sub: { q: 'What type?', opts: ['Gas', 'Electric', 'Not sure'] },
        excludes: ['tank-wh'],
      },
      {
        id: 'water-softener',
        name: 'Water softener',
        category: 'water',
        svgKey: 'softener',
        location: 'Basement · utility room · garage',
        tip: 'Two connected tanks — a taller mineral/resin tank and a shorter brine (salt) tank. The brine tank is filled with salt pellets. Located near where the water main enters the house.',
        labelTip: 'Control head label on top of the mineral tank.',
        sub: null,
        excludes: [],
      },
      {
        id: 'whole-house-filter',
        name: 'Whole-house water filter',
        category: 'water',
        svgKey: 'filter',
        location: 'On the main water line — basement or utility room',
        tip: 'One or more cylindrical canisters installed on the main water line, before the water heater. Has a housing you unscrew to replace the filter cartridge inside. May have a pressure gauge.',
        labelTip: 'On the canister housing itself.',
        sub: null,
        excludes: [],
      },
      {
        id: 'sump-pump',
        name: 'Sump pump',
        category: 'water',
        svgKey: 'sump',
        location: 'Basement floor — usually in a corner',
        tip: 'Located in a pit (sump pit) — a round hole (~18" diameter) in the basement floor, usually with a plastic or metal lid. The pump sits inside with a float switch. A discharge pipe runs up and out through the wall.',
        labelTip: 'On the pump body inside the pit — shine a flashlight into the pit.',
        sub: null,
        excludes: [],
      },
      {
        id: 'well-system',
        name: 'Well water system',
        category: 'water',
        svgKey: 'well',
        location: 'Well casing in yard · pressure tank indoors',
        tip: 'If on well water: look for a well casing (a 4–6" pipe with a cap) in the yard, and a cylindrical pressure tank (12–24" diameter, 2–5 ft tall) near the water main inside. City water homes won\'t have these.',
        labelTip: 'Pressure tank label is on the tank body.',
        sub: null,
        excludes: [],
      },
      {
        id: 'radon-system',
        name: 'Radon mitigation system',
        category: 'other',
        svgKey: 'radon',
        location: 'PVC pipe rising through basement slab — exits through roof or wall',
        tip: 'A PVC pipe (3–4" diameter) going up from the basement floor or slab and exiting through the roof or a wall, with a small inline fan attached. Often has a U-tube manometer (a small clear plastic tube with colored fluid) to show the system is working.',
        labelTip: 'Fan housing label — on the fan body itself, usually in the attic or on the pipe near the roof exit.',
        sub: null,
        excludes: [],
      },
      {
        id: 'crawlspace',
        name: 'Crawl space encapsulation',
        category: 'other',
        svgKey: 'crawl',
        location: 'Under the house — access through foundation wall or floor hatch',
        tip: 'A heavy plastic vapor barrier (6–20 mil) covering the ground and walls of the crawl space. A properly done encapsulation has the liner sealed at the walls and may include a dehumidifier. Access is through a small door in the foundation wall.',
        labelTip: 'No label on the liner — check any dehumidifier inside the crawl space for a model label.',
        sub: null,
        excludes: [],
      },
      { id: 'other-water', isOther: true, name: 'Other water / plumbing equipment', category: 'water' },
    ],
  },

  {
    id: 'garage',
    icon: 'fa-warehouse',
    name: 'Garage',
    intro: 'Look up at the ceiling for the opener rail, along the walls for chargers or sub-panels, and outside beside the house for a standby generator.',
    items: [
      {
        id: 'garage-door',
        name: 'Garage door',
        category: 'other',
        svgKey: 'garage-door',
        location: 'Front of garage',
        tip: 'Sectional doors (most common) have horizontal panels with hinges between them. Torsion springs run across the top; extension springs run along the sides. The door brand is usually on the back of the bottom panel near the track.',
        labelTip: 'Back of the bottom panel, or on a sticker near the horizontal track.',
        sub: { q: 'How wide?', opts: ['Single (1-car, 8–10 ft)', 'Double (2-car, 16–18 ft)'] },
        excludes: [],
      },
      {
        id: 'garage-opener',
        name: 'Garage door opener',
        category: 'other',
        svgKey: 'opener',
        location: 'Mounted to the ceiling on a rail',
        tip: 'Motor box on the ceiling with a drive rail running to the door. Belt drive is quietest; chain drive makes a rattling sound when running. The wall button and remotes are wired or connected to the motor unit.',
        labelTip: 'Back or side of the motor box — may need a step stool to read it.',
        sub: { q: 'Drive type?', opts: ['Belt (quiet)', 'Chain (louder)', 'Screw', 'Not sure'] },
        excludes: [],
      },
      {
        id: 'standby-gen',
        name: 'Standby generator',
        category: 'electrical',
        svgKey: 'generator',
        location: 'Outside on a concrete pad — beside the house',
        tip: 'Looks like a large air conditioner unit on a concrete pad, connected to the gas line. Starts automatically during power outages. Brands: Generac, Kohler, Briggs & Stratton.',
        labelTip: 'Side panel of the unit housing.',
        sub: null,
        excludes: ['portable-gen'],
      },
      {
        id: 'portable-gen',
        name: 'Portable generator',
        category: 'electrical',
        svgKey: 'generator',
        location: 'Stored in garage or shed',
        tip: 'Wheeled or handlebar unit stored in the garage. Runs on gasoline or dual-fuel (gas/propane). Must be manually started and used outdoors only — carbon monoxide risk.',
        labelTip: 'Housing panel label.',
        sub: null,
        excludes: ['standby-gen'],
      },
      {
        id: 'ev-charger',
        name: 'EV charger (Level 2)',
        category: 'electrical',
        svgKey: 'ev-charger',
        location: 'Garage wall',
        tip: 'Wall-mounted box (~8×12") with a heavy charging cable and J1772 or Tesla connector. Has a status indicator light. Requires a dedicated 240V/40–60A circuit. Brands: ChargePoint, JuiceBox, Wallbox, Emporia.',
        labelTip: 'Back or side of the wall unit.',
        sub: null,
        excludes: [],
      },
      { id: 'other-garage', isOther: true, name: 'Other garage equipment', category: 'electrical' },
    ],
  },

  {
    id: 'kitchen',
    icon: 'fa-utensils',
    name: 'Kitchen & laundry',
    intro: 'Check inside door frames and under bottom drawers for model labels. For the range, look behind it for a gas line or a large 240V plug.',
    items: [
      {
        id: 'refrigerator',
        name: 'Refrigerator',
        category: 'appliance',
        svgKey: 'fridge',
        location: 'Kitchen',
        tip: 'Model and serial on a sticker inside the fresh food compartment — upper left or right wall. Note the style: top-freezer, bottom-freezer, French door, or side-by-side.',
        labelTip: 'Open the refrigerator door and look at the upper left or right interior wall.',
        sub: { q: 'Style?', opts: ['Top-freezer', 'Bottom-freezer / French door', 'Side-by-side'] },
        excludes: [],
      },
      {
        id: 'dishwasher',
        name: 'Dishwasher',
        category: 'appliance',
        svgKey: 'dishwasher',
        location: 'Under the counter in the kitchen',
        tip: 'Built-in unit under the counter, typically 24" wide. Open the door fully to find the model/serial sticker on the inner door frame or side of the tub opening.',
        labelTip: 'Open the dishwasher door — label is on the inner door edge when the door is fully open.',
        sub: null,
        excludes: [],
      },
      {
        id: 'range-gas',
        name: 'Gas range / oven',
        category: 'appliance',
        svgKey: 'range',
        location: 'Kitchen',
        tip: 'Has open gas burners with metal grate covers — you can see the igniter tips in the center of each burner. A flexible gas line connects at the back. If the cooktop has open burners with a visible flame, it\'s gas.',
        labelTip: 'Inside the bottom storage drawer, or on the frame inside the oven door.',
        sub: null,
        excludes: ['range-electric'],
      },
      {
        id: 'range-electric',
        name: 'Electric range / oven',
        category: 'appliance',
        svgKey: 'range',
        location: 'Kitchen',
        tip: 'Smooth ceramic-glass cooktop or coil burners — no open flame. Plugged into a large 240V outlet behind the unit. Induction cooktops stay cool to the touch except where the pan heats.',
        labelTip: 'Inside the bottom storage drawer, or on the frame inside the oven door.',
        sub: { q: 'Cooktop type?', opts: ['Smooth ceramic / glass', 'Coil burners', 'Induction'] },
        excludes: ['range-gas'],
      },
      {
        id: 'disposal',
        name: 'Garbage disposal',
        category: 'appliance',
        svgKey: 'disposal',
        location: 'Under the kitchen sink',
        tip: 'Cylindrical metal unit (~6–8" diameter) attached to the kitchen drain under the sink. Has a reset button on the bottom. Activated by a wall switch or under-counter button.',
        labelTip: 'On the side of the unit — shine a flashlight under the sink.',
        sub: null,
        excludes: [],
      },
      {
        id: 'washer',
        name: 'Washing machine',
        category: 'appliance',
        svgKey: 'washer',
        location: 'Laundry room · basement · closet',
        tip: 'Front-load: circular door on the front (may have a small filter access door at the bottom). Top-load: lid on top. Model label is inside the door opening frame.',
        labelTip: 'Inside the door frame when the door is fully open, or under the top panel lip on top-loaders.',
        sub: { q: 'Type?', opts: ['Front-load', 'Top-load'] },
        excludes: [],
      },
      {
        id: 'dryer',
        name: 'Dryer',
        category: 'appliance',
        svgKey: 'dryer',
        location: 'Laundry room · basement · closet',
        tip: 'Gas dryers have a flexible gas line at the back (yellow or stainless flex connector). Electric dryers have a thick 3- or 4-wire cord into a large 240V outlet. Both have a vent duct out the back.',
        labelTip: 'Open the dryer door — label is on the inner door frame or inside the lint filter slot.',
        sub: { q: 'Type?', opts: ['Gas', 'Electric', 'Not sure'] },
        excludes: [],
      },
      { id: 'other-kitchen', isOther: true, name: 'Other kitchen / laundry equipment', category: 'appliance' },
    ],
  },

  {
    id: 'exterior',
    icon: 'fa-house',
    name: 'Roof & exterior',
    intro: 'Walk the perimeter of your home — look up at the roof from the yard, check gutters along the eaves, and note any decks, driveways, or irrigation equipment.',
    items: [
      {
        id: 'roof',
        name: 'Roof',
        category: 'roof',
        svgKey: 'roof',
        location: 'Visible from the yard',
        tip: 'Asphalt shingles (most common): flat, tabbed look with granules. Metal: long panels with seams or raised ribs. Clay/concrete tile: curved terracotta or colored rows. Flat membrane: white (TPO), black rubber (EPDM), or a granulated surface.',
        labelTip: 'No label — estimate age from building permits, inspection reports, or when you purchased the home.',
        sub: { q: 'Roof type?', opts: ['Asphalt shingles', 'Metal', 'Clay or concrete tile', 'Flat / low-slope'] },
        excludes: [],
      },
      {
        id: 'gutters',
        name: 'Gutters',
        category: 'roof',
        svgKey: 'gutters',
        location: 'Along the roof eaves',
        tip: 'Channels along the edges of the roof that collect rain and route it to downspouts. K-style (flat back, shaped front) is most common. Half-round gutters look like a half-circle. Aluminum is light and won\'t rust; copper is heavy and turns green over time.',
        labelTip: 'No label — identify by color and weight. Knock lightly: aluminum sounds hollow; copper sounds denser.',
        sub: { q: 'Material?', opts: ['Aluminum', 'Copper', 'Vinyl', 'Not sure'] },
        excludes: [],
      },
      {
        id: 'deck',
        name: 'Deck or patio',
        category: 'other',
        svgKey: 'deck',
        location: 'Back or side of house',
        tip: 'Pressure-treated wood: greenish or brownish treated boards (check the cut end for a green tint). Composite (Trex, TimberTech): looks like wood but won\'t splinter — the cut end shows a layered composite cross-section. Concrete patio: gray slab, no boards.',
        labelTip: 'Check the underside of a board end or a stamped clip/fastener for a brand name.',
        sub: { q: 'Material?', opts: ['Wood (pressure-treated)', 'Composite (Trex, etc.)', 'Concrete / pavers'] },
        excludes: [],
      },
      {
        id: 'driveway',
        name: 'Driveway',
        category: 'other',
        svgKey: 'driveway',
        location: 'Front or side of house',
        tip: 'Asphalt: black/dark gray, slightly flexible, gets soft in extreme heat — needs sealing every 2–5 years. Concrete: light gray, rigid, has control joints (shallow cuts) across it. Pavers: individual brick or stone units with visible joints.',
        labelTip: 'No label — identify by color and texture.',
        sub: { q: 'Material?', opts: ['Asphalt', 'Concrete', 'Pavers', 'Gravel'] },
        excludes: [],
      },
      {
        id: 'irrigation',
        name: 'Irrigation / sprinkler system',
        category: 'water',
        svgKey: 'irrigation',
        location: 'Controller in garage or utility room · pop-up heads in lawn',
        tip: 'Look for small round pop-up sprinkler heads flush with the ground in the lawn. The controller is a rectangular box in the garage or utility room with a display and zone controls. A backflow preventer is on a pipe near the foundation.',
        labelTip: 'Controller label is on or inside the timer box panel.',
        sub: null,
        excludes: [],
      },
      { id: 'other-exterior', isOther: true, name: 'Other exterior / roof item', category: 'roof' },
    ],
  },

  {
    id: 'bathrooms',
    icon: 'fa-bath',
    name: 'Bathrooms',
    intro: 'Check each bathroom — look up at the ceiling for exhaust fans, and check under the toilet tank lid for the model stamp.',
    items: [
      {
        id: 'toilets',
        name: 'Toilets',
        category: 'plumbing',
        svgKey: 'toilet',
        location: 'All bathrooms',
        tip: 'Standard gravity-flush toilet: tank behind the seat. Remove the tank lid — model/serial are sometimes stamped on the inside back wall. Modern toilets (post-1994) use 1.6 GPF or less; older ones may use 3.5–7 GPF.',
        labelTip: 'Remove the tank lid and look on the inside back wall of the tank, or on a sticker on the outside of the tank.',
        sub: { q: 'How many toilets in the home?', opts: ['1', '2', '3', '4 or more'] },
        excludes: [],
      },
      {
        id: 'exhaust-fans',
        name: 'Bathroom exhaust fans',
        category: 'electrical',
        svgKey: 'exhaust-fan',
        location: 'Ceiling of each bathroom',
        tip: 'A grille on the bathroom ceiling. Remove the cover (usually snap-off clips) to see the fan housing inside. The CFM rating and model are on the fan housing. Confirm the duct exits outside — not into the attic.',
        labelTip: 'Remove the grille cover — the model label is on the fan motor housing inside.',
        sub: { q: 'How many fans?', opts: ['1', '2', '3 or more'] },
        excludes: [],
      },
      {
        id: 'shower-valve',
        name: 'Shower / tub valves',
        category: 'plumbing',
        svgKey: 'shower',
        location: 'Behind the wall in each shower/tub',
        tip: 'The valve is hidden behind the wall — you only see the trim (handle and escutcheon plate). Single-handle pressure-balancing valves have been required since 1993. The brand name is usually on the handle cap or the decorative plate. Common: Moen, Delta, Kohler.',
        labelTip: 'Look at the center button/cap on the handle — brand is often printed there. Or check the escutcheon (decorative plate on the wall).',
        sub: null,
        excludes: [],
      },
      { id: 'other-bathrooms', isOther: true, name: 'Other bathroom equipment', category: 'plumbing' },
    ],
  },

  {
    id: 'attic',
    icon: 'fa-layer-group',
    name: 'Attic & crawl space',
    intro: 'A quick look from the access hatch is enough — you don\'t need to walk across the joists. Look for the type of insulation covering the floor and any fans near the peak.',
    items: [
      {
        id: 'attic-insulation',
        name: 'Attic insulation',
        category: 'other',
        svgKey: 'insulation',
        location: 'Attic floor — between and over the joists',
        tip: 'Blown-in cellulose: gray, looks like shredded paper. Blown-in fiberglass: white/yellow and fluffy. Batt: pink or yellow rectangular strips laid between joists. Spray foam: hard, yellow or cream colored. Target 10–16" depth for adequate R-value in most climates.',
        labelTip: 'No label — use a ruler or tape measure to check depth. Target R-38 to R-60 (10–16" of blown insulation) for most US climates.',
        sub: { q: 'What type?', opts: ['Blown-in (loose fill)', 'Batt (rolls / blankets)', 'Spray foam', 'Not sure'] },
        excludes: [],
      },
      {
        id: 'whole-house-fan',
        name: 'Whole-house fan',
        category: 'hvac',
        svgKey: 'house-fan',
        location: 'Ceiling between living space and attic',
        tip: 'A large fan (30–48" diameter) in the ceiling with a large grille visible from inside the home. When running with windows open, you feel strong airflow throughout the house. Different from an attic fan — this one pulls air from inside the living space.',
        labelTip: 'Motor housing label — accessible from the attic.',
        sub: null,
        excludes: [],
      },
      {
        id: 'attic-vent',
        name: 'Attic ventilation',
        category: 'roof',
        svgKey: 'vent',
        location: 'Roof ridge · roof field · gable ends',
        tip: 'Ridge vent: a continuous strip along the roof peak, often under shingle cap — nearly invisible from the ground but you can see the gaps from the attic. Box/pot vents: round or square caps on the roof. Gable vents: grilles at the triangular wall ends. Power fans: a dome on the roof with a motor.',
        labelTip: 'For power attic fans, label is on the motor housing inside the attic.',
        sub: { q: 'Primary vent type?', opts: ['Ridge vent', 'Box / pot vents', 'Gable vents', 'Power attic fan'] },
        excludes: [],
      },
      {
        id: 'solar-panels',
        name: 'Solar panel system',
        category: 'electrical',
        svgKey: 'solar',
        location: 'Roof · inverter in garage or utility room',
        tip: 'Dark blue or black rectangular modules mounted in a grid on the roof. The inverter (a gray or white box) is in the garage or utility room. An app or display typically shows real-time power generation. Brands: SolarEdge, Enphase, Tesla, SMA.',
        labelTip: 'Inverter label is on the box. Panel brand may be printed on the metal frame around each module.',
        sub: null,
        excludes: [],
      },
      { id: 'other-attic', isOther: true, name: 'Other attic / crawl space item', category: 'other' },
    ],
  },
];

// ── STATE ─────────────────────────────────────
let intakeStep = -1;        // -1 = welcome, 0..N = room, N+1 = summary
let intakeAnswers = {};     // { itemId: { status, year, sub, subOther, customName, customCategory } }

// ── HELPERS ───────────────────────────────────
function intakeFindItem(id) {
  for (const room of INTAKE_ROOMS) {
    const item = room.items.find(i => i.id === id);
    if (item) return item;
  }
  return null;
}

function intakeExcluded() {
  const excluded = new Set();
  Object.entries(intakeAnswers).forEach(([id, a]) => {
    if (a.status === 'yes') {
      const item = intakeFindItem(id);
      if (item?.excludes) item.excludes.forEach(e => excluded.add(e));
    }
  });
  return excluded;
}

function intakeBuildAssetName(item, ans) {
  if (item.isOther) return (ans?.customName || '').trim() || 'Other Equipment';
  let name = item.name;
  const sub = ans?.sub;
  if (!sub || sub === 'Not sure' || sub === 'Other') return name;
  if (item.id === 'tank-wh' || item.id === 'tankless-wh') {
    if (sub === 'Heat pump (hybrid)') return 'Heat Pump Water Heater';
    return sub + ' ' + item.name;
  }
  if (item.id === 'range-electric' && sub === 'Induction') return 'Induction Cooktop / Range';
  if (item.id === 'dryer') return sub + ' Dryer';
  if (item.id === 'garage-door') return sub.includes('Double') ? 'Double Garage Door' : 'Single Garage Door';
  return name;
}

function intakeEstimateTasks(confirmed) {
  const counted = new Set();
  let total = 0;
  confirmed.forEach(({ item, ans }) => {
    const cat = item.isOther ? (ans?.customCategory || 'other') : item.category;
    defaultTasks.filter(t => t.category === cat).forEach(t => {
      if (!counted.has(t.name)) { counted.add(t.name); total++; }
    });
  });
  return total;
}

// ── OPEN / CLOSE ──────────────────────────────
function showIntake() {
  intakeStep = -1;
  intakeAnswers = {};
  const el = document.getElementById('intake-overlay');
  el.style.display = 'flex';
  el.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  renderIntake();
}

function hideIntake() {
  const el = document.getElementById('intake-overlay');
  el.style.display = 'none';
  el.classList.remove('is-open');
  document.body.style.overflow = '';
}

function intakeGo(step) {
  intakeStep = step;
  renderIntake();
  document.getElementById('intake-overlay').scrollTop = 0;
}

// ── RENDER ────────────────────────────────────
function renderIntake() {
  const el = document.getElementById('intake-inner');
  if (intakeStep === -1) {
    el.innerHTML = renderIntakeWelcome();
  } else if (intakeStep >= INTAKE_ROOMS.length) {
    el.innerHTML = renderIntakeSummary();
  } else {
    el.innerHTML = renderIntakeRoom(INTAKE_ROOMS[intakeStep]);
  }
}

function renderProgressBar(step) {
  const pct = Math.round(((step + 1) / (INTAKE_ROOMS.length + 2)) * 100);
  return `
    <div class="intake-progress-track">
      <div class="intake-progress-fill" style="width:${pct}%"></div>
    </div>`;
}

function renderIntakeWelcome() {
  return `
    <div class="intake-topbar">
      <div class="intake-topbar-title">Home setup</div>
      <button class="icon-btn" onclick="hideIntake()" style="color:rgba(255,255,255,.7)" title="Close"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="intake-centered-page">
      <div class="intake-welcome-hero">
        <div class="intake-welcome-icon-wrap"><i class="fa-solid fa-house-chimney"></i></div>
        <h1>Let's find out what you've got</h1>
        <p>Walk through your home with us — takes about 5 minutes. You don't need any model numbers yet.</p>
      </div>
      <div class="intake-body">
        <div class="intake-callout">
          <i class="fa-solid fa-circle-info"></i>
          <span>Don't worry if you're unsure about something — identification tips are included for each item, and you can always add more later.</span>
        </div>
        <div class="intake-section-label">What we'll cover</div>
        <div class="intake-room-grid">
          ${INTAKE_ROOMS.map(r => `
            <div class="intake-room-chip">
              <i class="fa-solid ${r.icon}"></i>
              <span>${r.name}</span>
            </div>`).join('')}
        </div>
        <button class="intake-primary-btn" onclick="intakeGo(0)">
          Start the walkthrough <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>`;
}

function renderIntakeSidebar(currentIdx) {
  return `
    <aside class="intake-sidebar">
      <div class="intake-sidebar-label">Rooms</div>
      ${INTAKE_ROOMS.map((r, i) => {
        const isDone    = i < currentIdx;
        const isCurrent = i === currentIdx;
        const count     = r.items.filter(it => !it.isOther && intakeAnswers[it.id]?.status === 'yes').length;
        return `
          <button class="intake-sidebar-item ${isCurrent ? 'is-current' : ''} ${isDone ? 'is-done' : ''}"
                  onclick="intakeGo(${i})" ${i > currentIdx ? 'disabled' : ''}>
            <div class="intake-sidebar-dot">
              ${isDone
                ? '<i class="fa-solid fa-check"></i>'
                : `<i class="fa-solid ${r.icon}"></i>`}
            </div>
            <span class="intake-sidebar-name">${r.name}</span>
            ${isDone && count > 0 ? `<span class="intake-sidebar-badge">${count}</span>` : ''}
          </button>`;
      }).join('')}
    </aside>`;
}

function renderIntakeRoom(room) {
  const idx = INTAKE_ROOMS.indexOf(room);
  const excluded = intakeExcluded();
  const isLast = idx === INTAKE_ROOMS.length - 1;

  return `
    <div class="intake-topbar">
      ${renderProgressBar(idx)}
      <button class="icon-btn" onclick="hideIntake()" style="color:rgba(255,255,255,.7)" title="Close"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="intake-room-layout">
      ${renderIntakeSidebar(idx)}
      <div class="intake-room-main">
        <div class="intake-room-header">
          <div class="intake-room-icon"><i class="fa-solid ${room.icon}"></i></div>
          <div>
            <div class="intake-step-label">Room ${idx + 1} of ${INTAKE_ROOMS.length}</div>
            <h2>${room.name}</h2>
          </div>
        </div>
        <div class="intake-body">
          <p class="intake-intro">${room.intro}</p>
          ${room.items.map(item => renderIntakeItem(item, excluded)).join('')}
          <div class="intake-nav-row">
            <button class="intake-back-btn" onclick="intakeGo(${idx - 1})">
              <i class="fa-solid fa-arrow-left"></i> ${idx === 0 ? 'Welcome' : 'Back'}
            </button>
            <button class="intake-primary-btn" onclick="intakeGo(${idx + 1})">
              ${isLast ? 'See summary' : 'Next room'} <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

function renderIntakeItem(item, excluded) {
  const ans = intakeAnswers[item.id] || {};
  const isExcluded = !item.isOther && excluded.has(item.id);

  if (isExcluded) {
    const icon = INTAKE_ICON_MAP[item.svgKey] || 'fa-wrench';
    return `
      <div class="intake-item-card intake-item-excluded">
        <div class="intake-item-top">
          <div class="intake-item-icon"><i class="fa-solid ${icon}"></i></div>
          <div class="intake-item-info">
            <div class="intake-item-name">${item.name}</div>
            <div class="intake-item-excluded-msg"><i class="fa-solid fa-ban"></i> Excluded by another selection</div>
          </div>
        </div>
      </div>`;
  }

  if (item.isOther) return renderIntakeOtherItem(item, ans);

  const icon = INTAKE_ICON_MAP[item.svgKey] || 'fa-wrench';
  const yesActive    = ans.status === 'yes'    ? 'intake-yn-yes-active'    : '';
  const noActive     = ans.status === 'no'     ? 'intake-yn-no-active'     : '';
  const unsureActive = ans.status === 'unsure' ? 'intake-yn-unsure-active' : '';

  return `
    <div class="intake-item-card" id="icard-${item.id}">
      <div class="intake-item-top">
        <div class="intake-item-icon"><i class="fa-solid ${icon}"></i></div>
        <div class="intake-item-info">
          <div class="intake-item-name">${item.name}</div>
          <div class="intake-item-location"><i class="fa-solid fa-location-dot"></i> ${item.location}</div>
        </div>
      </div>
      <p class="intake-item-tip">${item.tip}</p>
      <button class="intake-label-toggle" onclick="intakeToggleTip('${item.id}')">
        <i class="fa-solid fa-magnifying-glass"></i> How to find the model label
        <i class="fa-solid fa-chevron-down" id="itipchev-${item.id}" style="margin-left:auto;transition:transform .2s"></i>
      </button>
      <div class="intake-label-body" id="itibbody-${item.id}" style="display:none">${item.labelTip}</div>
      <div class="intake-yn-row">
        <button class="intake-yn-btn ${yesActive}"    onclick="intakeSetAnswer('${item.id}','yes')">
          <i class="fa-solid fa-check"></i> Yes
        </button>
        <button class="intake-yn-btn ${noActive}"     onclick="intakeSetAnswer('${item.id}','no')">
          <i class="fa-solid fa-xmark"></i> No
        </button>
        <button class="intake-yn-btn ${unsureActive}" onclick="intakeSetAnswer('${item.id}','unsure')">
          <i class="fa-solid fa-question"></i> Not sure
        </button>
      </div>
      ${ans.status === 'yes' ? renderIntakeExpansion(item, ans) : ''}
    </div>`;
}

function renderIntakeOtherItem(item, ans) {
  const yesActive    = ans.status === 'yes'    ? 'intake-yn-yes-active'    : '';
  const noActive     = ans.status === 'no'     ? 'intake-yn-no-active'     : '';

  const catOptions = INTAKE_CAT_OPTIONS.map(opt =>
    `<option value="${opt.value}" ${(ans.customCategory || item.category) === opt.value ? 'selected' : ''}>${opt.label}</option>`
  ).join('');

  return `
    <div class="intake-item-card intake-item-other" id="icard-${item.id}">
      <div class="intake-item-top">
        <div class="intake-item-icon" style="background:var(--bg)"><i class="fa-solid fa-plus" style="color:var(--text-secondary)"></i></div>
        <div class="intake-item-info">
          <div class="intake-item-name" style="color:var(--text-secondary)">Something else?</div>
          <div class="intake-item-location">Add equipment not on the list above</div>
        </div>
      </div>
      <div class="intake-yn-row" style="margin-top:10px">
        <button class="intake-yn-btn ${yesActive}" onclick="intakeSetAnswer('${item.id}','yes')">
          <i class="fa-solid fa-check"></i> Yes, I have something else
        </button>
        <button class="intake-yn-btn ${noActive}" onclick="intakeSetAnswer('${item.id}','no')">
          <i class="fa-solid fa-xmark"></i> No
        </button>
      </div>
      ${ans.status === 'yes' ? `
        <div class="intake-expansion">
          <div class="intake-exp-row">
            <label class="intake-exp-label">Equipment name <span style="color:var(--red);font-size:11px">required</span></label>
            <input class="intake-other-name-input" type="text"
                   placeholder="e.g. Heat Recovery Ventilator"
                   value="${(ans.customName || '').replace(/"/g, '&quot;')}"
                   oninput="intakeSetOtherName('${item.id}', this.value)">
          </div>
          <div class="intake-exp-row">
            <label class="intake-exp-label">Category</label>
            <select class="intake-other-cat-select"
                    onchange="intakeSetOtherCat('${item.id}', this.value)">
              ${catOptions}
            </select>
          </div>
          <div class="intake-exp-row">
            <label class="intake-exp-label">Install year <span class="intake-optional">(optional)</span></label>
            <input class="intake-year-input" type="number" placeholder="${new Date().getFullYear() - 5}"
                   min="1950" max="${new Date().getFullYear()}" value="${ans.year || ''}"
                   oninput="intakeSetYear('${item.id}', this.value)">
          </div>
        </div>` : ''}
    </div>`;
}

function renderIntakeExpansion(item, ans) {
  // Build sub-question chips (with 'Other' appended)
  let subHtml = '';
  if (item.sub) {
    const allOpts = [...item.sub.opts, 'Other'];
    const chips = allOpts.map(opt => {
      const isActive = ans.sub === opt ? 'intake-sub-active' : '';
      // Escape single quotes in opt for the data attribute
      const safeOpt = opt.replace(/'/g, '&#39;');
      return `<button class="intake-sub-chip ${isActive}"
                      onclick="intakeSetSub(this)"
                      data-item="${item.id}"
                      data-opt="${safeOpt}">${opt}</button>`;
    }).join('');

    const otherInput = ans.sub === 'Other' ? `
      <input class="intake-sub-other-input" type="text"
             placeholder="Describe..."
             value="${(ans.subOther || '').replace(/"/g, '&quot;')}"
             oninput="intakeSetSubOther('${item.id}', this.value)">` : '';

    subHtml = `
      <div class="intake-exp-row">
        <label class="intake-exp-label">${item.sub.q}</label>
        <div class="intake-sub-chips">${chips}</div>
        ${otherInput}
      </div>`;
  }

  return `
    <div class="intake-expansion">
      <div class="intake-exp-row">
        <label class="intake-exp-label">Install year <span class="intake-optional">(optional — helps schedule tasks)</span></label>
        <input class="intake-year-input" type="number" placeholder="${new Date().getFullYear() - 5}"
               min="1950" max="${new Date().getFullYear()}" value="${ans.year || ''}"
               oninput="intakeSetYear('${item.id}', this.value)">
      </div>
      ${subHtml}
    </div>`;
}

function renderIntakeSummary() {
  const confirmed = [];
  const unsure    = [];
  INTAKE_ROOMS.forEach(room => {
    room.items.forEach(item => {
      const ans = intakeAnswers[item.id];
      if (ans?.status === 'yes') {
        // Skip "Other" items with no name entered
        if (item.isOther && !(ans.customName || '').trim()) return;
        confirmed.push({ item, ans, room });
      }
      if (ans?.status === 'unsure' && !item.isOther) unsure.push({ item, room });
    });
  });

  const taskCount = intakeEstimateTasks(confirmed);

  return `
    <div class="intake-topbar">
      ${renderProgressBar(INTAKE_ROOMS.length + 1)}
      <button class="icon-btn" onclick="hideIntake()" style="color:rgba(255,255,255,.7)" title="Close"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="intake-centered-page">
    <div class="intake-body">
      <div class="intake-summary-hero">
        <div class="intake-summary-num">${confirmed.length}</div>
        <div class="intake-summary-unit">item${confirmed.length !== 1 ? 's' : ''} found</div>
        <div class="intake-summary-tasks">~${taskCount} maintenance tasks/year</div>
      </div>

      ${confirmed.length > 0 ? `
        <div class="intake-section-label">Adding to your home</div>
        ${confirmed.map(({ item, ans }) => {
          const name = intakeBuildAssetName(item, ans);
          const icon = item.isOther ? 'fa-plus-circle' : (INTAKE_ICON_MAP[item.svgKey] || 'fa-wrench');
          const roomIdx = INTAKE_ROOMS.findIndex(r => r.items.some(i => i.id === item.id));
          const subDisplay = ans.sub === 'Other' ? (ans.subOther || 'Other') : ans.sub;
          return `
            <div class="intake-summary-row">
              <div class="intake-summary-icon"><i class="fa-solid ${icon}"></i></div>
              <div class="intake-summary-info">
                <div class="intake-summary-name">${name}</div>
                <div class="intake-summary-meta">
                  ${ans.year ? `Installed ${ans.year}` : 'Year unknown'}
                  ${subDisplay && subDisplay !== 'Not sure' ? ` · ${subDisplay}` : ''}
                </div>
              </div>
              <button class="intake-edit-btn" onclick="intakeGo(${roomIdx})" title="Edit">
                <i class="fa-solid fa-pen"></i>
              </button>
            </div>`;
        }).join('')}
      ` : `<p class="intake-empty-msg">No items confirmed yet — go back and answer each room.</p>`}

      ${unsure.length > 0 ? `
        <div class="intake-section-label" style="margin-top:20px">Still not sure about</div>
        ${unsure.map(({ item }) => `
          <div class="intake-unsure-row">
            <i class="fa-solid fa-circle-question"></i>
            <span>${item.name}</span>
          </div>`).join('')}
        <p class="intake-unsure-hint">You can add these manually from the Assets page anytime.</p>
      ` : ''}

      <button class="intake-primary-btn" id="intake-finish-btn"
              onclick="finishIntake()" style="margin-top:24px"
              ${confirmed.length === 0 ? 'disabled' : ''}>
        <i class="fa-solid fa-house-chimney"></i>
        Add ${confirmed.length} item${confirmed.length !== 1 ? 's' : ''} to my home
      </button>
      <button class="intake-back-btn" style="margin-top:10px;display:block;width:100%;text-align:center"
              onclick="intakeGo(${INTAKE_ROOMS.length - 1})">
        <i class="fa-solid fa-arrow-left"></i> Back
      </button>
    </div>
    </div>`;
}

// ── ANSWER HANDLERS ───────────────────────────
function intakeToggleTip(itemId) {
  const body = document.getElementById('itibbody-' + itemId);
  const chev = document.getElementById('itipchev-' + itemId);
  const open = body.style.display === 'block';
  body.style.display = open ? 'none' : 'block';
  chev.style.transform = open ? '' : 'rotate(180deg)';
}

function intakeSetAnswer(itemId, status) {
  if (!intakeAnswers[itemId]) intakeAnswers[itemId] = {};
  if (intakeAnswers[itemId].status === status) {
    delete intakeAnswers[itemId];
  } else {
    intakeAnswers[itemId].status = status;
  }
  renderIntake();
}

function intakeSetYear(itemId, year) {
  if (!intakeAnswers[itemId]) intakeAnswers[itemId] = {};
  intakeAnswers[itemId].year = year || null;
}

// FIX: use data-* attributes so JSON string quotes don't break HTML
function intakeSetSub(btn) {
  const itemId = btn.dataset.item;
  const opt    = btn.dataset.opt;
  if (!intakeAnswers[itemId]) intakeAnswers[itemId] = {};
  intakeAnswers[itemId].sub = opt;
  if (opt !== 'Other') intakeAnswers[itemId].subOther = null;
  renderIntake();
}

function intakeSetSubOther(itemId, val) {
  if (!intakeAnswers[itemId]) intakeAnswers[itemId] = {};
  intakeAnswers[itemId].subOther = val || null;
}

function intakeSetOtherName(itemId, val) {
  if (!intakeAnswers[itemId]) intakeAnswers[itemId] = {};
  intakeAnswers[itemId].customName = val || null;
}

function intakeSetOtherCat(itemId, val) {
  if (!intakeAnswers[itemId]) intakeAnswers[itemId] = {};
  intakeAnswers[itemId].customCategory = val || null;
}

// ── FINISH — CREATE ASSETS ────────────────────
async function finishIntake() {
  const btn = document.getElementById('intake-finish-btn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating assets…';

  const confirmed = [];
  INTAKE_ROOMS.forEach(room => {
    room.items.forEach(item => {
      const ans = intakeAnswers[item.id];
      if (ans?.status === 'yes') {
        if (item.isOther && !(ans.customName || '').trim()) return;
        confirmed.push({ item, ans });
      }
    });
  });

  for (const { item, ans } of confirmed) {
    const name        = intakeBuildAssetName(item, ans);
    const installYear = ans.year ? parseInt(ans.year) : null;
    const category    = item.isOther ? (ans.customCategory || 'other') : item.category;

    // Build notes from sub-question answer
    let notes = null;
    if (!item.isOther && ans.sub && ans.sub !== 'Not sure') {
      if (ans.sub === 'Other') {
        notes = ans.subOther ? `Type: ${ans.subOther}` : null;
      } else {
        notes = `Type: ${ans.sub}`;
      }
    }

    const { data: asset, error } = await sb.from('assets').insert({
      user_id:       currentUser.id,
      name,
      category,
      install_year:  installYear,
      install_month: null,
      brand:         null,
      model:         null,
      notes,
    }).select().single();

    if (error || !asset) continue;

    // Match tasks by specific asset_type (item.id), fall back to broad category
    const itemId = item.isOther ? null : item.id;
    const tasks = itemId
      ? defaultTasks.filter(t => t.asset_type === itemId)
      : defaultTasks.filter(t => t.category === category && !t.asset_type);
    if (tasks.length > 0) {
      const taskRows = tasks.map(t => ({
        asset_id:      asset.id,
        user_id:       currentUser.id,
        name:          t.name,
        interval_days: t.interval_days,
        next_due_at:   computeNextDue(installYear, null, t.interval_days),
      }));
      await sb.from('maintenance_tasks').insert(taskRows);
    }
  }

  hideIntake();
  await refreshAll();
  const assetsBtn = document.querySelector('.nav-item:nth-child(2)');
  if (assetsBtn) showPage('assets', assetsBtn);
}
