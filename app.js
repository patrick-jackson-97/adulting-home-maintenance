// ==============================================
// ADULTING — HOME MAINTENANCE TRACKER
// app.js v7
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

// Tasks page filter state
let taskFilters = { timeline: 'all', asset: '', category: '', sort: 'due_asc' };

// Estimated repair cost avoided per task completion (rough averages)
const REPAIR_VALUE = {
  hvac: 180, water: 150, appliance: 120,
  electrical: 100, plumbing: 130, roof: 200, other: 80
};

// ==============================================
// EQUIPMENT LIBRARY
// ==============================================
const EQUIPMENT_LIBRARY = {
  hvac: [
    { name: 'Central Air Conditioner', identify: 'A large metal box (2–4 ft square) on a concrete pad outside your home with fins around the sides and a fan on top. Copper refrigerant lines wrapped in black foam insulation run from it into your house. The model/serial number label is on the side panel — the serial number usually encodes the manufacture year in the first 4 digits (e.g. 1998 = manufactured 1998).' },
    { name: 'Gas Furnace', identify: 'A tall metal cabinet (usually 3–5 ft tall) in your basement, utility closet, or attic. Has a flue pipe running out through the wall or ceiling. The data label with model/serial is inside the front panel door, often on the left side wall. High-efficiency models have 2 PVC pipes going outside instead of a metal flue.' },
    { name: 'Electric Furnace', identify: 'Similar cabinet shape to a gas furnace but no flue pipe or gas line. Connected to your electrical panel via thick wires. Usually found in areas without natural gas service. Label is inside the front panel.' },
    { name: 'Heat Pump (Outdoor Unit)', identify: 'Looks identical to a central AC outdoor unit — large metal box on a pad outside. The key difference: it runs in both summer (cooling) and winter (heating). If your system heats AND cools without a furnace or separate outdoor unit, it\'s a heat pump. Check the indoor air handler label — it will say "heat pump" or show heating/cooling modes.' },
    { name: 'Air Handler / Fan Coil', identify: 'A large cabinet (4–5 ft tall) connected to an outdoor heat pump or AC. Located indoors — basement, attic, closet, or utility room. Has large ductwork attached to the top or sides. The refrigerant lines and electrical wiring connect it to the outdoor unit. Often paired with a heat pump instead of a furnace.' },
    { name: 'Mini-Split Outdoor Unit', identify: 'A smaller version of an AC outdoor unit, usually 1–2 ft tall and 2–3 ft wide. Mounted on the ground or wall outside. Multiple small refrigerant lines (usually ¼" and ½" copper in black foam) run from it through a small hole in the wall to indoor head units. Brand and model on the front or side panel.' },
    { name: 'Mini-Split Indoor Head Unit', identify: 'A slim rectangular unit mounted high on an interior wall, typically 30–40" wide and 10–12" tall. Has a front grille that opens for the air filter. The remote control receiver is usually visible on the right side. Model number is on the label inside the filter access panel.' },
    { name: 'Window Air Conditioner', identify: 'A rectangular unit installed in a window opening. The back (facing outside) has metal fins; the front (inside) has the controls and air vents. Model/serial label is usually on the side or back panel. BTU rating is on the front label.' },
    { name: 'Boiler (Hot Water)', identify: 'A compact appliance (usually 2–4 ft tall) connected to pipes rather than ducts. Heats water that circulates to radiators, baseboard heaters, or radiant floor tubing. Gas-fired models have a flue pipe; electric models do not. A pressure/temperature gauge is visible on the front. Found in basement or utility room.' },
    { name: 'Boiler (Steam)', identify: 'Similar to a hot water boiler but has a sight glass (vertical glass tube) on the side showing water level. Connected to one-pipe or two-pipe systems feeding old-style cast iron radiators. Often found in pre-1950s homes. Makes a hissing or banging sound as steam travels through pipes.' },
    { name: 'Radiant Floor Heating (Hydronic)', identify: 'No visible unit in the room — heat comes from tubing embedded in the floor. The mechanical component is a manifold (a metal bar with multiple valves/connections) usually in a basement or utility closet, connected to a boiler or water heater. Tubing may be PEX (red/blue flexible plastic pipe).' },
    { name: 'Electric Baseboard Heater', identify: 'A long, narrow (4–8 ft) metal unit mounted at floor level along walls, typically under windows. Has metal fins inside a housing with a simple dial or thermostat on one end. Wired directly to your electrical panel (240V). No ductwork or pipes — each unit operates independently.' },
    { name: 'Hot Water Baseboard Heater', identify: 'Similar appearance to electric baseboard but connected to your boiler system via pipes entering through the wall at each end. Fins are copper or aluminum. Check under the end caps — if you see pipes (not wires), it\'s hot water.' },
    { name: 'Whole-House Humidifier', identify: 'Mounted directly on your furnace or ductwork — a rectangular box (about 10"×12") with a water supply line connected to it. Has a drum/pad inside and a control panel (humidistat) on the duct nearby. You\'ll see a water feed line and a drain line. Brands include Aprilaire, Honeywell, and GeneralAire.' },
    { name: 'Whole-House Dehumidifier', identify: 'A standalone unit (about the size of a small mini-fridge) installed in a basement or crawl space. Has a drain line running to a floor drain or outside. May be ducted into the HVAC system or freestanding. Has its own control panel with a humidity setting. Brands include Santa Fe, Aprilaire, and Honeywell.' },
    { name: 'Heat Recovery Ventilator (HRV/ERV)', identify: 'A rectangular box (12"×18"×24") usually in the mechanical room or attic, connected to both supply and exhaust ductwork. Has two filtered air paths that cross through a heat exchanger core. Labels will say HRV, ERV, or "energy recovery ventilator." Common in newer, tightly-built homes.' },
    { name: 'Whole-House Fan', identify: 'A large fan (30"–48" diameter) installed in the ceiling between your living space and attic. Activated by a wall switch, it pulls air from open windows and exhausts it to the attic. The grille is visible on your ceiling. Not the same as an attic fan — this one you feel air movement from inside the house.' },
    { name: 'Attic Ventilator Fan', identify: 'Mounted in the attic on the roof (round dome with a fan inside) or in a gable vent opening. Runs automatically via a thermostat. You can see the dome on the roof or the grill on the gable end. The thermostat is usually clipped to a rafter near the fan.' },
    { name: 'Air Purifier / UV System', identify: 'Installed inside your ductwork, often at the air handler or furnace. UV models have a purple/blue light visible through a small inspection port. Whole-unit purifiers (like Carrier Infinity or Aprilaire 5000) are a separate cabinet inline with the ductwork. Look for it between the filter and the air handler.' },
    { name: 'Thermostat', identify: 'The wall-mounted temperature control — everyone knows what this looks like. Smart thermostats (Nest, Ecobee, Honeywell) have digital displays. Older models have a round dial (Honeywell round) or a rectangular slider. The model/serial is on the back (removable from its wall plate) or in the settings menu on smart models.' },
    { name: 'Portable Air Conditioner', identify: 'A freestanding unit on wheels, typically 2–3 ft tall. Has a flexible exhaust hose that vents out a window. Completely self-contained — no permanent installation. Model label is on the back or bottom panel.' },
    { name: 'Ductless Ceiling Cassette', identify: 'A square unit (roughly 24"×24") recessed into the ceiling, flush with the ceiling surface. Vents on all four sides blow air in multiple directions. Common in commercial-style homes or additions. Part of a mini-split system with an outdoor unit.' }
  ],

  water: [
    { name: 'Gas Water Heater (Tank)', identify: 'A tall cylindrical tank (40–80 gallons) with a gas line at the bottom and a metal flue pipe at the top. The pilot light or ignition is at the base. The data label on the side shows gallon capacity, BTU rating, and serial number — the first 4 digits of the serial often encode the manufacture year and week.' },
    { name: 'Electric Water Heater (Tank)', identify: 'Identical cylindrical shape to a gas model but no flue pipe and no gas connection. Instead, two thick electrical wires enter from the top or side. Usually has two access panels on the side covering the heating elements. Label is on the side of the tank.' },
    { name: 'Tankless Water Heater (Gas)', identify: 'A flat, wall-mounted box (roughly 18"×28") — much smaller than a tank heater. Gas line connects at the bottom; hot and cold water lines connect at the bottom or sides. Two PVC pipes (or one stainless exhaust pipe) go through the wall. Brands like Rinnai, Navien, and Noritz are common.' },
    { name: 'Tankless Water Heater (Electric)', identify: 'Similar flat box mounted on a wall, but connected to thick electrical wires instead of a gas line. No exhaust vent needed. Often installed under sinks or near point of use. Smaller than gas tankless units. Label is on the front panel.' },
    { name: 'Heat Pump Water Heater', identify: 'A large tank (similar to electric) with a compressor/fan unit on top — it looks like a water heater with an AC unit sitting on it. Makes a quiet humming sound when running. Requires at least 10×10 ft of air space around it. Brands include Rheem ProTerra, GE GeoSpring, and A.O. Smith Voltex.' },
    { name: 'Water Softener', identify: 'Two connected tanks — a taller cylindrical mineral tank and a shorter rectangular salt storage tank (brine tank). Usually found near your water main or where it enters the house. The brine tank is filled with salt pellets. A bypass valve allows you to isolate it for service.' },
    { name: 'Whole-House Water Filter', identify: 'A cylindrical canister (or series of canisters) installed on your main water line before the water heater. Has a housing you unscrew to replace the filter cartridge inside. May have a pressure gauge. Often has a shutoff valve on each side.' },
    { name: 'Reverse Osmosis System', identify: 'A set of 3–5 small cylindrical filter housings and a storage tank under your kitchen sink. Feeds a separate, small faucet on your countertop or sink. The storage tank is a small pressurized tank (about the size of a basketball). Filters are replaced annually or semi-annually.' },
    { name: 'Well Pump (Submersible)', identify: 'The pump itself is not visible — it sits at the bottom of your well, underwater. You\'ll see a well casing (a 4"–6" pipe) in your yard with a well cap on top. Electrical wires disappear into the well. The associated pressure tank is inside your home in the utility area.' },
    { name: 'Well Pressure Tank', identify: 'A cylindrical tank (12"–24" diameter, 2–5 ft tall) near your water main inside the house. Has a pressure gauge on top and connects to the water line. If you have well water, you have one of these. The tank maintains water pressure between pump cycles and prevents the pump from cycling too frequently.' },
    { name: 'Sump Pump', identify: 'Located in a pit (sump pit) in your basement floor, usually in a corner. The pit is a round hole (about 18" diameter) covered by a plastic or metal lid. A submersible pump sits inside with a float switch. A discharge pipe runs from the pit up and out through the wall to outside.' },
    { name: 'Battery Backup Sump Pump', identify: 'A secondary pump in the same sump pit as your main pump, connected to a large battery (like a car battery). Often mounted above the primary pump or on the pit wall. Has its own discharge line. The battery and charger unit are mounted on the wall nearby.' },
    { name: 'Irrigation / Sprinkler System', identify: 'The control panel (timer/controller) is usually mounted in your garage or utility room — a rectangular box with a digital display and zone controls. In-ground systems have pop-up sprinkler heads visible in lawn/planting beds. A backflow preventer is typically on an outdoor pipe near the foundation.' },
    { name: 'Backflow Preventer', identify: 'A brass or bronze assembly on a water pipe, usually outside near where the irrigation line comes off the main. Has two valves (one on each side) and test ports. Required by code on irrigation systems to prevent contaminated water from flowing back into the drinking supply.' },
    { name: 'Pool Pump', identify: 'A motor-and-basket assembly (motor is gray/black cylinder; basket housing is clear plastic) beside your pool equipment pad. Connected to pipes going into the ground. Has a strainer basket you can see through the clear lid. Label is on the motor housing.' },
    { name: 'Pool Heater', identify: 'A large metal cabinet (2–3 ft cube) on your pool equipment pad. Gas models have a flue outlet at the top; heat pump models have a fan on top. Water inlet/outlet pipes are labeled IN and OUT. Model label is on the front panel or inside the access door.' },
    { name: 'Hot Tub / Spa', identify: 'Freestanding acrylic tub (if portable) or built into a deck (if in-ground). Has a control panel (usually attached to the tub or on a post nearby). The equipment bay — under a side panel or in a separate equipment compartment — contains the pump, heater, and control pack. The model label is usually inside the equipment bay.' },
    { name: 'Water Pressure Regulator (PRV)', identify: 'A bell-shaped brass fitting on your main water line where it enters the house, usually near the main shutoff valve. Often has a screw on top for adjustment. If your water pressure seems too high (above 80 PSI) or hammers in pipes, the PRV may be failing. Normal setting is 50–70 PSI.' },
    { name: 'Recirculation Pump', identify: 'A small pump (about the size of a large coffee can) installed on your hot water line, usually near the water heater. Keeps hot water circulating so you get hot water instantly at fixtures. May have a timer or temperature sensor. Brands include Grundfos and Taco.' },
    { name: 'Main Water Shutoff Valve', identify: 'The master valve that controls all water entering your home. Usually a ball valve (lever handle) or gate valve (round wheel handle) on the water main where it enters the foundation. If you have city water, it may be near a water meter in the basement or utility room. If well water, it\'s near the pressure tank.' },
    { name: 'Expansion Tank (Water Heater)', identify: 'A small blue or red cylindrical tank (6"–10" diameter, 12"–18" long) installed on the cold water supply line near your water heater. Required by code in closed plumbing systems (with a PRV or check valve). If your water heater doesn\'t have one and your system is closed, you may need one added.' },
    { name: 'Sewage Ejector Pump', identify: 'A sealed tank (usually 30 gallons) in a basement bathroom or laundry area. Sewage from below-grade fixtures drains into it, and the pump ejects it up to the main sewer line. Similar to a sump pit but with a fully sealed lid and a vent pipe. Has a discharge pipe rising up and connecting to the main drain stack.' }
  ],

  appliance: [
    { name: 'Refrigerator', identify: 'Standard kitchen refrigerator (top-freezer, bottom-freezer, side-by-side, or French door). Model and serial number label is inside on the wall of the fresh food compartment, usually on the upper left or right side. Age over 15 years is a common replacement threshold.' },
    { name: 'Dishwasher', identify: 'Built-in unit under the counter, typically 24" wide. Model/serial label is on the inner door frame — open the door and look at the edges or top of the door opening. Most units are 10–15 year lifespan.' },
    { name: 'Washing Machine (Front-Load)', identify: 'Front-loading washing machine with a circular door. Model/serial label is inside the door opening on the door frame or tub opening. May have a small filter access door at the bottom front.' },
    { name: 'Washing Machine (Top-Load)', identify: 'Top-loading washing machine with a lid on top. Model/serial is on the inside of the lid opening — look on the back wall of the opening or lift the lid and check under the top panel lip.' },
    { name: 'Gas Dryer', identify: 'Dryer with a gas line connected at the back (usually ¾" flex connector). The vent duct exits the back. If you can see a flexible metal or yellow gas line behind the unit, it\'s gas. Label is on the inside of the door frame or back panel.' },
    { name: 'Electric Dryer', identify: 'Dryer with a thick 3- or 4-wire electrical cord plugged into a 240V outlet (larger than a standard outlet). No gas line at back. Label is on door frame or back panel.' },
    { name: 'Gas Range / Oven', identify: 'Has gas burners on the cooktop — you can see burner grates and may smell a faint gas scent when lighting. Gas line connects at the back. Model/serial label is inside the drawer at the bottom or on the oven door frame.' },
    { name: 'Electric Range / Oven', identify: 'Electric coil or smooth glass-ceramic cooktop (no open flame). Plugged into a large 240V outlet. Label is inside the storage drawer or on the door frame.' },
    { name: 'Induction Cooktop', identify: 'Smooth glass surface similar to electric but with no visible heating elements — surface stays cool to the touch except where the pan heats it. Test with a magnet: induction only works with magnetic cookware. Usually built into a counter as a separate unit from the oven.' },
    { name: 'Wall Oven', identify: 'Built into a wall cabinet at a comfortable height (not freestanding). Usually 24"–30" wide. Label is on the door frame or inside the oven on a side wall. May be single or double oven stacked vertically.' },
    { name: 'Microwave (Over-the-Range)', identify: 'Mounted above the range cooktop, attached to cabinets above. Combines microwave and range hood functions. Vented either to outside or recirculating. Label inside the microwave door frame.' },
    { name: 'Range Hood', identify: 'Mounted above the cooktop, either wall-mounted or built into the cabinets. Has a fan and filter. Vented hoods have a duct running up through the cabinet and out through the wall or roof. Recirculating hoods have a charcoal filter. Model label inside under the filter.' },
    { name: 'Garbage Disposal', identify: 'Mounted under the kitchen sink — a cylindrical metal unit connected to the drain. A power switch is usually on the wall or under the counter. The reset button is on the bottom of the unit. The label with model/serial is on the side of the unit (may require removing from under the sink to read).' },
    { name: 'Refrigerator (Second / Garage)', identify: 'An additional refrigerator, often older, in the garage or basement. Same identification as a primary refrigerator. Note: older units in garages use significantly more energy. Many are refrigerator-only or freezer-only units.' },
    { name: 'Chest Freezer', identify: 'A large box-style freezer with a lid that opens from the top. Usually in a basement or garage. Model/serial is inside the lid on a sticker or stamped into the inner wall near the top opening.' },
    { name: 'Upright Freezer', identify: 'Stands like a refrigerator but is all-freezer. Door opens from the front. Model/serial is inside the door frame similar to a refrigerator.' },
    { name: 'Wine / Beverage Cooler', identify: 'A compact refrigerator designed for wine or beverages, typically 12"–24" wide. May be freestanding or built into a counter. Label is inside the door frame. Many are designed to hold temperatures between 45–65°F rather than full refrigeration temperatures.' },
    { name: 'Trash Compactor', identify: 'Built into kitchen cabinets — looks like a narrow (15"–18") drawer unit. Compresses trash using a motor-driven ram. Model label is on the door frame when the drawer is open.' },
    { name: 'Ice Maker (Standalone)', identify: 'A dedicated ice-making appliance separate from the refrigerator, often in a bar area or pantry. Requires a water line connection. Label is inside the ice storage compartment or on the back panel.' },
    { name: 'Built-In Coffee System', identify: 'Integrated into a wall or cabinet — has a built-in grinder, bean hopper, and water reservoir. Usually requires a plumbed water line. Models like Miele, Wolf, and Jura are common. Label is inside the door or access panel.' },
    { name: 'Steam Oven', identify: 'A specialty oven that injects steam during cooking. Has a water reservoir to fill or is plumbed directly. Often a drawer-style or wall-oven style unit. Label on the door frame.' },
    { name: 'Central Vacuum System', identify: 'Wall-mounted inlets (typically 2"×4" metal or plastic covers) throughout the home connect to a central vacuum unit in the garage, basement, or utility room via tubing hidden in walls. The power unit is a large canister with a motor and dirt collection. You plug a hose into wall inlets to use it.' }
  ],

  electrical: [
    { name: 'Main Electrical Panel', identify: 'A gray metal box (12"–24" wide, 24"–40" tall) on a wall, usually in the garage, basement, or utility room. Opens to reveal circuit breakers arranged in rows. The main breaker (largest) is at the top. The label on the inside of the door shows circuit assignments. The service size (100A, 200A) is stamped on the main breaker.' },
    { name: 'Sub-Panel', identify: 'A smaller breaker panel, similar in appearance to the main panel, located in a detached garage, workshop, or another area of the home. Fed by a larger circuit from the main panel. Has its own rows of breakers but typically no meter.' },
    { name: 'Standby Generator', identify: 'A permanent outdoor unit (looks like a large air conditioner) on a concrete pad beside your home. Connected to your gas line and an automatic transfer switch. Turns on automatically during a power outage. Brands include Generac, Kohler, and Briggs & Stratton. Label is on the unit housing.' },
    { name: 'Portable Generator', identify: 'A wheeled or handlebar unit stored in a garage or shed. Must be manually started and connected via extension cords or a manual transfer switch. Runs on gasoline or dual-fuel (gas/propane). Model label on the housing panel.' },
    { name: 'Transfer Switch', identify: 'A metal box (6"–12" wide) mounted next to your main panel. Has its own set of breakers or a manual lever. Allows safe connection of a generator to your home\'s circuits without backfeeding the grid. Required for safe generator use connected to home wiring.' },
    { name: 'Solar Panel System', identify: 'Panels are visible on the roof — dark rectangular modules in a grid pattern. The inverter (converts DC to AC) is a box on an interior or exterior wall near your electrical panel, usually in a garage or utility room. Brands include Enphase, SolarEdge, SMA, and Tesla.' },
    { name: 'Solar Inverter', identify: 'A box on the wall near your electrical panel, typically 12"–24" wide. Has a digital display showing power output. String inverters are one large box; microinverters are small units under each panel. Brands: SolarEdge, Enphase, Fronius, SMA. The display should show green/normal status during daylight.' },
    { name: 'Battery Storage System', identify: 'A large rectangular unit (about the size of a suitcase) mounted on a wall in the garage or utility room. Tesla Powerwall, Enphase IQ Battery, and LG Chem are common. Has an indicator display showing charge level. Connected to your solar system and/or electrical panel.' },
    { name: 'EV Charger (Level 2)', identify: 'A wall-mounted box (about 8"×12") in the garage, usually on the same wall as your electrical panel or near it. Has a heavy charging cable with a J1772 or Tesla connector. Requires a dedicated 240V circuit (40–60A). Brands include ChargePoint, JuiceBox, Emporia, Wallbox.' },
    { name: 'Smoke Detectors', identify: 'Circular white or cream units mounted on ceilings and walls. The manufacturer, model, and manufacture date are printed on the back — you must remove from the mounting bracket to see it. Check the date: replace any unit over 10 years old. Hardwired units have wires going into the ceiling; battery-only units just have a bracket.' },
    { name: 'Carbon Monoxide Detectors', identify: 'Similar appearance to smoke detectors but labeled "CO" or "Carbon Monoxide." Often combined as a combo CO/smoke unit. The CO sensor module has a specific lifespan (5–7 years). Check the manufacture date on the back — it\'s often separate from the smoke alarm lifespan.' },
    { name: 'GFCI Outlets', identify: 'Standard electrical outlets with two buttons in the center labeled TEST and RESET. Required in bathrooms, kitchens, garages, outdoors, and near water sources. One GFCI outlet often protects multiple standard outlets downstream on the same circuit. If a downstream outlet isn\'t working, find and reset the GFCI.' },
    { name: 'Arc Fault Circuit Interrupter (AFCI)', identify: 'Looks like a circuit breaker in your electrical panel — but has a TEST button on the front of the breaker. Required in modern homes for bedroom and living area circuits. The breaker label or the panel directory will identify which circuits are AFCI-protected.' },
    { name: 'Whole-House Surge Protector', identify: 'Installed inside or next to your main electrical panel. May look like a small box plugged into a breaker slot or mounted on the panel enclosure. Has a status light (green = good) and may have a warranty. Brands: Square D, Eaton, Leviton, Siemens. Not to be confused with a power strip surge protector.' },
    { name: 'Security / Alarm System', identify: 'The main panel (control board) is usually a metal box in a closet, utility room, or basement — wires from all sensors run to it. Keypads are wall-mounted near entry doors. Brands include ADT, Ring, SimpliSafe, Honeywell, and DSC. The panel label is inside the metal enclosure.' },
    { name: 'Smart Home Hub', identify: 'A small box or plug-in device (Hubitat, SmartThings, Home Assistant green box) usually in a central location or near your router. May be rack-mounted in a networking closet. Also check for smart home bridges from Lutron, Philips Hue, or similar.' },
    { name: 'Ceiling Fan', identify: 'The motor housing is the round or oval casing where the blades attach. The label with model/serial is usually on the top of the motor housing (requires climbing a ladder and lifting the blades) or on a sticker inside the switch housing on the ceiling. Blade span is measured tip-to-tip across the widest blades.' },
    { name: 'Whole-House Surge Protector', identify: 'Installed inside or next to your main electrical panel. May look like a small box plugged into a breaker slot or mounted on the panel enclosure. Has a status light (green = good) and may have a warranty. Brands: Square D, Eaton, Leviton, Siemens.' },
    { name: 'Doorbell / Video Doorbell', identify: 'Standard doorbell: a small button at the front door wired to a chime inside. Video doorbell: a camera unit replacing the standard button, wired to existing doorbell wires (Nest, Ring Wired) or battery-powered (Ring Battery). The transformer powering the doorbell is often in the mechanical room or near the main panel.' },
    { name: 'Outdoor Lighting System', identify: 'May be low-voltage landscape lights (12V, connected to a transformer near the house) or line-voltage fixtures on the home exterior. The transformer for low-voltage systems is mounted on an exterior wall or post and plugged into an outdoor outlet. Has a timer or photocell to automate scheduling.' },
    { name: 'Bathroom Exhaust Fan', identify: 'A grille mounted in the bathroom ceiling or wall. Remove the grille cover (usually clips or screws) to access the fan motor. The CFM rating and model label are on the fan housing inside. Ductwork exits through the attic or wall to outside — confirm it vents OUTSIDE, not into the attic.' },
    { name: 'Electric Vehicle Charging (EVSE)', identify: 'See EV Charger (Level 2) above. For Level 1 charging: a standard 120V outlet (NEMA 5-15) in the garage, used with the portable charge cord that came with the vehicle. No special unit — just the outlet and cord.' }
  ],

  plumbing: [
    { name: 'Main Water Shutoff Valve', identify: 'The master valve controlling all water into your home. Ball valve: has a lever handle that is parallel to the pipe when open. Gate valve: has a round wheel handle you turn multiple times. Usually located where the water supply enters the foundation (basement, crawl space, or exterior wall). There may also be a shutoff at the water meter in the street.' },
    { name: 'Pressure Reducing Valve (PRV)', identify: 'A bell-shaped bronze or brass fitting on your main water line, typically within a few feet of where the line enters the house. Has a screw adjustment on top and usually a lock nut. If your water pressure is above 80 PSI, the PRV may be set too high or failing. A $10 pressure gauge at any hardware store will tell you your pressure.' },
    { name: 'Toilet (Standard)', identify: 'Standard gravity-flush toilet. The flush valve and fill valve are inside the tank (the upper box behind the seat). Remove the lid to see inside. The model and serial are often stamped inside the tank or on a label on the side of the tank. Toilets over 25 years old may use 3.5–7 gallons per flush vs. the modern 1.28 GPF.' },
    { name: 'Toilet (Low-Flow / High-Efficiency)', identify: 'Modern toilet (post-1994) using 1.6 GPF or less. High-efficiency models (HET) use 1.28 GPF or less. The gallons per flush is often printed on a label inside the tank lid. Dual-flush models have two buttons on the top of the tank (half-flush and full-flush).' },
    { name: 'Tankless Toilet (Flushometer)', identify: 'Has no water tank behind it — a chrome valve body connects directly to the supply pipe on the wall behind the toilet. Common in commercial buildings. The valve has a handle or button to actuate the flush. Requires higher water pressure than gravity toilets.' },
    { name: 'Kitchen Faucet', identify: 'Faucet at the kitchen sink — single or double handle, with or without a sprayer. The model label is usually on a sticker under the sink near the supply lines or stamped on the faucet body. The brand name is often on the handle or escutcheon plate.' },
    { name: 'Bathroom Faucet', identify: 'Faucet at a bathroom vanity sink. Single-handle or double-handle. The brand name may be on the handle or the index button. The model label is under the sink on the supply lines or valve body.' },
    { name: 'Shower Valve / Cartridge', identify: 'The internal valve controlling water temperature and flow in the shower. Not visible directly — hidden behind the wall. The trim (handles, plate, and showerhead) are visible. Single-handle pressure-balancing valves (required by code since 1993) have one handle. Common brands: Moen, Delta, Kohler, Price Pfister. The brand name is usually on the trim.' },
    { name: 'Bathtub', identify: 'Standard bathtub (usually 60"×30"–32") alcove, freestanding, or corner installation. The overflow cover (the plate above the drain) sometimes has the brand. Tubs are cast iron, acrylic, or fiberglass — knocking produces a dull thud (cast iron) or hollow sound (acrylic/fiberglass).' },
    { name: 'Sump Pump', identify: 'See Water category. Located in a pit in the basement floor. If you have a finished basement, the pit is under a lid in a utility area. Test by pouring water into the pit — the float should trigger the pump.' },
    { name: 'Sewage Ejector Pump', identify: 'A sealed, airtight pit (usually in a finished basement bathroom or laundry area). Distinguished from a sump pump by having a fully sealed lid with a vent pipe (to release sewer gases). Removes waste from below-grade fixtures that can\'t gravity-drain to the main sewer line.' },
    { name: 'Septic Tank', identify: 'An underground concrete or fiberglass tank, usually in the backyard. The access lids (typically 2 risers) may be visible at ground level or just below grade. A distribution box or septic d-box is downstream from the tank, before the leach field. Find your system on your property survey or county records.' },
    { name: 'Leach Field / Drain Field', identify: 'The area of yard where perforated pipes buried in gravel allow treated sewage to percolate into the soil. Often indicated by slightly lusher or greener grass in a grid pattern in the yard. Should not have vehicles driven over it or be planted with trees (roots damage pipes).' },
    { name: 'Floor Drain', identify: 'A drain set into the floor, typically in basements, utility rooms, garages, and mechanical rooms. Has a removable strainer cover. Inside is a P-trap that should stay filled with water to block sewer gas. If a floor drain smells like sewer gas, the trap has dried out — pour a gallon of water down it.' },
    { name: 'Outdoor Hose Bib / Spigot', identify: 'An exterior water faucet mounted on the house wall. Frost-free models (required in cold climates) have a long stem that shuts off water inside the heated space. You can tell if it\'s frost-free by its length — when you look at the pipe going through the wall, frost-free models have a 6"–12" stem. The actual shutoff is inside.' },
    { name: 'Gas Line / Shutoff Valves', identify: 'Corrugated stainless steel tubing (CSST, looks like a flexible yellow or black corrugated pipe) or black iron pipe supplying natural gas. Each appliance has a shutoff valve nearby — a small valve on the gas supply line within 6 feet of the appliance. The main gas shutoff is at the meter outside.' },
    { name: 'Water Heater Drain Pan', identify: 'A shallow metal or plastic pan under the water heater, designed to catch leaks and direct them to a drain. Should have a drain pipe routed to a floor drain or outside. If your water heater has no pan, it\'s a flood risk when the tank eventually fails.' },
    { name: 'Expansion Tank (Closed System)', identify: 'A small tank (6"–10" diameter) on the cold water supply line near the water heater. Required in closed plumbing systems (where a PRV or check valve prevents expansion water from going back to the street). Has a Schrader valve (like a tire valve) for pre-charging with air.' },
    { name: 'Laundry Standpipe', identify: 'A vertical drain pipe (usually 2") in the laundry area into which the washing machine drain hose is inserted. Should extend at least 30"–36" above the floor to prevent overflow. If your washer drains into a utility sink instead, the sink is the standpipe equivalent.' },
    { name: 'Dishwasher Drain & Supply', identify: 'Under the kitchen sink: a thin flexible supply line (usually ⅜") connects the dishwasher to the hot water shutoff valve, and a corrugated drain hose connects to the garbage disposal or drain. The high loop (where the drain hose is routed up near the countertop) prevents backflow.' },
    { name: 'Irrigation Backflow Preventer', identify: 'A brass or bronze assembly on the irrigation supply line, usually outside near the foundation. Has test cocks and two shutoff valves. Prevents irrigation water (which contacts soil, fertilizer, and pesticides) from backflowing into your drinking water. Annual testing required in many municipalities.' },
    { name: 'Whole-House Water Shutoff (Meter)', identify: 'Located at your water meter, usually in a box in the ground near the street or sidewalk (look for a metal cover with "WATER" stamped on it). Turning this off cuts all water to the property. May require a special meter key tool. Know where this is in case your main interior shutoff fails.' }
  ],

  roof: [
    { name: 'Asphalt Shingles (3-Tab)', identify: 'The most common residential roofing material — flat, rectangular shingles with three visible cutouts (tabs) along the bottom edge. Single-layer appearance from the ground. Typical lifespan 15–25 years. Look for curling, cracking, granule loss (check gutters), or bare spots where granules have worn away.' },
    { name: 'Architectural / Dimensional Shingles', identify: 'Premium asphalt shingles with a layered, textured appearance that mimics wood shake or slate. Thicker than 3-tab, with varied shadow lines creating a dimensional look. Typical lifespan 25–50 years depending on the warranty. The most common shingle on homes built after 2000.' },
    { name: 'Metal Roof (Standing Seam)', identify: 'Long, smooth metal panels that run from ridge to eave, with raised seams (1"–2" tall) connecting adjacent panels. No exposed fasteners. Typically aluminum or steel. Very long lifespan (40–70 years). Check seams for separation and look for oil-canning (waviness in flat panels — cosmetic, not structural).' },
    { name: 'Metal Roof (Exposed Fastener / R-Panel)', identify: 'Metal panels with visible screws along the ribs. Common on agricultural buildings and some residential homes. The rubber washers under the screw heads can deteriorate over time and allow water intrusion. Check fastener heads for missing or degraded washers.' },
    { name: 'Metal Roof (Steel Shingles)', identify: 'Individual metal shingles designed to look like asphalt shingles, wood shake, or slate. Each shingle locks into adjacent ones. Exposed fasteners at the top are covered by the overlapping course above. Lifespan 40–70 years.' },
    { name: 'Tile Roof (Clay)', identify: 'Orange or terracotta (or colored) curved or flat tiles made from fired clay. Very heavy — requires reinforced roof structure. Common in Spanish/Mediterranean architectural styles. Tiles themselves last 50–100 years; underlayment beneath them may need replacement at 20–30 years. Look for cracked or slipped tiles.' },
    { name: 'Tile Roof (Concrete)', identify: 'Similar appearance to clay tile but heavier and often available in more colors. Gray or brown most common in addition to terracotta tones. Check for efflorescence (white mineral deposits) and cracked tiles. Similar underlayment lifespan issues as clay tile.' },
    { name: 'Slate Roof', identify: 'Natural stone tiles — gray, green, purple, or black. Very heavy and extremely durable (75–150+ years for hard slate). Individual tiles may crack or slide. Repairs must be done by a slate-experienced roofer. Check gutters for slate chips (indicates deterioration). The age of the home often helps date the slate.' },
    { name: 'Flat Roof (TPO)', identify: 'A single-ply white or light gray membrane visible on flat or low-slope roofs. Seams are heat-welded together. Typically installed on commercial-style homes, additions, and garage roofs. Look for punctures, blistering, or seam separation. Typical lifespan 15–30 years.' },
    { name: 'Flat Roof (EPDM / Rubber)', identify: 'A single-ply black rubber membrane on flat or low-slope roofs. Seams are glued with adhesive and may be covered with seam tape. Look for shrinkage (membrane pulling away from edges), blistering, or seam separation. Typical lifespan 15–25 years. May be coated with a white reflective coating.' },
    { name: 'Flat Roof (Modified Bitumen)', identify: 'A granulated (mineral-surfaced) flat roofing material that looks like a wide roll of asphalt shingles. May be installed in layers. Granules similar to asphalt shingles; check for bare spots. Seams are heat-welded, torch-applied, or cold-adhesive. Typical lifespan 10–20 years.' },
    { name: 'Wood Shake Roof', identify: 'Rough, split (not sawn) cedar or redwood shingles with a rustic, irregular appearance. More dimensional than wood shingles. Naturally gray with age unless treated. Look for moss/lichen growth, cracking, cupping, or curling. Typical lifespan 20–40 years. Requires more maintenance than asphalt.' },
    { name: 'Skylight', identify: 'A window in the roof plane. Fixed or operable. Curb-mounted (raised frame) or deck-mounted (flush to roof). Brands include VELUX and Fakro. Check the interior ceiling around the skylight for water stains (flashing failure is common). The condensation channel at the bottom should be clear.' },
    { name: 'Gutters (Aluminum)', identify: 'K-style (ogee profile) or half-round aluminum channels along the roof edge. Most common type — lightweight, rust-proof, paint or factory-painted. Seamed at corners and end caps; seamless gutters are rolled to length on-site. Look for separation at seams, sagging, or holes.' },
    { name: 'Gutters (Copper)', identify: 'Distinctive brown/bronze color that patinas to green over time. Premium option — soldered seams make them very durable. Often half-round profile. Look for green patina (natural, not a problem), separated soldered joints, or holes.' },
    { name: 'Gutter Guards / Covers', identify: 'Installed over or into the gutter to prevent debris from accumulating. Styles include micro-mesh (fine metal screen over the gutter), reverse curve (water clings over the lip), foam inserts, and brush inserts. Visible as a product covering the top of the gutter. Performance varies — some still require annual inspection and cleaning.' },
    { name: 'Chimney (Masonry)', identify: 'Brick or stone chimney extending through the roof. Has a chimney cap on top (metal cover protecting the flue opening). The flashing where the chimney meets the roof is a common leak point. Inside, the flue liner (clay tile or stainless steel) runs the full height. A chimney sweep can assess the interior.' },
    { name: 'Chimney (Metal / Prefab)', identify: 'A double or triple-wall metal pipe (usually 8"–12" diameter) extending through the roof with a metal chase (housing) around it. Common in newer homes with fireplaces or wood stoves. Has a spark arrestor cap. Look for rust on the cap, separation of chase sections, or damaged sealant at the roof penetration.' },
    { name: 'Ridge Vent', identify: 'A continuous ventilation strip running along the peak of the roof. May be a shingle-over style (nearly invisible, looks like a slightly raised ridge cap) or a plastic/aluminum vented cap. Allows hot air to escape from the attic along the full ridge length. Check that the ridge cap shingles aren\'t blocking the vent openings.' },
    { name: 'Roof / Box Vents', identify: 'Square or round plastic or metal vents placed in the roof field, typically near the ridge. Allow hot air to exit the attic. Look for cracked or missing dome covers and check inside the attic that none are blocked with insulation. Also check for proper flashing around the base.' },
    { name: 'Solar Panels (Roof-Mounted)', identify: 'Dark blue or black rectangular modules mounted above the roof surface on racking. Wire conduit runs from the panels to an inverter (usually in garage/utility room). The gap between panels and roof can trap debris. Check for debris accumulation, racking hardware condition, and wiring insulation at the roof penetrations.' },
    { name: 'Ice & Water Shield / Underlayment', identify: 'Not directly visible — it\'s installed under the shingles. You only learn about it during a re-roofing project. Ice & water shield is a self-adhering membrane at the eaves (bottom 3+ feet) and valleys. Standard underlayment (felt paper or synthetic) covers the rest of the deck. If you have the original roofing documents, they may specify what was installed.' }
  ],

  other: [
    { name: 'Garage Door (Single)', identify: 'A single-car garage door, typically 8–10 ft wide and 7–8 ft tall. Sectional doors have horizontal panels with hinges between them; one-piece tilt-up doors have a single panel. The brand label is usually on the back side of the bottom panel or on the horizontal track near the opener.' },
    { name: 'Garage Door (Double)', identify: 'A two-car garage door, typically 16–18 ft wide. Otherwise identical to a single door in construction and operation. Heavier and uses larger springs. The spring(s) are on a torsion bar above the door opening — there may be 2 torsion springs on a double door.' },
    { name: 'Garage Door Opener', identify: 'Mounted to the ceiling of the garage on a metal rail. Has a motor unit (the main box), a drive system (belt, chain, or screw), and a carriage that connects to the door. The model and serial number label is on the back or side of the motor unit. A button on the unit opens/closes the door.' },
    { name: 'Exterior Entry Door (Steel)', identify: 'A steel-skinned door with a foam insulating core — most common modern exterior door. Feels solid when knocked on (unlike hollow interior doors) but lighter than solid wood. Check the door edge: a sticker or brand stamp is often on the top or side of the door frame or the door itself.' },
    { name: 'Exterior Entry Door (Fiberglass)', identify: 'A fiberglass door that may mimic wood grain or have a smooth finish. Doesn\'t rust or warp. Brands like Therma-Tru and Plastpro are common. Usually found by reading the door label inside the hinge recess or on the door jamb.' },
    { name: 'Exterior Entry Door (Wood)', identify: 'A solid or engineered wood door — heavier than fiberglass or steel. Expands and contracts seasonally with humidity. Requires periodic painting or staining to protect from moisture. Look for peeling finish, checking (small surface cracks), or bottom rot.' },
    { name: 'Sliding Patio Door', identify: 'Glass door(s) that slide horizontally. One panel is fixed; one slides. The threshold at the bottom has a track. The rollers that allow the door to slide are at the bottom of the sliding panel — they wear over time. Brand labels are on the door frame or in the track.' },
    { name: 'French Door (Exterior)', identify: 'Two outswing or inswing doors that meet in the middle. Usually have large glass lites (panes). The locking mechanism meets at the center where the two doors come together (astragal). Brand is on the hinge side jamb or on the glass unit itself.' },
    { name: 'Windows (Double-Pane / Insulated)', identify: 'Most windows installed after 1990 have two panes of glass with an argon gas-filled gap between them. If you see condensation or fogginess between the panes (not on the interior or exterior surface), the seal has failed and the insulating gas has escaped — the window unit needs replacement.' },
    { name: 'Windows (Triple-Pane)', identify: 'Three panes of glass with two gas-filled gaps — maximum insulation, common in cold climates and high-performance homes. Heavier than double-pane. Check for the NFRC label on the glass edge showing U-factor and SHGC ratings.' },
    { name: 'Window (Single-Pane)', identify: 'Older homes may have single-pane glass — just one pane with no insulating gap. Significantly less efficient. You can feel significant cold radiating from them in winter. If you place your hand near the glass in winter and feel cold air, it\'s either single-pane or the double-pane seal has failed.' },
    { name: 'Deck (Wood / Pressure-Treated)', identify: 'Outdoor platform of pressure-treated lumber (green-tinted or brownish depending on treatment). Check for deck boards that are cracked, splintered, warping, or have fasteners popping up. More importantly, check the ledger board (where the deck attaches to the house) and the post bases (metal connectors at the bottom of posts) for rot and rust.' },
    { name: 'Deck (Composite)', identify: 'Deck boards made of wood fiber and plastic — does not require painting or staining. Brands include Trex, TimberTech, and Fiberon. Usually has a smooth or wood-grain embossed surface. Check for fading, mold/mildew in the grooves, and scratches. The substructure underneath is still typically pressure-treated wood.' },
    { name: 'Fence (Wood)', identify: 'Pressure-treated or cedar/redwood fence. Check the bottom of the fence boards and posts at ground level — these areas absorb moisture and are first to rot. Posts set directly in concrete can trap moisture; those with gravel bases or post supports last longer. Check for leaning posts and loose boards.' },
    { name: 'Fence (Vinyl / PVC)', identify: 'White or colored plastic fence that won\'t rot or require painting. Posts, rails, and pickets click or snap together. Check for fading (chalk residue when you rub it) and UV damage (brittle, cracking plastic). Some systems are hollow and can collect water inside that freezes and cracks the post.' },
    { name: 'Fence (Aluminum / Metal)', identify: 'Lightweight metal fence with vertical pickets — often resembles ornamental iron but much lighter. Powder-coated finish protects from rust. Check for scratches in the coating (rust starting point), loose pickets, and gate hardware.' },
    { name: 'Driveway (Concrete)', identify: 'Gray concrete slab, usually 4" thick for residential use. Check for cracks (especially wide ones or those that allow vertical movement between sections), spalling (surface flaking off), and joint sealant condition. Control joints (the shallow cuts across the driveway) need periodic sealant to prevent water intrusion.' },
    { name: 'Driveway (Asphalt)', identify: 'Black or dark gray material made of aggregate and bitumen (petroleum). Softer and more flexible than concrete. Should be sealed every 2–5 years to prevent drying and cracking. Check for alligator cracking (a mesh of small cracks indicating base failure), potholes, and edge deterioration.' },
    { name: 'Crawl Space Encapsulation', identify: 'A heavy plastic vapor barrier (6–20 mil) covering the ground and walls of the crawl space. A properly encapsulated crawl space has the barrier sealed to the walls and a dehumidifier maintaining low humidity. Look for tears in the barrier, standing water, and dehumidifier drainage.' },
    { name: 'Attic Insulation (Blown-In)', identify: 'Loose cellulose (gray, paper-based) or fiberglass (fluffy, light yellow/white) fill blown into the attic floor between joists. Depth indicates R-value — the DOE recommends R-38 to R-60 for most US climates (10–16" of blown cellulose or 16"+ of blown fiberglass). Check that insulation is not blocking soffit vents.' },
    { name: 'Attic Insulation (Batt)', identify: 'Pre-cut fiberglass or mineral wool batts placed between joists. Pink (Owens Corning), yellow (Johns Manville), or gray (Roxul/Rockwool) are common colors. Check that the vapor barrier (if faced batts) faces down (toward living space). Sagging, compression, or water staining indicates problems.' },
    { name: 'Foundation Waterproofing System', identify: 'Various systems exist: interior drainage (perforated pipe around the basement perimeter leading to a sump pump), exterior drainage (membrane applied to the outside of the foundation), or crack injection (polyurethane foam injected into cracks). Interior systems are visible as a channel or small gap where the wall meets the floor, sometimes covered with a plastic panel system.' }
  ]
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
  // Show setup wizard automatically for new users with no assets
  if (allAssets.length === 0) showIntake();
}

