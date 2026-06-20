-- ============================================================
-- ADULTING — schema_update.sql
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- Adds rich content columns to default_tasks
-- ============================================================

ALTER TABLE default_tasks
  ADD COLUMN IF NOT EXISTS description  TEXT,
  ADD COLUMN IF NOT EXISTS tips_parts   TEXT,
  ADD COLUMN IF NOT EXISTS tips_tools   TEXT,
  ADD COLUMN IF NOT EXISTS tips_how     TEXT;

-- ── HVAC ────────────────────────────────────────────────────

UPDATE default_tasks SET
  description  = 'Your HVAC filter traps dust, pollen, pet dander, and other particles before they circulate through your home. A clogged filter forces your system to work harder, raising energy bills and shortening the life of the blower motor and heat exchanger.',
  tips_parts   = 'Buy filters at any hardware store (Home Depot, Lowe''s) or Amazon. Check the existing filter frame for the size — it''s printed on the cardboard edge (e.g. 16x25x1). MERV 8–11 is the sweet spot for most homes: better filtration than basic fiberglass without restricting airflow. Stock up on a 6-pack to make future replacements easy.',
  tips_tools   = 'No tools needed. A flashlight helps if your filter slot is in a dark closet or ceiling.',
  tips_how     = '1. Turn off your HVAC system at the thermostat before changing the filter.
2. Locate the filter — usually in the return air vent (large louvered grill on wall or ceiling) or inside the air handler cabinet.
3. Slide out the old filter. Note the arrow printed on the frame — it shows airflow direction.
4. Hold the old filter up to light. If you can''t see through it, it''s overdue.
5. Slide in the new filter with the arrow pointing toward the air handler (away from the return air duct).
6. Dispose of the old filter in a trash bag — it''s full of allergens.
7. Turn your system back on and check for normal airflow from vents.'
WHERE name ILIKE '%air filter%';

UPDATE default_tasks SET
  description  = 'The evaporator coil (inside your air handler) and condenser coil (outside unit) transfer heat to cool your home. Dirt and grime act as insulation, making the system work harder to achieve the same cooling. Dirty coils are the #1 cause of A/C inefficiency and compressor failure.',
  tips_parts   = 'Coil cleaner foam spray (Nu-Calgon or similar, ~$15 at HVAC supply stores or Amazon). For the outdoor unit, plain water from a garden hose is often enough. Fin comb (~$10) to straighten bent fins if needed.',
  tips_tools   = 'Screwdriver to remove access panels. Garden hose with spray nozzle for the outdoor condenser. Soft brush or vacuum with brush attachment for loose debris. Safety gloves and eye protection when using chemical coil cleaner.',
  tips_how     = '1. Turn off power to the unit at the disconnect box or breaker before touching anything.
2. OUTDOOR CONDENSER: Remove any debris (leaves, grass) from around the unit. Use a garden hose to spray water through the fins from the inside out to push dirt outward. Avoid bending the fins — spray straight through, not at an angle.
3. If fins are visibly dirty, apply coil cleaner foam, let it sit per the product instructions, then rinse.
4. INDOOR EVAPORATOR: Located above the furnace or in the air handler cabinet. Access panel is usually held by screws. Spray evaporator coil cleaner on the coil — it self-rinses and drains through the condensate pan.
5. Check the condensate drain pan for standing water or slime. Pour a cup of diluted bleach (1 part bleach, 10 parts water) down the drain line to prevent mold.
6. Replace access panels, restore power, and run the system for 15 minutes to verify cooling.'
WHERE name ILIKE '%coil%' AND category = 'hvac';

UPDATE default_tasks SET
  description  = 'An annual professional tune-up catches problems before they become expensive failures. A technician checks refrigerant levels, electrical connections, and heat exchanger integrity — issues that can cause carbon monoxide leaks or compressor burnout if left unchecked. Most manufacturers require annual service to keep warranties valid.',
  tips_parts   = 'No parts to buy — the technician brings what''s needed. Budget $80–$150 for a standard tune-up. Ask if they offer a service contract (typically $150–$200/year) that covers labor on repairs.',
  tips_tools   = 'This task is best left to a licensed HVAC technician. They need specialized tools: manifold gauges for refrigerant, combustion analyzer, and electrical meters.',
  tips_how     = '1. Schedule the tune-up in spring (for A/C) or fall (for heating) — before peak season when wait times are longer.
