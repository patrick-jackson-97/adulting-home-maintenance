-- ============================================================
-- ADULTING — default_tasks_v2.sql
-- Replaces all default tasks with equipment-specific tasks.
-- Each task has:
--   category  = broad category used for display grouping (hvac, water, etc.)
--   asset_type = specific equipment ID matching intake.js item.id values
--
-- Run this in Supabase → SQL Editor
-- ============================================================

-- Step 1: Add asset_type column
ALTER TABLE default_tasks ADD COLUMN IF NOT EXISTS asset_type TEXT;

-- Step 2: Clear existing default tasks (maintenance_tasks table is unaffected)
DELETE FROM default_tasks;

-- Step 3: Insert equipment-specific tasks
-- ============================================================

INSERT INTO default_tasks (category, asset_type, name, interval_days, description, tips_parts, tips_tools, tips_how) VALUES

-- ── CENTRAL AC / HEAT PUMP ───────────────────────────────────
('hvac', 'central-ac', 'Replace HVAC air filter', 60,
 'Your HVAC filter traps dust, pollen, pet dander, and other particles. A clogged filter forces the system to work harder, raising energy bills and shortening blower motor life.',
 'Check the filter frame for the size (e.g. 16x25x1). MERV 8–11 is the sweet spot. Stock up on a 6-pack.',
 'No tools needed. A flashlight helps in dark utility closets.',
 '1. Turn off the HVAC system at the thermostat.
2. Locate the filter — usually in the return air vent or inside the air handler cabinet.
3. Slide out the old filter. Note the arrow showing airflow direction.
4. Hold the old filter to light — if you can''t see through it, it''s overdue.
5. Insert the new filter with the arrow pointing toward the air handler.
6. Turn system back on.'),

('hvac', 'central-ac', 'Clean outdoor condenser coils', 365,
 'Dirty condenser coils can''t release heat efficiently — the compressor runs hotter and longer, shortening its life. Cleaning takes 20 minutes and can cut cooling costs noticeably.',
 'Garden hose with spray nozzle. Coil cleaner foam spray (Nu-Calgon, ~$15) for heavy buildup.',
 'Screwdriver to remove access panels. Garden hose. Fin comb (~$10) to straighten bent fins if needed.',
 '1. Turn off power at the disconnect box next to the outdoor unit.
2. Remove debris (leaves, grass) from around the unit.
3. Use a garden hose to spray water through the fins from inside out — push dirt outward.
4. Avoid bending fins — spray straight through, not at an angle.
5. For heavy buildup, apply coil cleaner foam per product instructions, then rinse.
6. Restore power and test cooling.'),

('hvac', 'central-ac', 'Clear A/C condensate drain line', 365,
 'The condensate drain removes humidity pulled from indoor air. A clogged drain causes water to back up into the air handler, leading to water damage and mold growth.',
 '1 cup of diluted white vinegar or bleach (1 part bleach to 10 parts water).',
 'Wet/dry vacuum (optional but very effective). Flashlight.',
 '1. Locate the condensate drain pan — inside the air handler cabinet, usually below the evaporator coil.
2. Check for standing water in the pan. Water = clogged drain.
3. Find the drain line (a white PVC pipe, usually ¾" diameter) exiting the air handler.
4. Pour ¼ cup of diluted bleach or white vinegar into the drain line access port to kill mold and algae.
5. Alternatively, use a wet/dry vacuum on the exterior end of the drain line to suck out the clog.
6. Verify drainage by pouring a cup of water into the pan and watching it drain freely.'),

('hvac', 'central-ac', 'Schedule annual HVAC tune-up', 365,
 'An annual professional inspection checks refrigerant levels, electrical connections, and system efficiency. Most manufacturers require annual service to keep warranties valid.',
 'No parts needed — budget $80–$150 for a standard tune-up.',
 'Leave this to a licensed HVAC technician.',
 '1. Schedule in spring (before cooling season) — before peak demand when wait times are longer.
2. Clear 2 feet of space around the outdoor unit and air handler before the technician arrives.
3. Note any symptoms: unusual sounds, rooms that don''t cool well, higher energy bills.
4. Ask for a written report of everything checked and any recommendations.'),

-- ── GAS FURNACE ─────────────────────────────────────────────
('hvac', 'gas-furnace', 'Replace HVAC air filter', 60,
 'Your HVAC filter traps dust, pollen, and allergens. A clogged filter forces the blower to work harder, raising energy bills and shortening motor life.',
 'Check the filter frame for the size (e.g. 16x25x1). MERV 8–11 is the sweet spot. Stock up on a 6-pack.',
 'No tools needed. Flashlight helps in dark closets.',
 '1. Turn off the furnace at the thermostat.
2. Locate the filter — usually at the return air vent (large louvered grill) or inside the furnace cabinet door.
3. Slide out the old filter, noting the airflow arrow direction.
4. Insert the new filter with the arrow pointing toward the furnace blower.
5. Restore power and test heating.'),

('hvac', 'gas-furnace', 'Schedule annual furnace tune-up', 365,
 'A professional tune-up catches heat exchanger cracks, gas pressure issues, and carbon monoxide hazards before they become expensive or dangerous.',
 'Budget $80–$150. Ask about a service contract covering future labor.',
 'Licensed HVAC technician with combustion analyzer and gas pressure gauges.',
 '1. Schedule in fall before heating season — technicians are busiest in October/November.
2. Clear 2 feet of space around the furnace before the technician arrives.
3. List any symptoms: unusual smells, short-cycling, uneven heating, higher gas bills.
4. Ask the tech to verify: heat exchanger integrity, gas pressure, burner combustion, and flue draft.'),

('hvac', 'gas-furnace', 'Inspect furnace flue pipe', 365,
 'The flue pipe carries combustion gases including carbon monoxide outside. Blockages or cracks can force deadly gases back into your living space.',
 'Sheet metal screws and HVAC foil tape (~$10) for small leak repairs. Serious damage = call a technician.',
 'Flashlight. Screwdriver if you need to disconnect a section.',
 '1. With the furnace OFF, trace the flue pipe from the furnace through the wall or ceiling to outside.
2. Look for rust, holes, separated joints, or corrosion along the entire length.
3. Check the exterior vent cap for bird nests, leaves, or debris.
4. Confirm all joints have at least 3 sheet metal screws and are sealed with foil tape.
5. Blue or black discoloration near the furnace = call a technician — this suggests combustion problems.'),

('hvac', 'gas-furnace', 'Clean furnace blower assembly', 730,
 'Dust buildup on the blower wheel reduces airflow, causes the motor to overheat, and leads to uneven heating throughout the house.',
 'No parts needed for cleaning. If the motor has oil ports, use 3-in-1 motor oil (~$5).',
 'Screwdriver to open cabinet. Vacuum with brush attachment. Stiff brush or toothbrush.',
 '1. Shut off power at the furnace switch AND the breaker.
2. Remove the blower compartment door.
3. Vacuum loose dust from the blower wheel and housing.
4. Use a stiff brush to clean between the blower wheel fins.
5. Spin the wheel by hand — should rotate freely with no grinding.
6. If the motor has oil ports (small rubber caps), add 2–3 drops of motor oil.
7. Reinstall panels and restore power.'),

-- ── ELECTRIC FURNACE ─────────────────────────────────────────
('hvac', 'electric-furnace', 'Replace HVAC air filter', 60,
 'A clogged filter restricts airflow, forcing the electric heating elements to run longer and increasing your electricity bill.',
 'Check the filter frame for size. MERV 8–11 recommended.',
 'No tools needed.',
 '1. Turn off the furnace at the thermostat.
2. Locate and slide out the filter — inside the furnace cabinet or at the return air vent.
3. Note airflow arrow direction, then insert new filter with arrow toward the blower.
4. Restore power.'),

('hvac', 'electric-furnace', 'Schedule annual furnace tune-up', 365,
 'Annual inspection checks heating elements, electrical connections, and blower performance. Catches failing elements before you lose heat on a cold night.',
 'Budget $80–$150 for a tune-up.',
 'Licensed HVAC technician.',
 '1. Schedule in fall before heating season.
2. Ask the technician to check all heating elements, contactors, capacitors, and blower motor.'),

('hvac', 'electric-furnace', 'Inspect and clean heating elements', 730,
 'Dust on heating elements reduces efficiency and can cause a burning smell. Inspecting them also catches a failed element before you lose heating capacity.',
 'Compressed air can. Soft brush.',
 'Screwdriver to open access panel. Vacuum with brush attachment.',
 '1. Turn off ALL power to the furnace at the breaker.
2. Remove the access panel covering the heating elements.
3. Visually inspect elements for breaks, hot spots, or corrosion.
4. Gently vacuum or blow dust off the elements.
5. Reinstall panel and restore power.'),

-- ── BOILER ──────────────────────────────────────────────────
('hvac', 'boiler', 'Schedule annual boiler service', 365,
 'Annual professional service checks burner combustion, heat exchanger integrity, and controls — catching issues that could lead to carbon monoxide leaks or costly failures.',
 'Budget $100–$200 for annual boiler service.',
 'Licensed HVAC/plumbing technician.',
 '1. Schedule in fall before heating season.
2. Clear access to the boiler and all radiators/baseboards.
3. Note any issues: unusual sounds, cold radiators, pressure drops.
4. Ask the tech to check: burner combustion, flue draft, pressure relief valve, and expansion tank.'),

('hvac', 'boiler', 'Bleed radiators to remove trapped air', 365,
 'Air gets trapped in radiators and prevents hot water from filling them fully, leaving the tops cold and reducing heating efficiency.',
 'Radiator bleed key (~$3 at hardware stores) — or a flat-head screwdriver for modern bleed valves.',
 'Small bowl or rag to catch drips. Bleed key.',
 '1. Turn the boiler on and let the system heat up fully (30 minutes).
2. Starting with the radiator farthest from the boiler, locate the bleed valve (small square or flat-head fitting at the top end of the radiator).
3. Place a small bowl under the valve.
4. Slowly turn the valve counterclockwise ½ turn. You''ll hear a hiss as air escapes.
5. When water starts dripping out (no more air), close the valve.
6. Check the boiler pressure gauge — refill through the fill valve if pressure dropped below the normal range (usually 12–15 PSI).'),

('hvac', 'boiler', 'Check boiler pressure gauge', 180,
 'Boiler pressure that''s too low means radiators won''t heat fully. Too high risks the pressure relief valve opening. Keeping pressure in the normal range ensures efficient, safe operation.',
 'No parts needed unless you need to add water (use the fill valve).',
 'No tools needed — just read the gauge on the front of the boiler.',
 '1. When the boiler is cold (not running), check the pressure gauge — normal cold pressure is 12–15 PSI.
2. If below 12 PSI, open the fill valve (usually a lever or knob near the cold water line entering the boiler) until pressure reaches 15 PSI, then close it.
3. If pressure is above 25 PSI or the system frequently over-pressurizes, the expansion tank may need replacement.'),

('hvac', 'boiler', 'Test boiler pressure relief valve', 365,
 'The pressure relief valve is a critical safety device. It opens if pressure gets dangerously high, preventing the boiler from exploding.',
 'If the valve drips continuously after testing, replace it. Replacement: $20–$40 at plumbing supply stores.',
 'Small bucket or towel under the discharge pipe.',
 '1. Place a bucket under the relief valve discharge pipe (a pipe running down from the valve, usually to the floor).
2. Lift the lever on the pressure relief valve for 2–3 seconds, then release.
3. You should see water discharge into the pipe and flow stop immediately when you release.
4. If water keeps flowing, the valve is stuck — it needs replacement.
5. If the lever was seized and nothing came out, the valve needs replacement.'),

-- ── MINI-SPLIT ───────────────────────────────────────────────
('hvac', 'mini-split', 'Clean mini-split air filters', 30,
 'Mini-split filters trap dust and allergens. Clogged filters block airflow, reduce efficiency dramatically, and can cause the indoor unit to freeze up or drip water.',
 'No parts needed for cleaning. If filters are torn, replacement filters are $10–$30 per unit.',
 'Step stool to reach the indoor unit. Vacuum with soft brush attachment. Sink for rinsing.',
 '1. Turn off the mini-split at the remote or wall control.
2. Lift the front panel of the indoor head unit (usually hinges upward).
3. Slide out the mesh filter panels.
4. Vacuum loose dust from both sides.
5. Rinse under warm water, let dry completely — never reinsert wet.
6. Reinstall filters, close the panel, and restore power.'),

('hvac', 'mini-split', 'Clean indoor evaporator coils', 365,
 'Even with clean filters, dust reaches the coils over time. Dirty coils reduce efficiency and can cause the unit to drip water or develop mold/odors.',
 'No-rinse evaporator coil cleaner spray (~$10). Coil brush (optional).',
 'Step stool. Spray bottle or coil cleaner can.',
 '1. Turn off the mini-split and remove the filters (see filter cleaning).
2. With the front panel open, spray coil cleaner evenly across the visible coil surface.
3. Let it drip-rinse through the drain pan — the cleaner is designed to self-drain.
4. Check the drain line at the bottom of the unit for blockages; pour a small amount of diluted bleach down it.
5. Let dry 15 minutes before running the unit.'),

('hvac', 'mini-split', 'Clean outdoor compressor unit', 365,
 'Leaves, dirt, and debris restrict airflow through the outdoor unit, reducing efficiency and causing the compressor to work harder.',
 'Garden hose with spray nozzle.',
 'Garden hose. Gloves.',
 '1. Turn off power to the outdoor unit.
2. Clear any leaves, grass clippings, or debris from around and on top of the unit.
3. Gently rinse the fins with a garden hose from top down — don''t use high pressure.
4. Keep at least 18" of clearance on all sides for proper airflow.
5. Restore power.'),

('hvac', 'mini-split', 'Schedule annual mini-split service', 365,
 'Annual professional service checks refrigerant levels, electrical connections, and drains. Required by most manufacturers to maintain warranty coverage.',
 'Budget $100–$150 per system.',
 'Licensed HVAC technician with mini-split certification.',
 '1. Schedule in spring before cooling season.
2. Note any issues: ice on the unit, water dripping, unusual noises, or poor heating/cooling.
3. Ask the technician to check refrigerant charge, electrical connections, and condensate drain.'),

-- ── ROOFTOP UNIT (RTU) ───────────────────────────────────────
('hvac', 'rtu', 'Replace RTU air filter', 90,
 'Rooftop unit filters trap airborne debris before it reaches the coils. Restricted airflow strains the compressor and reduces both heating and cooling capacity.',
 'Check the existing filter frame for the size — usually listed on the filter edge.',
 'Access to the roof (rooftop unit cover panels). Screwdriver.',
 '1. Access the unit per your building''s roof access procedure — use proper safety precautions on the roof.
2. Open the filter access panel on the unit.
3. Remove and replace the filter; note airflow direction arrow.
4. Close the panel securely.'),

('hvac', 'rtu', 'Schedule annual RTU service', 365,
 'RTUs combine heating and cooling in one package. Annual service covers coils, refrigerant, heat exchanger, and electrical — essential for maintaining efficiency and preventing roof leaks from condensate.',
 'Budget $150–$250 for RTU service (requires roof access).',
 'Licensed commercial HVAC technician.',
 '1. Schedule in spring before cooling season.
2. Ensure roof access is coordinated and safe.
3. Ask the tech to clean coils, check refrigerant, inspect condensate drain, and test both heat and cool modes.'),

('hvac', 'rtu', 'Clear RTU condensate drain', 365,
 'RTU condensate drains can block from algae and debris, causing water to pool on the roof or leak into the building interior.',
 'Diluted bleach solution. Garden hose or vacuum.',
 'Roof access. Wet/dry vacuum (optional).',
 '1. Access the rooftop unit.
2. Locate the condensate drain pan inside the unit and the drain outlet (usually exits through the unit base to the roof drain or scupper).
3. Pour diluted bleach (1:10) into the drain pan to kill algae.
4. Confirm water drains freely — use a vacuum to clear blockages if needed.'),

-- ── TANK WATER HEATER ────────────────────────────────────────
('water', 'tank-wh', 'Flush water heater sediment', 365,
 'Sediment settles at the bottom of the tank, insulating the burner from the water and causing longer heating cycles. Flushing annually can add years to the tank''s life.',
 'No parts needed. If the drain valve leaks after flushing, replacement valves are ~$8.',
 'Garden hose long enough to reach a drain. Flathead screwdriver. Gloves — the water is very hot.',
 '1. Set water heater to "Pilot" (gas) or turn off breaker (electric) the day before, or work carefully with hot water.
2. Connect a garden hose to the drain valve at the bottom of the tank.
3. Run the hose to a floor drain or outside (let hot water cool first — it will kill grass).
4. Turn off the cold water supply valve at the top of the tank.
5. Open a hot water faucet in the house to prevent a vacuum.
6. Open the drain valve and let water flow until it runs clear (5–15 minutes).
7. Close the drain valve, remove the hose, turn cold supply back on, let tank refill before restoring power.'),

('water', 'tank-wh', 'Test pressure relief valve', 365,
 'The T&P valve is a critical safety device. If it fails, a faulty water heater can build enough pressure to explode. Testing annually confirms it still works.',
 'If the valve drips continuously after testing, replace it — $15–$30 at hardware stores, match the BTU and pressure ratings.',
 'No tools to test. Adjustable wrench if replacing.',
 '1. Place a bucket under the discharge pipe (the pipe running down from the T&P valve).
2. Lift the lever on the T&P valve quickly for 2–3 seconds, then release.
3. A good valve discharges hot water and stops immediately when released.
4. If water keeps flowing, the valve is stuck open and needs replacement.
5. If the lever was seized and nothing came out, the valve is stuck and needs replacement.'),

('water', 'tank-wh', 'Inspect anode rod', 730,
 'The sacrificial anode rod attracts corrosion instead of letting it attack the tank walls. When consumed, the tank begins corroding and can fail within a few years.',
 'Replacement rods: $20–$40 at hardware stores. Match thread size (usually 1-1/16") and choose magnesium for normal water. Teflon tape for threads.',
 '1-1/16" socket and breaker bar (the rod is often very tight). Bucket to drain enough water before removal.',
 '1. Shut off cold water supply and power/gas to the heater. Drain 5–10 gallons to lower the water level.
2. Find the hex head on top of the heater (may be under a plastic cap).
3. Use a 1-1/16" socket and breaker bar to loosen the rod counterclockwise.
4. Pull out the rod. If it''s less than ½" diameter or heavily pitted, replace it.
5. Wrap new rod threads with Teflon tape, insert and tighten firmly.
6. Restore water supply and check for leaks before restoring power.'),

('water', 'tank-wh', 'Inspect flue pipe and venting (gas)', 365,
 'A cracked or disconnected flue can allow carbon monoxide to enter your home. This inspection takes 5 minutes.',
 'Sheet metal screws and HVAC foil tape for small repairs.',
 'Flashlight.',
 '1. With the water heater OFF, trace the flue pipe from the top of the unit to the exterior vent cap.
2. Check for rust, holes, separated joints, or disconnected sections.
3. Check the exterior vent cap for bird nests or debris.
4. Confirm all joints have sheet metal screws and foil tape seals.'),

('water', 'tank-wh', 'Check for leaks and corrosion', 365,
 'Catching a small water heater leak early prevents water damage to the surrounding area. Rust or mineral deposits are warning signs of an aging tank.',
 NULL, NULL,
 '1. Inspect the tank body, fittings, and drain valve for rust streaks, water stains, or mineral deposits.
2. Run your hand under the T&P valve and around the base — any moisture indicates a slow leak.
3. Check the area around and under the water heater for staining or rust on the floor.
4. Surface rust on fittings is normal; rust dripping from the tank body means the tank is failing and should be replaced.'),

-- ── TANKLESS WATER HEATER ────────────────────────────────────
('water', 'tankless-wh', 'Descale tankless water heater', 365,
 'Mineral scale (calcium and magnesium deposits) builds up on the heat exchanger over time, reducing efficiency and eventually causing premature failure. Annual descaling keeps it running at full capacity.',
 'White vinegar (food grade) or descaling solution specific to tankless heaters (~$15). Two hoses and a small submersible pump if doing a flush kit method.',
 'Descaling kit (pump + hoses + bucket) OR a professional service call.',
 '1. Turn off the water heater at the breaker or gas valve.
2. Close the hot and cold isolation valves on the unit.
3. Connect a small pump and hoses to the service ports on the isolation valves (most modern units have them).
4. Run 3 gallons of food-grade white vinegar through the heat exchanger for 45 minutes.
5. Flush with clean water for 10 minutes, then restore water supply and power.
6. If your unit doesn''t have service ports, schedule professional descaling.'),

('water', 'tankless-wh', 'Clean inlet filter screens', 365,
 'Tankless water heaters have small filter screens on the water inlets to prevent debris from reaching the heat exchanger. Clogged screens reduce water flow and trigger error codes.',
 'No parts needed unless screens are damaged.',
 'Needle-nose pliers to remove screens. Old toothbrush.',
 '1. Turn off water supply to the unit.
2. Locate the cold water inlet (usually labeled, at the bottom of the unit).
3. Use needle-nose pliers to gently pull out the small mesh screen filter.
4. Rinse under water and gently scrub with a toothbrush.
5. Reinstall the screen and restore water supply.'),

('water', 'tankless-wh', 'Test pressure relief valve', 365,
 'Like tank water heaters, tankless units have a pressure relief valve that must be tested annually to confirm it still functions.',
 'If the valve leaks after testing, replace it — $15–$30 at hardware stores.',
 'Small bucket under the discharge pipe.',
 '1. Locate the T&P valve on the unit.
2. Place a bucket under the discharge pipe.
3. Lift the valve lever for 2–3 seconds, then release.
4. Water should discharge and stop immediately when released.
5. If it drips continuously or won''t open, replace the valve.'),

('water', 'tankless-wh', 'Schedule annual tankless service', 365,
 'Annual professional service checks burner combustion (gas), electrical connections, and venting to maximize efficiency and prevent failures.',
 'Budget $100–$150 for a professional service visit.',
 'Licensed plumber or HVAC technician familiar with tankless units.',
 '1. Schedule in fall.
2. Report any error codes, reduced hot water flow, or unusual sounds.
3. Ask the tech to clean the burner assembly (gas), check venting, and verify water flow rate.'),

-- ── WATER SOFTENER ───────────────────────────────────────────
('water', 'water-softener', 'Refill salt in brine tank', 30,
 'The water softener uses salt to regenerate the resin that removes hard water minerals. When salt runs out, the softener stops working and hard water damages your pipes and appliances.',
 'Use pellet salt or solar salt designed for water softeners (~$6–$10 per 40 lb bag at hardware stores). Avoid rock salt — it leaves more residue.',
 NULL,
 '1. Open the brine tank lid (the shorter of the two tanks).
2. Check the salt level — if you can see the water surface or the salt is below halfway, it''s time to refill.
3. Pour salt pellets in until the tank is about ¾ full — don''t overfill.
4. If the salt is clumped into a hard mass (salt bridge), break it up with a broom handle before adding new salt.'),

('water', 'water-softener', 'Check for salt bridges', 90,
 'A salt bridge is a hardened crust of salt that forms in the brine tank and prevents the softener from working — even though salt appears present. If your water has been feeling hard, check for this.',
 NULL, 'Broom handle or long stick.',
 '1. Open the brine tank lid.
2. Push a broom handle down through the salt — if it stops before reaching the water, there is a salt bridge.
3. Break up the crust by pressing the broom handle around the edges and through the center.
4. Remove large chunks of broken crust and discard.'),

('water', 'water-softener', 'Clean brine tank', 365,
 'Sludge and sediment accumulate at the bottom of the brine tank over time, reducing softener efficiency and contaminating the resin.',
 'Dish soap. Water softener cleaner (optional, ~$10).',
 'Garden hose. Bucket. Wet/dry vacuum (optional).',
 '1. Put the softener into bypass mode (turn the bypass valve).
2. Scoop out remaining salt from the brine tank.
3. Use a wet/dry vacuum to remove any remaining water and sludge from the bottom.
4. Rinse the tank with clean water and scrub with dish soap.
5. Rinse thoroughly, then refill with fresh salt and restore to service mode.'),

-- ── WHOLE-HOUSE WATER FILTER ─────────────────────────────────
('water', 'whole-house-filter', 'Replace whole-house filter cartridge', 180,
 'A saturated filter cartridge no longer effectively removes contaminants and can harbor bacteria. The replacement interval varies by filter type and water quality.',
 'Replacement cartridges for your specific housing size (usually 10" or 20" standard). Match the micron rating of your current filter.',
 'Filter housing wrench (often included with the filter; also available for ~$10). Small bucket for drips.',
 '1. Turn off the water supply to the filter housing (usually a bypass or shutoff valve on each side).
2. Open a faucet downstream to relieve pressure.
3. Use the housing wrench to unscrew the filter housing counterclockwise.
4. Remove the old cartridge and dispose of it.
5. Rinse the housing interior with clean water.
6. Insert the new cartridge and hand-tighten the housing (don''t overtighten — just firm).
7. Turn water supply back on slowly and check for leaks.
8. Run a faucet for 1 minute to flush the new filter.'),

('water', 'whole-house-filter', 'Sanitize filter housing', 365,
 'Biofilm can grow inside filter housings over time, especially if the filter hasn''t been changed regularly. Annual sanitizing keeps water quality high.',
 '1 tablespoon of household bleach. Gloves.',
 'Filter housing wrench. Bucket.',
 '1. Remove the filter cartridge (see cartridge replacement steps).
2. Mix 1 tablespoon bleach in 1 gallon of water.
3. Wipe the inside of the housing with the solution using a clean cloth.
4. Rinse thoroughly with clean water.
5. Install a fresh cartridge and restore water supply.'),

-- ── SUMP PUMP ────────────────────────────────────────────────
('water', 'sump-pump', 'Test sump pump operation', 90,
 'A sump pump that fails during a heavy rain can allow thousands of dollars of water damage in hours. Quarterly testing confirms it''s ready when you need it most.',
 NULL, 'Flashlight. Bucket of water.',
 '1. Remove the pit cover (if present) and look inside. The pit should be dry or have minimal water.
2. Pour a bucket of water into the pit to raise the float.
3. The pump should turn on within a few seconds as the water level rises.
4. Confirm water is pumping through the discharge pipe (you should hear it running and see the water level drop).
5. The pump should shut off automatically after the water drains.
6. If the pump doesn''t start, check the power connection and outlet first.'),

('water', 'sump-pump', 'Clean sump pit', 365,
 'Debris, sediment, and gravel accumulate in the sump pit and can clog the pump intake or damage the impeller. Annual cleaning extends pump life.',
 NULL, 'Wet/dry vacuum. Gloves. Flashlight.',
 '1. Disconnect the pump power (unplug or switch off breaker).
2. Remove the pump from the pit.
3. Use a wet/dry vacuum to remove water, sediment, and debris from the pit.
4. Rinse the pit walls with clean water and vacuum again.
5. Inspect the pump impeller and intake screen — remove any debris.
6. Reinstall the pump and restore power.'),

('water', 'sump-pump', 'Test backup battery or backup pump', 180,
 'Your backup system is the only protection during power outages — which is exactly when heavy storms knock power out. Testing ensures it works when your primary pump can''t.',
 'Battery-powered backup sump pumps use specific batteries. Check your model — often a Group 27 or 29 marine battery. Budget $80–$150 for replacement.',
 'Flashlight. Bucket of water.',
 '1. Unplug the main sump pump to simulate a power outage.
2. Pour water into the pit until the backup pump activates.
3. Confirm it pumps water and shuts off correctly.
4. Restore main pump power.
5. Check the battery charge indicator on the battery backup unit (if present).
6. If the battery is more than 3–5 years old, consider replacing it proactively.'),

('water', 'sump-pump', 'Inspect discharge line and check valve', 365,
 'A blocked discharge line or failed check valve can allow water to flow back into the pit after the pump stops, causing it to run continuously and burn out.',
 NULL, 'Flashlight.',
 '1. Trace the discharge pipe from the sump pump to where it exits the house.
2. Make sure the outdoor discharge point is at least 6 feet from the foundation and water flows away.
3. In winter, confirm the outdoor end is not blocked by ice.
4. Locate the check valve on the discharge pipe (a fitting that only allows flow in one direction). Pour water into the pit and listen for backflow after the pump shuts off — if you hear a loud backflow gurgle, the check valve has failed and should be replaced.'),

-- ── WELL SYSTEM ──────────────────────────────────────────────
('water', 'well-system', 'Test well water quality', 365,
 'Well water is unregulated, so testing annually catches bacterial contamination, nitrates, pH changes, and mineral levels before they become a health risk.',
 'Water test kit or professional lab test. Basic kits: $15–$30. Lab test: $40–$100 and more comprehensive.',
 NULL,
 '1. Contact your county health department — many offer free or subsidized testing kits.
2. Follow the kit instructions carefully for collecting a water sample (usually involves running the tap for 2 minutes first).
3. Mail or drop off at the specified lab.
4. Compare results to EPA drinking water standards.
5. If coliform bacteria are detected, shock chlorinate the well — a process you can do yourself or hire a well service.'),

('water', 'well-system', 'Inspect well pressure tank', 365,
 'A waterlogged pressure tank (one that has lost its air charge) causes the pump to short-cycle rapidly, shortening pump life dramatically.',
 NULL, 'Tire pressure gauge. Hose.',
 '1. Turn off power to the well pump.
2. Drain the pressure from the tank by opening a faucet until water flow stops.
3. Check the air valve (Schrader valve, like a tire valve) on the top of the tank using a tire gauge.
4. The pre-charge pressure should be 2 PSI below your pump''s cut-in pressure (usually 38 PSI for a 40/60 switch).
5. If air pressure is low, add air with a bicycle pump.
6. If the tank feels heavy and no air comes from the valve, the bladder has failed — replace the tank.'),

('water', 'well-system', 'Check well cap and casing', 365,
 'A damaged or missing well cap allows insects, rodents, and surface water to contaminate the well, which can cause bacterial contamination detected on your annual test.',
 'Replacement well caps: $15–$30 at plumbing supply stores.',
 'Flashlight.',
 '1. Go to the well casing in your yard (the pipe sticking up from the ground, usually 6"–8" in diameter).
2. Check that the cap is securely in place and sealed.
3. Look for cracks, corrosion, or gaps around the top.
4. Inspect for evidence of insects entering — ants, spiders, or mud daubers nesting inside.
5. Make sure the ground slopes away from the well casing to prevent surface water from running in.'),

-- ── IRRIGATION SYSTEM ────────────────────────────────────────
('water', 'irrigation', 'Spring irrigation startup and zone test', 365,
 'After winterization, irrigation systems need a careful startup to avoid water hammer damage and identify heads that were broken by frost, mowers, or settling soil.',
 NULL, NULL,
 '1. Open the main irrigation shutoff valve slowly to pressurize the system gradually.
2. Enable each zone at the controller one at a time. Walk each zone and observe:
   - Sprinkler heads that don''t pop up (clogged or broken)
   - Heads spraying in the wrong direction
   - Pooling water indicating a broken line underground
3. Adjust head direction and coverage as needed.
4. Test the rain/weather sensor if present.
5. Set controller schedule for the new season.'),

('water', 'irrigation', 'Fall irrigation winterization', 365,
 'Water left in irrigation lines will freeze and crack the pipes and fittings. Winterization removes all water before the first freeze.',
 'Backflow preventer foam cover (optional, $10–$20). Air compressor or hire a professional ($50–$100).',
 'Air compressor (minimum 50 CFM at 50 PSI for most residential systems).',
 '1. Turn off the water supply to the irrigation system at the main shutoff.
2. Set the controller to run each zone for 2 minutes using the "manual" mode.
3. With each zone running, connect the air compressor to the blow-out port.
4. Blow compressed air through each zone (wear eye protection — debris may come out of the heads).
5. Repeat 2–3 times per zone until no water mist comes from the heads.
6. Turn off and drain the backflow preventer. Insulate it if it will freeze.
7. Set the controller to "off" or rain mode for winter.'),

('water', 'irrigation', 'Inspect and adjust sprinkler heads', 365,
 'Tilted, clogged, or damaged heads create dry spots in the lawn, water waste, and can spray sidewalks, driveways, or the house foundation.',
 'Replacement pop-up heads: $2–$8 each. Adjustment tool (often a small plastic key, free with head purchase).',
 'Small flathead screwdriver. Adjustment tool for your head brand.',
 '1. Run each zone and walk through the area being watered.
2. Identify heads that: don''t pop up fully, spray in wrong directions, have broken covers, or create puddles.
3. Use the head adjustment slot (top center of most heads) to rotate the spray arc.
4. Straighten tilted heads by digging around the base and repositioning.
5. Replace cracked or broken heads — they unscrew and pop out of the riser.'),

('water', 'irrigation', 'Test and certify backflow preventer', 365,
 'The backflow preventer stops irrigation water from flowing back into your drinking water supply. Many municipalities legally require annual testing and certification by a licensed tester.',
 NULL,
 'Licensed backflow preventer tester (required in most jurisdictions).',
 '1. Contact a licensed backflow preventer tester (check your city/county website or plumbing companies).
2. Testing takes about 30 minutes and verifies the valves are seating properly.
3. Keep the test report on file — some water utilities require it to be submitted.
4. If the backflow preventer fails the test, it must be repaired or replaced.'),

-- ── RADON MITIGATION SYSTEM ──────────────────────────────────
('other', 'radon-system', 'Test radon levels', 365,
 'Radon systems are highly effective but can lose effectiveness over time if the fan fails or the slab seal deteriorates. Annual testing confirms radon levels remain below 4 pCi/L (the EPA action level).',
 'Short-term test kit: $15–$30 at hardware stores or online. Long-term test: more accurate, takes 90 days.',
 NULL,
 '1. Purchase a radon test kit (short-term = 2–7 days; long-term = 90 days for more accurate results).
2. Place the detector in the lowest livable level of the home (not a crawlspace or garage) per kit instructions.
3. Mail the kit to the included lab after the test period.
4. Results above 4 pCi/L require action — contact a licensed radon mitigator.'),

('other', 'radon-system', 'Inspect radon fan operation', 365,
 'The radon fan runs 24/7. A failed fan means radon is no longer being vented, but you may not notice until you test. Quick visual and audible checks verify it''s running.',
 NULL, 'Flashlight.',
 '1. Locate the radon fan (usually in the attic, crawlspace, or on the exterior pipe).
2. Listen for a gentle hum — a running fan makes a continuous low hum.
3. Carefully feel for airflow at the top of the pipe (should feel exhaust air coming out).
4. If the fan is silent and you feel no airflow, it has failed — replacement fans are $75–$150 and often DIY-replaceable.'),

('other', 'radon-system', 'Check manometer fluid level', 180,
 'The U-tube manometer (a small plastic tube with colored fluid, usually near the pipe near the fan) shows the pressure difference — indicating the system is creating negative pressure under the slab. Fluid that is level or reversed indicates a system problem.',
 NULL, NULL,
 '1. Locate the manometer — usually a small clear plastic U-shaped tube mounted on the radon pipe in the basement.
2. The fluid should be drawn up on one side (the side connected to the sub-slab suction point).
3. If the fluid levels are equal (no differential), the fan may have failed or there is a large air leak in the slab.
4. If you see a differential the wrong direction, the pipe may be blocked — call a radon professional.'),

-- ── CRAWLSPACE ───────────────────────────────────────────────
('other', 'crawlspace', 'Inspect vapor barrier for damage', 365,
 'Tears or gaps in the vapor barrier allow ground moisture to enter the crawlspace, causing wood rot, mold, and elevated indoor humidity.',
 '6-mil poly sheeting or encapsulation liner for patches. Seam tape.',
 'Kneepads. Flashlight or headlamp.',
 '1. Access the crawlspace through the access hatch (wear old clothes and kneepads).
2. Inspect the vapor barrier systematically — look for tears, punctures, or areas where the liner has pulled away from the walls.
3. Look for standing water under or on top of the liner.
4. Patch any tears with seam tape or additional liner material.
5. Reseal wall edges if the liner has pulled away.'),

('other', 'crawlspace', 'Empty crawlspace dehumidifier', 30,
 'A full dehumidifier shuts off automatically, leaving the crawlspace humidification uncontrolled. Emptying regularly — or ensuring the drain line is clear — keeps it running continuously.',
 NULL, NULL,
 '1. If the dehumidifier has a bucket, check and empty it.
2. If it has a drain line, confirm the line is not kinked, clogged, or frozen (winter).
3. Check the dehumidifier''s filter — rinse or replace if visibly dirty.
4. Note the current relative humidity reading — target is below 60% in the crawlspace.'),

('other', 'crawlspace', 'Check for moisture and mold', 180,
 'Crawlspace moisture problems can go undetected for years, causing serious structural damage and indoor air quality issues.',
 'Moisture meter (~$20) for checking wood members. Mold test kit if visible spots found.',
 'Flashlight or headlamp. Kneepads.',
 '1. Access the crawlspace and inspect the floor joists, band joists (along the perimeter), and subfloor.
2. Look for white/gray/black staining on wood (potential mold), soft or discolored wood (rot), or rust on metal fasteners.
3. Use a moisture meter on any suspect wood — above 19% moisture content indicates a problem.
4. Check the area near the HVAC ducts and any pipes for condensation.
5. If you find active mold, consult a remediation professional.'),

-- ── GARAGE DOOR ──────────────────────────────────────────────
('other', 'garage-door', 'Lubricate garage door springs, rollers, and hinges', 365,
 'Dry or corroded parts wear quickly, cause loud operation, and can fail suddenly. A broken spring can make the door impossible to open. Lubrication takes 5 minutes.',
 'White lithium grease spray or garage door lubricant ($6–$10 at hardware stores). NOT WD-40 — it''s a solvent, not a lubricant.',
 'Lubricant spray with extension nozzle. Rag.',
 '1. Disconnect the opener (pull the red emergency cord) so you can move the door manually.
2. Open the door halfway. Spray lubricant on the rollers where the axle enters each roller.
3. Lubricate all hinges at their pivot points (where sections connect).
4. Spray lubricant along the coils of the torsion spring(s) above the door.
5. Lubricate the bearing plates at each end of the torsion spring.
6. Reconnect the opener and run the door up and down 3–4 times to distribute lubricant.
7. Do NOT attempt to adjust or replace springs yourself — they are under extreme tension.'),

('other', 'garage-door', 'Test auto-reverse safety feature', 180,
 'Federal law requires garage doors to reverse if they contact an object while closing. A door that doesn''t reverse can injure a person or pet. Testing takes 30 seconds.',
 NULL, 'A 2x4 piece of lumber (about 18" long) or a roll of paper towels.',
 '1. Place a 2x4 flat on the ground centered under the door.
2. Press the button to close the door.
3. When the door contacts the 2x4, it should immediately reverse and go back up.
4. If it does not reverse, adjust the down-force sensitivity setting on the opener motor (refer to your opener manual — usually a dial or screw adjustment).
5. Also test the photoelectric sensors: with the door closing, wave a broom handle through the beam path. The door should immediately reverse.'),

('other', 'garage-door', 'Inspect cables and springs for wear', 365,
 'Frayed cables or cracked springs are failures waiting to happen. A snapped cable can cause the door to drop suddenly; a broken spring makes the door inoperable.',
 NULL, 'Flashlight.',
 '1. With the door CLOSED, examine the lift cables (the steel cables running from the bottom corners of the door up to the drums near the springs).
2. Look for fraying, kinking, or broken strands. Even a single frayed strand is cause for professional replacement.
3. Examine the torsion spring(s) above the door for cracks or separation.
4. Examine extension springs (along the sides of the door if no torsion spring is present) for stretched or cracked coils.
5. Do NOT attempt to replace springs yourself — always call a professional.'),

('other', 'garage-door', 'Check door balance', 365,
 'An unbalanced door puts extra strain on the opener motor and can shorten its life significantly. This test reveals if the springs need adjustment.',
 NULL, NULL,
 '1. Pull the red emergency release cord to disconnect the opener.
2. Manually move the door to waist height and let go.
3. A balanced door stays in place or moves very slightly.
4. If the door drops quickly, the springs are too weak and need professional adjustment.
5. If the door springs up, the springs are too tight and need professional adjustment.
6. Only a garage door professional should adjust torsion springs.'),

-- ── GARAGE DOOR OPENER ───────────────────────────────────────
('other', 'garage-opener', 'Test auto-reverse safety feature', 180,
 'The opener''s auto-reverse must stop and reverse the door if it hits an object. This is a required safety test.',
 NULL, 'A 2x4 piece of lumber.',
 '1. Place a 2x4 flat on the ground centered under the door.
2. Press the button to close the door.
3. When the door contacts the 2x4, it must reverse immediately.
4. If it doesn''t reverse, adjust the down-force sensitivity on the opener motor (a dial or screw, per the opener manual).
5. Test the photoelectric beam sensors: wave a broom through the beam while the door is closing — it should immediately reverse.'),

('other', 'garage-opener', 'Lubricate opener drive mechanism', 365,
 'The belt or chain wears faster when dry, creating noise and reducing opener lifespan. Light lubrication annually prevents premature wear.',
 'White lithium grease spray. For belt drives, the manufacturer may specify no lubrication — check your manual.',
 'Lubricant spray.',
 '1. With the opener powered off, apply a thin bead of lubricant along the chain or rail.
2. For belt drives: check the owner''s manual first — some belt drives should not be lubricated.
3. Run the door up and down a few times to distribute the lubricant.
4. Wipe off any excess to prevent drips on the car.'),

('other', 'garage-opener', 'Inspect and test safety sensors', 180,
 'Misaligned or dirty sensors prevent the door from closing, or worse, fail to reverse when they should. A quick cleaning and alignment check takes 2 minutes.',
 NULL, 'Soft cloth.',
 '1. Locate the two small sensor boxes mounted on each side of the garage door track, about 6 inches above the floor.
2. Wipe the lens on each sensor with a soft cloth.
3. Check that both sensors have a solid light (usually green on the receiver, amber on the sender). A blinking light indicates misalignment.
4. Gently loosen the wing nut holding each sensor and adjust until both lights are solid. Retighten.
5. Test: try to close the door, then wave your foot through the sensor beam — the door must reverse.'),

-- ── STANDBY GENERATOR ────────────────────────────────────────
('electrical', 'standby-gen', 'Verify automatic weekly exercise run', 90,
 'Standby generators exercise automatically (usually weekly) to keep the engine ready and charge the battery. Confirming it ran prevents discovering a dead generator when the power goes out.',
 NULL, NULL,
 '1. Most standby generators log their run history on the control panel.
2. Check the panel display or app (if the generator has connectivity) to verify the last exercise run completed successfully.
3. Look for error codes on the panel — common codes indicate low battery, low oil pressure, or overcrank.
4. Make sure nothing is blocking the exhaust or cooling fins on the unit.'),

('electrical', 'standby-gen', 'Schedule annual generator service', 365,
 'Annual professional service covers spark plugs, air filter, oil change, cooling system, and load bank testing — essential for reliability during power outages.',
 'Budget $150–$300 for annual generator service.',
 'Licensed generator technician (Generac, Kohler, or independent).',
 '1. Schedule in spring or fall — NOT during storm season.
2. Keep a log of the last service date and what was done.
3. Ask the technician to perform a load bank test to verify full-power output under actual load.'),

('electrical', 'standby-gen', 'Check generator oil level', 90,
 'Generator engines consume oil over time, especially during extended runs. Low oil can trigger the low-oil shutdown, leaving you without power during an outage.',
 'Check your generator manual for the correct oil type (usually synthetic 5W-30).',
 'Clean rag. Oil type per manufacturer spec.',
 '1. Ensure the generator is off and has cooled for 10 minutes.
2. Locate the engine oil dipstick (marked with an oil can symbol).
3. Remove, wipe clean, reinsert fully, then remove again to read the level.
4. Add oil of the correct type if below the "full" mark — don''t overfill.'),

('electrical', 'standby-gen', 'Test transfer switch operation', 365,
 'The transfer switch safely disconnects you from the utility grid when the generator starts, preventing backfeed injuries to utility workers.',
 NULL,
 'This test involves interrupting power — do it during the day when all household members are aware.',
 '1. Confirm the generator is fully fueled and the oil level is correct.
2. Switch off the main breaker from the utility (or have your electrician assist with the transfer switch test).
3. The generator should automatically start and transfer the load within 30 seconds.
4. Verify the generator is powering your home (lights on, devices working).
5. Restore utility power — the generator should automatically shut down after a cool-down period.'),

-- ── PORTABLE GENERATOR ───────────────────────────────────────
('electrical', 'portable-gen', 'Run generator under load (30 min)', 90,
 'Gasoline engines develop "varnish" buildup when not run regularly, clogging the carburetor. Running monthly under load prevents this and keeps the engine ready.',
 'Fuel stabilizer ($8–$12) to add to the gas tank if not running monthly.',
 'Extension cords rated for the generator''s output. Ear protection.',
 '1. Check oil level before starting.
2. Start the generator outdoors, at least 20 feet from windows and doors.
3. Connect a load (electric heater, shop light, or other appliance) to exercise the generator.
4. Run for 30 minutes.
5. If you won''t run it within 30 days, add fuel stabilizer and run for 5 minutes to circulate it through the carburetor.
6. NEVER run a generator indoors or in the garage — carbon monoxide is lethal.'),

('electrical', 'portable-gen', 'Change generator oil', 365,
 'Dirty oil accelerates engine wear. Most portable generators require an oil change after the first 20 hours and then every 50–100 hours or annually.',
 'Oil per your generator''s manual (usually 10W-30 or 5W-30). Oil drain pan. Funnel.',
 'Wrench or socket for drain plug. Oil drain pan. Funnel.',
 '1. Run the generator for 10 minutes to warm the oil.
2. Turn it off, remove the spark plug wire for safety.
3. Remove the oil drain plug and drain into a pan.
4. Replace the drain plug and add fresh oil (the manual specifies type and quantity — usually ½ to ¾ quart).
5. Check the dipstick — fill to the full mark.
6. Reconnect the spark plug wire and run for 1 minute to confirm no leaks.'),

('electrical', 'portable-gen', 'Replace spark plugs', 365,
 'Worn spark plugs cause hard starting and rough running. Most portable generators need a new plug annually or every 100 hours.',
 'Spark plug per your generator spec (listed in the manual or on the engine). ~$5.',
 'Spark plug socket wrench. Feeler gauge (optional).',
 '1. Remove the spark plug wire.
2. Use a spark plug socket to remove the old plug.
3. Check the gap on the new plug against the spec in the manual (usually 0.030"–0.040").
4. Thread the new plug in by hand until snug, then tighten ¼ turn with the socket.
5. Reconnect the spark plug wire.'),

-- ── EV CHARGER ───────────────────────────────────────────────
('electrical', 'ev-charger', 'Inspect charging cable for damage', 365,
 'The charging cable operates under high current daily. Cracks, kinks, or damaged connectors are both a safety hazard and can void the unit warranty.',
 NULL, NULL,
 '1. Visually inspect the full length of the charging cable from the unit to the connector.
2. Look for cracks in the cable jacket, especially near where it exits the wall unit and at the connector end.
3. Inspect the J1772 or Tesla connector for bent pins, corrosion, or cracked housing.
4. Hang the cable properly on the provided bracket between charges — don''t leave it coiled on the floor.'),

('electrical', 'ev-charger', 'Clean charging connector contacts', 365,
 'Dirt and corrosion on charging contacts cause poor connections, slower charging, or charging failures.',
 'Electrical contact cleaner spray ($5–$10). Dry cloth.',
 'Contact cleaner spray.',
 '1. Unplug the connector from the vehicle.
2. Inspect the connector contacts for dirt or corrosion.
3. Spray electrical contact cleaner into the connector and let it dry completely.
4. Wipe the outside of the connector with a dry cloth.
5. For stubborn corrosion, use a very soft brush with the cleaner.'),

('electrical', 'ev-charger', 'Test GFCI protection on charger circuit', 365,
 'Level 2 EV chargers are required to have GFCI protection. This protection should be tested annually to confirm it still functions.',
 NULL, 'GFCI outlet tester ($10) or use the test button on the GFCI breaker.',
 '1. Locate the GFCI breaker or GFCI outlet protecting the EV charger circuit.
2. Press the TEST button — the breaker should trip or the outlet should lose power.
3. Verify the charger loses power when the GFCI trips.
4. Press RESET to restore power.
5. If the GFCI doesn''t trip or won''t reset, it needs replacement.'),

-- ── REFRIGERATOR ─────────────────────────────────────────────
('appliance', 'refrigerator', 'Clean refrigerator condenser coils', 365,
 'Dusty condenser coils can''t release heat efficiently — the compressor runs hotter and longer, shortening its life. Cleaning takes 15 minutes. A compressor replacement costs $300–$600.',
 'Refrigerator coil cleaning brush (~$8 at hardware stores or Amazon).',
 'Coil cleaning brush. Vacuum with brush attachment. Flashlight.',
 '1. Pull the refrigerator away from the wall. Unplug it.
2. Locate the coils — most modern fridges have them underneath, behind a snap-off grille at the bottom front. Older fridges have them on the back.
3. Use the coil brush to loosen dust from between the fins, then vacuum up the debris.
4. Vacuum the condenser fan and motor (usually next to the coils underneath).
5. Wipe the floor under and behind the fridge while it''s pulled out.
6. Push the fridge back — maintain 1–2 inches of clearance at the back for airflow. Plug it back in.'),

('appliance', 'refrigerator', 'Replace refrigerator water filter', 180,
 'A clogged filter stops removing contaminants and can harbor bacteria. Most manufacturers recommend replacement every 6 months.',
 'Use your refrigerator''s model number to find the correct filter. OEM or NSF-certified aftermarket. Usually $20–$50.',
 'No tools needed — the filter twists or pushes in by hand.',
 '1. Find the filter location: upper right corner inside the refrigerator, in the door, or in the bottom grille.
2. Turn the old filter counterclockwise or push the release button to remove.
3. Insert the new filter and turn clockwise until it locks, or push until it clicks.
4. Run 2–3 gallons of water through the dispenser to flush the new filter (first water may look gray — that''s normal carbon dust).
5. Reset the filter indicator light (usually hold a button for 3 seconds — check your model).'),

('appliance', 'refrigerator', 'Clean door gaskets and seals', 180,
 'Dirty or cracked door gaskets allow cold air to escape, making the compressor run continuously and increasing energy use.',
 NULL, 'Warm water, dish soap, and a soft cloth. Petroleum jelly to condition the gasket.',
 '1. Open the refrigerator and freezer doors fully.
2. Wipe the entire length of the door gasket (the rubber seal) with a cloth dampened in warm soapy water.
3. Pay attention to the folded sections where mold commonly hides.
4. Rinse with clean water and dry.
5. Apply a thin coat of petroleum jelly to keep the gasket pliable.
6. Test the seal: close the door on a piece of paper. If you can pull the paper out without resistance, the gasket needs replacement.'),

('appliance', 'refrigerator', 'Vacuum and clean behind and beneath refrigerator', 365,
 'Dust, pet hair, and debris accumulate under and behind the refrigerator, reducing airflow to the compressor and condenser coils.',
 NULL, 'Vacuum with hose attachment. Flat mop or stick broom.',
 '1. Pull the refrigerator out from the wall.
2. Sweep or vacuum the floor under and behind the unit.
3. Wipe the back panel of the refrigerator if dusty.
4. Push the refrigerator back to its position.'),

-- ── DISHWASHER ───────────────────────────────────────────────
('appliance', 'dishwasher', 'Clean dishwasher filter and trap', 30,
 'Modern dishwashers have a manual filter instead of a grinder. Food particles accumulate quickly and cause odors, cloudy dishes, and reduced cleaning performance.',
 NULL, 'Dish brush. Mild dish soap.',
 '1. Remove the bottom rack.
2. Locate the filter assembly in the bottom of the dishwasher (usually a round filter with a flat fine-mesh screen surrounding it).
3. Twist the cylindrical filter counterclockwise and lift it out. Remove the flat mesh screen below it.
4. Rinse both pieces under warm water and scrub gently with a dish brush.
5. Reinstall the flat screen first, then twist the cylindrical filter clockwise until it locks.'),

('appliance', 'dishwasher', 'Run dishwasher cleaning cycle', 30,
 'Grease and hard water deposits build up inside the dishwasher tub, on the spray arms, and on the heating element, reducing cleaning performance.',
 'Dishwasher cleaning tablet or 1 cup white vinegar.',
 NULL,
 '1. Empty the dishwasher completely.
2. Place a dishwasher cleaning tablet in the detergent cup, OR pour 1 cup of white vinegar in a dishwasher-safe bowl on the bottom rack.
3. Run a hot water cycle (the longest, hottest cycle on your machine).
4. For added deodorizing: after the cycle, sprinkle 1 cup of baking soda on the bottom and run a short hot cycle.'),

('appliance', 'dishwasher', 'Clean spray arms', 180,
 'Mineral deposits and food particles clog the small holes in the spray arms, reducing water pressure and leaving dishes dirty. Cleaning restores full spray coverage.',
 NULL, 'Toothpick or thin wire. Warm water.',
 '1. Remove the bottom rack. Look for the lower spray arm — it usually pulls straight up or unclips.
2. Remove the upper spray arm by unscrewing the center cap or unclipping it.
3. Hold each arm up to the light and look through the spray holes — blocked ones are obvious.
4. Use a toothpick to clear each hole.
5. Rinse the arms under warm water and reinstall.'),

('appliance', 'dishwasher', 'Inspect door gasket', 365,
 'A cracked or dirty door gasket allows water to leak onto the floor during the cycle, which can cause water damage and mold under the dishwasher.',
 'Replacement dishwasher door gaskets: $15–$40 depending on model.',
 NULL,
 '1. Open the dishwasher door and inspect the rubber gasket around the door opening.
2. Look for cracks, tears, or areas where the gasket has pulled away from the door frame.
3. Wipe the gasket with a damp cloth to remove any residue.
4. If the gasket is cracked or pulling away, search your model number for the replacement part.'),

-- ── GAS RANGE ────────────────────────────────────────────────
('appliance', 'range-gas', 'Clean gas burners and ignitors', 90,
 'Food spills clog the small holes in burner caps, creating uneven flames or ignition problems. A clean burner burns more efficiently and ignites reliably.',
 NULL, 'Toothbrush. Warm soapy water. Toothpick or thin wire.',
 '1. Make sure all burners are cool and the gas is off.
2. Lift off the burner grates and remove the burner caps (they just lift off).
3. Soak the caps in warm soapy water for 20 minutes.
4. Scrub off baked-on food with a toothbrush.
5. Use a toothpick or thin wire to clear the small holes in each burner head — don''t use a wood toothpick that can break off inside.
6. Dry caps completely before replacing — installing wet caps can cause ignition problems.
7. Wipe down the cooktop surface and burner bases.'),

('appliance', 'range-gas', 'Run oven self-clean cycle', 365,
 'Annual self-cleaning burns off baked-on grease and food residue, keeping the oven hygienic and preventing smoke or odors during normal cooking.',
 NULL, NULL,
 '1. Remove all oven racks (the self-clean cycle can warp them and ruin the finish).
2. Wipe out any large food chunks first — excess grease can cause smoking.
3. Lock the oven door and start the self-clean cycle (usually 2–4 hours).
4. Open windows and turn on your range hood fan — some smoke and odor is normal.
5. After the cycle completes and the oven cools, wipe out the white ash residue with a damp cloth.
6. Reinstall oven racks.'),

('appliance', 'range-gas', 'Clean range hood filters', 90,
 'Range hood filters trap grease. Clogged filters reduce suction, leave cooking odors in the house, and are a fire hazard — grease is flammable.',
 NULL, 'Degreaser spray or dish soap. Dish brush.',
 '1. Remove the metal mesh filters from the range hood (usually slide or clip out).
2. Soak in very hot water with dish soap or degreaser for 15 minutes.
3. Scrub with a brush to remove grease.
4. Rinse and let dry before reinstalling.
5. For charcoal filters in recirculating hoods: these cannot be washed — replace them every 6 months.'),

('appliance', 'range-gas', 'Inspect gas supply line connection', 365,
 'Gas line connections can develop small leaks at fittings over time. Catching a leak early prevents a potential fire or explosion risk.',
 'Gas leak detector spray (~$8) or liquid dish soap solution.',
 'Spray bottle with soapy water.',
 '1. Pull the range forward slightly to access the gas connection at the back.
2. Apply gas leak detector spray (or a soap-and-water solution) to all gas fittings and the flexible connector.
3. Look for bubbles — bubbles indicate a gas leak.
4. If you detect a leak, turn off the gas shutoff valve and call a plumber. Do not use the range.
5. Also smell for gas around the connection — if you smell gas at any time, leave the home immediately and call 911.'),

-- ── ELECTRIC RANGE ───────────────────────────────────────────
('appliance', 'range-electric', 'Clean cooktop surface', 30,
 'Food and grease burn onto ceramic or glass cooktops quickly, creating stubborn stains and reducing heating efficiency on coil burners.',
 'Ceramic cooktop cleaner (Weiman or similar, $8) for glass/ceramic tops. Baking soda paste for coil tops.',
 'Ceramic cooktop scraper (plastic, included with most ceramic cleaners). Non-scratch scrubbing pad.',
 '1. Make sure the cooktop is completely cool.
2. For ceramic/glass: apply a dime-sized amount of ceramic cooktop cleaner and spread in a thin layer. Scrub with a non-scratch pad. Use the plastic scraper at a 45° angle for stubborn spots.
3. Wipe clean with a damp cloth, then dry to prevent streaks.
4. For coil burners: remove the drip pans and wash in warm soapy water. Wipe the burner elements gently.'),

('appliance', 'range-electric', 'Run oven self-clean cycle', 365,
 'Self-cleaning burns off baked-on food and grease at very high temperature.',
 NULL, NULL,
 '1. Remove all oven racks before starting self-clean.
2. Wipe out large food debris first.
3. Start the self-clean cycle and keep the kitchen well-ventilated.
4. After the cycle and cool-down, wipe out the remaining ash residue with a damp cloth.'),

('appliance', 'range-electric', 'Clean range hood filters', 90,
 'Grease builds up in range hood filters, reducing ventilation effectiveness and creating a fire hazard.',
 NULL, 'Dish soap. Degreaser. Dish brush.',
 '1. Remove metal mesh filters from the hood.
2. Soak in hot soapy water for 15 minutes.
3. Scrub with a brush and rinse.
4. Dry and reinstall.
5. Charcoal filters (in recirculating hoods) must be replaced — they cannot be cleaned.'),

('appliance', 'range-electric', 'Inspect power cord and connection', 365,
 'Electric ranges draw up to 50 amps through a 240V cord. A loose connection can arc, causing overheating or fire.',
 NULL, 'Flashlight.',
 '1. Pull the range away from the wall.
2. Inspect the 240V power cord where it enters the back of the range for any scorching, melting, or damage.
3. Check that the cord is seated securely in the range''s terminal block — it should not be loose or have scorch marks.
4. Inspect the wall outlet for any discoloration or burning smell around it.
5. If you find damage, call an electrician.'),

-- ── GARBAGE DISPOSAL ─────────────────────────────────────────
('appliance', 'disposal', 'Clean disposal blades and interior', 30,
 'Food residue builds up on the grinding components and inside the rubber splash guard, causing persistent odors.',
 NULL, 'Ice cubes. Coarse salt. Dish soap. Toothbrush.',
 '1. With water running, pour 1 cup of ice cubes and ½ cup of coarse salt into the disposal.
2. Run the disposal for 30 seconds — the ice and salt scour the grinding surfaces.
3. Lift the rubber splash guard and scrub the underside with a toothbrush and dish soap (this is where most odors originate).
4. Run cold water and the disposal for another 30 seconds.
5. NEVER put your hand into the disposal — even with power off, the grinding elements are sharp.'),

('appliance', 'disposal', 'Deodorize garbage disposal', 30,
 'Organic residue creates odors even after cleaning. Baking soda and vinegar neutralize odors naturally.',
 NULL, NULL,
 '1. Pour ½ cup of baking soda into the disposal.
2. Follow with ½ cup of white vinegar — it will fizz.
3. Let sit for 5 minutes.
4. Flush with hot water while running the disposal.
5. Optionally, grind citrus peels for a fresh scent.'),

('appliance', 'disposal', 'Check under-sink drain connections for leaks', 365,
 'Disposal mounting flange and drain connections can loosen over time, causing slow leaks that damage the cabinet floor.',
 NULL, 'Flashlight. Dry paper towel.',
 '1. Clear the cabinet under the sink.
2. Run the disposal with water for 30 seconds.
3. Check the mounting flange (where the disposal attaches to the sink drain) for drips.
4. Check the drain outlet side of the disposal where it connects to the drain pipe.
5. Press a dry paper towel against each connection for 10 seconds — any moisture is visible.
6. Hand-tighten any loose connections. Plumber''s putty at the sink flange fixes a leaking sink connection.'),

-- ── WASHING MACHINE ──────────────────────────────────────────
('appliance', 'washer', 'Run washing machine cleaning cycle', 30,
 'Detergent residue and hard water deposits accumulate in the drum, causing musty odors and dull laundry. Monthly cleaning cycles keep it fresh.',
 'Washing machine cleaner tablet (Affresh, $8 for 3-pack) or 2 cups of white vinegar.',
 NULL,
 '1. Make sure the drum is empty.
2. Add a cleaning tablet to the drum (or pour vinegar into the detergent dispenser).
3. Run the hottest, longest cycle available.
4. After the cycle, leave the door open for 1–2 hours to allow the drum to dry out.'),

('appliance', 'washer', 'Clean front-load door seal and drum', 30,
 'The rubber door gasket on front-load washers traps moisture, lint, and detergent, creating the perfect environment for mold. Black mold in the gasket is the #1 cause of musty laundry smell.',
 NULL, 'Spray bottle with 50/50 vinegar-water solution. Old toothbrush. Dry cloth.',
 '1. Pull back the rubber door seal folds and inspect the entire inner perimeter.
2. Look for black mold, lint, and soap scum — it''s almost always present if the door is left closed.
3. Spray the seal with the vinegar solution and scrub with a toothbrush.
4. Wipe dry with a clean cloth.
5. ALWAYS leave the door slightly ajar after each load to prevent moisture buildup.'),

('appliance', 'washer', 'Inspect washer inlet hoses', 365,
 'Rubber washer hoses are a leading cause of household water damage. They can fail suddenly and release 600 gallons per hour onto your floor.',
 'Braided stainless steel replacement hoses ($15–$25 per pair — much more burst-resistant than rubber). Upgrade if yours are still rubber.',
 'Flashlight.',
 '1. Pull the washer away from the wall slightly.
2. Inspect both the hot and cold inlet hoses (the hoses running from the wall valves to the washer).
3. Look for cracks, bulges, or corrosion at the fittings.
4. Rubber hoses more than 5 years old should be replaced proactively.
5. Check that the connections at both the wall valve and the washer are hand-tight.
6. Turn off the water supply valves when going on vacation.'),

('appliance', 'washer', 'Clean detergent dispenser drawer', 90,
 'Detergent and fabric softener build up in the dispenser, clogging the nozzles and reducing dispensing accuracy. Mold can also form in the residue.',
 NULL, 'Old toothbrush. Warm water.',
 '1. Pull the detergent drawer out fully — most come all the way out.
2. Rinse under warm water and scrub all compartments with a toothbrush.
3. Inspect the dispenser housing opening (in the machine where the drawer sits) and wipe out any residue.
4. Reinstall the clean drawer.'),

-- ── DRYER ────────────────────────────────────────────────────
('appliance', 'dryer', 'Clean dryer vent duct', 365,
 'Lint accumulates in the vent duct over time. Restricted airflow is the #1 cause of dryer fires — about 2,900 per year in the US. Cleaning annually is one of the highest-impact maintenance tasks in your home.',
 'Dryer vent cleaning brush kit (long flexible rod brushes, ~$20 on Amazon). Consider replacing flexible foil duct with rigid metal duct ($20) if yours is the flexible silver kind — it traps more lint.',
 'Dryer vent brush kit. Vacuum with hose. Screwdriver to disconnect the duct.',
 '1. Pull the dryer away from the wall and disconnect the duct from the back of the dryer.
2. Vacuum inside the duct opening on the dryer.
3. Insert the brush kit rod into the wall duct and scrub while rotating. Add extensions to reach the full length.
4. Go outside and remove the exterior vent cap. Brush from that end and vacuum out debris.
5. Reconnect the duct to the dryer, ensuring a tight connection.
6. Run the dryer on air-only for a few minutes to blow out remaining loose lint.
7. Test: hold your hand in front of the exterior vent while the dryer runs — you should feel strong airflow.'),

('appliance', 'dryer', 'Inspect dryer exhaust vent cap', 365,
 'A damaged or stuck vent cap allows cold air to enter the duct in winter, reducing dryer efficiency, and can allow birds or rodents to nest in the duct.',
 'Replacement vent caps: $8–$20 at hardware stores.',
 NULL,
 '1. Go outside and locate the dryer exhaust vent cap on the exterior wall (usually a louvered or flap-style cap, 4" diameter).
2. Inspect the flap(s) — they should open freely when the dryer is running and close fully when off.
3. Clear any lint, bird nests, or debris blocking the cap.
4. If the flap is stuck open, closed, or corroded, replace the cap.'),

('appliance', 'dryer', 'Clean dryer drum and moisture sensor', 365,
 'Dryer sheet residue coats the interior drum and the moisture sensor bars (two small metal strips inside the drum), causing the dryer to cut off cycles early and leave clothes damp.',
 NULL, 'Rubbing alcohol. Soft cloth.',
 '1. Wipe the inside of the drum with a clean damp cloth.
2. Locate the moisture sensor bars — two small metallic strips usually inside the drum near the lint trap opening.
3. Wipe both bars with a cloth dampened in rubbing alcohol to remove dryer sheet coating.
4. Clean the lint trap housing with a vacuum hose — lint accumulates below the screen.'),

-- ── ROOF ─────────────────────────────────────────────────────
('roof', 'roof', 'Annual roof inspection', 365,
 'Your roof is your home''s primary defense against weather. Small issues — a cracked shingle, lifted flashing — let water in and cause mold, rotted decking, and ceiling damage. Catching these early means $20 in sealant instead of a $5,000 repair.',
 'Roofing sealant/cement ($8–$15) for minor flashing and vent issues. Replacement shingles if cracked/missing.',
 'Binoculars (safer than climbing for initial scan). Rubber-soled shoes if going on roof. Safety harness on steep pitches.',
 '1. GROUND LEVEL: Use binoculars to scan the roof from multiple angles. Look for: missing or curled shingles, dark streaks (algae), sagging areas, exposed nail heads, damaged ridge cap.
2. Check gutters for granules (looks like coarse sand) — shingles losing granules are nearing end of life.
3. ATTIC: On a sunny day, look for daylight coming through the roof deck, water stains, or wet insulation.
4. Inspect all penetrations: chimney, vents, skylights, pipes — these are the most common leak points.
5. After heavy rain, check ceilings for water stains.
6. For anything beyond minor sealant work, call a licensed roofing contractor.'),

('roof', 'roof', 'Check roof flashing and sealants', 365,
 'Flashing is the metal material sealing transitions between the roof and vertical surfaces (chimney, walls, skylights, vents). It is the most common point of roof leaks.',
 'Roofing sealant or roof cement ($8–$15).',
 'Binoculars. Caulking gun.',
 '1. From the ground (or roof if safely accessible), examine the metal flashing around the chimney, any skylights, plumbing vents, and where the roof meets a vertical wall.
2. Look for: lifted flashing, gaps between the flashing and the surface it seals, cracked or missing sealant, and rust.
3. Small gaps in sealant can be filled with roofing sealant.
4. Lifted or separated flashing requires professional repair.'),

('roof', 'roof', 'Inspect attic for water damage or leaks', 365,
 'Roof leaks often travel along rafters before dripping, making the interior leak location different from the roof entry point. The attic is where you catch them early.',
 NULL, 'Flashlight or headlamp.',
 '1. On a sunny day, access the attic and turn off your light.
2. Look for any daylight visible through the roof deck (indicates a hole or gap).
3. With the light on, look for water stains (brown rings or streaks on rafters, decking, or insulation).
4. Look for mold growth (black, white, or gray spots on wood or insulation).
5. Check around any penetrations (vent pipes, exhaust fans) for staining.
6. After heavy rain is an ideal time to do this inspection with the roof wet.'),

-- ── GUTTERS ──────────────────────────────────────────────────
('roof', 'gutters', 'Clean gutters', 180,
 'Clogged gutters overflow and deposit water against your foundation, leading to basement water intrusion. They also cause ice dams in cold climates and provide a perfect nesting spot for pests.',
 'Gutter scoop (~$5). Gutter patch sealant ($8–$15) for any holes found.',
 'Extension ladder with stabilizers. Gutter scoop. Garden hose with spray nozzle. Bucket. Gloves.',
 '1. Set up your ladder on stable, level ground. Use stand-off stabilizers — never lean the ladder against the gutter.
2. Scoop out leaves and debris from the gutter into a bucket. Start away from the downspout and work toward it.
3. Flush the gutter with a garden hose to check water flow toward the downspout.
4. Confirm the gutter drops about ¼ inch for every 10 feet toward the downspout — pooling water in the middle means the gutter has sagged.
5. Run water down each downspout to confirm free flow.
6. Seal any leaking seams or holes with gutter sealant from inside the gutter while dry.'),

('roof', 'gutters', 'Inspect gutter hangers and slope', 365,
 'Gutters sag over time as hangers loosen or fail. A sagging gutter holds standing water (a mosquito breeding ground), eventually pulling away from the fascia and leaking at the connection.',
 'Replacement gutter hangers/spikes: $3–$8 each. Hidden hangers are more secure than old-style spikes.',
 'Ladder. Drill or screwdriver.',
 '1. Visually scan each run of gutter from the ground — look for visible sags or sections pulling away from the fascia.
2. From the ladder, check each hanger for tightness (should not wiggle).
3. Replace any missing or loose hangers. Screw-style hidden hangers are stronger than the original spikes.
4. Check that the gutter end caps are sealed and not pulling away.'),

('roof', 'gutters', 'Check downspout extensions and grading', 365,
 'Downspout water discharging too close to the foundation is one of the most common causes of basement water intrusion.',
 'Downspout extension: $5–$15. Underground drain kit: $30–$80 for a longer solution.',
 NULL,
 '1. Look at where each downspout discharges.
2. Water should be directed at least 6 feet away from the foundation.
3. Add downspout extensions if water is too close.
4. Check that the ground slopes away from the house at the discharge point (1–2 inches per foot for the first 6 feet).'),

-- ── DECK ─────────────────────────────────────────────────────
('other', 'deck', 'Inspect deck boards and structural joists', 365,
 'Rot and structural deterioration in deck joists and ledger boards can cause sudden collapse. Early detection is far less expensive than full replacement.',
 NULL, 'Flashlight. Flat screwdriver (probing tool). Kneepads.',
 '1. Walk the entire deck surface and feel for soft or springy boards — a sign of rot.
2. Use a flat screwdriver to probe suspected rot: soft wood that the screwdriver sinks into easily is rotted and must be replaced.
3. Inspect the ledger board (the board bolted to the house where the deck attaches) — this is the most critical connection. Look for rot, separation, and proper flashing above it.
4. Look under the deck at joists and posts for rot, especially at any wood-to-ground or wood-to-concrete contact.
5. Check for loose or missing joist hanger hardware.'),

('other', 'deck', 'Check railing stability and fasteners', 365,
 'A loose deck railing can give way unexpectedly. Building codes require railings to resist 200 lbs of lateral force. Check every year.',
 NULL, NULL,
 '1. Push firmly on the top rail at multiple points — it should feel completely solid.
2. Check each railing post — they should not wobble when pushed.
3. Inspect all balusters (vertical spindles): they should not be loose, missing, or have gaps over 4 inches.
4. Check all screws and bolts at rail-to-post connections. Tighten any loose fasteners.
5. Look for wood rot at post bases, especially if they mount through the decking surface.'),

('other', 'deck', 'Clean deck surface', 365,
 'A clean deck is safer (less slippery), looks better, and lets you inspect the wood condition. Cleaning also prepares the surface for sealing.',
 'Deck cleaner ($10–$20). Oxygen bleach solution for mold/mildew.',
 'Pressure washer (600–1200 PSI for wood — higher can damage the wood fibers) or stiff-bristle broom. Garden hose.',
 '1. Clear all furniture and sweep debris off the deck.
2. Apply deck cleaner per label instructions (or mix oxygen bleach with water for mold/mildew).
3. Scrub with a stiff brush or use a pressure washer at low setting — keep the nozzle moving to avoid gouging the wood.
4. Rinse thoroughly with a garden hose.
5. Allow the deck to dry completely (usually 48 hours) before sealing or staining.'),

('other', 'deck', 'Seal or stain wood deck', 1095,
 'Unsealed wood absorbs moisture, leading to warping, cracking, and accelerating rot. A quality sealer or stain protects the wood and extends the deck''s life. Typically needed every 2–3 years.',
 'Semi-transparent deck stain or clear water sealer ($30–$60 per gallon). 1 gallon covers about 150–200 sq ft.',
 'Roller and brush, or pump sprayer. Painter''s tape. Drop cloths.',
 '1. Ensure the deck is completely clean and dry (at least 48 hours after cleaning).
2. Stir the sealer/stain thoroughly.
3. Work in sections, applying with a roller for the field and a brush for edges and between boards.
4. Apply 1–2 coats per label instructions.
5. Keep the surface clear for 24–48 hours while it cures.
6. SKIP SEALING: Composite decks do not need sealing — just cleaning.'),

('other', 'deck', 'Inspect ledger board and flashing', 365,
 'The ledger board is the deck''s connection to the house. Failed ledger flashing allows water to enter behind the siding, rotting the house framing. This is the most common deck structural failure point.',
 NULL, 'Flashlight. Probing screwdriver.',
 '1. Look at the flashing above the ledger board (metal strip between the deck ledger and the house siding).
2. Confirm the flashing directs water away from the house — it should be lapped OVER the siding, not tucked under it.
3. Check the ledger board itself for rot by probing with a screwdriver.
4. Look for any gaps or separation between the ledger and the house.
5. If you see any rot in the ledger or house framing behind it, this is a major issue requiring professional repair.'),

-- ── DRIVEWAY ─────────────────────────────────────────────────
('other', 'driveway', 'Fill cracks in driveway', 365,
 'Water enters cracks, expands when it freezes, and dramatically accelerates cracking. Filling cracks annually prevents small problems from becoming expensive repairs.',
 'Asphalt crack filler ($10–$15) for asphalt driveways. Concrete crack filler/sealant ($8–$12) for concrete.',
 'Caulking gun or squeeze bottle applicator. Wire brush. Leaf blower or broom.',
 '1. Clean all cracks with a wire brush and blow out debris with a leaf blower or broom.
2. For cracks wider than ½ inch in asphalt: fill with sand to within ½ inch of the surface, then apply crack filler on top.
3. Apply crack filler per label instructions, slightly overfilling.
4. Smooth flush with a putty knife or trowel.
5. Keep traffic off for the cure time (usually 24–48 hours per the product label).'),

('other', 'driveway', 'Seal asphalt driveway', 1095,
 'Asphalt oxidizes and dries out in UV light, leading to cracking and crumbling. Sealing every 2–3 years protects the surface and dramatically extends driveway life.',
 '5-gallon bucket of driveway sealer ($25–$40) covers approximately 250–500 sq ft depending on condition.',
 'Squeegee applicator (often sold with sealer). Stiff broom. Crack filler for any cracks first.',
 '1. Fill all cracks first and let cure for 24 hours.
2. Clean the driveway thoroughly — blow off debris, wash away oil stains with degreaser.
3. Stir the sealer thoroughly.
4. Pour a ribbon of sealer across the top of the driveway and spread with a squeegee in overlapping passes.
5. Work from the top down toward the street.
6. Apply a second coat in the opposite direction if the driveway is very oxidized.
7. Keep vehicles off for 24–48 hours.
8. Avoid sealing MORE than every 2 years — over-sealing causes peeling.'),

('other', 'driveway', 'Pressure wash driveway surface', 365,
 'Algae, oil stains, and embedded dirt make the driveway slippery when wet and accelerate surface degradation.',
 'Concrete degreaser for oil stains ($10). Driveway detergent for general cleaning.',
 'Pressure washer (1500–3000 PSI for concrete). For asphalt, use 1200–1500 PSI max.',
 '1. Apply degreaser to any oil stains and let soak for 10 minutes.
2. Use a pressure washer to clean the full surface.
3. For concrete: 2500–3000 PSI with a rotating nozzle is effective.
4. Keep the nozzle moving — holding in one place can etch the surface.
5. Rinse toward the street or yard (not toward the foundation).'),

-- ── TOILETS ──────────────────────────────────────────────────
('plumbing', 'toilets', 'Inspect toilet tank components', 365,
 'Worn flappers, fill valves, and overflow tubes cause silent water leaks that waste thousands of gallons per year and inflate water bills. These inexpensive parts are simple to replace.',
 'Toilet repair kit ($10–$20 at hardware stores) or individual parts: flapper $5, fill valve $10–$15.',
 'None needed to inspect. Adjustable wrench for replacement.',
 '1. Remove the toilet tank lid and set it aside.
2. Flush the toilet and watch: the flapper should drop firmly to seal after flushing. If it flaps slowly or you hear water running after the tank fills, the flapper is worn.
3. Listen for water running more than 1 minute after flushing — this indicates a leak.
4. Check the fill valve: water should stop filling when the water level reaches about 1 inch below the overflow tube. If it keeps running, the fill valve needs adjustment or replacement.
5. Check the overflow tube — the water level should be just below its top edge.'),

('plumbing', 'toilets', 'Check for silent toilet leaks (dye test)', 180,
 'A toilet with a worn flapper can silently waste 200 gallons per day — the leak runs from the tank into the bowl, so you never see water on the floor. The dye test makes it obvious.',
 'Toilet dye tablets or food coloring (free at many water utilities).',
 NULL,
 '1. Drop a dye tablet (or 5 drops of food coloring) into the toilet tank.
2. Do NOT flush for 15 minutes.
3. Look in the toilet bowl — if you see colored water, the flapper is leaking.
4. A leaking flapper wastes up to 200 gallons per day. Replacement is simple and costs about $5.'),

('plumbing', 'toilets', 'Clean toilet tank interior', 365,
 'Mineral deposits, rust, and bacteria accumulate inside the toilet tank, causing corrosion of internal components and the distinctive odor of an unclean bathroom.',
 '1 cup white vinegar (or a denture cleaning tablet). Toilet brush (for tank).',
 NULL,
 '1. Pour 1 cup of white vinegar into the tank and let sit for 30 minutes.
2. Scrub the tank interior with a toilet brush.
3. Flush to rinse.
4. For significant mineral buildup, drop in a couple of denture cleaning tablets and leave overnight before scrubbing.'),

('plumbing', 'toilets', 'Inspect toilet supply line and shut-off valve', 365,
 'The braided supply line connecting the shut-off valve to the toilet tank can corrode or crack, causing a floor flood. The shut-off valve itself can seize if never operated.',
 'Replacement braided supply lines: $8–$12. Replace if over 10 years old.',
 'Flashlight.',
 '1. Trace the supply line from the wall shut-off valve to the toilet tank.
2. Look for corrosion at the fittings, cracking in the line, or water staining on the floor indicating a past drip.
3. Slowly turn the shut-off valve clockwise until closed, then counterclockwise to fully open — this keeps it operable in an emergency.
4. If the valve is stuck or drips when operated, replace it.'),

('plumbing', 'toilets', 'Check caulk around toilet base', 365,
 'A gap in the caulk at the toilet base allows water from mopping or condensation to get under the toilet and slowly rot the subfloor without any visible leak.',
 'Caulk designed for kitchen/bath (silicone or latex with mildewcide). ~$5.',
 'Utility knife to remove old caulk. Caulk gun.',
 '1. Inspect the caulk bead around the base of the toilet where it meets the floor.
2. Look for gaps, cracks, or missing sections.
3. If you''re re-caulking: score and remove the old caulk with a utility knife. Clean the area with rubbing alcohol.
4. Apply a thin bead of bathroom caulk around the entire perimeter of the toilet base.
5. Smooth with a wet finger and let cure per label instructions.
NOTE: Leave a small gap at the back if your toilet is not perfectly level — this allows any water from a wax ring failure to escape where you can see it, rather than staying hidden and rotting the subfloor.'),

-- ── BATHROOM EXHAUST FANS ────────────────────────────────────
('electrical', 'exhaust-fans', 'Clean bathroom exhaust fan grille and blades', 180,
 'Dust-clogged exhaust fans can''t move enough air to prevent mold and mildew growth. The motor also runs hotter, shortening its life.',
 NULL, 'Vacuum with brush attachment. Soft cloth.',
 '1. Snap off or unscrew the fan grille cover.
2. Wash the cover in warm soapy water and dry.
3. While the cover is off, vacuum the fan blades and housing interior.
4. Wipe the blades with a slightly damp cloth.
5. Snap the cover back in place.'),

('electrical', 'exhaust-fans', 'Test exhaust fan airflow', 365,
 'A fan that''s running but moving inadequate air isn''t preventing moisture buildup. This simple test reveals if the fan is doing its job.',
 NULL, 'A sheet of toilet paper or tissue.',
 '1. Turn on the exhaust fan.
2. Hold a single sheet of toilet paper near the grille — it should be drawn firmly to the grille by the suction.
3. If the paper falls away or barely moves, the fan is not moving enough air.
4. Check if the fan is clogged (clean first) — if cleaning doesn''t help, the motor may be failing.'),

('electrical', 'exhaust-fans', 'Check exterior duct termination', 365,
 'A bathroom fan venting into the attic creates a major moisture problem and mold risk. The duct must terminate outside the building.',
 NULL, NULL,
 '1. On a day when someone is inside running the fan, go outside and find the duct termination cap.
2. You should feel warm, moist air coming out of the cap while the fan runs.
3. If you can''t find the exterior cap, the fan may be venting into the attic — inspect from the attic with a flashlight.
4. Also confirm the duct is insulated (in cold climates, an uninsulated bathroom exhaust duct will cause moisture to condense inside and drip back down).'),

-- ── SHOWER VALVE ─────────────────────────────────────────────
('plumbing', 'shower-valve', 'Clean drain stopper and hair trap', 30,
 'Hair and soap scum accumulate in the shower drain quickly. Left uncleaned, this slows drainage and allows bacteria to grow, creating odors.',
 NULL, 'Gloves. Drain snake or hair-removal tool.',
 '1. Remove the drain cover or stopper — most unscrew or lift out.
2. Pull out accumulated hair and debris by hand (gloves recommended).
3. Use a drain snake or zip-it tool to remove buildup further down the drain.
4. Scrub the stopper and drain opening with an old toothbrush and dish soap.
5. For odors: pour ½ cup baking soda then ½ cup white vinegar down the drain, let fizz for 5 min, flush with hot water.'),

('plumbing', 'shower-valve', 'Descale and clean showerhead', 180,
 'Mineral deposits from hard water clog the showerhead nozzles, reducing water pressure and creating uneven spray patterns.',
 NULL, 'Quart-size zip-lock bag. White vinegar. Rubber band or twist tie. Old toothbrush.',
 '1. Fill a zip-lock bag with white vinegar.
2. Submerge the showerhead in the bag of vinegar and secure with a rubber band around the neck of the showerhead (don''t remove the head from the pipe).
3. Leave for at least 1 hour (overnight for heavy buildup).
4. Remove the bag and run the shower to flush mineral debris.
5. Scrub the nozzle surface with a toothbrush to remove remaining deposits.'),

('plumbing', 'shower-valve', 'Inspect and re-caulk grout, tiles, and tub surround', 365,
 'Failed grout and caulk in the shower allows water to penetrate behind the tiles, causing severe and expensive water damage to the wall framing. Recaulking is a $10 fix that prevents a $5,000 repair.',
 'Tub and tile caulk with mildewcide ($6–$10). Caulk gun.',
 'Utility knife or oscillating tool. Caulk gun. Rubbing alcohol.',
 '1. Inspect all caulk lines in the shower — primarily the corners (floor-to-wall, wall-to-wall) and the tub/shower base perimeter.
2. Look for cracking, gaps, discoloration (pink or black mold), and areas where the caulk has pulled away.
3. Use a utility knife to score and remove all old caulk in damaged areas.
4. Wipe the surface with rubbing alcohol and let dry completely.
5. Apply new silicone caulk (or tub-and-tile sealant) in a smooth, continuous bead.
6. Wet your finger and smooth the bead flat.
7. Also inspect grout lines for cracks or missing grout — repair with grout repair tube from hardware store.'),

('plumbing', 'shower-valve', 'Check for loose or damaged tiles', 365,
 'A loose tile indicates water has gotten behind it, compromising the adhesive and often the wall material behind it. Catching this early prevents large-scale tile replacement.',
 NULL, NULL,
 '1. Press firmly on each tile in the shower/tub surround — a hollow sound or movement indicates a loose tile.
2. Look for cracked or chipped tiles.
3. A single loose tile can sometimes be re-glued — a section of loose tiles indicates moisture damage to the backer board and requires professional repair.'),

-- ── ATTIC INSULATION ─────────────────────────────────────────
('other', 'attic-insulation', 'Check attic insulation depth', 365,
 'Inadequate insulation is one of the biggest sources of energy loss in most homes. Most older homes are under-insulated. The current recommendation is R-38 to R-60 (10–16" of blown insulation) for most US climates.',
 NULL, 'Flashlight. Tape measure or ruler.',
 '1. Access the attic from the hatch.
2. Use a tape measure or ruler to check the depth of insulation at multiple points.
3. Blown-in cellulose or fiberglass: R-value is about R-3.7 per inch. 10" deep = R-37.
4. If insulation is less than 10" deep, adding more is one of the best energy investments you can make.
5. Also check that insulation is not blocking soffit vents (the vents at the eaves) — use baffles to maintain air channels.'),

('other', 'attic-insulation', 'Inspect insulation for moisture or mold', 365,
 'Wet insulation loses its R-value and can develop mold. Finding it early allows targeted drying and repair before it spreads.',
 NULL, 'Flashlight. Moisture meter (optional, ~$20).',
 '1. Access the attic and scan with a flashlight for darkened, compressed, or stained insulation — all signs of moisture.
2. Look for black or gray mold growth on insulation or the wood framing above it.
3. Probe any discolored insulation with your hand — wet insulation feels heavy and cold.
4. If you find wet or moldy insulation, find the moisture source first (roof leak, ice dam, bathroom fan venting into attic) before replacing insulation.'),

('other', 'attic-insulation', 'Check for pest activity in insulation', 365,
 'Squirrels, mice, and other rodents nest in attic insulation, contaminating it with droppings and urine and reducing its effectiveness.',
 NULL, 'Flashlight.',
 '1. Look for paths or tunnels through the insulation — rodents create visible runways.
2. Look for droppings (small dark pellets) or nesting material (shredded insulation, leaves, paper).
3. Examine the attic perimeter and any penetrations (wiring, pipes, vents) for entry points.
4. If you find evidence of rodents, set traps and seal all entry points before replacing contaminated insulation.'),

-- ── WHOLE-HOUSE FAN ──────────────────────────────────────────
('hvac', 'whole-house-fan', 'Lubricate whole-house fan motor bearings', 365,
 'Whole-house fan motors run at high RPM and can develop bearing noise or wear without lubrication. Annual oiling prevents premature motor failure.',
 'Electric motor oil or 3-in-1 oil (~$5).',
 'Step stool to access fan from attic. Flashlight.',
 '1. Access the fan motor from the attic.
2. Locate the oil ports on the motor housing (small rubber caps or holes marked "oil here").
3. Add 2–3 drops of motor oil to each port.
4. If the motor has sealed bearings (no oil ports), no lubrication is needed — check for unusual noise instead.'),

('hvac', 'whole-house-fan', 'Clean fan louvers and blades', 365,
 'Dust buildup on the louvers and fan blades reduces airflow capacity and can become a fire risk if it accumulates heavily on the motor.',
 NULL, 'Vacuum with brush attachment. Damp cloth.',
 '1. Turn off the fan.
2. From inside the home, vacuum the louver grille.
3. From the attic, vacuum the fan blades and motor housing.
4. Wipe the louvers with a damp cloth from inside if accessible.'),

('hvac', 'whole-house-fan', 'Test fan operation each spring', 365,
 'After a winter without use, confirming the fan operates correctly before summer ensures you can actually use it to cool the house.',
 NULL, NULL,
 '1. Open several windows before running the fan (it requires outside air — running it with windows closed can damage the motor or cause negative pressure in the home).
2. Turn the fan on at the wall switch.
3. You should feel strong airflow from the windows toward the ceiling grille.
4. Listen for unusual bearing noise (grinding or squealing) — this may indicate a need for lubrication or motor replacement.
5. Make sure the attic has adequate ventilation to exhaust the air the fan brings in.'),

-- ── ATTIC VENTILATION ────────────────────────────────────────
('roof', 'attic-vent', 'Inspect attic vents for blockages', 365,
 'Blocked attic vents trap heat in summer (making the home hotter) and moisture in winter (causing ice dams and wood rot). Clear vents are essential for year-round attic health.',
 NULL, 'Flashlight from attic. Ladder for gable or roof vents.',
 '1. From inside the attic, look toward the eaves — you should see daylight through soffit vents. If not, insulation or debris is blocking them. Use attic vent baffles to create clear channels.
2. Check gable vents (if present) for bird nests, debris, or damaged screens.
3. From outside, inspect any box or pot vents on the roof surface for debris buildup around them.
4. For ridge vents, check from the attic that the vent strip is clear along its full length.'),

('roof', 'attic-vent', 'Test and inspect power attic fan', 365,
 'A power attic fan with a failed thermostat or motor doesn''t vent the attic heat that would otherwise radiate into the living space and stress the HVAC system.',
 NULL, NULL,
 '1. In summer, on a hot day, go into the attic and listen — the fan should be running if the attic temperature is above the thermostat set point (usually 90–110°F).
2. If the fan isn''t running on a hot day, check: power supply to the fan, thermostat setting, and whether the motor is seized.
3. Test the thermostat by adjusting it to a lower setting and seeing if the fan kicks on.
4. Check the fan blades for debris or obstruction.'),

('roof', 'attic-vent', 'Inspect vent screens for damage', 365,
 'Damaged vent screens allow birds, bats, squirrels, and insects to access the attic. Once inside, they can damage insulation, wiring, and the roof structure.',
 'Screen material ($5–$10) or pre-cut vent covers.',
 'Flashlight. Ladder.',
 '1. Inspect all gable vents, soffit vents, and any attic access screens for holes, tears, or sections that have pulled away from the framing.
2. Even small holes allow pest entry.
3. Repair damaged screens with patches or replace the vent cover entirely.'),

-- ── SOLAR PANELS ─────────────────────────────────────────────
('electrical', 'solar-panels', 'Check inverter display and system alerts', 90,
 'The inverter display is your early warning system. Error codes can indicate panel failures, shading issues, or grid connection problems that reduce your energy production.',
 NULL, NULL,
 '1. Check the inverter display (on the wall in your garage or utility room) for any red lights, error codes, or unusual readings.
2. If your system has a monitoring app (SolarEdge, Enphase Enlighten, Tesla app), review the daily production chart — any sudden drops suggest a problem.
3. Green or normal status lights = system is producing as expected.
4. If you see an error code, look it up in the inverter manual or call your solar installer.'),

('electrical', 'solar-panels', 'Clean solar panel surfaces', 365,
 'Dust, pollen, bird droppings, and leaves shade the panel surface and reduce energy production. Keeping panels clean can improve output by 5–25% depending on your environment.',
 'Mild soap or solar panel cleaning solution. Deionized water if available (prevents water spots).',
 'Garden hose with a gentle spray nozzle. Soft non-abrasive brush. Safety harness for roof access.',
 '1. The safest time to clean is early morning or evening when panels are cool and production is low.
2. Use a garden hose to rinse the panels — most dirt will come off with water alone.
3. For bird droppings or stubborn residue, use a soft brush with mild soapy water and rinse well.
4. NEVER use abrasive materials, high-pressure washers, or harsh chemicals — these can scratch the glass.
5. If your panels are not easily accessible without walking on the roof, hire a professional solar cleaning service ($3–$8 per panel).'),

('electrical', 'solar-panels', 'Inspect panel mounting hardware', 365,
 'Solar panel mounting systems are exposed to wind, temperature cycles, and UV. Loose mounting hardware can allow panels to shift in high winds.',
 NULL, NULL,
 '1. From the ground (or safely on the roof with proper precautions), visually inspect the mounting rails and panel frames.
2. Look for: panels that appear shifted out of alignment, visible rust or corrosion on mounting hardware, or loose-looking rails.
3. If anything looks significantly different from when installed, contact your solar installer to inspect.'),

('electrical', 'solar-panels', 'Schedule annual solar system inspection', 365,
 'A professional annual inspection checks wiring, connections, and system performance against your original installation specs — catching degradation and potential fire hazards early.',
 NULL, NULL,
 '1. Contact your solar installer or a certified solar inspector.
2. The inspection should cover: panel visual inspection, wiring and connection torque check, inverter performance verification, and monitoring system review.
3. Keep your inspection report — it may be required for warranty claims.');