// ==============================================
// DATA LOADING
// ==============================================
async function loadDefaultTasks() {
  const { data } = await sb.from('default_tasks')
    .select('id, category, asset_type, name, interval_days, description, tips_parts, tips_tools, tips_how');
  defaultTasks = data || [];
}

// Maps equipment library names to the asset_type IDs used in default_tasks
const EQUIP_NAME_TO_ASSET_TYPE = {
  'Central Air Conditioner':           'central-ac',
  'Heat Pump (Outdoor Unit)':          'central-ac',
  'Air Handler / Fan Coil':            'central-ac',
  'Gas Furnace':                       'gas-furnace',
  'Electric Furnace':                  'electric-furnace',
  'Boiler (Hot Water)':                'boiler',
  'Boiler (Steam)':                    'boiler',
  'Mini-Split Outdoor Unit':           'mini-split',
  'Mini-Split Indoor Head Unit':       'mini-split',
  'Ductless Ceiling Cassette':         'mini-split',
  'Whole-House Fan':                   'whole-house-fan',
  'Attic Ventilator Fan':              'attic-vent',
  'Gas Water Heater (Tank)':           'tank-wh',
  'Electric Water Heater (Tank)':      'tank-wh',
  'Heat Pump Water Heater':            'tank-wh',
  'Tankless Water Heater (Gas)':       'tankless-wh',
  'Tankless Water Heater (Electric)':  'tankless-wh',
  'Water Softener':                    'water-softener',
  'Whole-House Water Filter':          'whole-house-filter',
  'Sump Pump':                         'sump-pump',
  'Battery Backup Sump Pump':          'sump-pump',
  'Irrigation / Sprinkler System':     'irrigation',
  'Backflow Preventer':                'irrigation',
  'Well Pump (Submersible)':           'well-system',
  'Well Pressure Tank':                'well-system',
  'Standby Generator':                 'standby-gen',
  'Portable Generator':                'portable-gen',
  'Solar Panel System':                'solar-panels',
  'Solar Inverter':                    'solar-panels',
  'EV Charger (Level 2)':              'ev-charger',
  'Electric Vehicle Charging (EVSE)':  'ev-charger',
  'Bathroom Exhaust Fan':              'exhaust-fans',
  'Refrigerator':                      'refrigerator',
  'Refrigerator (Second / Garage)':    'refrigerator',
  'Dishwasher':                        'dishwasher',
  'Gas Range / Oven':                  'range-gas',
  'Electric Range / Oven':             'range-electric',
  'Garbage Disposal':                  'disposal',
  'Washing Machine (Front-Load)':      'washer',
  'Washing Machine (Top-Load)':        'washer',
  'Gas Dryer':                         'dryer',
  'Electric Dryer':                    'dryer',
  'Toilet (Standard)':                 'toilets',
  'Toilet (Low-Flow / High-Efficiency)':'toilets',
  'Shower Valve / Cartridge':          'shower-valve',
};

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