2. Clear 2 feet of space around the outdoor unit and air handler before the technician arrives.
3. Write down any symptoms you''ve noticed: unusual sounds, rooms that don''t heat/cool well, higher-than-normal bills.
4. Ask the technician to check: refrigerant charge, capacitors, contactor, heat exchanger, flue draft, and condensate drain.
5. Ask for a written report of everything checked and any recommendations.
6. Replace the air filter the day of or right after the tune-up.'
WHERE name ILIKE '%tune-up%' OR name ILIKE '%tuneup%';

UPDATE default_tasks SET
  description  = 'The flue pipe carries combustion gases (including carbon monoxide) from your furnace or water heater safely outside. Blockages from bird nests, debris, or corrosion can force deadly gases back into your living space. This inspection takes 5 minutes and could save your life.',
  tips_parts   = 'Usually no parts needed for the inspection itself. If you find corrosion or holes, sheet metal screws and HVAC foil tape (~$10 at hardware stores) can seal small leaks. Seriously damaged sections should be replaced by a technician.',
  tips_tools   = 'Flashlight. Screwdriver if you need to disconnect a section for inspection.',
  tips_how     = '1. Locate the flue pipe — it runs from the top of your furnace or water heater through the wall or ceiling to outside.
2. With the furnace OFF, visually trace the entire length of the pipe for rust, holes, or disconnected sections.
3. Check where the pipe exits outside — look for bird nests, leaves, or debris blocking the vent cap.
4. Check that all pipe joints are secured with sheet metal screws (at least 3 per joint) and sealed with foil tape.
5. Look at the pipe color near the furnace. Blue or black discoloration suggests the furnace is running too rich — call a technician.
6. During heating season, hold a stick of incense near furnace joints while it''s running. Smoke pulled away from the furnace indicates a draft problem — call a professional.'
WHERE name ILIKE '%flue%';

UPDATE default_tasks SET
  description  = 'The blower motor circulates air through your entire HVAC system. Dust buildup on the blower wheel reduces airflow and efficiency, and causes the motor to overheat. Keeping it clean extends motor life and ensures even temperature distribution throughout your home.',
  tips_parts   = 'No parts needed for cleaning. If the motor has oil ports (older motors), use 3-in-1 oil or electric motor oil (~$5).',
  tips_tools   = 'Screwdriver to access the blower compartment. Vacuum with brush attachment. Stiff brush or old toothbrush to clean blower fins. Compressed air can (optional).',
  tips_how     = '1. Shut off power at the furnace switch AND the breaker before opening the cabinet.
2. Remove the blower compartment door (usually slides or unscrews).
3. Vacuum loose dust from the blower wheel and housing.
4. Use a stiff brush to clean between the blower wheel fins — they collect thick dust layers.
5. Check motor bearings: spin the wheel by hand. It should spin freely with no grinding.
6. If the motor has oil ports (small rubber caps on the motor housing), add 2–3 drops of motor oil.
7. Reinstall panels and restore power.'
WHERE name ILIKE '%blower%';

-- ── WATER ───────────────────────────────────────────────────

UPDATE default_tasks SET
  description  = 'Sediment (minerals from your water supply) settles at the bottom of your water heater tank over time, acting as insulation between the burner and the water. This forces longer heating cycles, increases energy use by up to 25%, and shortens tank life. Flushing annually keeps efficiency up and can add years to the tank''s lifespan.',
  tips_parts   = 'No parts needed for a basic flush. If you notice rust-colored water or the drain valve leaks after flushing, the valve may need replacement (~$8 at hardware stores, same thread size).',
  tips_tools   = 'Garden hose long enough to reach a drain or outside. Flathead screwdriver or hose bib key. Gloves — the water will be very hot.',
  tips_how     = '1. Turn the water heater to "Pilot" (gas) or switch to vacation mode/off (electric) the day before to let water cool, OR be very careful with the hot water.
2. Connect a garden hose to the drain valve at the bottom of the tank.
3. Run the other end to a floor drain, utility sink, or outside (hot water will kill grass — let it cool or drain to pavement).
4. Turn off the cold water supply valve at the top of the heater.
5. Open a hot water faucet somewhere in the house to prevent a vacuum.
6. Open the drain valve and let the water flow until it runs clear (usually 5–15 minutes).
7. Close the drain valve, remove the hose, turn the cold supply back on, and let the tank refill before relighting the pilot or turning power back on.'
WHERE name ILIKE '%flush%' AND category = 'water';

UPDATE default_tasks SET
  description  = 'The pressure relief valve (T&P valve) is a critical safety device that opens automatically if water pressure or temperature inside the tank gets dangerously high. If it fails to open, the tank can explode. If it fails to close, it wastes water and energy. Testing annually confirms it''s still functional.',
  tips_parts   = 'If the valve leaks after testing or drips continuously, replace it. Replacement valves cost $15–$30 at hardware stores. Match the BTU rating and pressure rating on the existing valve.',
  tips_tools   = 'No tools needed to test. Adjustable wrench if replacing.',
  tips_how     = '1. Locate the T&P valve on the side or top of your water heater. It has a small lever and a pipe running down to the floor or a drain.
2. Place a bucket under the discharge pipe — some hot water will come out.
3. Lift the lever quickly for 2–3 seconds, then release. You should hear/feel steam and see a little hot water discharge into the pipe.
4. If the lever doesn''t snap back and water keeps flowing, the valve is stuck open and needs replacement.
5. If no water came out and the lever felt stuck, the valve is seized and needs replacement.
6. A working valve will stop water flow immediately when you release the lever.'
WHERE name ILIKE '%pressure relief%' OR name ILIKE '%T&P%';

UPDATE default_tasks SET
  description  = 'The anode rod is a sacrificial magnesium or aluminum rod inside your water heater that attracts corrosion instead of letting it attack the tank walls. When the rod is consumed, the tank starts corroding and will fail within a few years. Replacing the rod before it''s fully depleted can double or triple the life of your water heater.',
  tips_parts   = 'Replacement anode rods cost $20–$40 at hardware stores. Match the thread size (usually 1-1/16") and choose magnesium for normal water, aluminum for soft water. Teflon tape for the threads.',
  tips_tools   = '1-1/16" socket (or the size that fits your rod). Long breaker bar or impact wrench — the rod is often very tight. Hose and bucket to drain enough water to remove the rod.',
  tips_how     = '1. Shut off cold water supply and power/gas to the heater. Drain 5–10 gallons from the tank to lower the water level below the rod.
2. Locate the hex head on top of the water heater (may be under a plastic cap, or access via a port on the top).
3. Using a 1-1/16" socket and breaker bar, loosen the rod counterclockwise — it will be very tight.
4. Pull out the old rod. If it''s less than ½" diameter or heavily pitted, it''s due for replacement.
5. Wrap the threads of the new rod with Teflon tape (3–4 wraps), insert and tighten firmly.
6. Turn water supply back on, check for leaks, then restore power or relight pilot.'
WHERE name ILIKE '%anode%';

-- ── APPLIANCE ───────────────────────────────────────────────

UPDATE default_tasks SET
  description  = 'The condenser coils on your refrigerator release the heat pulled from inside the fridge. When coated in dust and pet hair, they can''t release heat efficiently — the compressor runs longer and hotter, shortening its life. A compressor replacement costs $300–$600; cleaning the coils takes 15 minutes.',
  tips_parts   = 'No parts needed. A refrigerator coil brush (~$8) makes the job much easier.',
  tips_tools   = 'Coil cleaning brush (long, flexible). Vacuum with brush attachment. Flashlight.',
  tips_how     = '1. Pull the refrigerator away from the wall. Unplug it.