// ==============================================
// TASKS PAGE
// ==============================================
function renderTasksPage() {
  // Populate asset dropdown
  const assetSel = document.getElementById('filter-asset');
  const currentVal = assetSel.value;
  assetSel.innerHTML = '<option value="">All assets</option>' +
    allAssets.map(a => `<option value="${a.id}" ${currentVal === a.id ? 'selected' : ''}>${a.name}</option>`).join('');

  applyTaskFilters();
}

function setFilter(type, btn) {
  document.querySelectorAll(`#filter-${type} .filter-chip`).forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  taskFilters[type] = btn.dataset.val;
  applyTaskFilters();
}

function applyTaskFilters() {
  // Read select values
  taskFilters.asset    = document.getElementById('filter-asset').value;
  taskFilters.category = document.getElementById('filter-category').value;
  taskFilters.sort     = document.getElementById('filter-sort').value;

  const now  = new Date();
  let tasks  = [...allTasks];

  // Timeline filter
  const tl = taskFilters.timeline;
  if (tl === 'initial') {
    tasks = tasks.filter(t => !t.last_completed_at);
  } else if (tl === 'overdue') {
    tasks = tasks.filter(t => t.last_completed_at && t.next_due_at && new Date(t.next_due_at) < now);
  } else if (tl !== 'all') {
    const days = parseInt(tl, 10);
    const cutoff = new Date(now); cutoff.setDate(cutoff.getDate() + days);
    tasks = tasks.filter(t => {
      if (!t.next_due_at) return false;
      const d = new Date(t.next_due_at);
      return d >= now && d <= cutoff;
    });
  }

  // Asset filter
  if (taskFilters.asset) {
    tasks = tasks.filter(t => t.asset_id === taskFilters.asset);
  }

  // Category filter — match via asset
  if (taskFilters.category) {
    const assetIds = new Set(allAssets.filter(a => a.category === taskFilters.category).map(a => a.id));
    tasks = tasks.filter(t => assetIds.has(t.asset_id));
  }

  // Sort
  tasks.sort((a, b) => {
    switch (taskFilters.sort) {
      case 'due_asc':
        return (a.next_due_at || '9999') < (b.next_due_at || '9999') ? -1 : 1;
      case 'due_desc':
        return (a.next_due_at || '') > (b.next_due_at || '') ? -1 : 1;
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'asset_asc': {
        const an = a.assets?.name || '';
        const bn = b.assets?.name || '';
        return an.localeCompare(bn);
      }
    }
    return 0;
  });

  // Render
  const count = document.getElementById('tasks-count');
  count.textContent = tasks.length === 1 ? '1 task' : `${tasks.length} tasks`;

  const list = document.getElementById('tasks-list');
  list.innerHTML = tasks.length
    ? tasks.map(t => taskItemHTML(t)).join('')
    : '<div class="empty-state"><i class="fa-solid fa-circle-check"></i><p>No tasks match these filters.</p></div>';
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
  document.getElementById('equip-picker-group').style.display = 'block';
  document.querySelectorAll('#category-chips .chip').forEach(c => {
    c.classList.toggle('active', c.dataset.cat === 'hvac');
  });
  ['asset-name','asset-brand','asset-model','asset-notes'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('asset-install-year').value  = '';
  document.getElementById('asset-install-month').value = '';
  renderEquipmentList('hvac');
  renderSuggestedTasks('hvac', null);
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
  document.getElementById('equip-picker-group').style.display = 'none';

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

function renderEquipmentList(cat) {
  const items = EQUIPMENT_LIBRARY[cat] || [];
  const list = document.getElementById('equip-list');
  const tip  = document.getElementById('equip-tip');
  if (!list) return;
  tip.style.display = 'none';
  tip.innerHTML = '';
  list.innerHTML = items.map(item => {
    const assetType = EQUIP_NAME_TO_ASSET_TYPE[item.name] || '';
    return `<button type="button" class="equip-item" onclick="selectEquipment(this, ${JSON.stringify(item.name)}, ${JSON.stringify(item.identify)}, ${JSON.stringify(assetType)})">${item.name}</button>`;
  }).join('');
}

function selectEquipment(btn, name, identifyText, assetType) {
  // Toggle active state
  const wasActive = btn.classList.contains('active');
  document.querySelectorAll('#equip-list .equip-item').forEach(b => b.classList.remove('active'));
  const tip = document.getElementById('equip-tip');
  if (wasActive) {
    tip.style.display = 'none';
    tip.innerHTML = '';
    renderSuggestedTasks(selectedCat, null);
    return;
  }
  btn.classList.add('active');
  // Pre-fill asset name if empty
  const nameInput = document.getElementById('asset-name');
  if (!nameInput.value.trim()) {
    nameInput.value = name;
  }
  // Show identification tip
  tip.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> <strong>How to identify:</strong> ${identifyText}`;
  tip.style.display = 'block';
  // Update suggested tasks for this specific equipment type
  renderSuggestedTasks(selectedCat, assetType || null);
}

function selectCategory(btn) {
  document.querySelectorAll('#category-chips .chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  selectedCat = btn.dataset.cat;
  renderEquipmentList(selectedCat);
  renderSuggestedTasks(selectedCat, null);
}

function renderSuggestedTasks(cat, assetType) {
  const tasks = assetType
    ? defaultTasks.filter(t => t.asset_type === assetType)
    : defaultTasks.filter(t => t.category === cat && !t.asset_type);
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