2. Locate the coils — on most modern fridges, they''re underneath, behind a snap-off grille at the bottom front. On older fridges, they''re on the back.
3. Use the coil brush to loosen dust from between the coil fins, then vacuum up the debris.
4. Also vacuum the condenser fan and motor (usually next to the coils underneath).
5. Wipe the floor under and behind the fridge while it''s out.
6. Push the fridge back, plug it in, and make sure there''s 1–2 inches of clearance at the back for airflow.'
WHERE name ILIKE '%refrigerator coil%' OR name ILIKE '%fridge coil%';

UPDATE default_tasks SET
  description  = 'Lint that escapes the dryer trap accumulates in the vent duct over time. Restricted airflow forces the dryer to run longer, increases energy use, and — most critically — creates a fire hazard. Dryer vent fires cause ~2,900 home fires per year in the US. Annual cleaning is one of the highest-impact maintenance tasks in your home.',
  tips_parts   = 'No parts unless the duct itself is damaged. If your duct is the flexible silver foil type, replace it with rigid metal duct ($10–$20) — foil ducts trap more lint and are more fire-prone.',
  tips_tools   = 'Dryer vent cleaning brush kit (long flexible rod brushes, ~$20 on Amazon). Vacuum with hose attachment. Screwdriver to disconnect duct if needed.',
  tips_how     = '1. Pull the dryer away from the wall and disconnect the duct from the back of the dryer.
2. Vacuum inside the dryer duct opening on the dryer itself.
3. Insert the brush kit rod into the wall duct and scrub back and forth while rotating. Add rod extensions to reach the full length.
4. Go outside and remove the exterior vent cap. Brush from that end as well and vacuum out debris.
5. Reconnect the duct to the dryer, ensuring the connection is tight and secure.
6. Run the dryer on air-only for a few minutes to blow out any remaining loose lint.
7. Test: hold your hand in front of the exterior vent while the dryer runs — you should feel strong airflow.'
WHERE name ILIKE '%dryer vent%';

UPDATE default_tasks SET
  description  = 'The refrigerator water filter removes chlorine, lead, cysts, and other contaminants from your drinking water and ice maker water. Over time, the filter media becomes saturated and can no longer effectively filter contaminants — and can even begin harboring bacteria. Most manufacturers recommend replacement every 6 months.',
  tips_parts   = 'Use your refrigerator''s model number to find the correct filter. OEM filters from the manufacturer are most reliable; many compatible aftermarket options (NSF-certified) are available for less. Cost is typically $20–$50.',
  tips_tools   = 'No tools needed — the filter twists or pushes in by hand.',
  tips_how     = '1. Find the filter location: inside the refrigerator (upper right corner or in the door), or in the bottom grille.
2. Turn the old filter counterclockwise (or push the release button) to remove it. Have a towel ready for a small water drip.
3. Remove the cap or O-ring from the old filter and transfer to the new one (if required).
4. Insert the new filter and turn clockwise until it locks, or push until it clicks.
5. Run 2–3 gallons of water through the dispenser to flush the new filter and remove any carbon dust (the water may look slightly gray — that''s normal).
6. Reset the filter indicator light per your model''s instructions (usually hold a button for 3 seconds).'
WHERE name ILIKE '%water filter%' OR name ILIKE '%refrigerator filter%';

-- ── ELECTRICAL ──────────────────────────────────────────────

UPDATE default_tasks SET
  description  = 'Smoke detectors save lives — but only if they work. Battery-powered detectors have a 10-year lifespan after which the sensing chamber degrades even if the battery is new. Hardwired detectors have the same 10-year lifespan. The NFPA recommends testing every month and replacing every 10 years. At minimum, test every 6 months and replace batteries annually.',
  tips_parts   = '9V batteries or AA batteries depending on your detector model. If your detector is over 10 years old (manufacture date is stamped inside the cover), replace the entire unit ($15–$30 at hardware stores). Interconnected models recommended so all alarms sound when one detects smoke.',
  tips_tools   = 'Step stool or ladder. New battery.',
  tips_how     = '1. Press and hold the test button on each detector for 3–5 seconds. A working detector will sound a loud alarm.
2. If the alarm is weak or doesn''t sound, replace the battery first.
3. Open the detector cover, remove the old battery, and note which type is needed.
4. Install the new battery, close the cover, and test again.
5. Check the manufacture date stamped on the label inside the cover — if it''s over 10 years ago, replace the unit.
6. Vacuum the exterior vents with a brush attachment to remove dust that can reduce sensitivity.
7. Note locations of all detectors: required on every level, outside every sleeping area, and inside each bedroom.'
WHERE name ILIKE '%smoke%';

UPDATE default_tasks SET
  description  = 'GFCI (Ground Fault Circuit Interrupter) outlets protect you from electrocution in wet areas like bathrooms, kitchens, garages, and outdoors. They detect tiny current imbalances and cut power in milliseconds. Over time, the internal mechanism can wear out while still appearing functional. Testing quarterly confirms they''re actually working.',
  tips_parts   = 'If a GFCI fails the test, replace it ($15–$25 at hardware stores). Match the amperage rating on the existing outlet (usually 15A or 20A).',
  tips_tools   = 'GFCI outlet tester (~$10, highly recommended) or just use the TEST/RESET buttons.',
  tips_how     = '1. Locate all GFCI outlets: bathrooms, kitchen counters, garage, outdoors, basement, near any water source.
2. BUTTON METHOD: Press the TEST button — you should hear a click and the RESET button will pop out. Verify that power to the outlet (and any regular outlets it protects downstream) is now off using a lamp or tester. Press RESET to restore power.
3. TESTER METHOD: Plug the GFCI tester into the outlet and press its test button. The outlet should go dead. Press RESET on the outlet to restore.
4. If the outlet doesn''t trip when tested, or won''t reset, it needs replacement.
5. Remember: one GFCI outlet can protect multiple regular outlets on the same circuit. Check that protected outlets also lose power during the test.'
WHERE name ILIKE '%GFCI%' OR name ILIKE '%ground fault%';

UPDATE default_tasks SET
  description  = 'Carbon monoxide is an odorless, colorless gas produced by combustion appliances (furnaces, water heaters, gas stoves, fireplaces). CO detectors have a lifespan of 5–7 years. Like smoke detectors, they can appear functional while no longer detecting CO. Test regularly and replace on schedule.',
  tips_parts   = 'Check the manufacture date on the back of the unit. Replace if it''s over 7 years old ($25–$50). Units that combine CO and smoke detection are convenient. Electrochemical CO sensors are more accurate than biomimetic (gel) types.',
  tips_tools   = 'Step stool if needed.',
  tips_how     = '1. Locate all CO detectors — required outside sleeping areas and on every level of the home.
2. Press the test button and hold for 5 seconds. The alarm should sound.
3. If it beeps weakly or doesn''t respond, replace the battery first, then retest.
4. Check the manufacture date (usually on the back label). Replace any unit over 7 years old.
5. Know the difference between beep patterns: most units beep 4 times in a pattern for CO alarm, and chirp once every 30-60 seconds when the battery is low or unit has reached end of life.
6. If your detector alarms for CO: get everyone out immediately, call 911, and don''t re-enter until cleared.'
WHERE name ILIKE '%carbon monoxide%' OR name ILIKE '%CO detector%';

-- ── PLUMBING ────────────────────────────────────────────────

UPDATE default_tasks SET
  description  = 'Drain strainers catch hair, food, and debris before it enters your pipes. Over time, the strainer itself fills up and the basket around it traps soap scum and grease, reducing drainage speed. Clearing strainers regularly prevents slow drains and the need for harsh chemical drain cleaners.',
  tips_parts   = 'No parts needed for cleaning. If the strainer basket is corroded or broken, replacements cost $3–$15 at hardware stores.',
  tips_tools   = 'Rubber gloves. Old toothbrush or bottle brush. Baking soda and white vinegar (natural deodorizer).',
  tips_how     = '1. Remove the strainer from each drain: bathroom sinks, shower/tub, and kitchen sink.
2. Pull out any accumulated hair or debris by hand (gloves recommended).
3. Scrub the strainer and the drain opening with an old toothbrush and dish soap.
4. For odors: pour ½ cup baking soda down the drain, follow with ½ cup white vinegar, let fizz for 5 minutes, then flush with hot water.
5. Check that the strainer sits flat and doesn''t rock — a loose strainer lets debris past it.
6. Run water and watch the drainage speed. If slow, the blockage is further in the drain and may need a drain snake.'
WHERE name ILIKE '%drain%' AND name ILIKE '%strain%';

UPDATE default_tasks SET
  description  = 'Small leaks under sinks waste hundreds of gallons of water per year, promote mold growth inside cabinets, and can cause significant water damage to cabinet floors and subflooring. Catching a slow drip early costs almost nothing to fix; water damage to flooring and cabinets can run thousands of dollars.',
  tips_parts   = 'Plumber''s tape (Teflon tape, ~$2). Compression fittings or supply line if one is leaking (~$10–$20). Plumber''s putty if the drain basket is leaking.',
  tips_tools   = 'Flashlight. Dry paper towel to detect small drips. Adjustable wrench.',
  tips_how     = '1. Clear everything out from under each sink to get a clear view.
2. Run hot water for 30 seconds while watching all connections with a flashlight.
3. Check: supply lines (the braided hoses connecting shut-off valves to the faucet), the P-trap (curved pipe under the drain), drain connections, and the shut-off valves themselves.
4. Dry any suspicious area with a paper towel, then press the towel against the connection and hold for 10 seconds — any moisture shows up clearly.
5. Hand-tighten any loose slip-joint connections on the drain pipes. Don''t overtighten plastic fittings.
6. Check under the dishwasher (if accessible) for the same issues.
7. If the shut-off valve itself is leaking, tighten the packing nut slightly. If that doesn''t work, the valve needs replacement.'
WHERE name ILIKE '%leak%' AND category = 'plumbing';

UPDATE default_tasks SET
  description  = 'Water shut-off valves are only as reliable as the last time they were used. Valves that sit fully open for years can seize in place — meaning when you have a burst pipe or need to do a repair, you can''t stop the water. Cycling them annually keeps the internal seals pliable and confirms they still work.',
  tips_parts   = 'Penetrating oil (WD-40 or similar) for stuck valves. If a valve leaks when you operate it, the packing nut may just need tightening — or the valve may need replacement.',
  tips_tools   = 'Adjustable wrench. Towels in case of small drips.',
  tips_how     = '1. Locate your main shut-off valve (usually where the water line enters your home — basement, utility room, or outside near the foundation). Also locate shut-offs under every sink and toilet.
2. Slowly turn each valve clockwise until closed, then counterclockwise until fully open. For ball valves (lever handle), a quarter turn closes/opens them.
3. Check for drips at the valve stem while operating — tighten the packing nut slightly if you see any.
4. If a gate valve (round handle) is stuck, try applying penetrating oil to the stem and waiting 10 minutes before retrying. Don''t force it.
5. After operating all valves, confirm your water pressure is normal by running a faucet.'
WHERE name ILIKE '%shut-off%' OR name ILIKE '%shutoff%';

-- ── ROOF ────────────────────────────────────────────────────

UPDATE default_tasks SET
  description  = 'Clogged gutters cause water to overflow and pool against your foundation, leading to basement water intrusion and foundation damage. They also cause water to back up under roofing materials (ice dams in cold climates) and provide a perfect nesting spot for pests. Clean gutters redirect water 6+ feet away from your foundation where it belongs.',
  tips_parts   = 'Gutter scoops (~$5). If gutters have holes, gutter patch sealant ($8–$15). Consider gutter guards after cleaning to reduce future maintenance.',
  tips_tools   = 'Extension ladder (properly rated for your weight). Gutter scoop or trowel. Garden hose with spray nozzle. Bucket or tarp to collect debris. Gloves.',
  tips_how     = '1. Set up your ladder on stable, level ground. Never lean a ladder against gutters — use stand-off stabilizers or brace against the fascia.
2. Work in sections. Scoop out leaves and debris into a bucket. Start at the downspout end and work toward it.
3. After clearing debris, flush the gutter with a garden hose to check water flow toward the downspout.
4. Check the slope: gutters should drop about ¼ inch for every 10 feet toward the downspout. Water pooling in the middle means the gutter has sagged and needs re-hanging.
5. Run water down each downspout and confirm it flows freely at the bottom. If blocked, use a hose on full pressure from the bottom up, or a drain snake.
6. Inspect gutter seams and end caps for leaks. Seal with gutter sealant from inside the gutter while it''s dry.
7. Check that downspout extensions direct water at least 6 feet from the foundation.'
WHERE name ILIKE '%gutter%';

UPDATE default_tasks SET
  description  = 'Your roof is your home''s first defense against weather. Small issues — a cracked shingle, lifted flashing, or damaged sealant around a vent — let water in and cause mold, rotted decking, and ceiling damage. Catching these issues early means a $20 tube of roofing sealant instead of a $5,000 decking repair.',
  tips_parts   = 'Roofing sealant / roof cement ($8–$15) for minor flashing and vent issues. Replacement shingles if any are cracked or missing (match your existing shingle type and color). Roofing nails.',
  tips_tools   = 'Binoculars (for ground-level inspection — safer than climbing). Camera with zoom to document issues. If going on roof: rubber-soled shoes, roof harness for steep pitches.',
  tips_how     = '1. START FROM THE GROUND: Use binoculars to scan the roof from different angles. Look for: missing or curled shingles, dark streaks (algae), sagging areas, exposed nail heads, and damaged ridge cap.
2. Check gutters for granules (looks like coarse sand) — shingles losing granules are at end of life.
3. INSIDE YOUR ATTIC: On a sunny day, go into the attic and look for daylight coming through the roof deck. Also look for water stains, mold, or wet insulation.
4. Check all roof penetrations: chimneys, vents, skylights, and pipes. These are the most common leak points. The metal flashing around them should be flat and sealed with no gaps.
5. After heavy rain, check your ceilings for water stains or discoloration.
6. For any issues beyond minor sealant work, contact a licensed roofing contractor for repairs.'
WHERE name ILIKE '%roof%' AND name ILIKE '%inspect%';

-- ── OTHER ───────────────────────────────────────────────────

UPDATE default_tasks SET
  description  = 'Garage door springs, hinges, and rollers bear the weight of a heavy door hundreds of times per year. Dry or corroded parts wear quickly, cause loud operation, and can fail suddenly — a broken spring can make the door impossible to open or close. Lubrication takes 5 minutes and dramatically extends the life of all moving parts.',
  tips_parts   = 'White lithium grease or garage door lubricant spray (NOT WD-40, which is a solvent, not a lubricant). Available at hardware stores for $6–$10.',
  tips_tools   = 'Lubricant spray with extension nozzle. Rag for wiping excess.',
  tips_how     = '1. Disconnect the garage door opener (pull the red emergency cord) so you can move the door manually.
2. Open the door halfway and spray lubricant on the rollers (the wheels that run along the track). Wipe off excess — you want a thin coat.
3. Lubricate the hinges where the door sections connect, at every pivot point.
4. Lubricate the torsion spring(s) above the door by spraying along the coils. This is the large spring(s) running horizontally above the door. DO NOT attempt to adjust or repair springs — they are under extreme tension and can cause serious injury.
5. Lubricate the bearing plates on each end of the torsion spring.
6. Reconnect the opener and run the door up and down 3–4 times to distribute the lubricant.
7. The door should move quietly and smoothly. If it still grinds or strains, have a technician inspect the springs and cables.'
WHERE name ILIKE '%garage%';
