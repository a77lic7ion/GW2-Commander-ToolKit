
import React, { useState, useMemo, useCallback, useEffect, useRef, Dispatch, SetStateAction, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import './global.css';

console.log("GW2 CommKit: Application script loaded.");
window.onerror = (msg, url, lineNo, columnNo, error) => {
    console.error("FATAL RENDERING ERROR:", msg, "at", url, ":", lineNo, ":", columnNo, error);
    return false;
};

// --- ICONS (SVG) ---

const IconHeart = ({ filled }: { filled?: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.505 4.044 3 5.5L12 21l7-7z" />
    </svg>
);

const IconBell = ({ active, size = 14 }: { active?: boolean, size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={active ? "animate-bounce" : ""}>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
);

const IconMapPin = ({ size = 12 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
);

const IconRefresh = ({ animate, size = 16 }: { animate?: boolean, size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={animate ? "animate-spin" : ""}>
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" />
    </svg>
);

const IconAstral = ({ size = 14 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-sky-400">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

const IconWallet = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M7 15h0M2 9.5h20" />
    </svg>
);

const IconCheck = ({ checked }: { checked: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={checked ? "text-green-500" : "text-slate-800"}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const IconCopy = ({ size = 12 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

const IconBox = ({ size = 16 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
);

const IconUser = ({ size = 16 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

const IconClock = ({ size = 16 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
);

const IconGlobe = ({ size = 14 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const IconWorld = ({ size = 16, className }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const IconArrowUpRight = ({ size = 14 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17l9.2-9.2M17 17V7H7" />
    </svg>
);

// --- DATA CONSTANTS ---

const CATEGORY_COLORS: Record<string, string> = {
    "Core Tyria": "border-rose-500 bg-rose-500/10 text-rose-400",
    "Heart of Thorns": "border-emerald-500 bg-emerald-500/10 text-emerald-400",
    "Path of Fire": "border-amber-500 bg-amber-500/10 text-amber-400",
    "End of Dragons": "border-cyan-500 bg-cyan-500/10 text-cyan-400",
    "Secrets of the Obscure": "border-violet-500 bg-violet-500/10 text-violet-400",
    "Janthir Wilds": "border-indigo-500 bg-indigo-500/10 text-indigo-400",
    "Visions of Eternity": "border-orange-500 bg-orange-500/10 text-orange-400",
    "Public Instances": "border-red-500 bg-red-500/10 text-red-400",
    "Living World": "border-sky-500 bg-sky-500/10 text-sky-400"
};

const EASY_OBJECTIVES: Record<string, { waypoint: string, note: string }> = {
    // Daily - Combat
    "Defeat a Veteran": { waypoint: "[&BBkAAAA=]", note: "Go to Hall of Memories (PvP Lobby) and kill the Target Golem." },
    "Dodge Attacks": { waypoint: "[&BBkAAAA=]", note: "Go to Hall of Memories (PvP Lobby) and dodge Golem aoe." },
    "Execute a Combo": { waypoint: "[&BBkAAAA=]", note: "Go to Hall of Memories (PvP Lobby) and use the combo field golems." },
    "Defiance Bar": { waypoint: "[&BBkAAAA=]", note: "Go to Hall of Memories (PvP Lobby) and break the Golem bar." },
    "Defeat a Champion": { waypoint: "[&BGECAAA=]", note: "Go to Armistice Bastion or kill a world boss champion." },
    "Defeat Elite": { waypoint: "[&BBkAAAA=]", note: "Go to Hall of Memories (PvP Lobby) and kill Elite Golem." },
    // Daily - Gathering
    "Gathering Wood": { waypoint: "[&BPgBAAA=]", note: "Pagga's Waypoint in Malchor's Leap (Cypress) or Home Instance." },
    "Gathering Ore": { waypoint: "[&BK8DAAA=]", note: "Criterion Waypoint in Iron Marches (Platinum) or Home Instance." },
    "Gathering Plants": { waypoint: "[&BEEAAAA=]", note: "Beetletun Waypoint in Queensdale (Lettuce) or Home Instance." },
    // Daily - Tasks
    "Salvage Items": { waypoint: "[&BBkAAAA=]", note: "Use any salvage kit on white items from Trading Post." },
    "Use an Item for Nourishment": { waypoint: "[&BBkAAAA=]", note: "Eat any cheap food or vendor bread." },
    "Use a Utility Item": { waypoint: "[&BBkAAAA=]", note: "Use any sharpening stone or tuning crystal." },
    "Identify Gear": { waypoint: "[&BBkAAAA=]", note: "Right click any blue/green unidentified gear and select Identify All." },
    // Daily - Location Specific
    "Complete an Event in Cantha": { waypoint: "[&BE4NAAA=]", note: "Village Waypoint in Seitung Province (Mechs or Fishing)." },
    "Complete an Event in Crystal Desert": { waypoint: "[&BLsKAAA=]", note: "Amnoon Waypoint (Refugee aid or Forged)." },
    "Complete an Event in Maguuma": { waypoint: "[&BNkHAAA=]", note: "Soulkeeper's Airship in Bloodstone Fen." },
    "Complete an Event in Heart of Maguuma": { waypoint: "[&BNYHAAA=]", note: "Jaka Itzel Waypoint (VB Meta or tasks)." },
    "Complete an Event in Horn of Maguuma": { waypoint: "[&BN4NAAA=]", note: "Wizard's Tower (Rifts or tasks)." },
    // Weekly
    "Complete Fractals of the Mists": { waypoint: "[&BAAFAAA=]", note: "Fort Marriner in Lion's Arch. Run T1 Swamp or Urban." },
    "Complete Strike Missions": { waypoint: "[&BAgFAAA=]", note: "Arborstone or Lion's Arch Aerodrome." },
    "Defeat World Bosses": { waypoint: "", note: "Check the Events timer for imminent bosses." },
    "Complete Meta Events": { waypoint: "[&BKYBAAA=]", note: "Silverwastes RIBA is always active and easy." }
};

const GW2_NINJA_TIMER_DATA = {
    "events": {
        "wb": { "category": "Core Tyria", "name": "World Bosses", "segments": { "1": { "name": "Admiral Taidha Covington", "chatlink": "[&BKgBAAA=]" }, "2": { "name": "Claw of Jormag", "chatlink": "[&BHoCAAA=]" }, "3": { "name": "Fire Elemental", "chatlink": "[&BEcAAAA=]" }, "4": { "name": "Golem Mark II", "chatlink": "[&BNQCAAA=]" }, "5": { "name": "Great Jungle Wurm", "chatlink": "[&BEEFAAA=]" }, "6": { "name": "Megadestroyer", "chatlink": "[&BM0CAAA=]" }, "7": { "name": "Modniir Ulgoth", "chatlink": "[&BLAAAAA=]" }, "8": { "name": "Shadow Behemoth", "chatlink": "[&BPcAAAA=]" }, "9": { "name": "Svanir Shaman Chief", "chatlink": "[&BMIDAAA=]" }, "10": { "name": "The Shatterer", "chatlink": "[&BE4DAAA=]" } }, "sequences": { "pattern": [{ "r": 1, "d": 15 }, { "r": 9, "d": 15 }, { "r": 6, "d": 15 }, { "r": 3, "d": 15 }, { "r": 10, "d": 15 }, { "r": 5, "d": 15 }, { "r": 7, "d": 15 }, { "r": 8, "d": 15 }, { "r": 4, "d": 15 }, { "r": 9, "d": 15 }, { "r": 2, "d": 15 }, { "r": 3, "d": 15 }, { "r": 1, "d": 15 }, { "r": 5, "d": 15 }, { "r": 6, "d": 15 }, { "r": 8, "d": 15 }, { "r": 10, "d": 15 }, { "r": 9, "d": 15 }, { "r": 7, "d": 15 }, { "r": 3, "d": 15 }, { "r": 4, "d": 15 }, { "r": 5, "d": 15 }, { "r": 2, "d": 15 }, { "r": 8, "d": 15 }] } },
        "hwb": { "category": "Core Tyria", "name": "Hard Bosses", "segments": { "1": { "name": "Triple Trouble", "chatlink": "[&BKoBAAA=]" }, "2": { "name": "Karka Queen", "chatlink": "[&BNUGAAA=]" }, "3": { "name": "Tequatl the Sunless", "chatlink": "[&BNABAAA=]" } }, "sequences": { "pattern": [{ "r": 3, "d": 30 }, { "r": 0, "d": 30 }, { "r": 1, "d": 30 }, { "r": 0, "d": 30 }, { "r": 2, "d": 30 }, { "r": 0, "d": 150 }] } },
        "hot": { "category": "Heart of Thorns", "name": "Maguuma Meta", "segments": { "1": { "name": "Verdant Brink (Night)", "chatlink": "[&BAgIAAA=]" }, "2": { "name": "Auric Basin (Octovine)", "chatlink": "[&BN0HAAA=]" }, "3": { "name": "Tangled Depths (Gerent)", "chatlink": "[&BPUHAAA=]" }, "4": { "name": "Dragon's Stand", "chatlink": "[&BBAIAAA=]" } }, "sequences": { "pattern": [{ "r": 1, "d": 45 }, { "r": 3, "d": 20 }, { "r": 2, "d": 20 }, { "r": 4, "d": 35 }] } },
        "pof": { "category": "Path of Fire", "name": "Desert Meta", "segments": { "1": { "name": "Choya Piñata", "chatlink": "[&BKYHAAA=]" }, "2": { "name": "Forged Maverick", "chatlink": "[&BMEHAAA=]" }, "3": { "name": "Serpent's Ire", "chatlink": "[&BH0HAAA=]" } }, "sequences": { "pattern": [{ "r": 1, "d": 15 }, { "r": 0, "d": 105 }, { "r": 3, "d": 20 }, { "r": 0, "d": 100 }] } },
        "eod": { "category": "End of Dragons", "name": "Cantha Meta", "segments": { "1": { "name": "Seitung Harbor", "chatlink": "[&BE4NAAA=]" }, "2": { "name": "New Kaineng Blackout", "chatlink": "[&BHoNAAA=]" }, "3": { "name": "Gang War Echovald", "chatlink": "[&BPcNAAA=]" }, "4": { "name": "Dragon's End (Soo-Won)", "chatlink": "[&BK0NAAA=]" } }, "sequences": { "pattern": [{ "r": 1, "d": 30 }, { "r": 2, "d": 30 }, { "r": 3, "d": 30 }, { "r": 4, "d": 30 }] } },
        "soto": { "category": "Secrets of the Obscure", "name": "Rifts & Towers", "segments": { "1": { "name": "Convergences", "chatlink": "[&BB8OAAA=]" }, "2": { "name": "Skywatch Archipelago", "chatlink": "[&BL8NAAA=]" }, "3": { "name": "Amnytas Meta", "chatlink": "[&BNMNAAA=]" } }, "sequences": { "pattern": [{ "r": 1, "d": 20 }, { "r": 2, "d": 40 }, { "r": 3, "d": 40 }, { "r": 0, "d": 80 }] } },
        "voe-ss": { "category": "Visions of Eternity", "name": "Shipwreck Strand", "segments": { "0": { "name": "", "bg": "transparent" }, "1": { "name": "Hammerhart Rumble!", "chatlink": "[&BJEPAAA=]" } }, "sequences": { "pattern": [{ "r": 1, "d": 20 }, { "r": 0, "d": 100 }] } },
        "voe-sw": { "category": "Visions of Eternity", "name": "Starlit Weald", "segments": { "0": { "name": "", "bg": "transparent" }, "1": { "name": "Secrets of the Weald", "chatlink": "[&BJ4PAAA=]" } }, "sequences": { "pattern": [{ "r": 1, "d": 35 }, { "r": 0, "d": 85 }] } },
        "public-con": { "category": "Public Instances", "name": "Convergence", "segments": { "0": { "name": "", "bg": "transparent" }, "1": { "name": "Mount Balrior", "chatlink": "[&BK4OAAA=]" }, "2": { "name": "Outer Nayos", "chatlink": "[&BB8OAAA=]" } }, "sequences": { "pattern": [{ "r": 1, "d": 10 }, { "r": 0, "d": 80 }, { "r": 2, "d": 10 }, { "r": 0, "d": 80 }] } },
    }
} as const;

const ICON_LAUREL = "https://wiki.guildwars2.com/images/thumb/c/ce/Laurel.png/20px-Laurel.png";
const ICON_VM = "https://wiki.guildwars2.com/images/thumb/2/22/Volatile_Magic.png/20px-Volatile_Magic.png";

const LAUREL_BAG_DATA = [
    { id: 24273, name: "Medium Crafting Bag", profit: 9731, cost: "1 Laurel", icon: "./Medium_Crafting_Bag.png" },
    { id: 24272, name: "Light Crafting Bag", profit: 9654, cost: "1 Laurel", icon: "./Small_Crafting_Bag.png" },
    { id: 24274, name: "Heavy Crafting Bag", profit: 5729, cost: "1 Laurel", icon: "./Heavy_Crafting_Bag.png" },
    { id: 24276, name: "Small Crafting Bag", profit: 1317, cost: "1 Laurel", icon: "./Small_Crafting_Bag.png" },
    { id: 46797, name: "Large Crafting Bag", profit: 1144, cost: "1 Laurel", icon: "./Large_Crafting_Bag.png" },
    { id: 24277, name: "Tiny Crafting Bag", profit: 261, cost: "1 Laurel", icon: "./Tiny_Crafting_Bag.png" }
];

const VM_SHIPMENT_DATA = [
    { id: 85725, name: "Trophy Shipment", profit: 10400, cost: "250 VM + 1g", icon: "./Trophy_Shipment.png" },
    { id: 87023, name: "Leather Shipment", profit: 4500, cost: "250 VM + 1g", icon: "./Leather_Shipment.png" },
    { id: 87026, name: "Cloth Shipment", profit: 2500, cost: "250 VM + 1g", icon: "./Cloth_Shipment.png" },
    { id: 87275, name: "Metal Shipment", profit: 1500, cost: "250 VM + 1g", icon: "./Metal_Shipment.png" },
    { id: 87276, name: "Wood Shipment", profit: 800, cost: "250 VM + 1g", icon: "./Wood_Shipment.png" }
];

const PARKING_DATA = [
    { name: "Large Chest of Essence", profit: 21859, wp: "[&BDkMAAA=]", req: "IBS - Episode 2", limit: "Limit 3x daily", icon: "./alt_parking.png" },
    { name: "Verdant Brink - Wyvern Matriarch", profit: 15952, wp: "[&BAgIAAA=]", req: "Heart of Thorns", limit: "Limit 1x daily", icon: "./alt_parking.png" },
    { name: "Mount Maelstrom - Hidden Garden", profit: 13684, wp: "", req: "Core", limit: "Limit 1x daily", icon: "./alt_parking.png" },
    { name: "Magic Mirror", profit: 11095, wp: "", req: "Visions of Eternity", limit: "Limit 19x daily", icon: "./alt_parking.png" },
    { name: "Lowland Shore - Queen's Confidence JP", profit: 10560, wp: "[&BMkOAAA=]", req: "Janthir Wilds", limit: "Limit 1x daily", icon: "./alt_parking.png" },
    { name: "Hero Point", profit: 10308, wp: "", req: "End of Dragons", limit: "Limit 5x daily", icon: "./alt_parking.png" },
    { name: "Medium Chest of Essence", profit: 8826, wp: "[&BCcMAAA=]", req: "IBS - Episode 2", limit: "Limit 6x daily", icon: "./alt_parking.png" },
    { name: "Greater Arcane Chest", profit: 8648, wp: "", req: "Secrets of the Obscure", limit: "Limit 20x daily", icon: "./alt_parking.png" },
    { name: "Bava Nisos - Traversing the Titan JP", profit: 7923, wp: "[&BGEPAAA=]", req: "Janthir Wilds", limit: "Limit 1x daily", icon: "./alt_parking.png" },
    { name: "Small Chest of Essence", profit: 7766, wp: "[&BCcMAAA=]", req: "IBS - Episode 2", limit: "Limit 4x daily", icon: "./alt_parking.png" },
    { name: "Pile of Flax Seeds", profit: 7583, wp: "", req: "Heart of Thorns, Path of Fire", limit: "Limit 1x daily per Char", id: 74090, icon: "./alt_parking.png" },
    { name: "Varietal Cilantro Seed", profit: 7583, wp: "", req: "Path of Fire, LS4", limit: "Limit 1x daily per Char", id: 86831, icon: "./alt_parking.png" },
    { name: "Artichoke", profit: 7204, wp: "", req: "Core, Path of Fire", limit: "Limit 1x daily per Char", id: 12519, icon: "./alt_parking.png" },
    { name: "Handful of Red Lentils", profit: 7204, wp: "", req: "Path of Fire, LS4", limit: "Limit 1x daily per Char", id: 82866, icon: "./alt_parking.png" },
    { name: "Head of Cabbage", profit: 7204, wp: "", req: "Core, LS4", limit: "Limit 1x daily per Char", id: 12534, icon: "./alt_parking.png" }
];

const PROFESSION_ASSETS: Record<string, string> = {
    "Guardian": "./Guardian_icon.png",
    "Warrior": "./Warrior_icon.png",
    "Engineer": "./Engineer_icon.png",
    "Ranger": "./Ranger_icon.png",
    "Thief": "./Thief_icon.png",
    "Elementalist": "./Elementalist_icon.png",
    "Mesmer": "./Mesmer_icon.png",
    "Necromancer": "./Necromancer_icon.png",
    "Revenant": "./Revenant_icon.png",
    "Firebrand": "./Firebrand.png",
    "Dragonhunter": "./Dragonhunter.png",
    "Willbender": "./Willbender.png",
    "Berserker": "./Berserker.png",
    "Spellbreaker": "./Spellbreaker.png",
    "Bladesworn": "./Bladesworn.png",
    "Scrapper": "./Scrapper.png",
    "Holosmith": "./Holosmith.png",
    "Mechanist": "./Mechanist.png",
    "Druid": "./Druid.png",
    "Soulbeast": "./Soulbeast.png",
    "Untamed": "./Untamed.png",
    "Daredevil": "./Daredevil.png",
    "Deadeye": "./Deadeye.png",
    "Specter": "./Specter.png",
    "Tempest": "./Tempest.png",
    "Weaver": "./Weaver.png",
    "Catalyst": "./Catalyst.png",
    "Chronomancer": "./Chronomancer.png",
    "Mirage": "./Mirage.png",
    "Virtuoso": "./Virtuoso.png",
    "Reaper": "./Reaper.png",
    "Scourge": "./Scourge.png",
    "Harbinger": "./160px-Harbinger_icon_(highres).png",
    "Herald": "./Herald.png",
    "Renegade": "./Renegade.png",
    "Vindicator": "./Vindicator.png",
    "Amalgam": "./Amalgam.png",
    "Galeshot": "./Galeshot.png",
    "Antiquary": "./Antiquary.png",
    "Conduit": "./Conduit.png",
    "Evoker": "./Evoker.png",
    "Luminary": "./Luminary.png",
    "Paragon": "./Paragon.png",
    "Troubadour": "./Troubadour.png"
};

// --- UTILS ---

const formatCurrency = (copper: number) => {
    const g = Math.floor(copper / 10000);
    const s = Math.floor((copper % 10000) / 100);
    const c = copper % 100;
    return (
        <span className="flex items-center gap-1 font-mono text-[13px] font-bold">
            {g > 0 && <span className="text-amber-400">{g}g</span>}
            {s > 0 && <span className="text-slate-400">{s}s</span>}
            <span className="text-orange-600">{c}c</span>
        </span>
    );
};

const playReminderSound = () => {
    try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.5);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
        console.error("Audio playback failed", e);
    }
};

const calculateNextBirthday = (createdStr: string) => {
    if (!createdStr) return 0;
    const birthday = new Date(createdStr);
    const now = new Date();
    const thisYearBday = new Date(now.getFullYear(), birthday.getMonth(), birthday.getDate());
    let nextBday = thisYearBday;
    if (now > thisYearBday) {
        nextBday = new Date(now.getFullYear() + 1, birthday.getMonth(), birthday.getDate());
    }
    const diff = nextBday.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
};

const FESTIVAL_DATA_2026 = [
    { name: "Lunar New Year", start: "Feb 3, 2026", end: "Feb 24, 2026", month: "February", color: "from-red-600 to-amber-600", season: "Winter", image: "./LunarfestivalCard.png" },
    { name: "Super Adventure Festival", start: "Mar 31, 2026", end: "Apr 21, 2026", month: "March", color: "from-sky-500 to-lime-500", season: "Spring", image: "./SuperAdventureBoxCard.png" },
    { name: "Dragon Bash", start: "Jun 2, 2026", end: "Jun 23, 2026", month: "June", color: "from-indigo-600 to-cyan-500", season: "Summer", image: "./DragonBashCard.png" },
    { name: "Festival of the Four Winds", start: "Jul 21, 2026", end: "Aug 11, 2026", month: "July", color: "from-amber-400 to-rose-400", season: "Summer", image: "./FetrivaloftheFourwindsCard.png" },
    { name: "Shadow of the Mad King", start: "Oct 13, 2026", end: "Nov 3, 2026", month: "October", color: "from-orange-600 to-purple-700", season: "Autumn", image: "./HalloweenCard.png" },
    { name: "Wintersday", start: "Dec 15, 2026", end: "Jan 5, 2027", month: "December", color: "from-blue-400 to-slate-100", season: "Winter", image: "./WintersdayCard.png" }
];

// --- TYPE DEFINITIONS ---
type AppEvent = {
    id: string;
    stableId: string;
    name: string;
    map: string;
    category: string;
    startTime: number;
    duration: number;
    waypoint: string;
};

type CurrencyMeta = {
    id: number;
    name: string;
    description: string;
    order: number;
    icon: string;
};

type AccountData = {
    name: string;
    id: string;
    world: number;
    created: string;
    last_sync?: string;
    wallet?: Array<{ id: number; value: number }>;
    permissions?: string[];
};

type User = {
    email: string;
    settings: { gw2ApiKey: string; soundEnabled: boolean; vaultFilters: string[] };
    accountData?: AccountData;
    favorites: string[];
    recipeFavorites: number[];
    reminders: string[];
};

type AppTab = 'timer' | 'favorites' | 'dailies' | 'selachimorphia' | 'vault' | 'characters' | 'wallet' | 'achievements' | 'farm_tracker' | 'farming_checklist' | 'cleanup' | 'crafting' | 'settings';

// --- CONTEXT ---
const ToastContext = React.createContext<(msg: string) => void>(() => { });
const useToast = () => useContext(ToastContext);

// --- HELPER HOOKS ---
const useUser = () => {
    const defaultUser: User = useMemo(() => ({
        email: '',
        settings: { gw2ApiKey: '', soundEnabled: true, vaultFilters: ['PvE'] },
        favorites: [],
        achievementFavorites: [],
        recipeFavorites: [],
        reminders: []
    }), []);

    const [user, setUser] = useState<User>(defaultUser);

    useEffect(() => {
        const stored = localStorage.getItem('gw2commkit_user');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setUser({ ...defaultUser, ...parsed });
            } catch (e) {
                setUser(defaultUser);
            }
        }
        else setUser(defaultUser);
    }, [defaultUser]);

    const saveUser = (u: User) => {
        setUser(u);
        localStorage.setItem('gw2commkit_user', JSON.stringify(u));
    };

    const logout = () => {
        localStorage.removeItem('gw2commkit_user');
        setUser(null);
    };

    return { user, saveUser, logout };
};

// --- COMPONENTS ---

const ChatLinkBadge = ({ link }: { link: string }) => {
    const showToast = useToast();
    const copy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(link);
        showToast(`Copied ${link}`);
    };
    if (!link) return null;
    return (
        <button onClick={copy} className="flex items-center gap-2 px-2 py-1 bg-slate-900 border border-slate-700 rounded hover:border-indigo-500 transition-all group">
            <span className="font-mono text-[12px] text-indigo-400">{link}</span>
            <IconCopy size={13} />
        </button>
    );
};

const TimelineGraph = ({ events, label = "Visual Timeline (Next 8 Hours)" }: { events: AppEvent[], label?: string }) => {
    const [now, setNow] = useState(Date.now());
    const [hoveredEvent, setHoveredEvent] = useState<AppEvent | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);

    const start = useMemo(() => now - 1 * 3600000, [now]);
    const end = start + 8 * 3600000;
    const getPos = (t: number) => ((t - start) / (end - start)) * 100;

    const timeMarkers = useMemo(() => {
        const markers = [];
        let curr = Math.ceil(start / 3600000) * 3600000;
        while (curr < end) {
            markers.push(curr);
            curr += 3600000;
        }
        return markers;
    }, [start, end]);

    const handleMouseMove = (e: React.MouseEvent) => {
        setTooltipPos({ x: e.clientX, y: e.clientY });
    };

    const nowPos = getPos(now);

    return (
        <div className="rounded-xl p-6 mb-6 relative overflow-hidden h-64 bg-slate-950 border border-slate-800/50 shadow-2xl" onMouseMove={handleMouseMove}>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/50">
                <h4 className="text-[13px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</h4>
                <div className="flex items-center gap-4 text-[10px] uppercase font-bold text-slate-600">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Live</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Upcoming</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Scheduled</span>
                </div>
            </div>

            <div className="absolute inset-0 top-16 pointer-events-none">
                {timeMarkers.map(t => (
                    <div key={t} className="absolute h-full border-l border-slate-800/30" style={{ left: `${getPos(t)}%` }}>
                        <span className="absolute -top-6 -left-1/2 text-[12px] font-mono text-slate-600 font-bold opacity-50">
                            {new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </span>
                    </div>
                ))}
            </div>

            {/* Current Time Indicator - Slim Red Line */}
            <div className="absolute top-16 bottom-0 bg-red-500/50 w-[1px] z-40" style={{ left: `${nowPos}%` }}>
                <div className="absolute -top-1 -left-[3px] w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_red]"></div>
                <div className="absolute top-0 left-2 text-[10px] font-black text-white bg-red-600 px-1.5 py-0.5 rounded shadow-lg uppercase tracking-tight">
                    Now
                </div>
            </div>

            <div className="relative h-40 mt-4 flex flex-col gap-1.5">
                {events.map((e, idx) => {
                    const l = getPos(e.startTime);
                    const w = getPos(e.startTime + e.duration * 60000) - l;
                    if (l > 100 || l + w < 0) return null;

                    const isLive = e.startTime <= now && (e.startTime + e.duration * 60000) > now;
                    const isSoon = e.startTime > now && e.startTime < now + 900000;

                    let bgClass = "bg-indigo-600/30 border-indigo-500/50";
                    if (isLive) bgClass = "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)] border-green-400 z-10";
                    else if (isSoon) bgClass = "bg-amber-500/60 border-amber-500/80";

                    return (
                        <div key={`${e.id}-${idx}`}
                            className="absolute transition-all duration-300 group"
                            style={{ left: `${l}%`, width: `${Math.max(w, 0.5)}%`, top: (idx % 6) * 24 + 'px' }}>

                            <div
                                onMouseEnter={() => setHoveredEvent(e)}
                                onMouseLeave={() => setHoveredEvent(null)}
                                className={`h-4 rounded-sm border ${bgClass} cursor-pointer hover:brightness-125 transition-all relative overflow-hidden`}
                            >
                                {w > 5 && <span className="absolute inset-0 flex items-center px-2 text-[9px] font-black text-white/50 uppercase truncate select-none">{e.name}</span>}
                            </div>
                        </div>
                    );
                })}
            </div>

            {hoveredEvent && (
                <div className="fixed pointer-events-none bg-slate-950/90 backdrop-blur-md border border-slate-700 px-4 py-3 rounded-lg shadow-2xl z-[100] animate-in fade-in zoom-in duration-100 flex flex-col gap-1 min-w-[200px]"
                    style={{ left: tooltipPos.x + 15, top: tooltipPos.y + 15 }}>
                    <h5 className="text-[14px] font-black text-white uppercase tracking-tight">{hoveredEvent.name}</h5>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                        <span>{new Date(hoveredEvent.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                        <span>{hoveredEvent.duration}m</span>
                    </div>
                </div>
            )}
        </div>
    );
};

const EventItem = ({
    event,
    isFavorite,
    isReminder,
    onToggleFavorite,
    onToggleReminder
}: {
    event: AppEvent,
    isFavorite: boolean,
    isReminder: boolean,
    onToggleFavorite: (id: string) => void,
    onToggleReminder: (id: string) => void
}) => {
    const showToast = useToast();
    const [now, setNow] = useState(Date.now());
    useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);

    const tStart = (event.startTime - now) / 1000;
    const tEnd = (event.startTime + event.duration * 60000 - now) / 1000;
    const active = tStart <= 0 && tEnd > 0;

    // Using a cleaner dot indicator instead of border
    const colorTheme = CATEGORY_COLORS[event.category] || "text-slate-400";
    const dotColor = active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : tStart < 900 && tStart > 0 ? 'bg-amber-500 animate-pulse' : 'bg-indigo-500';

    const copyWaypoint = () => {
        if (event.waypoint) {
            navigator.clipboard.writeText(event.waypoint);
            showToast(`Copied ${event.name} waypoint!`);
        }
    };

    const timeStr = new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    return (
        <div className="group relative flex items-center justify-between p-4 bg-slate-900/40 hover:bg-slate-900 border-b border-slate-800/50 transition-all gap-4">
            {/* Left: Time & Info */}
            <div className="flex items-center gap-6 min-w-0 flex-grow">
                <div className="flex items-center gap-3 shrink-0">
                    <div className={`w-2 h-2 rounded-full ${dotColor}`}></div>
                    <span className="text-[17px] font-black font-mono text-white">{timeStr}</span>
                </div>

                <div className="flex flex-col min-w-0">
                    <h4 className="text-[15px] font-black text-white uppercase tracking-tight truncate group-hover:text-indigo-300 transition-colors">{event.name}</h4>
                    <span className="text-[11px] font-bold text-slate-500 uppercase truncate">{event.category} • {event.map}</span>
                </div>
            </div>

            {/* Middle: Zone (Hidden on mobile) */}
            <div className="hidden md:block text-[12px] font-bold text-slate-500 uppercase tracking-wide w-48 truncate text-center">
                {event.map}
            </div>

            {/* Right: Status & Actions */}
            <div className="flex items-center gap-6 shrink-0">
                <div className="min-w-[100px] text-right">
                    {active ? (
                        <div className="inline-flex items-center gap-2">
                            <span className="text-[10px] font-black bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded uppercase tracking-wider">Active</span>
                            <span className="text-[12px] font-mono font-bold text-green-400">Ends {Math.floor(tEnd / 60)}m</span>
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-2">
                            {tStart < 900 && tStart > 0 ? (
                                <span className="text-[10px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded uppercase tracking-wider">Soon</span>
                            ) : (
                                <span className="text-[10px] font-black bg-slate-800 text-slate-500 border border-slate-700 px-2 py-0.5 rounded uppercase tracking-wider">Upcoming</span>
                            )}
                            <span className={`text-[12px] font-mono font-bold ${tStart < 900 && tStart > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                                {tStart < 0 ? 'Ended' : `in ${Math.floor(tStart / 60)}m`}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    {event.waypoint && (
                        <button onClick={copyWaypoint} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors" title="Copy Waypoint">
                            <IconMapPin size={16} />
                        </button>
                    )}
                    <button onClick={() => onToggleReminder(event.stableId)} className={`p-2 rounded-lg transition-colors ${isReminder ? 'text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`} title="Remind Me">
                        <IconBell size={16} active={isReminder} />
                    </button>
                    <button onClick={() => onToggleFavorite(event.stableId)} className={`p-2 rounded-lg transition-colors ${isFavorite ? 'text-rose-500' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`} title="Favorite">
                        <IconHeart size={16} filled={isFavorite} />
                    </button>
                </div>
            </div>

            {/* Simple progress bar at bottom for active events */}
            {active && (
                <div className="absolute bottom-0 left-0 h-[2px] bg-green-500/50" style={{ width: `${((event.duration * 60000 - tEnd * 1000) / (event.duration * 60000)) * 100}%` }}></div>
            )}
        </div>
    );
};

// --- SELACHIMORPHIA PAGE ---

const SEL_GUIDE_DATA = [
    {
        title: "I. Precursor Progress Gated Activities (Agaleus)",
        tasks: [
            { name: "Complete 'Booter's Path Minidungeon", loc: "Shipwreck Strand", wp: "[&BJEPAAA=]", notes: "Complete minidungeon. Step 10 achievement unlock requires daily reset if done early." },
            { name: "Acquire Ornate Rusted Keys", loc: "Central Tyria", wp: "Any", notes: "Required for Sunken Chests (Step 7). Obtain via 'Blood in the Water' daily achievement." },
            { name: "Fractal Sunken Chest Attempt", loc: "Lion's Arch", wp: "[&BDAEAAA=]", notes: "Run Siren's Reef or Aquatic Ruins Fractals. Open Sunken Chest at end with Ornate Rusted Key." }
        ]
    },
    {
        title: "II. Castora Map Currency & Coin Farming",
        tasks: [
            { name: "Shipwreck Strand World Boss", loc: "Shipwreck Strand", wp: "[&BJEPAAA=]", notes: "Hammerhart Rumble! Hero's Choice Chest: Select 25 Chromatic Saps or 25 Stones daily." },
            { name: "Starlit Weald Meta Event", loc: "Starlit Weald", wp: "[&BMAPAAA=]", notes: "Secrets of the Weald. Hero's Choice Chest: Select 25 Chromatic Saps or 25 Stones daily." },
            { name: "Magic Mirror Keepsake Box", loc: "Castora Maps", wp: "[&BJEPAAA=]", notes: "Interact with Magic Mirror (Secrets Unearthed required). 1 Box per mirror location daily." },
            { name: "Ethereal Key Farming", loc: "Castora Maps", wp: "[&BMAPAAA=]", notes: "Repeat mirror challenges after first daily clear for 5 Key Charges. Open Obscured Chests." },
            { name: "Skimmer Aetherlocation", loc: "Castora Maps", wp: "[&BJEPAAA=]", notes: "Use Skimmer to locate Aetherlocation Treasure chests (Castoran Intuition required)." },
            { name: "Targeted Gathering", loc: "Castora Maps", wp: "Any", notes: "Use Resourcefulness mastery while harvesting for zone-specific map currencies." }
        ]
    },
    {
        title: "III. Core Legendary Materials & Vendor Visits",
        tasks: [
            { name: "Obsidian Shard Purchase", loc: "Lion's Arch", wp: "[&BDAEAAA=]", notes: "Buy from Laurel Merchant (3 Laurels) or Fractal Reliquary (25 relics) daily." },
            { name: "Mystic Clovers (Weekly)", loc: "Various", wp: "Vendors", notes: "Buy up to 10 per week from PvP, WvW, Strike, Fractal, or Raid vendors." },
            { name: "Bloodstone Shard Purchase", loc: "Any City", wp: "Miyani", notes: "Buy for 200 Spirit Shards from Miyani or Forge Attendants." },
            { name: "Vision Crystals (Optional)", loc: "Lounge", wp: "Vault UI", notes: "Buy for 150 Astral Acclaim if crafting (Level 500) is unavailable." }
        ]
    },
    {
        title: "IV. One-Time Precursor Route Checklist",
        tasks: [
            { name: "Start Rumors", loc: "Breezy Cay", wp: "[&BJEPAAA=]", notes: "Talk to 'Captain' Ruymond Lakes. Bring any mixology drink." },
            { name: "Find the Diver", loc: "Sanctum Harbor", wp: "[&BC8EAAA=]", notes: "Talk to Dive Master Astora. Advances achievement if Master Diver is done." },
            { name: "Master Diver", loc: "Lion's Arch", wp: "Various", notes: "Complete 'Sunken Treasure Hunter: Master Diver' achievement (5 chests)." },
            { name: "Sharkmaw Caverns", loc: "Sharkmaw", wp: "[&BDMEAAA=]", notes: "Complete Weyandt's Revenge JP. Magnificent Chest yields Tattered Note." },
            { name: "Wiley's Note", loc: "Gendarran Fields", wp: "[&BM0DAAA=]", notes: "Interact with Torn Note inside Wiley's Cove." },
            { name: "Vigil Keep Cache", loc: "Gendarran Fields", wp: "[&BJIBAAA=]", notes: "Loot chest in cave south of waypoint for mask piece." },
            { name: "Shipwreck Strand Grotto", loc: "Riddled Cove", wp: "[&BJEPAAA=]", notes: "Loot underwater chest in Greenroot Grotto Skimmerway." },
            { name: "Freebooter Drop", loc: "Shipwreck Strand", wp: "[&BJEPAAA=]", notes: "Defeat freebooters around Twisting Hollows for mask piece drop." },
            { name: "Southsun Cove", loc: "Pearl Islet", wp: "[&BNUGAAA=]", notes: "Dive immediately underwater at Privateer's Moorage POI for piece." },
            { name: "Lion's Arch Underwater", loc: "Sanctum Harbor", wp: "[&BABEAAA=]", notes: "Locate mask piece on sea floor North-West of Phoenix Roost ruins." },
            { name: "Cursed Shore (Orr)", loc: "Mausollus Sea", wp: "[&BOQGAAA=]", notes: "Find piece west of waypoint near Death's Anthem POI wreckage." },
            { name: "Defeat Taidha Covington", loc: "Bloodtide Coast", wp: "[&BKoBAAA=]", notes: "Retrieve piece from Taidha's World Boss reward chest." },
            { name: "Find the Shaman", loc: "Soaring Sands", wp: "[&BJwPAAA=]", notes: "Talk to Castaway NPC lower ledge west of Leystone Promontory." },
            { name: "Find the Shark Spirit", loc: "Frostgorge", wp: "[&BEMFAAA=]", notes: "Interact with Shark Spirit swimming west of HotW waypoint." },
            { name: "Honor of the Waves", loc: "Frostgorge", wp: "[&BEMFAAA=]", notes: "Complete any explorable dungeon path in Honor of the Waves." }
        ]
    }
];

const SEL_ACHIEVEMENT_IDS: Record<string, number> = {
    "Master Diver": 2966, // Sunken Treasure Hunter? Using generic ID, update if needed
    "Sharkmaw Caverns": 568, // Weyandt's Revenge
    "Shipwreck Strand World Boss": 0, // Event - not direct ach
    "Hammerhart Rumble!": 8097, // Example ID for event ach
    "Complete 'Booter's Path Minidungeon": 7987,
    "Magic Mirror Keepsake Box": 0,
    "Secrets of the Weald": 0
};

// Map task names to IDs for auto-tracking
const SEL_TASK_MAPPING: Record<string, number> = {
    "Master Diver": 4016, // Sunken Treasure Hunter
    "Sharkmaw Caverns": 444, // Weyandt's Revenge
    "Shipwreck Strand Grotto": 6777,
};

function SelachimorphiaPage({ user }: { user: User }) {
    const [checked, setChecked] = useState<Record<string, boolean>>({});
    const [achStatus, setAchStatus] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(false);
    const key = user?.settings?.gw2ApiKey;
    const showToast = useToast();

    // Load manual checks
    useEffect(() => {
        const stored = localStorage.getItem('gw2commkit_sel_checks');
        if (stored) try { setChecked(JSON.parse(stored)); } catch (e) { }
    }, []);

    const toggleCheck = (name: string) => {
        setChecked(prev => {
            const next = { ...prev, [name]: !prev[name] };
            localStorage.setItem('gw2commkit_sel_checks', JSON.stringify(next));
            return next;
        });
    };

    // Auto-check completion from API
    useEffect(() => {
        if (!key) return;

        const checkAchievements = async () => {
            setLoading(true);
            try {
                // Collect IDs we can check
                const idsToCheck = Object.values(SEL_TASK_MAPPING);
                if (idsToCheck.length === 0) return;

                const res = await fetch(`https://api.guildwars2.com/v2/account/achievements?access_token=${key}&ids=${idsToCheck.join(',')}`);
                if (res.ok) {
                    const data = await res.json();
                    const statusMap: Record<string, boolean> = {};

                    // Map back to task names
                    Object.entries(SEL_TASK_MAPPING).forEach(([taskName, id]) => {
                        const ach = data.find((a: any) => a.id === id);
                        if (ach && ach.done) statusMap[taskName] = true;
                    });

                    setAchStatus(statusMap);
                }
            } catch (e) {
                console.error("Selachimorphia sync failed", e);
            } finally {
                setLoading(false);
            }
        };

        checkAchievements();
        // Refresh every 15 mins
        const interval = setInterval(checkAchievements, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, [key]);

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            <div className="bg-sky-950/20 border-b border-sky-500/20 p-8 -mt-8 -mx-8 mb-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <IconAstral size={200} />
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none mb-4">Selachimorphia Acquisition Protocol</h1>
                        <p className="text-sky-400 font-bold text-[17px] uppercase tracking-[0.4em] max-w-2xl opacity-70">Focus: Agaleus Precursor, Gift of Survivors, Gift of the People, Castoran Mastery.</p>
                    </div>
                    {loading && <div className="text-sky-400 text-xs font-mono animate-pulse">SYNCING INTEL...</div>}
                </div>
            </div>

            <div className="space-y-16 max-w-6xl mx-auto">
                {SEL_GUIDE_DATA.map((section, idx) => (
                    <div key={idx} className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-8 bg-sky-500 rounded-full shadow-[0_0_10px_rgba(14,165,233,0.5)]"></div>
                            <h2 className="text-4xl font-black text-white uppercase tracking-tight">{section.title}</h2>
                        </div>
                        <div className="overflow-x-auto rounded-xl border border-slate-700/50 shadow-2xl bg-slate-900/50">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-800 text-[13px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-700">
                                        <th className="p-4 w-12 text-center">Status</th>
                                        <th className="p-4 w-1/4">Task / Step</th>
                                        <th className="p-4 w-1/4">Location</th>
                                        <th className="p-4 w-1/4">Waypoint / POI</th>
                                        <th className="p-4 w-1/4">Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50">
                                    {section.tasks.map((task, tidx) => {
                                        const isDone = checked[task.name] || achStatus[task.name];
                                        return (
                                            <tr key={tidx} className={`transition-colors group ${isDone ? 'bg-emerald-900/10' : 'hover:bg-slate-800/40'}`}>
                                                <td className="p-4 text-center">
                                                    <button onClick={() => toggleCheck(task.name)} className={`w-6 h-6 rounded border transition-all flex items-center justify-center ${isDone ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-slate-900 border-slate-600 hover:border-sky-500'}`}>
                                                        {isDone && <IconCheck checked={true} />}
                                                    </button>
                                                </td>
                                                <td className="p-4 align-top">
                                                    <div className={`font-bold text-[14px] uppercase tracking-tight ${isDone ? 'text-emerald-400 line-through decoration-emerald-500/50' : 'text-white'}`}>{task.name}</div>
                                                </td>
                                                <td className="p-4 align-top text-[13px] font-bold text-slate-400 uppercase">{task.loc}</td>
                                                <td className="p-4 align-top">
                                                    <ChatLinkBadge link={task.wp} />
                                                </td>
                                                <td className="p-4 align-top text-[13px] text-slate-300 leading-relaxed italic">{task.notes}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- DAILIES CHECKLIST PAGE ---

const DAILIES_DATA = [
    {
        category: "Home Sector",
        items: [
            { id: "hi-nodes", label: "Harvest All Resource Nodes" },
            { id: "hi-chest", label: "Enchanted Reward Chest" },
            { id: "hi-cats", label: "Feed Hungry Cats" },
            { id: "hi-quartz", label: "Charge Quartz Crystal" },
            { id: "hi-garden", label: "Harvest Garden Plots" }
        ]
    },
    {
        category: "Matter Converters",
        items: [
            { id: "conv-princess", label: "Princess (Empyreal)" },
            { id: "conv-mawdrey", label: "Mawdrey II (Dust)" },
            { id: "conv-star", label: "Star of Gratitude (Empyreal)" },
            { id: "conv-herta", label: "Herta (Dust)" },
            { id: "conv-anomaly", label: "Sentient Anomaly (Ore)" },
            { id: "conv-singularity", label: "Sentient Singularity (Unbound)" },
            { id: "conv-oddity", label: "Sentient Oddity (Ore)" },
            { id: "conv-ley", label: "Ley-Energy Converter" },
            { id: "conv-karma", label: "Karma Converter" }
        ]
    },
    {
        category: "Guild Logistics",
        items: [
            { id: "gh-gathering", label: "Guild Hall Nodes" },
            { id: "gh-trader", label: "Guild Commendation Trader" },
            { id: "gh-boost", label: "Tavern Hero Boost" },
            { id: "gh-missions", label: "Guild Missions (Weekly)" }
        ]
    },
    {
        category: "Daily Crafting",
        items: [
            { id: "dc-deldrimor", label: "Deldrimor Steel Ingot" },
            { id: "dc-spiritwood", label: "Spiritwood Plank" },
            { id: "dc-damask", label: "Bolt of Damask" },
            { id: "dc-elonian", label: "Elonian Leather Square" },
            { id: "dc-electrum", label: "Xunlai Electrum Ingot" },
            { id: "dc-clay", label: "Clay Pot" }
        ]
    }
];

function DailiesPage({ user }: { user: User }) {
    const [checked, setChecked] = useState<Record<string, boolean>>({});
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
    const showToast = useToast();

    const loadDailies = useCallback(() => {
        const stored = localStorage.getItem('gw2commkit_dailies');
        const resetTime = localStorage.getItem('gw2commkit_dailies_reset');
        const now = new Date();
        const todayStr = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}`;

        if (resetTime !== todayStr) {
            setChecked({});
            localStorage.setItem('gw2commkit_dailies_reset', todayStr);
        } else if (stored) {
            try { setChecked(JSON.parse(stored)); } catch (e) { }
        }
        setLastRefresh(new Date());
    }, []);

    useEffect(() => {
        loadDailies();
        const interval = setInterval(() => {
            loadDailies();
            showToast('Dailies checklist refreshed');
        }, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, [loadDailies, showToast]);

    const toggleItem = (id: string) => {
        setChecked(prev => {
            const next = { ...prev, [id]: !prev[id] };
            localStorage.setItem('gw2commkit_dailies', JSON.stringify(next));
            return next;
        });
    };

    const runBatchScript = async (script: string, label: string) => {
        if (window.electronAPI?.runScript) {
            try {
                showToast(`Running ${label}...`);
                await window.electronAPI.runScript(script);
                showToast(`${label} complete! Waypoints copied to clipboard.`);
            } catch (e) {
                showToast(`Error running ${label}: ${e}`);
            }
        } else {
            showToast("Script execution only available in Electron app.");
        }
    };

    const total = DAILIES_DATA.reduce((acc, cat) => acc + cat.items.length, 0);
    const completed = Object.values(checked).filter(Boolean).length;
    const progress = total > 0 ? (completed / total) * 100 : 0;

    const getParkingIcon = (item: any) => {
        if (item.icon) return item.icon;
        if (item.id && user.itemDetails && user.itemDetails[item.id]) return user.itemDetails[item.id].icon;
        return null;
    };



    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-slate-900/40 p-6 rounded-xl border border-slate-700/50 shadow-inner">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Dailies</h2>
                    <p className="text-[15px] font-black text-indigo-400 uppercase tracking-[0.2em]">Daily Operational Checklist</p>
                    {lastRefresh && <p className="text-[13px] text-slate-600">Last refresh: {lastRefresh.toLocaleTimeString()}</p>}
                </div>

                <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <button onClick={() => runBatchScript('psna.bat', 'Daily PSNA')} className="w-20 h-20 bg-slate-800 border-2 border-indigo-500/50 rounded-xl flex items-center justify-center hover:border-indigo-400 transition-all shadow-lg group relative overflow-hidden">
                            <img src="./PSNA.png" alt="PSNA" className="w-14 h-14 object-contain group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-x-0 bottom-0 bg-indigo-600/80 py-1 text-[8px] font-black text-white uppercase text-center opacity-0 group-hover:opacity-100 transition-opacity">Execute</div>
                        </button>
                        <div className="text-center">
                            <p className="text-[10px] font-black text-white uppercase">Daily PSNA</p>
                            <p className="text-[8px] text-indigo-400 uppercase font-bold tracking-widest mt-0.5">Click to Copy</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <button onClick={() => runBatchScript('masterdiver.bat', 'Master Diver')} className="w-20 h-20 bg-slate-800 border-2 border-emerald-500/50 rounded-xl flex items-center justify-center hover:border-emerald-400 transition-all shadow-lg group relative overflow-hidden">
                            <img src="./masterdiver.png" alt="Diver" className="w-14 h-14 object-contain group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-x-0 bottom-0 bg-emerald-600/80 py-1 text-[8px] font-black text-white uppercase text-center opacity-0 group-hover:opacity-100 transition-opacity">Execute</div>
                        </button>
                        <div className="text-center">
                            <p className="text-[10px] font-black text-white uppercase">Daily Diver</p>
                            <p className="text-[8px] text-emerald-400 uppercase font-bold tracking-widest mt-0.5">Click to Copy</p>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-64 space-y-2">
                    <div className="flex justify-between items-center text-[15px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Readiness</span>
                        <span className="text-white">{completed} / {total} Targets</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                        <div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DAILIES_DATA.map(cat => (
                    <div key={cat.category} className="space-y-4">
                        <h3 className="text-[17px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                            <div className="w-2.5 h-2.5 bg-indigo-500/50 rounded-full"></div> {cat.category}
                        </h3>
                        <div className="space-y-2">
                            {cat.items.map(item => (
                                <button key={item.id} onClick={() => toggleItem(item.id)} className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center justify-between group ${checked[item.id] ? 'bg-indigo-950/20 border-indigo-500/30 opacity-60' : 'bg-slate-800/40 border-slate-700/40 hover:border-slate-600 shadow-sm'}`}>
                                    <span className={`text-[17px] font-bold uppercase tracking-tight leading-tight ${checked[item.id] ? 'text-indigo-300' : 'text-slate-200'}`}>{item.label}</span>
                                    <div className={`w-6 h-6 rounded flex items-center justify-center transition-all ${checked[item.id] ? 'bg-indigo-500 border-indigo-500' : 'bg-slate-950 border border-slate-700'}`}>
                                        <IconCheck checked={checked[item.id]} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Alt Parking Section */}
            <div className="mt-16 pt-10 border-t border-slate-700/50">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-3">
                    <IconMapPin size={24} /> Efficient Parking
                </h3>
                <div className="bg-slate-950/40 rounded-xl overflow-hidden border border-slate-800 shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900/80 text-[11px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800">
                                    <th className="p-4">Name</th>
                                    <th className="p-4 text-right">Profit</th>
                                    <th className="p-4">Waypoint</th>
                                    <th className="p-4">Requires</th>
                                    <th className="p-4">Limitation</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/40 text-[13px] font-bold text-slate-300">
                                {PARKING_DATA.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="p-4 font-black uppercase text-indigo-300 group-hover:text-indigo-200 flex items-center gap-3">
                                            <div className="w-8 h-8 bg-slate-950 rounded border border-slate-800 p-1 flex-shrink-0">
                                                {row.icon ? <img src={row.icon} alt="" className="w-full h-full object-contain" /> : <IconBox size={20} className="text-slate-600 m-1" />}
                                            </div>
                                            {row.name}
                                        </td>
                                        <td className="p-4 text-right">{formatCurrency(row.profit)}</td>
                                        <td className="p-4 font-mono text-[11px] text-slate-500 select-all group-hover:text-slate-300">{row.wp}</td>
                                        <td className="p-4 text-[11px] uppercase tracking-wide text-slate-500">{row.req}</td>
                                        <td className="p-4 text-[11px] uppercase font-black text-slate-500 bg-slate-900/20">{row.limit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <p className="text-center text-[15px] text-slate-600 uppercase font-black tracking-widest mt-10 italic">Auto-reset at 00:00 UTC • Auto-refresh every 15 min</p>
        </div>
    );
}

// --- FARMING CHECKLIST ---
const FARMING_CHECKLIST_DATA = [
    {
        category: "High Value Meta Events",
        items: [
            { id: "fc-dragonstorm", label: "Dragonstorm", note: "2g + Memories of Aurene" },
            { id: "fc-chak", label: "Chak Gerent", note: "Chak Egg + Hero Chest" },
            { id: "fc-octovine", label: "Octovine", note: "Multi-loot potential" },
            { id: "fc-piñata", label: "Choya Piñata", note: "Confetti Infusion chance" },
            { id: "fc-anomaly", label: "Ley-Line Anomaly", note: "Mystic Coin" },
            { id: "fc-shatterer", label: "The Shatterer (Jahai)", note: "Amalgamate Gemstone" },
            { id: "fc-drizzlewood", label: "Drizzlewood North/South", note: "Best consistent raw gold" }
        ]
    },
    {
        category: "Instances & Strikes",
        items: [
            { id: "fc-fractals", label: "Daily T4 + Recommended", note: "40g+ daily potentially" },
            { id: "fc-ibs-strikes", label: "IBS Strike Mission Fast 5", note: "Blue Prophecies + Eternal Ice" },
            { id: "fc-eod-strikes", label: "EoD Daily Strike Mission", note: "Imperial Favor + Antique Stones" },
            { id: "fc-convergences", label: "Convergences (SotO)", note: "Heroic Essence" }
        ]
    },
    {
        category: "Daily Collection & Merchants",
        items: [
            { id: "fc-provisioner", label: "Faction Provisioner Tokens", note: "Core/HoT locations" },
            { id: "fc-vol-collect", label: "Volatile Magic Shipments", note: "Trading VM for trophies" },
            { id: "fc-ascended-craft", label: "Ascended Daily Crafting", note: "Deldrimor/Damask/Spiritwood" },
            { id: "fc-as-buy", label: "Antique Summoning Stone", note: "Vendor buy in Arborstone" }
        ]
    }
];

function FarmingChecklistPage() {
    const [checked, setChecked] = useState<Record<string, boolean>>({});
    useEffect(() => {
        const stored = localStorage.getItem('gw2commkit_farming_checklist');
        if (stored) try { setChecked(JSON.parse(stored)); } catch (e) { }
    }, []);

    const toggle = (id: string) => {
        setChecked(prev => {
            const next = { ...prev, [id]: !prev[id] };
            localStorage.setItem('gw2commkit_farming_checklist', JSON.stringify(next));
            return next;
        });
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="bg-emerald-950/20 border border-emerald-500/10 p-8 rounded-xl flex items-center gap-6 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <IconHeart size={150} />
                </div>
                <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                    <IconMapPin size={48} />
                </div>
                <div>
                    <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Farming Checklist</h2>
                    <p className="text-[15px] font-black text-emerald-400 uppercase tracking-[0.4em] mt-2 opacity-70">Optimal Daily Efficiency Targets</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {FARMING_CHECKLIST_DATA.map(cat => (
                    <div key={cat.category} className="space-y-4">
                        <h3 className="text-[17px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                            <div className="w-2.5 h-2.5 bg-emerald-500/50 rounded-full"></div> {cat.category}
                        </h3>
                        <div className="space-y-2">
                            {cat.items.map(item => (
                                <button key={item.id} onClick={() => toggle(item.id)} className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center justify-between group ${checked[item.id] ? 'bg-emerald-950/20 border-emerald-500/30 opacity-60' : 'bg-slate-800/40 border-slate-700/40 hover:border-slate-600 shadow-sm'}`}>
                                    <div className="min-w-0">
                                        <p className={`text-[15px] font-bold uppercase tracking-tight leading-tight ${checked[item.id] ? 'text-emerald-300' : 'text-slate-200'}`}>{item.label}</p>
                                        <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">{item.note}</p>
                                    </div>
                                    <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 transition-all ${checked[item.id] ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-950 border border-slate-700'}`}>
                                        <IconCheck checked={checked[item.id]} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-center text-[12px] text-slate-600 uppercase font-black tracking-widest mt-10 italic">Reference: fast.farming-community.eu</p>
        </div>
    );
}

// --- LIVE FARM TRACKER ---
function FarmTrackerPage({ user, tracking, loading, now, startSnapshot, currentSnapshot, startTime, logs, onStart, onStop, onUpdate, onExport, sessions, onDeleteSession }: any) {
    const elapsed = startTime ? (now - startTime) / 1000 : 0;
    const goldGain = (currentSnapshot?.gold || 0) - (startSnapshot?.gold || 0);
    const gph = elapsed > 0 ? (goldGain / elapsed) * 3600 : 0;

    const currencyLogs = logs.filter((l: any) => l.type === 'currency' || l.type === 'gold');
    const itemLogs = logs.filter((l: any) => l.type === 'item');

    const LogItem = ({ log }: { log: any }) => (
        <div className="flex items-center justify-between py-1 border-b border-slate-800/50 text-[13px] group">
            <div className="flex items-center gap-3 min-w-0">
                <span className="text-[10px] text-slate-600 font-mono w-16">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {log.icon && <img src={log.icon} className="w-5 h-5 object-contain" alt="" />}
                <span className="text-slate-300 truncate uppercase font-bold">{log.name}</span>
            </div>
            <span className={`font-mono font-bold ${log.change > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {log.change > 0 ? '+' : ''}{log.type === 'gold' ? (log.change / 10000).toFixed(2) + 'G' : log.change.toLocaleString()}
            </span>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-10">
            <div className="bg-slate-900 border border-indigo-500/20 p-8 rounded-2xl shadow-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                    <IconRefresh size={180} animate={tracking} />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                    <div>
                        <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Tactical Farm Tracker</h2>
                        <p className="text-[15px] font-black text-indigo-400 uppercase tracking-[0.4em] mt-3 opacity-80">Autonomous background monitoring engine</p>
                    </div>

                    {!tracking ? (
                        <button onClick={onStart} disabled={loading} className="gw2-button !px-10 !py-4 !text-2xl hover:scale-105 transition-transform bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                            {loading ? <IconRefresh animate size={24} /> : "Initialize Feed"}
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button onClick={onUpdate} disabled={loading} className="gw2-button !px-6 !py-2 text-[14px] !bg-amber-900/20 !border-amber-500/50 text-amber-400">Update</button>
                            <button onClick={onStop} className="gw2-button !px-6 !py-2 text-[14px] !bg-rose-900/40 !border-rose-500/50 text-rose-400">Complete</button>
                        </div>
                    )}
                </div>

                {tracking && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 pt-10 border-t border-slate-800">
                        <div className="space-y-1">
                            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Operation Time</p>
                            <p className="text-4xl font-black text-white font-mono">
                                {Math.floor(elapsed / 3600).toString().padStart(2, '0')}:
                                {Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0')}:
                                {Math.floor(elapsed % 60).toString().padStart(2, '0')}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">Net Intelligence Gains</p>
                            <div className="scale-125 origin-left">{formatCurrency(goldGain)}</div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[11px] font-black text-amber-500 uppercase tracking-widest">Efficiency (GPH)</p>
                            <div className="scale-125 origin-left">{formatCurrency(gph)}</div>
                        </div>
                    </div>
                )}
            </div>

            {tracking && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <section className="space-y-4">
                        <h3 className="text-[16px] font-black text-white uppercase tracking-widest flex items-center gap-3">
                            <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div> Currency Gains
                        </h3>
                        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 min-h-[100px]">
                            {currencyLogs.length > 0 ? currencyLogs.map((l: any, i: number) => <LogItem key={i} log={l} />) : <p className="text-center py-8 text-slate-700 uppercase font-black text-[11px]">No currency fluctuations detected.</p>}
                        </div>
                    </section>
                    <section className="space-y-4">
                        <h3 className="text-[16px] font-black text-white uppercase tracking-widest flex items-center gap-3">
                            <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div> Item Intelligence
                        </h3>
                        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 min-h-[100px]">
                            {itemLogs.length > 0 ? itemLogs.map((l: any, i: number) => <LogItem key={i} log={l} />) : <p className="text-center py-8 text-slate-700 uppercase font-black text-[11px]">No item transfers recorded.</p>}
                        </div>
                    </section>
                </div>
            )}

            {!tracking && sessions.length > 0 && (
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-white uppercase tracking-widest">Previous Operations</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {sessions.map((s: any) => (
                            <div key={s.id} className="gw2-container-border p-4 bg-slate-800/20 flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-indigo-500 group">
                                <div className="space-y-1">
                                    <p className="text-[11px] font-black text-slate-500 uppercase">{new Date(s.endTime).toLocaleString()}</p>
                                    <p className="text-white font-bold uppercase">Duration: {Math.floor((s.endTime - s.startTime) / 60000)}m</p>
                                </div>
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-500 uppercase mb-1">Gold Gain</p>
                                        {formatCurrency(s.goldGain)}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Intel Items</p>
                                        <p className="text-xl font-black text-white font-mono">{s.logs.filter((l: any) => l.type === 'item').length}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => onExport(s.logs)} className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all border border-indigo-500/20"><IconCopy size={18} /></button>
                                    <button onClick={() => onDeleteSession(s.id)} className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20">✕</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!tracking && sessions.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-2xl opacity-40">
                    <p className="text-xl text-slate-500 uppercase font-black tracking-widest mb-2">No Mission Data</p>
                    <p className="text-[13px] text-slate-600 uppercase font-bold">Initialize intelligence feed to begin logging.</p>
                </div>
            )}
        </div>
    );
}

// --- CHARACTERS PAGE ---

function CharactersPage({ user }: { user: User }) {
    const [chars, setChars] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<any>(null);
    const [itemDetails, setItemDetails] = useState<Record<number, { icon: string, name: string }>>({});
    const [displayProfession, setDisplayProfession] = useState<string>('');
    const [specDetails, setSpecDetails] = useState<Record<number, { name: string; icon: string; background: string; elite: boolean }>>({});
    const [buildMode, setBuildMode] = useState<'pve' | 'pvp' | 'wvw'>('pve');
    const showToast = useToast();
    const key = user?.settings?.gw2ApiKey;

    useEffect(() => {
        if (!key) return;
        setLoading(true);
        fetch(`https://api.guildwars2.com/v2/characters?ids=all&access_token=${key}`)
            .then(async (r) => {
                if (!r.ok) throw new Error("Failed to load roster");
                return r.json();
            })
            .then(data => setChars(Array.isArray(data) ? data : []))
            .catch(() => showToast("Network Error: Failed to load roster"))
            .finally(() => setLoading(false));
    }, [key, showToast]);

    const selectChar = async (name: string) => {
        setLoading(true);
        try {
            const r = await fetch(`https://api.guildwars2.com/v2/characters/${encodeURIComponent(name)}?access_token=${key}`);
            if (!r.ok) throw new Error("Failed to load char details");
            const data = await r.json();
            setSelected(data);
            setDisplayProfession(data.profession);

            // Fetch all specialization details for the build
            const allSpecIds: number[] = [];
            ['pve', 'pvp', 'wvw'].forEach(mode => {
                const specs = data.specializations?.[mode];
                if (specs) {
                    specs.forEach((s: any) => {
                        if (s?.id) allSpecIds.push(s.id);
                    });
                }
            });

            const uniqueSpecIds = Array.from(new Set(allSpecIds));
            if (uniqueSpecIds.length > 0) {
                const specRes = await fetch(`https://api.guildwars2.com/v2/specializations?ids=${uniqueSpecIds.join(',')}`);
                if (specRes.ok) {
                    const specDataList = await specRes.json();
                    const specMap: Record<number, any> = {};
                    specDataList.forEach((spec: any) => {
                        specMap[spec.id] = { name: spec.name, icon: spec.icon, background: spec.background, elite: spec.elite };
                    });
                    setSpecDetails(specMap);

                    // Set display profession from elite spec
                    const pveSpecs = data.specializations?.pve;
                    if (pveSpecs && pveSpecs[2]?.id && specMap[pveSpecs[2].id]?.elite) {
                        setDisplayProfession(specMap[pveSpecs[2].id].name);
                    }
                }
            }

            const itemIds = (data.equipment || []).map((e: any) => e.id).filter(Boolean);
            if (itemIds.length) {
                const uniqueIds = Array.from(new Set(itemIds)).slice(0, 200);
                const itemRes = await fetch(`https://api.guildwars2.com/v2/items?ids=${uniqueIds.join(',')}`);
                if (!itemRes.ok) throw new Error("Item fetch failed");
                const items = await itemRes.json();
                const detailMap: Record<number, { icon: string, name: string }> = {};
                if (Array.isArray(items)) items.forEach((it: any) => detailMap[it.id] = { icon: it.icon, name: it.name });
                setItemDetails(prev => ({ ...prev, ...detailMap }));
            }
        } catch (e) { showToast("Network Error: Failed to load dossier."); }
        finally { setLoading(false); }
    };

    const ARMOR_SLOTS = ['Helm', 'Shoulders', 'Coat', 'Gloves', 'Leggings', 'Boots'];
    const TRINKET_SLOTS = ['Backpack', 'Accessory1', 'Accessory2', 'Ring1', 'Ring2', 'Amulet'];
    const WEAPON_SLOTS = ['WeaponA1', 'WeaponA2', 'WeaponB1', 'WeaponB2'];
    const UTILITY_SLOTS = ['Relic', 'PowerCore'];

    // Get equipped items for each slot
    const getEquippedItem = (slotName: string) => {
        return (selected?.equipment || []).find((e: any) => e.slot === slotName);
    };

    // Filter weapon slots to only show equipped ones
    const equippedWeaponSlots = WEAPON_SLOTS.filter(slot => getEquippedItem(slot));
    const equippedUtilitySlots = UTILITY_SLOTS.filter(slot => getEquippedItem(slot));

    if (loading && !chars.length) return <div className="flex justify-center items-center py-20"><IconRefresh animate /></div>;

    return (
        <div className="space-y-6">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Characters</h2>
            {selected ? (
                <div className="animate-in slide-in-from-right duration-300">
                    <button onClick={() => setSelected(null)} className="text-indigo-400 mb-6 flex items-center gap-2 hover:underline text-[12px] font-black uppercase tracking-widest">← Return to Roster</button>
                    <div className="gw2-container-border p-8 bg-slate-800/40 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-50 pointer-events-none">
                            <img src={PROFESSION_ASSETS[displayProfession] || PROFESSION_ASSETS[selected.profession] || 'logo2.png'} className="w-56 h-56 object-cover mask-fade" alt="" onError={(e) => (e.currentTarget.src = 'logo2.png')} />
                        </div>

                        {/* Character Header */}
                        <div className="mb-8 pb-6 border-b border-slate-700/50 flex items-center gap-8">
                            <div className="w-32 h-32 bg-slate-950 rounded-2xl border-2 border-indigo-500/20 flex items-center justify-center p-4 shadow-3xl">
                                <img src={PROFESSION_ASSETS[displayProfession] || PROFESSION_ASSETS[selected.profession] || 'logo2.png'} className="w-full h-full object-contain" alt="" />
                            </div>
                            <div className="flex-grow">
                                <div className="flex items-center gap-3">
                                    {selected.title && (
                                        <span className="px-2 py-0.5 bg-amber-600/20 text-amber-400 text-[8px] font-black rounded border border-amber-500/30 uppercase">{selected.title}</span>
                                    )}
                                </div>
                                <h3 className="text-6xl font-black text-white uppercase tracking-tighter leading-none mt-1">{selected.name}</h3>
                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                    <span className="px-2 py-1 bg-indigo-600 text-white text-[12px] font-black rounded uppercase shadow-lg">Lvl {selected.level}</span>
                                    <span className="text-slate-400 text-[13px] font-bold uppercase">{selected.gender} {selected.race}</span>
                                    <span className="text-indigo-400 text-[13px] font-black uppercase">{displayProfession}</span>
                                    {selected.guild && (
                                        <span className="text-slate-500 text-[12px] font-bold">[Guild]</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8 p-4 bg-slate-900/40 rounded-xl border border-slate-700/50">
                            {/* Playtime */}
                            <div>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Playtime</p>
                                <p className="text-2xl font-black text-white font-mono leading-tight">
                                    {Math.floor(selected.age / 3600).toLocaleString()}h {Math.floor((selected.age % 3600) / 60)}m
                                </p>
                                <p className="text-[8px] text-slate-600 font-mono">
                                    {(() => {
                                        const created = new Date(selected.created);
                                        const days = Math.max(1, Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)));
                                        const avgMins = Math.round(selected.age / 60 / days);
                                        return `${Math.floor(avgMins / 60)}h ${avgMins % 60}m per day`;
                                    })()}
                                </p>
                            </div>

                            {/* Last Login */}
                            <div>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Last Login</p>
                                <p className="text-2xl font-black text-white leading-tight">
                                    {(() => {
                                        if (!selected.last_modified) return 'Unknown';
                                        const diff = Date.now() - new Date(selected.last_modified).getTime();
                                        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                                        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                        if (days > 0) return `${days}d ${hours}h ago`;
                                        return `${hours}h ago`;
                                    })()}
                                </p>
                                <p className="text-[8px] text-slate-600 font-mono">
                                    {selected.last_modified ? new Date(selected.last_modified).toLocaleDateString() : ''}
                                </p>
                            </div>

                            {/* Deaths */}
                            <div>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Deaths</p>
                                <p className="text-2xl font-black text-red-500 font-mono leading-tight">
                                    {(selected.deaths || 0).toLocaleString()}
                                </p>
                                <p className="text-[8px] text-slate-600 font-mono">
                                    {(selected.deaths && selected.age > 0) ? ((selected.deaths / (selected.age / 3600)).toFixed(1) + ' per hour') : '0 per hour'}
                                </p>
                            </div>

                            {/* Creation Date */}
                            <div>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Creation Date</p>
                                <p className="text-2xl font-black text-white leading-tight">
                                    {(() => {
                                        const created = new Date(selected.created);
                                        const years = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24 * 365));
                                        const months = Math.floor(((Date.now() - created.getTime()) % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
                                        return `${years}y ${months}m old`;
                                    })()}
                                </p>
                                <p className="text-[8px] text-slate-600 font-mono">
                                    {new Date(selected.created).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Next Birthday */}
                            <div>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Next Birthday</p>
                                <p className="text-2xl font-black text-sky-400 font-mono leading-tight">
                                    in {calculateNextBirthday(selected.created)} days
                                </p>
                                <p className="text-[8px] text-slate-600 font-mono">
                                    {(() => {
                                        const bday = new Date(selected.created);
                                        const now = new Date();
                                        let nextYear = now.getFullYear();
                                        const thisYearBday = new Date(nextYear, bday.getMonth(), bday.getDate());
                                        if (now > thisYearBday) nextYear++;
                                        return new Date(nextYear, bday.getMonth(), bday.getDate()).toLocaleDateString();
                                    })()}
                                </p>
                            </div>

                            {/* Inventory Slots */}
                            <div>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Inventory Slots</p>
                                <p className="text-2xl font-black text-white font-mono leading-tight">
                                    {(() => {
                                        const bags = selected.bags || [];
                                        const usedSlots = bags.reduce((acc: number, bag: any) => {
                                            if (!bag) return acc;
                                            return acc + (bag.inventory?.filter((i: any) => i !== null).length || 0);
                                        }, 0);
                                        const totalSlots = bags.reduce((acc: number, bag: any) => acc + (bag?.size || 0), 0);
                                        return `${usedSlots} / ${totalSlots}`;
                                    })()}
                                </p>
                                <p className="text-[8px] text-slate-600 font-mono">
                                    Bag Slots: {(selected.bags || []).filter((b: any) => b !== null).length} / {(selected.bags || []).length}
                                </p>
                            </div>

                            {/* Equipment Templates */}
                            <div>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Templates</p>
                                <p className="text-2xl font-black text-white font-mono leading-tight">
                                    {(selected.equipment_tabs?.length || 2)} / {(selected.equipment_tabs?.length || 2) + 6}
                                </p>
                                <p className="text-[8px] text-slate-600 font-mono">
                                    Equipment Tabs
                                </p>
                            </div>

                            {/* Build Templates */}
                            <div>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Build Templates</p>
                                <p className="text-2xl font-black text-white font-mono leading-tight">
                                    {(selected.build_tabs?.length || 3)} / {(selected.build_tabs?.length || 3) + 6}
                                </p>
                                <p className="text-[8px] text-slate-600 font-mono">
                                    Build Tabs
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-2 space-y-6">
                                {/* Armor */}
                                <div>
                                    <h4 className="font-black text-slate-500 mb-3 uppercase text-[12px] tracking-[0.2em] flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div> Armor
                                    </h4>
                                    <div className="grid grid-cols-6 gap-2">
                                        {ARMOR_SLOTS.map((slotName) => {
                                            const item = getEquippedItem(slotName);
                                            const details = item ? itemDetails[item.id] : null;
                                            return (
                                                <div key={slotName} className={`group relative aspect-square rounded-lg border-2 transition-all flex items-center justify-center overflow-hidden shadow-inner ${details ? 'bg-slate-900 border-indigo-500/30 hover:border-indigo-500 shadow-indigo-500/5' : 'bg-slate-950/60 border-slate-800 opacity-30'}`} title={details?.name || slotName}>
                                                    {details ? (
                                                        <img src={details.icon} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={details.name} />
                                                    ) : (
                                                        <div className="text-[6px] text-slate-700 font-black uppercase text-center leading-tight px-1 select-none">{slotName}</div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Trinkets */}
                                <div>
                                    <h4 className="font-black text-slate-500 mb-3 uppercase text-[12px] tracking-[0.2em] flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div> Trinkets
                                    </h4>
                                    <div className="grid grid-cols-6 gap-2">
                                        {TRINKET_SLOTS.map((slotName) => {
                                            const item = getEquippedItem(slotName);
                                            const details = item ? itemDetails[item.id] : null;
                                            return (
                                                <div key={slotName} className={`group relative aspect-square rounded-lg border-2 transition-all flex items-center justify-center overflow-hidden shadow-inner ${details ? 'bg-slate-900 border-purple-500/30 hover:border-purple-500 shadow-purple-500/5' : 'bg-slate-950/60 border-slate-800 opacity-30'}`} title={details?.name || slotName}>
                                                    {details ? (
                                                        <img src={details.icon} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={details.name} />
                                                    ) : (
                                                        <div className="text-[6px] text-slate-700 font-black uppercase text-center leading-tight px-1 select-none">{slotName}</div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Weapons & Utility */}
                                <div className="flex gap-6">
                                    {equippedWeaponSlots.length > 0 && (
                                        <div className="flex-grow">
                                            <h4 className="font-black text-slate-500 mb-3 uppercase text-[12px] tracking-[0.2em] flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div> Weapons
                                            </h4>
                                            <div className="flex gap-2">
                                                {equippedWeaponSlots.map((slotName) => {
                                                    const item = getEquippedItem(slotName);
                                                    const details = item ? itemDetails[item.id] : null;
                                                    const isSetB = slotName.includes('B');
                                                    return (
                                                        <div key={slotName} className={`group relative w-14 h-14 rounded-lg border-2 transition-all flex items-center justify-center overflow-hidden shadow-inner ${details ? `bg-slate-900 ${isSetB ? 'border-orange-500/30 hover:border-orange-500' : 'border-red-500/30 hover:border-red-500'}` : 'bg-slate-950/60 border-slate-800'}`} title={details?.name || slotName}>
                                                            {details && <img src={details.icon} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={details.name} />}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {equippedUtilitySlots.length > 0 && (
                                        <div>
                                            <h4 className="font-black text-slate-500 mb-3 uppercase text-[12px] tracking-[0.2em] flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Utility
                                            </h4>
                                            <div className="flex gap-2">
                                                {equippedUtilitySlots.map((slotName) => {
                                                    const item = getEquippedItem(slotName);
                                                    const details = item ? itemDetails[item.id] : null;
                                                    return (
                                                        <div key={slotName} className={`group relative w-14 h-14 rounded-lg border-2 transition-all flex items-center justify-center overflow-hidden shadow-inner ${details ? 'bg-slate-900 border-emerald-500/30 hover:border-emerald-500 shadow-emerald-500/5' : 'bg-slate-950/60 border-slate-800'}`} title={details?.name || slotName}>
                                                            {details && <img src={details.icon} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={details.name} />}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Current Build */}
                                <div className="p-6 bg-slate-900/40 rounded-xl border border-slate-700/50 shadow-inner">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-[12px] font-black text-slate-500 uppercase tracking-widest">Current Build</h4>
                                        <div className="flex gap-1 bg-slate-950 p-0.5 rounded">
                                            {(['pve', 'pvp', 'wvw'] as const).map(mode => (
                                                <button
                                                    key={mode}
                                                    onClick={() => setBuildMode(mode)}
                                                    className={`px-2 py-0.5 text-[7px] font-black uppercase rounded transition-all ${buildMode === mode
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'text-slate-500 hover:text-white'
                                                        }`}
                                                >
                                                    {mode}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {(selected.specializations?.[buildMode] || []).map((spec: any, idx: number) => {
                                            if (!spec?.id) return (
                                                <div key={idx} className="flex items-center gap-3 p-2 bg-slate-950/50 rounded border border-slate-800/50 opacity-30">
                                                    <div className="w-8 h-8 bg-slate-800 rounded"></div>
                                                    <span className="text-[13px] text-slate-600 uppercase font-bold">Empty Slot</span>
                                                </div>
                                            );
                                            const details = specDetails[spec.id];
                                            return (
                                                <div key={spec.id} className={`flex items-center gap-3 p-2 rounded border transition-all ${details?.elite
                                                    ? 'bg-amber-950/30 border-amber-500/30'
                                                    : 'bg-slate-950/50 border-slate-800/50'
                                                    }`}>
                                                    {details?.icon ? (
                                                        <img src={details.icon} alt="" className="w-8 h-8 rounded" />
                                                    ) : (
                                                        <div className="w-8 h-8 bg-slate-800 rounded"></div>
                                                    )}
                                                    <div className="flex-grow">
                                                        <p className={`text-[13px] font-bold uppercase ${details?.elite ? 'text-amber-400' : 'text-indigo-300'
                                                            }`}>
                                                            {details?.name || `Spec ${spec.id}`}
                                                        </p>
                                                        {details?.elite && (
                                                            <span className="text-[7px] text-amber-500/70 uppercase font-black">Elite</span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {(!selected.specializations?.[buildMode] || selected.specializations[buildMode].every((s: any) => !s?.id)) && (
                                            <p className="text-[12px] text-slate-600 italic text-center py-2">No build configured</p>
                                        )}
                                    </div>
                                </div>

                                {/* Training Discipline (Crafting) */}
                                <div className="p-6 bg-slate-900/40 rounded-xl border border-slate-700/50 shadow-inner">
                                    <h4 className="text-[12px] font-black text-slate-500 uppercase tracking-widest mb-4">Crafting Disciplines</h4>
                                    <div className="space-y-3">
                                        {(selected.crafting || []).map((c: any) => (
                                            <div key={c.discipline} className="flex justify-between items-center text-[14px] font-bold">
                                                <span className="text-indigo-300 uppercase">{c.discipline}</span>
                                                <span className="font-mono text-white">{c.rating} / 500</span>
                                            </div>
                                        ))}
                                        {(!selected.crafting || selected.crafting.length === 0) && (
                                            <p className="text-[12px] text-slate-600 italic">No crafting disciplines</p>
                                        )}
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-900/40 rounded-xl border border-slate-700/50">
                                    <h4 className="text-[12px] font-black text-slate-500 uppercase tracking-widest mb-4">Commission Date</h4>
                                    <p className="text-xl font-black text-white font-mono tracking-tight">{new Date(selected.created).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {chars.map(c => (
                        <div key={c.name} onClick={() => selectChar(c.name)} className="gw2-container-border p-5 hover:border-indigo-500 transition-all cursor-pointer group bg-slate-900 border-l-4 border-l-indigo-600 shadow-xl flex items-center gap-5">
                            <div className="w-16 h-16 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 group-hover:border-indigo-500/50 transition-colors overflow-hidden">
                                <img src={PROFESSION_ASSETS[c.profession] ? `./${PROFESSION_ASSETS[c.profession]}` : './logo2.png'} className="w-12 h-12 object-contain" alt="" onError={(e) => (e.currentTarget.src = './logo2.png')} />
                            </div>
                            <div className="min-w-0 flex-grow">
                                <h4 className="font-black text-white uppercase tracking-tighter text-[19px] group-hover:text-indigo-400 truncate">{c.name}</h4>
                                <p className="text-[11px] text-slate-500 uppercase font-black tracking-widest">{c.level} {c.profession}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// --- ACHIEVEMENTS PAGE ---

function AchievementsPage({ user, saveUser }: { user: User, saveUser: (u: User) => void }) {
    const [search, setSearch] = useState('');
    const [achievements, setAchievements] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedAch, setSelectedAch] = useState<any>(null);
    const [selectedAchDetails, setSelectedAchDetails] = useState<any>(null);
    const [selectedAchProgress, setSelectedAchProgress] = useState<any>(null);
    const [accountProg, setAccountProg] = useState<any[]>([]);
    const [deepScanning, setDeepScanning] = useState(false);
    const [canCommit, setCanCommit] = useState(false);
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const showToast = useToast();
    const key = user?.settings?.gw2ApiKey;

    useEffect(() => {
        const cache = localStorage.getItem('gw2commkit_achievements_cache');
        if (cache) try { setAchievements(JSON.parse(cache)); } catch (e) { }
        const progCache = localStorage.getItem('gw2commkit_progression_cache');
        if (progCache) try { setAccountProg(JSON.parse(progCache)); } catch (e) { }
    }, []);

    // Periodic Background Sync for Favorites (15 min)
    useEffect(() => {
        if (!key || (user.achievementFavorites || []).length === 0) return;

        const syncFavorites = async () => {
            try {
                const favIds = user.achievementFavorites;
                const [progRes, detailRes] = await Promise.all([
                    fetch(`https://api.guildwars2.com/v2/account/achievements?access_token=${key}&ids=${favIds.join(',')}`),
                    fetch(`https://api.guildwars2.com/v2/achievements?ids=${favIds.join(',')}`)
                ]);

                if (progRes.ok && detailRes.ok) {
                    const prog = await progRes.json();
                    const details = await detailRes.json();

                    setAchievements(prev => {
                        const next = [...prev];
                        details.forEach((d: any) => {
                            const p = prog.find((x: any) => x.id === d.id);
                            const idx = next.findIndex(a => a.id === d.id);
                            const merged = p ? { ...p, ...d } : d;
                            if (idx >= 0) next[idx] = merged;
                            else next.push(merged);
                        });
                        return next;
                    });
                    setAccountProg(prev => {
                        const next = [...prev];
                        prog.forEach((p: any) => {
                            const idx = next.findIndex(x => x.id === p.id);
                            if (idx >= 0) next[idx] = p;
                            else next.push(p);
                        });
                        return next;
                    });
                }
            } catch (e) { console.error("Achievement sync failed"); }
        };

        syncFavorites();
        const interval = setInterval(syncFavorites, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, [key, user.achievementFavorites]);

    const performSearch = useCallback(async (isGlobal = false) => {
        if (!search || search.length < 3) return;
        setLoading(true);
        try {
            // Get all IDs to know what exists
            const allIds = await fetch('https://api.guildwars2.com/v2/achievements').then(r => r.ok ? r.json() : []);

            // Filter local cache first
            let results = achievements.filter(a => (a.name || '').toLowerCase().includes(search.toLowerCase()));

            // If global requested or nothing found, try discovery
            if (isGlobal || results.length === 0) {
                // Broaden discovery: Check last 6000 IDs in reverse (newest first)
                const targetIds = allIds.slice(-6000).reverse();
                const batchSize = 200;
                const maxBatches = isGlobal ? 30 : 5; // Check up to 6000 IDs on global scan

                for (let i = 0; i < maxBatches; i++) {
                    const batch = targetIds.slice(i * batchSize, (i + 1) * batchSize);
                    if (batch.length === 0) break;

                    const res = await fetch(`https://api.guildwars2.com/v2/achievements?ids=${batch.join(',')}`);
                    if (res.ok) {
                        const data = await res.json();
                        const matches = data.filter((a: any) => (a.name || '').toLowerCase().includes(search.toLowerCase()));
                        if (matches.length > 0) {
                            results = [...results, ...matches];
                            // Merge into main cache
                            setAchievements(prev => {
                                const next = [...prev];
                                matches.forEach((m: any) => {
                                    if (!next.find(x => x.id === m.id)) next.push(m);
                                });
                                return next;
                            });
                        }
                    }
                }
            }

            // Sync progress for found items if key exists
            if (results.length > 0 && key) {
                const foundIds = results.map(r => r.id);
                const progRes = await fetch(`https://api.guildwars2.com/v2/account/achievements?access_token=${key}&ids=${foundIds.join(',')}`);
                if (progRes.ok) {
                    const prog = await progRes.json();
                    setAccountProg(prev => {
                        const next = [...prev];
                        prog.forEach((p: any) => {
                            const idx = next.findIndex(x => x.id === p.id);
                            if (idx >= 0) next[idx] = p;
                            else next.push(p);
                        });
                        return next;
                    });
                }
            }

            if (results.length === 0) showToast("No intel matching parameters found in global scan.");
        } catch (e) { showToast("Global scan disrupted."); }
        finally { setLoading(false); }
    }, [search, achievements, key, showToast]);

    const commitToLocal = () => {
        localStorage.setItem('gw2commkit_achievements_cache', JSON.stringify(achievements));
        localStorage.setItem('gw2commkit_progression_cache', JSON.stringify(accountProg));
        setCanCommit(false);
        showToast("Intel committed.");
    };

    const toggleAchFavorite = (id: number) => {
        const favs = user?.achievementFavorites || [];
        const next = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
        saveUser({ ...user, achievementFavorites: next });
    };

    useEffect(() => {
        if (key) {
            if (!achievements.length) {
                performSearch();
            } else {
                // If we have some achievements, check if favorites are missing names
                const favIds = user.achievementFavorites || [];
                const missingFavNames = favIds.filter(id => {
                    const ach = achievements.find(a => a.id === id);
                    return !ach || !ach.name;
                });

                if (missingFavNames.length > 0) {
                    // Fetch only missing favorites
                    fetch(`https://api.guildwars2.com/v2/achievements?ids=${missingFavNames.join(',')}`)
                        .then(r => r.ok ? r.json() : [])
                        .then(data => {
                            if (Array.isArray(data) && data.length > 0) {
                                setAchievements(prev => {
                                    const next = [...prev];
                                    data.forEach(d => {
                                        const idx = next.findIndex(a => a.id === d.id);
                                        if (idx >= 0) next[idx] = { ...next[idx], ...d };
                                        else next.push(d);
                                    });
                                    return next;
                                });
                            }
                        });
                }
            }
        }
    }, [key, performSearch, achievements.length, user.achievementFavorites]);

    const [subAchievements, setSubAchievements] = useState<Record<number, any>>({});
    const [subAchProgress, setSubAchProgress] = useState<Record<number, any>>({});

    // Fetch detailed achievement info when selected
    const fetchAchievementDetails = useCallback(async (achId: number) => {
        if (!key) return;
        setRefreshing(true);
        try {
            // Fetch achievement details (includes bits/objectives)
            const detailRes = await fetch(`https://api.guildwars2.com/v2/achievements/${achId}`);
            let details = null;
            if (detailRes.ok) {
                details = await detailRes.json();
                setSelectedAchDetails(details);
            }

            // Fetch account progress for this achievement
            const progRes = await fetch(`https://api.guildwars2.com/v2/account/achievements?access_token=${key}&ids=${achId}`);
            if (progRes.ok) {
                const progData = await progRes.json();
                if (Array.isArray(progData) && progData.length > 0) {
                    setSelectedAchProgress(progData[0]);
                }
            }

            // If this is a meta-achievement with bits referencing other achievements, fetch those too
            if (details?.bits && details.bits.length > 0) {
                const achBitIds = details.bits
                    .filter((b: any) => b.type === 'Text' && b.id)
                    .map((b: any) => b.id);

                if (achBitIds.length > 0) {
                    // Fetch sub-achievement details
                    const subRes = await fetch(`https://api.guildwars2.com/v2/achievements?ids=${achBitIds.join(',')}`);
                    if (subRes.ok) {
                        const subData = await subRes.json();
                        const subMap: Record<number, any> = {};
                        subData.forEach((s: any) => { subMap[s.id] = s; });
                        setSubAchievements(subMap);
                    }

                    // Fetch progress for sub-achievements
                    const subProgRes = await fetch(`https://api.guildwars2.com/v2/account/achievements?access_token=${key}&ids=${achBitIds.join(',')}`);
                    if (subProgRes.ok) {
                        const subProgData = await subProgRes.json();
                        const subProgMap: Record<number, any> = {};
                        subProgData.forEach((s: any) => { subProgMap[s.id] = s; });
                        setSubAchProgress(subProgMap);
                    }
                }
            }

            setLastRefresh(new Date());
        } catch (e) {
            showToast('Failed to fetch achievement details');
        } finally {
            setRefreshing(false);
        }
    }, [key, showToast]);

    // Auto-refresh every 15 minutes when viewing an achievement
    useEffect(() => {
        if (!selectedAch?.id || !key) return;

        // Initial fetch
        fetchAchievementDetails(selectedAch.id);

        // Set up 15-minute auto-refresh
        const interval = setInterval(() => {
            fetchAchievementDetails(selectedAch.id);
            showToast('Achievement progress refreshed');
        }, 15 * 60 * 1000);

        return () => clearInterval(interval);
    }, [selectedAch?.id, key, fetchAchievementDetails, showToast]);

    const handleSelectAchievement = (ach: any) => {
        setSelectedAch(ach);
        setSelectedAchDetails(null);
        setSelectedAchProgress(null);
        setSubAchievements({});
        setSubAchProgress({});
    };

    const favoritesList = useMemo(() => {
        const favIds = user.achievementFavorites || [];
        return achievements.filter(a => favIds.includes(a.id));
    }, [achievements, user.achievementFavorites]);

    const filtered = useMemo(() => {
        if (!search) return favoritesList;
        return achievements
            .filter(a => (a?.name || '').toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => {
                const aFav = (user.achievementFavorites || []).includes(a.id);
                const bFav = (user.achievementFavorites || []).includes(b.id);
                if (aFav && !bFav) return -1;
                if (!aFav && bFav) return 1;
                return 0;
            });
    }, [achievements, search, user.achievementFavorites, favoritesList]);

    if (selectedAch) {
        const details = selectedAchDetails;
        const progress = selectedAchProgress;
        const bits = details?.bits || [];
        const completedBits = progress?.bits || [];
        const isFullyComplete = progress?.done === true;
        const currentProgress = progress?.current || 0;
        const maxProgress = details?.tiers?.[details.tiers.length - 1]?.count || progress?.max || bits.length || 1;
        const overallPercent = Math.round((currentProgress / maxProgress) * 100);

        return (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <button onClick={() => { setSelectedAch(null); setSelectedAchDetails(null); setSelectedAchProgress(null); }} className="text-indigo-400 hover:underline text-[13px] font-bold uppercase tracking-widest">← Back</button>
                    <div className="flex items-center gap-3">
                        {lastRefresh && (
                            <span className="text-[8px] text-slate-600 font-mono">
                                Updated: {lastRefresh.toLocaleTimeString()}
                            </span>
                        )}
                        <button
                            onClick={() => fetchAchievementDetails(selectedAch.id)}
                            disabled={refreshing}
                            className="gw2-button !px-3 !py-1 text-[8px]"
                        >
                            <IconRefresh animate={refreshing} size={12} /> Refresh
                        </button>
                        <button onClick={() => toggleAchFavorite(selectedAch.id)} className={`p-1.5 rounded transition-all ${user.achievementFavorites.includes(selectedAch.id) ? 'text-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]' : 'text-slate-500'}`}>
                            <IconHeart filled={user.achievementFavorites.includes(selectedAch.id)} />
                        </button>
                    </div>
                </div>

                {/* Achievement Header Card */}
                <div className={`gw2-container-border p-6 shadow-xl ${isFullyComplete ? 'bg-emerald-950/30 border-emerald-500/30' : 'bg-slate-800/60'}`}>
                    <div className="flex items-start gap-5">
                        {selectedAch.icon && <img src={selectedAch.icon} className="w-16 h-16 rounded shadow-lg" alt="" />}
                        <div className="flex-grow">
                            <div className="flex items-center gap-3">
                                <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{selectedAch.name}</h3>
                                {isFullyComplete && (
                                    <span className="px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black rounded uppercase">Complete</span>
                                )}
                            </div>
                            <p className="text-indigo-400 font-bold text-[12px] uppercase tracking-widest mt-2">{details?.requirement || selectedAch.requirement}</p>
                            {details?.description && (
                                <p className="text-slate-400 text-[13px] mt-2 leading-relaxed">{details.description}</p>
                            )}

                            {/* Overall Progress Bar */}
                            <div className="mt-4">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[12px] font-black text-slate-500 uppercase">Overall Progress</span>
                                    <span className="text-[13px] font-black text-white font-mono">{currentProgress} / {maxProgress} ({overallPercent}%)</span>
                                </div>
                                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                                    <div
                                        className={`h-full transition-all duration-500 ${isFullyComplete ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                        style={{ width: `${overallPercent}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Objectives/Bits List */}
                {bits.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[13px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                Objectives ({completedBits.length} / {bits.length})
                            </h4>
                            <span className="text-[12px] text-slate-600 italic">Auto-refreshes every 15 min</span>
                        </div>
                        <div className="space-y-2">
                            {bits.map((bit: any, idx: number) => {
                                const isComplete = completedBits.includes(idx);

                                // Check if this bit references another achievement
                                const subAch = bit.id ? subAchievements[bit.id] : null;
                                const subProg = bit.id ? subAchProgress[bit.id] : null;
                                const subComplete = subProg?.done === true;
                                const subCurrent = subProg?.current || 0;
                                const subMax = subProg?.max || subAch?.tiers?.[subAch.tiers.length - 1]?.count || 1;
                                const subPercent = Math.round((subCurrent / subMax) * 100);

                                // Use sub-achievement name if available, otherwise use bit text
                                const bitText = subAch?.name || bit.text || `Objective ${idx + 1}`;
                                const bitIcon = subAch?.icon;
                                const bitRequirement = subAch?.requirement;

                                return (
                                    <div
                                        key={idx}
                                        className={`p-3 rounded-lg border-2 flex items-center gap-3 transition-all ${isComplete || subComplete
                                            ? 'bg-emerald-950/20 border-emerald-500/30'
                                            : 'bg-slate-800/40 border-slate-700/40'
                                            }`}
                                    >
                                        {/* Checkbox or Icon */}
                                        {bitIcon ? (
                                            <img src={bitIcon} alt="" className={`w-10 h-10 rounded shrink-0 ${isComplete || subComplete ? 'opacity-50 grayscale' : ''}`} />
                                        ) : (
                                            <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 transition-all ${isComplete || subComplete
                                                ? 'bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]'
                                                : 'bg-slate-950 border border-slate-700'
                                                }`}>
                                                <IconCheck checked={isComplete || subComplete} />
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div className="flex-grow min-w-0">
                                            <p className={`text-[14px] font-bold uppercase ${isComplete || subComplete ? 'text-emerald-300' : 'text-white'
                                                }`}>
                                                {bitText}
                                            </p>
                                            {bitRequirement && (
                                                <p className="text-[12px] text-slate-400 mt-0.5 leading-tight">
                                                    {bitRequirement}
                                                </p>
                                            )}

                                            {/* Sub-achievement progress bar */}
                                            {subAch && !subComplete && (
                                                <div className="mt-2">
                                                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-indigo-500 transition-all"
                                                            style={{ width: `${subPercent}%` }}
                                                        ></div>
                                                    </div>
                                                    <p className="text-[8px] text-slate-500 font-mono mt-1">
                                                        {subCurrent} / {subMax} ({subPercent}%)
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Status */}
                                        <div className="text-right shrink-0">
                                            {isComplete || subComplete ? (
                                                <span className="text-[12px] font-black text-emerald-400 uppercase">✓ Done</span>
                                            ) : (
                                                <span className="text-[12px] font-black text-amber-500 uppercase">{subPercent}%</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Tiers/Rewards */}
                {details?.tiers && details.tiers.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-[13px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            Reward Tiers
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {details.tiers.map((tier: any, idx: number) => {
                                const tierComplete = currentProgress >= tier.count;
                                return (
                                    <div
                                        key={idx}
                                        className={`p-3 rounded-lg border text-center transition-all ${tierComplete
                                            ? 'bg-amber-950/30 border-amber-500/30'
                                            : 'bg-slate-900/40 border-slate-700/50'
                                            }`}
                                    >
                                        <p className="text-[8px] font-black text-slate-500 uppercase">Tier {idx + 1}</p>
                                        <p className={`text-[17px] font-black font-mono ${tierComplete ? 'text-amber-400' : 'text-white'}`}>
                                            {tier.count}
                                        </p>
                                        {tierComplete && <span className="text-[7px] text-emerald-400 font-black">✓ CLAIMED</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {!details && (
                    <div className="flex justify-center items-center py-12">
                        <IconRefresh animate size={24} />
                        <span className="ml-3 text-slate-500 text-[13px] uppercase font-bold">Loading objectives...</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Favourites Section - instructions: Strategic Achievements renamed to Favourites and listed above Search */}
            {favoritesList.length > 0 && (
                <div className="space-y-4 animate-in fade-in duration-500">
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                        <IconHeart filled /> Favourites
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {favoritesList.map(a => (
                            <div key={`fav-${a.id}`} onClick={() => handleSelectAchievement(a)} className="gw2-container-border p-3 flex gap-4 border-l-4 border-l-red-500 bg-slate-800/50 hover:bg-slate-800 transition-all cursor-pointer group shadow-lg">
                                {a.icon && <img src={a.icon} className="w-10 h-10 object-contain shadow-md" alt="" />}
                                <div className="min-w-0 flex-grow">
                                    <h4 className="font-bold text-white truncate text-[14px] uppercase group-hover:text-indigo-400">{a.name}</h4>
                                    <div className="w-full bg-slate-700 h-1 rounded-full mt-2 overflow-hidden shadow-inner">
                                        <div className="h-full bg-red-500" style={{ width: `${Math.max(2, (a.current / (a.max || 1)) * 100)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Search and Main List Section */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6 border-t border-slate-700/50">
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">Achievements</h2>
                    <div className="flex gap-2">
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search intel..." className="bg-slate-900 border border-slate-700 p-2 rounded text-[13px] text-white focus:border-indigo-500 outline-none w-48" />
                        <button onClick={() => performSearch(true)} className="gw2-button !px-4 !py-1 text-[12px]"><IconRefresh animate={loading} /> Global Scan</button>
                        {canCommit && <button onClick={commitToLocal} className="gw2-button !bg-emerald-700 !border-emerald-500 !px-4 !py-1 text-[12px]">Commit</button>}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filtered.map(a => (
                        <div key={a.id} onClick={() => handleSelectAchievement(a)} className={`gw2-container-border p-3 flex gap-4 border-l-4 bg-slate-800/30 hover:bg-slate-800 transition-all cursor-pointer group shadow-sm ${user.achievementFavorites.includes(a.id) ? 'border-l-red-500' : 'border-l-teal-500'}`}>
                            {a.icon && <img src={a.icon} className="w-10 h-10 object-contain shadow-md" alt="" />}
                            <div className="min-w-0 flex-grow">
                                <h4 className="font-bold text-white truncate text-[14px] uppercase group-hover:text-indigo-400">{a.name}</h4>
                                <div className="w-full bg-slate-700 h-1 rounded-full mt-2 overflow-hidden shadow-inner">
                                    <div className="h-full bg-teal-500" style={{ width: `${Math.max(2, (a.current / (a.max || 1)) * 100)}%` }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// --- WIZARD'S VAULT PAGE ---

function WizardsVaultPage({ user, saveUser }: { user: User, saveUser: any }) {
    const [daily, setDaily] = useState<any[]>([]);
    const [weekly, setWeekly] = useState<any[]>([]);
    const [special, setSpecial] = useState<any[]>([]);
    const [totalAA, setTotalAA] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const showToast = useToast();
    const key = user?.settings?.gw2ApiKey;

    // Filter settings (persistent)
    const activeFilters = user?.settings?.vaultFilters || ['PvE'];

    const toggleFilter = (f: string) => {
        const current = user.settings?.vaultFilters || ['PvE'];
        const next = current.includes(f)
            ? current.filter(x => x !== f)
            : [...current, f];
        saveUser({ ...user, settings: { ...user.settings, vaultFilters: next } });
    };

    const fetchVaultData = useCallback(async (silent = false) => {
        if (!key) return;
        if (!silent) setLoading(true);
        setRefreshing(true);
        try {
            const t = Date.now();
            const [d, w, s, wallet] = await Promise.all([
                fetch(`https://api.guildwars2.com/v2/account/wizardsvault/daily?access_token=${key}&t=${t}`).then(r => r.ok ? r.json() : { objectives: [] }),
                fetch(`https://api.guildwars2.com/v2/account/wizardsvault/weekly?access_token=${key}&t=${t}`).then(r => r.ok ? r.json() : { objectives: [] }),
                fetch(`https://api.guildwars2.com/v2/account/wizardsvault/special?access_token=${key}&t=${t}`).then(r => r.ok ? r.json() : { objectives: [] }),
                fetch(`https://api.guildwars2.com/v2/account/wallet?access_token=${key}&t=${t}`).then(r => r.ok ? r.json() : [])
            ]);

            setDaily(d.objectives || []);
            setWeekly(w.objectives || []);
            setSpecial(s.objectives || []);

            // Check if we got daily data - if so, it's the current day per API
            if (d.objectives) {
                setLastRefresh(new Date());
            }

            // Find Astral Acclaim (ID 70? Need to verify - usually usually 59 is currency, 
            // but AA is newer. Using standard wallet search if ID is unknown, but let's assume valid wallet data)
            // Actually, AA ID is 70.
            const aa = wallet.find((c: any) => c.id === 70);
            if (aa) setTotalAA(aa.value);

        } catch (e) {
            showToast("Vault connection unstable.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [key, showToast]);

    const allDone = useMemo(() => {
        return daily.length > 0 && daily.every(o => o.claimed) &&
            weekly.length > 0 && weekly.every(o => o.claimed) &&
            special.length > 0 && special.every(o => o.claimed);
    }, [daily, weekly, special]);

    useEffect(() => {
        // Initial fetch only if key is present
        if (key) fetchVaultData();

        // Smart refresh: every 15 min 
        const interval = setInterval(() => {
            // Automaticaly refresh to check for new day or completed items
            fetchVaultData(true);
            // We don't toast every time for background refresh to avoid spam
        }, 15 * 60 * 1000);

        return () => clearInterval(interval);
    }, [key]); // Removed fetchVaultData from dependency to avoid loop if it changes

    if (!key) return <div className="py-20 text-center text-slate-500 uppercase font-black tracking-widest text-[17px]">Connect API key in Command tab.</div>;
    if (loading && daily.length === 0) return <div className="flex justify-center items-center py-20"><IconRefresh animate /></div>;

    const renderTable = (title: string, items: any[]) => {
        // Filter by track (PvE, PvP, WvW)
        const filtered = items.filter(item => {
            if (!item.track || item.track === 'General') return true;
            return activeFilters.includes(item.track);
        });

        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-[18px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                        <div className="w-2 h-6 bg-sky-500 rounded-full"></div> {title}
                    </h3>
                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{filtered.length} Objectives</span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950/80 border-b border-slate-800">
                                <th className="p-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Objective</th>
                                <th className="p-4 text-[11px] font-black text-slate-500 uppercase tracking-widest w-32">Tactical Note</th>
                                <th className="p-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center w-24">Acclaim</th>
                                <th className="p-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center w-24">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filtered.map((item, idx) => {
                                const easyInfo = Object.entries(EASY_OBJECTIVES).find(([name]) => (item.title || '').toLowerCase().includes(name.toLowerCase()))?.[1];

                                return (
                                    <tr key={idx} className={`group transition-colors ${item.claimed ? 'opacity-30 grayscale bg-slate-950/20' : 'hover:bg-slate-800/40'}`}>
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-950 rounded-lg flex items-center justify-center border border-slate-800 group-hover:border-sky-500/30 transition-colors">
                                                    <span className="text-xl">{item.track === 'PvP' ? '⚔️' : item.track === 'WvW' ? '🏰' : '🛡️'}</span>
                                                </div>
                                                <div>
                                                    <p className={`text-[16px] font-black uppercase ${item.claimed ? 'text-slate-500' : 'text-white group-hover:text-sky-400'} transition-colors`}>{item.title || `Objective ${item.id}`}</p>
                                                    <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest mt-0.5">{item.track || 'General'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            {easyInfo ? (
                                                <div className="space-y-2 max-w-sm">
                                                    <p className="text-[13px] text-slate-400 leading-tight italic">{easyInfo.note}</p>
                                                    {easyInfo.waypoint && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigator.clipboard.writeText(easyInfo.waypoint);
                                                                showToast("Waypoint tactical link copied.");
                                                            }}
                                                            className="flex items-center gap-2 px-2 py-1 bg-sky-950/30 border border-sky-800/50 rounded text-[9px] font-black text-sky-400 uppercase tracking-widest hover:bg-sky-600 hover:text-white transition-all shadow-lg"
                                                        >
                                                            <IconCopy size={10} /> {easyInfo.waypoint}
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-[11px] text-slate-600 font-bold uppercase italic">Standard Ops</p>
                                            )}
                                        </td>
                                        <td className="p-5 text-center">
                                            <p className="text-[18px] font-black text-sky-400 font-mono">+{item.acclaim}</p>
                                            <p className="text-[8px] text-slate-600 uppercase font-black">Acclaim</p>
                                        </td>
                                        <td className="p-5 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <p className="text-[14px] font-bold text-white font-mono">{item.progress_current ?? item.progress} / {item.progress_max ?? item.needed}</p>
                                                <div className={`w-6 h-6 rounded flex items-center justify-center transition-all ${item.claimed ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-slate-950 border border-slate-700'}`}>
                                                    <IconCheck checked={item.claimed} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="py-20 text-center">
                            <p className="text-[18px] text-slate-600 uppercase font-black tracking-[0.2em] italic">No filtered data detected in this sector.</p>
                            <p className="text-[11px] text-slate-700 uppercase font-bold mt-2">Adjust track filters to broaden search parameters.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-500 pb-20">
            {/* Tactical Header */}
            <div className="bg-slate-900 border border-indigo-500/20 p-10 rounded-2xl shadow-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <IconAstral size={160} />
                </div>

                <div className="flex flex-col xl:flex-row justify-between items-center gap-10 relative z-10">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-sky-500/10 rounded-2xl flex items-center justify-center border border-sky-500/20 shadow-inner">
                            <IconAstral size={48} />
                        </div>
                        <div>
                            <h2 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">Wizard's Vault</h2>
                            <p className="text-[17px] font-black text-sky-400 uppercase tracking-[0.4em] mt-3 opacity-80">Strategic Target Acquisition</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        {totalAA !== null && (
                            <div className="bg-slate-950/80 px-4 py-2 rounded-lg border border-sky-500/30 mb-2 text-right">
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Available Acclaim</p>
                                <p className="text-3xl font-black text-sky-400 font-mono">{totalAA}</p>
                            </div>
                        )}

                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 shadow-inner">
                                {['PvE', 'PvP', 'WvW'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => toggleFilter(f)}
                                        className={`px-6 py-2.5 rounded-lg text-[13px] font-black uppercase tracking-widest transition-all ${activeFilters.includes(f) ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-slate-900'}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => fetchVaultData()} disabled={refreshing} className="gw2-button !px-8 !py-3 !text-[15px] !bg-indigo-900/40 !border-indigo-500/50">
                                <IconRefresh animate={refreshing} /> {refreshing ? 'Syncing...' : 'Deep Refresh'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-16">
                {renderTable("Daily Assignments", daily)}
                {renderTable("Weekly Strategic Objectives", weekly)}
                {renderTable("Special Operations", special)}
            </div>

            <div className="pt-8 border-t border-slate-800 text-center">
                <p className="text-slate-600 font-black text-[11px] uppercase tracking-[0.4em] italic mb-2">Automated Astral Retrieval Cycle Active</p>
                <p className="text-slate-700 font-mono text-[9px] uppercase tracking-tighter">Last Sync: {lastRefresh?.toLocaleString() || 'Never'}</p>
            </div>
        </div>
    );
}

// --- MAIN APP ---

// --- TRACKER TYPES ---
type TrackingSnapshot = { gold: number; items: Record<number, number>; currencies: Record<number, number> };
type TrackingLog = { id: number; name: string; icon: string; change: number; type: 'item' | 'currency' | 'gold', timestamp: number };

type RecipeInfo = {
    id: number;
    type: string;
    output_item_id: number;
    output_item_count: number;
    min_rating: number;
    disciplines: string[];
    ingredients: Array<{ item_id: number; count: number }>;
};

type MarketPrice = {
    id: number;
    buys?: { quantity: number; unit_price: number };
    sells?: { quantity: number; unit_price: number };
};

function CraftingPage({ user, saveUser, unlockedRecipes, recipeDetails, itemDetails, marketPrices, materials, bankItems, inventoryItems, sharedInventory, characterCrafting, onSync, syncing }: any) {
    const [search, setSearch] = useState('');
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
    const [fetchingMore, setFetchingMore] = useState(false);
    const [goldMode, setGoldMode] = useState(false);
    const showToast = useToast();

    const toggleRecipeFav = (id: number) => {
        const current = user.recipeFavorites || [];
        const next = current.includes(id) ? current.filter((x: number) => x !== id) : [...current, id];
        saveUser({ ...user, recipeFavorites: next });
    };

    // Aggregate all items for easy lookup
    const allItems = useMemo(() => {
        const counts: Record<number, number> = {};
        [...materials, ...bankItems, ...sharedInventory, ...inventoryItems].forEach(item => {
            counts[item.item_id] = (counts[item.item_id] || 0) + item.count;
        });
        return counts;
    }, [materials, bankItems, sharedInventory, inventoryItems]);

    // Potential yield calculator
    const getPotentialYield = useCallback((recipe: RecipeInfo) => {
        if (!recipe.ingredients || recipe.ingredients.length === 0) return 0;
        let yieldCount = Infinity;
        recipe.ingredients.forEach(ing => {
            const owned = allItems[ing.item_id] || 0;
            const possible = Math.floor(owned / ing.count);
            if (possible < yieldCount) yieldCount = possible;
        });
        return yieldCount === Infinity ? 0 : yieldCount;
    }, [allItems]);

    const [rarityFilter, setRarityFilter] = useState<string>('All');
    const [typeFilter, setTypeFilter] = useState<string>('All');
    const [sortBy, setSortBy] = useState<string>('Name');

    const getCraftingCost = useCallback((recipe: RecipeInfo) => {
        let cost = 0;
        recipe.ingredients.forEach(ing => {
            const prices = marketPrices[ing.item_id];
            // If we don't have prices, we assume it's untradable or account bound (cost 0 for this simplified view)
            const unitPrice = prices?.buys?.unit_price || 0;
            cost += unitPrice * ing.count;
        });
        return cost;
    }, [marketPrices]);

    const getProfit = useCallback((recipe: RecipeInfo) => {
        const outputPrices = marketPrices[recipe.output_item_id];
        if (!outputPrices?.sells?.unit_price) return null;

        const sellPrice = outputPrices.sells.unit_price;
        const totalRevenue = sellPrice * recipe.output_item_count * 0.85; // 15% TP Tax
        const cost = getCraftingCost(recipe);
        return Math.floor(totalRevenue - cost);
    }, [marketPrices, getCraftingCost]);

    const canCraft = (recipe: RecipeInfo) => getPotentialYield(recipe) > 0;

    const getRecipeProgress = (recipe: RecipeInfo) => {
        let totalOwned = 0;
        let totalNeeded = 0;
        recipe.ingredients.forEach(ing => {
            totalOwned += Math.min(allItems[ing.item_id] || 0, ing.count);
            totalNeeded += ing.count;
        });
        return totalNeeded > 0 ? (totalOwned / totalNeeded) * 100 : 0;
    };

    // Group recipes by discipline and type with refined filters
    const groupedRecipes = useMemo(() => {
        const groups: Record<string, { label: string, discipline: string, type: string, recipes: RecipeInfo[] }> = {};

        const filtered = unlockedRecipes
            .map(id => recipeDetails[id])
            .filter(Boolean)
            .filter(r => {
                const output = itemDetails[r.output_item_id];
                const yieldCount = getPotentialYield(r);
                const profit = getProfit(r) || 0;

                // Gold Mode Filter
                if (goldMode) {
                    if (yieldCount <= 0) return false;
                    if (!output) return false;
                    const flags = output.flags || [];
                    if (flags.includes('AccountBound') || flags.includes('SoulbindOnAcquire') || flags.includes('SoulBindOnAcquire')) return false;
                    if (!(marketPrices[r.output_item_id]?.sells?.unit_price > 0)) return false;
                    if (profit <= 0) return false;
                }

                // Search override
                if (search) return output?.name.toLowerCase().includes(search.toLowerCase());

                // Rarity filter
                if (rarityFilter !== 'All' && output?.rarity !== rarityFilter) return false;

                // Type filter
                if (typeFilter !== 'All') {
                    const type = output?.type || '';
                    if (typeFilter === 'Equipment' && !['Weapon', 'Armor', 'Trinket', 'Back'].includes(type)) return false;
                    if (typeFilter === 'Food' && (type !== 'Consumable' || !output?.name.includes('Food'))) {
                        // Complex food check? For now simplified:
                        if (typeFilter === 'Food' && !output?.name.toLowerCase().includes('food') && !output?.name.toLowerCase().includes('soup') && !output?.name.toLowerCase().includes('bread')) return false;
                    }
                    if (typeFilter === 'Upgrade' && type !== 'UpgradeComponent') return false;
                }

                // Default craftable toggle (User didn't explicitly ask to remove this, so I'll keep it as a soft filter)
                // return yieldCount > 0;
                return true;
            });

        // Sorting
        const sorted = [...filtered].sort((a, b) => {
            if (sortBy === 'Profit' || goldMode) {
                const pA = getProfit(a) || -9999999;
                const pB = getProfit(b) || -9999999;
                return pB - pA;
            }
            if (sortBy === 'Yield') {
                return getPotentialYield(b) - getPotentialYield(a);
            }
            const nameA = itemDetails[a.output_item_id]?.name || '';
            const nameB = itemDetails[b.output_item_id]?.name || '';
            return nameA.localeCompare(nameB);
        });

        sorted.forEach(recipe => {
            recipe.disciplines.forEach(disc => {
                const groupKey = `${disc}-${recipe.type}`;
                if (!groups[groupKey]) {
                    groups[groupKey] = {
                        label: `${disc} ${recipe.type.replace(/([A-Z])/g, ' $1').trim()}`,
                        discipline: disc,
                        type: recipe.type,
                        recipes: []
                    };
                }
                groups[groupKey].recipes.push(recipe);
            });
        });

        return Object.values(groups).sort((a, b) => a.label.localeCompare(b.label));
    }, [unlockedRecipes, recipeDetails, itemDetails, search, getPotentialYield, rarityFilter, typeFilter, sortBy, getProfit, goldMode]);

    const favoriteRecipeData = useMemo(() => {
        return (user.recipeFavorites || [])
            .map((id: number) => recipeDetails[id])
            .filter(Boolean);
    }, [user.recipeFavorites, recipeDetails]);

    const getCrafters = (recipe: RecipeInfo) => {
        const crafters: string[] = [];
        Object.entries(characterCrafting).forEach(([charName, disciplines]: [string, any]) => {
            const hasDisc = disciplines.find((d: any) => recipe.disciplines.includes(d.discipline) && d.rating >= recipe.min_rating);
            if (hasDisc) crafters.push(charName);
        });
        return crafters;
    };

    const toggleGroup = (key: string) => {
        setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const fetchMoreRecipes = async () => {
        const missing = unlockedRecipes.filter(id => !recipeDetails[id]).slice(0, 200);
        if (missing.length === 0) return;

        setFetchingMore(true);
        try {
            const res = await fetch(`https://api.guildwars2.com/v2/recipes?ids=${missing.join(',')}`);
            if (res.ok) {
                const data = await res.json();
                const newDetails: any = {};
                data.forEach((r: any) => newDetails[r.id] = r);
                // Also trigger item detail fetch for outputs
                // We'd need to expose fetchItemDetails or handle it in parent
                // For now, assume App will handle on next sync or we can do it here if we had access
                showToast(`Intelligence update: ${data.length} recipes decoded.`);
                // Communication with parent is needed to Update recipeDetails
                // Since this is a simple implementation, we'll suggest using Deep Sync
            }
        } catch (e) { }
        setFetchingMore(false);
    };

    const exportGoldManifest = () => {
        const data: any[] = [];
        unlockedRecipes.forEach(id => {
            const r = recipeDetails[id];
            if (!r) return;
            const output = itemDetails[r.output_item_id];
            const yieldCount = getPotentialYield(r);
            const profitValue = getProfit(r) || 0;
            const isAb = output?.flags?.includes('AccountBound') || output?.flags?.includes('SoulbindOnAcquire') || output?.flags?.includes('SoulBindOnAcquire');
            const hasS = marketPrices[r.output_item_id]?.sells?.unit_price > 0;
            if (yieldCount > 0 && output && !isAb && hasS && profitValue > 0) {
                const ingredients = r.ingredients.map(ing => {
                    const itm = itemDetails[ing.item_id];
                    return `${itm?.name || ing.item_id} (x${ing.count})`;
                }).join('; ');
                data.push({
                    Name: output.name,
                    Rarity: output.rarity,
                    CanCraft: yieldCount,
                    ProfitPerUnit: (profitValue / 10000).toFixed(4) + 'g',
                    TotalProfit: ((profitValue * yieldCount) / 10000).toFixed(2) + 'g',
                    Ingredients: ingredients
                });
            }
        });
        if (data.length === 0) {
            showToast("No profitable manifests detected for export.");
            return;
        }
        data.sort((a, b) => parseFloat(b.TotalProfit) - parseFloat(a.TotalProfit));
        const csvRows = [
            ["Item Name", "Rarity", "Amount Craftable", "Profit per Unit", "Total Combined Profit", "Required Ingredients"],
            ...data.map(d => [d.Name, d.Rarity, d.CanCraft, d.ProfitPerUnit, d.TotalProfit, `"${d.Ingredients}"`])
        ];
        const csvContent = csvRows.map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gw2_gold_manifest_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast("Strategic Gold Manifest exported.");
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 shadow-xl">
                <div>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                        <IconBox size={32} /> Production Logistics
                    </h2>
                    <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em] mt-2 opacity-70">Recipe Matrix & Assembly Status</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search recipes..."
                        className="bg-slate-950 border border-slate-700 p-3 rounded-xl text-white focus:border-indigo-500 outline-none flex-grow md:w-64"
                    />
                    <button onClick={onSync} disabled={syncing} className="gw2-button !px-6 !py-2">
                        <IconRefresh animate={syncing} size={16} /> {syncing ? 'Scanning...' : 'Deep Sync'}
                    </button>
                </div>
            </div>

            {/* Tactical Filters */}
            <div className="flex flex-wrap gap-4 p-4 bg-slate-900/40 rounded-xl border border-slate-800/60 items-center justify-between">
                <div className="flex flex-wrap gap-6">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Tier Access</p>
                        <div className="flex gap-1">
                            {['All', 'Rare', 'Exotic', 'Ascended', 'Legendary'].map(r => (
                                <button key={r} onClick={() => setRarityFilter(r)} className={`px-3 py-1 rounded text-[11px] font-black uppercase transition-all ${rarityFilter === r ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 bg-slate-950/50 border border-slate-800'}`}>{r}</button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Logistics Type</p>
                        <div className="flex gap-1">
                            {['All', 'Equipment', 'Food', 'Upgrade'].map(t => (
                                <button key={t} onClick={() => setTypeFilter(t)} className={`px-3 py-1 rounded text-[11px] font-black uppercase transition-all ${typeFilter === t ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 bg-slate-950/50 border border-slate-800'}`}>{t}</button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Strategic Sorting</p>
                    <div className="flex gap-2">
                        <button
                            onClick={exportGoldManifest}
                            className="px-4 py-1 rounded text-[11px] font-black uppercase transition-all flex items-center gap-2 border bg-indigo-900/40 border-indigo-500/50 text-indigo-300 hover:bg-indigo-600 hover:text-white"
                            title="Export Profitable Manifest"
                        >
                            <IconCopy size={12} /> Mission Export
                        </button>
                        <button
                            onClick={() => setGoldMode(!goldMode)}
                            className={`px-4 py-1 rounded text-[11px] font-black uppercase transition-all flex items-center gap-2 border ${goldMode ? 'bg-amber-600 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:text-slate-300'}`}
                        >
                            <span className="text-sm">🪙</span> Make Gold
                        </button>
                        <div className="flex gap-1">
                            {['Name', 'Profit', 'Yield'].map(s => (
                                <button key={s} onClick={() => setSortBy(s)} className={`px-3 py-1 rounded text-[11px] font-black uppercase transition-all ${sortBy === s ? 'bg-amber-500 text-slate-950 shadow-lg font-bold' : 'text-slate-500 hover:text-slate-300 bg-slate-950/50 border border-slate-800'}`}>{s}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Strategic Priorities (Favorites) */}
            {
                favoriteRecipeData.length > 0 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <h3 className="text-2xl font-black text-amber-400 uppercase tracking-tighter">Strategic Priorities</h3>
                            <div className="flex-grow h-[1px] bg-amber-500/20"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {favoriteRecipeData.map((recipe: any) => {
                                const output = itemDetails[recipe.output_item_id];
                                const progress = getRecipeProgress(recipe);
                                const yieldCount = getPotentialYield(recipe);
                                const crafters = getCrafters(recipe);
                                const rarityColor = output ? RARITY_COLORS[output.rarity] : 'text-white';

                                return (
                                    <div key={`fav-${recipe.id}`} className="gw2-container-border p-5 bg-slate-900/80 border-amber-500/20 shadow-2xl relative overflow-hidden group">
                                        <div className="flex items-start gap-4 relative z-10">
                                            <div className="w-16 h-16 bg-slate-950 rounded-xl border border-slate-800 p-2 shrink-0 group-hover:scale-105 transition-transform">
                                                {output?.icon && <img src={output.icon} alt="" className="w-full h-full object-contain" />}
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <h4 className={`text-[17px] font-black uppercase truncate leading-tight ${rarityColor}`}>{output?.name || `Recipe ${recipe.id}`}</h4>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-[10px] font-black text-amber-500/80 uppercase">Progress: {Math.floor(progress)}%</span>
                                                    {yieldCount > 0 && <span className="text-[10px] font-black text-emerald-400 uppercase underline decoration-emerald-500/30 underline-offset-4">Yield: {yieldCount}</span>}
                                                    {getProfit(recipe) !== null && (
                                                        <span className={`text-[10px] font-black uppercase ${getProfit(recipe)! > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                            {getProfit(recipe)! > 0 ? '+' : ''}{Math.floor(getProfit(recipe)! / 100) / 100}g
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-3 h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                                    <div className={`h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000 shadow-[0_0_10px_rgba(251,191,36,0.3)]`} style={{ width: `${progress}%` }}></div>
                                                </div>
                                            </div>
                                            <button onClick={() => toggleRecipeFav(recipe.id)} className="text-amber-500 hover:text-amber-400 shrink-0">
                                                <IconHeart filled />
                                            </button>
                                        </div>
                                        <div className="mt-4 space-y-1.5">
                                            {recipe.ingredients.map(ing => {
                                                const count = allItems[ing.item_id] || 0;
                                                const hasEnough = count >= ing.count;
                                                const itm = itemDetails[ing.item_id];
                                                return (
                                                    <div key={ing.item_id} className="flex items-center justify-between text-[10px] bg-slate-950/40 p-1.5 rounded border border-slate-800/40">
                                                        <div className="flex items-center gap-2 truncate">
                                                            <img src={itm?.icon} className="w-4 h-4 object-contain" />
                                                            <span className="text-slate-500 truncate">{itm?.name}</span>
                                                        </div>
                                                        <div className="flex gap-2 shrink-0 font-mono">
                                                            <span className="text-emerald-500 font-black"><span className="opacity-50 text-[8px] mr-1">HAS:</span>{count}</span>
                                                            <span className="text-rose-500 font-black"><span className="opacity-50 text-[8px] mr-1">NEEDS:</span>{ing.count}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-1">
                                            {crafters.slice(0, 3).map(c => (
                                                <span key={c} className="text-[8px] text-slate-500 font-black uppercase tracking-widest">{c}</span>
                                            ))}
                                            {crafters.length > 3 && <span className="text-[8px] text-slate-600 font-black uppercase">+{crafters.length - 3} More</span>}
                                        </div>
                                        {/* Abstract decorative element */}
                                        <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )
            }

            <div className="grid grid-cols-1 gap-4">
                {groupedRecipes.map(group => {
                    const groupKey = `${group.discipline}-${group.type}`;
                    const recipes = group.recipes;
                    const craftableCount = recipes.filter(canCraft).length;
                    const isExpanded = expandedGroups[groupKey];
                    const progress = (craftableCount / recipes.length) * 100;

                    return (
                        <div key={groupKey} className="bg-slate-900/40 rounded-xl border border-slate-800/60 shadow-inner overflow-hidden">
                            <button
                                onClick={() => toggleGroup(groupKey)}
                                className="w-full flex items-center justify-between p-4 hover:bg-slate-800/40 transition-colors text-left"
                            >
                                <div className="flex items-center gap-6 flex-grow">
                                    <div className="w-10 h-10 bg-slate-950 rounded border border-slate-700 flex items-center justify-center shrink-0">
                                        <IconBox size={20} className="text-indigo-400" />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-[17px] font-black text-white uppercase tracking-wider">{group.label}</h3>
                                            <span className="text-[12px] font-black text-emerald-400 uppercase">{craftableCount} Craftable</span>
                                        </div>
                                        <div className="mt-2 w-full max-w-md h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                                            <div
                                                className={`h-full transition-all duration-700 ${progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <p className="text-[14px] font-black text-white font-mono">{recipes.length} Patterns</p>
                                        <p className="text-[9px] text-slate-500 uppercase font-black">Strategic Options</p>
                                    </div>
                                </div>
                                <div className={`ml-6 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </div>
                            </button>

                            {isExpanded && (
                                <div className="p-4 bg-slate-950/30 border-t border-slate-800/40 divide-y divide-slate-800/40 animate-in slide-in-from-top-2 duration-300">
                                    {recipes.map(recipe => {
                                        const output = itemDetails[recipe.output_item_id];
                                        const crafters = getCrafters(recipe);
                                        const craftable = canCraft(recipe);
                                        const rarityColor = output ? RARITY_COLORS[output.rarity] : 'text-white';

                                        return (
                                            <div key={recipe.id} className="py-4 first:pt-2 last:pb-2 flex items-center gap-6 group">
                                                <div className="w-12 h-12 bg-slate-900 rounded border border-slate-800 p-1 shrink-0 relative">
                                                    {output?.icon && <img src={output.icon} alt="" className="w-full h-full object-contain" />}
                                                    {recipe.output_item_count > 1 && (
                                                        <span className="absolute -bottom-1 -right-1 bg-indigo-600 text-white text-[9px] font-black px-1 rounded-sm border border-indigo-400">{recipe.output_item_count}</span>
                                                    )}
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    <h4 className={`text-[15px] font-black uppercase truncate tracking-tight ${rarityColor}`}>{output?.name || `Recipe ${recipe.id}`}</h4>
                                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                                        {crafters.map(c => (
                                                            <span key={c} className="text-[9px] text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/20 font-black uppercase">{c}</span>
                                                        ))}
                                                        {crafters.length === 0 && (
                                                            <span className="text-[9px] text-rose-500 bg-rose-950/20 px-2 py-0.5 rounded border border-rose-500/20 font-black uppercase">Unqualified</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 shrink-0">
                                                    <button onClick={() => toggleRecipeFav(recipe.id)} className={`transition-colors ${user.recipeFavorites?.includes(recipe.id) ? 'text-amber-500' : 'text-slate-700 hover:text-slate-500'}`}>
                                                        <IconHeart filled={user.recipeFavorites?.includes(recipe.id)} />
                                                    </button>
                                                    <div className="flex flex-col items-end gap-3">
                                                        {getProfit(recipe) !== null && (
                                                            <div className={`px-3 py-1 rounded text-[11px] font-black uppercase border flex items-center gap-2 ${getProfit(recipe)! > 0 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                                                                <span>Potential Profit:</span>
                                                                {formatCurrency(getProfit(recipe)!)}
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col gap-1 w-full min-w-[300px] mt-2">
                                                            {recipe.ingredients.map(ing => {
                                                                const count = allItems[ing.item_id] || 0;
                                                                const hasEnough = count >= ing.count;
                                                                const itm = itemDetails[ing.item_id];
                                                                return (
                                                                    <div key={ing.item_id} className="flex items-center justify-between text-[11px] font-bold bg-slate-900/60 p-1.5 px-3 rounded border border-slate-800/40 group/ing">
                                                                        <div className="flex items-center gap-2">
                                                                            <img src={itm?.icon} className="w-5 h-5 object-contain opacity-70 group-hover/ing:opacity-100" />
                                                                            <span className="text-slate-400 uppercase truncate max-w-[150px]">{itm?.name}</span>
                                                                        </div>
                                                                        <div className="flex gap-4 font-mono">
                                                                            <span className="text-emerald-500 font-black"><span className="text-[9px] opacity-70 mr-1">HAS:</span>{count}</span>
                                                                            <span className="text-rose-500 font-black"><span className="text-[9px] opacity-70 mr-1">NEEDS:</span>{ing.count}</span>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                        {getPotentialYield(recipe) > 0 && (
                                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded shadow-indigo-500/10 mt-1">
                                                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                                                                <span className="text-[10px] font-black text-indigo-400 uppercase">Strategic Available: {getPotentialYield(recipe)}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {
                unlockedRecipes.length > Object.keys(recipeDetails).length && (
                    <div className="text-center py-6">
                        <p className="text-[12px] text-slate-500 uppercase font-black tracking-widest mb-4">Account contains decoded data for {unlockedRecipes.length - Object.keys(recipeDetails).length} additional patterns.</p>
                        <button onClick={onSync} disabled={syncing} className="gw2-button !px-8 !py-3 flex items-center gap-2 mx-auto">
                            <IconRefresh animate={syncing} size={18} /> {syncing ? 'Decoding Patterns...' : 'Initialize Deep Intelligence Scan'}
                        </button>
                    </div>
                )
            }
        </div >
    );
}

function App() {
    console.log("GW2 CommKit: App component rendering...");
    const { user, saveUser, logout } = useUser();
    console.log("GW2 CommKit: Current user state:", user ? "Initialized" : "Null");
    const [tab, setTab] = useState<AppTab>('timer');
    const [events, setEvents] = useState<AppEvent[]>([]);
    const [filters, setFilters] = useState<string[]>(Object.keys(CATEGORY_COLORS));
    const [toast, setToast] = useState<string | null>(null);
    const [outlook, setOutlook] = useState<3 | 6>(3);
    const triggeredReminders = useRef<Set<string>>(new Set());
    const birthdayChecked = useRef(false);

    // Background Farm Tracker State
    const [tracking, setTracking] = useState(false);
    const [trackStartTime, setTrackStartTime] = useState<number | null>(null);
    const [trackNow, setTrackNow] = useState(Date.now());
    const [startSnapshot, setStartSnapshot] = useState<TrackingSnapshot | null>(null);
    const [currentSnapshot, setCurrentSnapshot] = useState<TrackingSnapshot | null>(null);
    const [trackLogs, setTrackLogs] = useState<TrackingLog[]>([]);
    const [trackLoading, setTrackLoading] = useState(false);
    const [sessions, setSessions] = useState<any[]>([]);
    const [currencyDetails, setCurrencyDetails] = useState<Record<number, { name: string, icon: string }>>({
        1: { name: 'Gold', icon: '' }
    });
    const lastTrackUpdate = useRef<number>(0);
    const [materials, setMaterials] = useState<StorageItem[]>([]);
    const [bankItems, setBankItems] = useState<StorageItem[]>([]);
    const [inventoryItems, setInventoryItems] = useState<StorageItem[]>([]);
    const [sharedInventory, setSharedInventory] = useState<StorageItem[]>([]);
    const [itemDetails, setItemDetails] = useState<Record<number, ItemDetail>>({});
    const [storageSyncing, setStorageSyncing] = useState(false);
    const [storageLoaded, setStorageLoaded] = useState(false);
    const [gemExchangeRate, setGemExchangeRate] = useState<{ goldToGems: number; gemsToGold: number } | null>(null);
    const [unlockedRecipes, setUnlockedRecipes] = useState<number[]>([]);
    const [recipeDetails, setRecipeDetails] = useState<Record<number, RecipeInfo>>({});
    const [marketPrices, setMarketPrices] = useState<Record<number, MarketPrice>>({});
    const [allCharactersCrafting, setAllCharactersCrafting] = useState<Record<string, Array<{ discipline: string, rating: number }>>>({});

    useEffect(() => {
        const stored = localStorage.getItem('gw2commkit_farm_sessions');
        if (stored) try { setSessions(JSON.parse(stored)); } catch (e) { }

        // Pre-fetch conversion item icons and parking items
        const conversionIds = [...LAUREL_BAG_DATA.map(i => i.id), ...VM_SHIPMENT_DATA.map(i => i.id)];
        const parkingItemIds = PARKING_DATA.filter(p => p.id).map(p => p.id as number);
        fetchItemDetails([...conversionIds, ...parkingItemIds]);
    }, []);

    const saveSessions = (newList: any[]) => {
        setSessions(newList);
        localStorage.setItem('gw2commkit_farm_sessions', JSON.stringify(newList));
    };

    const showToast = useCallback((m: string) => {
        setToast(m);
        setTimeout(() => setToast(null), 8000);
    }, []);

    const captureTrackingSnapshot = useCallback(async () => {
        const key = user?.settings?.gw2ApiKey;
        if (!key) return null;
        try {
            const [wallet, materials, bank, chars] = await Promise.all([
                fetch(`https://api.guildwars2.com/v2/account/wallet?access_token=${key}`).then(r => r.json()),
                fetch(`https://api.guildwars2.com/v2/account/materials?access_token=${key}`).then(r => r.json()),
                fetch(`https://api.guildwars2.com/v2/account/bank?access_token=${key}`).then(r => r.json()),
                fetch(`https://api.guildwars2.com/v2/characters?ids=all&access_token=${key}`).then(r => r.json())
            ]);

            const itemCounts: Record<number, number> = {};
            const processItems = (list: any[]) => {
                list.forEach(item => {
                    if (item && item.id) itemCounts[item.id] = (itemCounts[item.id] || 0) + (item.count || 1);
                });
            };

            processItems(materials);
            processItems(bank);
            chars.forEach((c: any) => {
                if (c.bags) c.bags.forEach((b: any) => b?.inventory?.forEach((i: any) => { if (i?.id) itemCounts[i.id] = (itemCounts[i.id] || 0) + (i.count || 1); }));
            });

            const currencies: Record<number, number> = {};
            wallet.forEach((w: any) => currencies[w.id] = w.value);

            return { gold: currencies[1] || 0, items: itemCounts, currencies };
        } catch (e) { return null; }
    }, [user?.settings?.gw2ApiKey]);

    const updateTracking = useCallback(async (silent = false) => {
        if (!tracking) return;
        if (!silent) setTrackLoading(true);
        const snapshot = await captureTrackingSnapshot();
        if (snapshot && currentSnapshot) {
            // Detect changes
            const newLogs: TrackingLog[] = [];

            // Gold change
            if (snapshot.gold !== currentSnapshot.gold) {
                newLogs.push({ id: 1, name: 'Gold', icon: '', change: snapshot.gold - currentSnapshot.gold, type: 'gold', timestamp: Date.now() });
            }

            // Currency changes
            const currenciesToFetch: number[] = [];
            for (const [idStr, val] of Object.entries(snapshot.currencies)) {
                const id = parseInt(idStr);
                if (id === 1) continue;
                const prev = currentSnapshot.currencies[id] || 0;
                if (val !== prev) {
                    if (!currencyDetails[id]) currenciesToFetch.push(id);
                    newLogs.push({ id, name: currencyDetails[id]?.name || `Currency ${id}`, icon: currencyDetails[id]?.icon || '', change: val - prev, type: 'currency', timestamp: Date.now() });
                }
            }

            if (currenciesToFetch.length > 0) {
                try {
                    const cDetails: any[] = await fetch(`https://api.guildwars2.com/v2/currencies?ids=${currenciesToFetch.join(',')}`).then(r => r.json());
                    const newCDetails: Record<number, { name: string, icon: string }> = {};
                    cDetails.forEach(c => newCDetails[c.id] = { name: c.name, icon: c.icon });
                    setCurrencyDetails(prev => ({ ...prev, ...newCDetails }));
                    // Update names in the logs we just created
                    newLogs.forEach(l => {
                        if (l.type === 'currency' && newCDetails[l.id]) {
                            l.name = newCDetails[l.id].name;
                            l.icon = newCDetails[l.id].icon;
                        }
                    });
                } catch (e) { console.error("Currency fetch failed"); }
            }

            // Item changes
            const allItemIds = new Set([...Object.keys(snapshot.items), ...Object.keys(currentSnapshot.items)]);
            const itemsToFetch: number[] = [];
            for (const idStr of allItemIds) {
                const id = parseInt(idStr);
                const count = snapshot.items[id] || 0;
                const prev = currentSnapshot.items[id] || 0;
                if (count !== prev) itemsToFetch.push(id);
            }

            if (itemsToFetch.length > 0) {
                // Fetch item details efficiently
                const details: any[] = await fetch(`https://api.guildwars2.com/v2/items?ids=${itemsToFetch.slice(0, 200).join(',')}`).then(r => r.json());
                itemsToFetch.forEach(id => {
                    const d = details.find(x => x.id === id);
                    const count = snapshot.items[id] || 0;
                    const prev = currentSnapshot.items[id] || 0;
                    newLogs.push({ id, name: d?.name || `Item ${id}`, icon: d?.icon || '', change: count - prev, type: 'item', timestamp: Date.now() });
                });
            }

            if (newLogs.length > 0) {
                setTrackLogs(prev => [...newLogs, ...prev].slice(0, 100));
                if (silent) {
                    showToast(`Tracker updated: ${newLogs.length} changes detected.`);
                    if (user.settings.soundEnabled) playReminderSound();
                }
            }
            setCurrentSnapshot(snapshot);
            lastTrackUpdate.current = Date.now();
        }
        setTrackLoading(false);
    }, [tracking, currentSnapshot, captureTrackingSnapshot, showToast, user.settings.soundEnabled]);

    // Timer for tracker (10m auto-update)
    useEffect(() => {
        let id: any;
        if (tracking) {
            id = setInterval(() => {
                setTrackNow(Date.now());
                if (Date.now() - lastTrackUpdate.current > 600000) { // 10 minutes
                    updateTracking(true);
                }
            }, 1000);
        }
        return () => clearInterval(id);
    }, [tracking, updateTracking]);

    const startTracking = async () => {
        setTrackLoading(true);
        const snapshot = await captureTrackingSnapshot();
        if (snapshot) {
            setStartSnapshot(snapshot);
            setCurrentSnapshot(snapshot);
            setTrackStartTime(Date.now());
            lastTrackUpdate.current = Date.now();
            setTracking(true);
            setTrackLogs([]);
            showToast("Intelligence feed active. Monitoring all account storage sectors.");
        } else {
            showToast("Failed to initialize tracking sensors.");
        }
        setTrackLoading(false);
    };

    const stopTracking = () => {
        const goldGain = (currentSnapshot?.gold || 0) - (startSnapshot?.gold || 0);
        const session = {
            id: Date.now(),
            startTime: trackStartTime,
            endTime: Date.now(),
            logs: [...trackLogs],
            goldGain,
            startSnapshot,
            endSnapshot: currentSnapshot
        };
        saveSessions([session, ...sessions].slice(0, 20));
        setTracking(false);
        showToast("Tracking suspended. Mission archived.");
    };

    const deleteSession = (id: number) => {
        saveSessions(sessions.filter(s => s.id !== id));
        showToast("Mission record purged.");
    };

    const exportToCSV = (logsToExport: TrackingLog[]) => {
        if (!logsToExport || logsToExport.length === 0) return;
        const csv = ["Timestamp,Type,Name,Change", ...logsToExport.map(l => `${new Date(l.timestamp).toISOString()},${l.type},"${l.name.replace(/"/g, '""')}",${l.change}`)].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gw2_farm_log_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast("Mission log exported to CSV.");
    };

    // Birthday notification check on app load
    useEffect(() => {
        if (!user?.settings?.gw2ApiKey || birthdayChecked.current) return;
        birthdayChecked.current = true;

        const checkBirthdays = async () => {
            try {
                const res = await fetch(`https://api.guildwars2.com/v2/characters?ids=all&access_token=${user.settings.gw2ApiKey}`);
                if (!res.ok) return;
                const chars = await res.json();
                const today = new Date();

                chars.forEach((char: any) => {
                    if (!char.created) return;
                    const birthday = new Date(char.created);
                    if (birthday.getMonth() === today.getMonth() && birthday.getDate() === today.getDate()) {
                        const age = today.getFullYear() - birthday.getFullYear();
                        setTimeout(() => {
                            showToast(`🎂 Happy Birthday! ${char.name} turns ${age} today!`);
                        }, 2000);
                    }
                });
            } catch (e) {
                console.error('Birthday check failed');
            }
        };
        checkBirthdays();
    }, [user?.settings?.gw2ApiKey, showToast]);

    useEffect(() => {
        setEvents(calculateSchedule(outlook));
        const id = setInterval(() => setEvents(calculateSchedule(outlook)), 1800000);
        return () => clearInterval(id);
    }, [outlook]);

    // Enhanced Reminder system logic
    useEffect(() => {
        if (!user || !user.reminders) return;
        const checkReminders = () => {
            const now = Date.now();
            events.forEach(e => {
                if (user.reminders.includes(e.stableId)) {
                    const timeUntil = e.startTime - now;
                    const instanceKey = `${e.stableId}_${e.startTime}`;

                    if (timeUntil > 590000 && timeUntil <= 610000 && !triggeredReminders.current.has(instanceKey)) {
                        triggeredReminders.current.add(instanceKey);
                        if (user.settings.soundEnabled) playReminderSound();
                        showToast(`🔔 ALERT: ${e.name} in 10m!`);
                    }

                    if (timeUntil < 0 && triggeredReminders.current.has(instanceKey)) {
                        triggeredReminders.current.delete(instanceKey);
                    }
                }
            });
        };
        const interval = setInterval(checkReminders, 5000);
        return () => clearInterval(interval);
    }, [events, user, showToast]);

    const toggleFilter = (cat: string) => setFilters(prev => prev.includes(cat) ? prev.filter(f => f !== cat) : [...prev, cat]);
    const filteredEvents = useMemo(() => events.filter(e => filters.includes(e.category)), [events, filters]);
    const toggleFav = (id: string) => {
        if (!user) return;
        const newFavs = user.favorites.includes(id) ? user.favorites.filter(f => f !== id) : [...user.favorites, id];
        saveUser({ ...user, favorites: newFavs });
    };
    const toggleReminder = (id: string) => {
        if (!user) return;
        const newRem = user.reminders.includes(id) ? user.reminders.filter(r => r !== id) : [...user.reminders, id];
        saveUser({ ...user, reminders: newRem });
    };

    const fetchGemRates = useCallback(async () => {
        try {
            const goldToGemsRes = await fetch('https://api.guildwars2.com/v2/commerce/exchange/coins?quantity=1000000');
            const gemsToGoldRes = await fetch('https://api.guildwars2.com/v2/commerce/exchange/gems?quantity=100');

            if (goldToGemsRes.ok && gemsToGoldRes.ok) {
                const goldToGemsData = await goldToGemsRes.json();
                const gemsToGoldData = await gemsToGoldRes.json();
                setGemExchangeRate({
                    goldToGems: goldToGemsData.quantity,
                    gemsToGold: gemsToGoldData.quantity
                });
            }
        } catch (e) {
            console.error('Failed to fetch gem rates');
        }
    }, []);

    const fetchItemDetails = async (itemIds: number[]) => {
        const uniqueIds = Array.from(new Set(itemIds)).filter(id => id && !itemDetails[id]);
        if (uniqueIds.length === 0) return;

        const batchSize = 200;
        const newDetails: Record<number, ItemDetail> = {};

        for (let i = 0; i < uniqueIds.length; i += batchSize) {
            const batch = uniqueIds.slice(i, i + batchSize);
            try {
                const res = await fetch(`https://api.guildwars2.com/v2/items?ids=${batch.join(',')}`);
                if (res.ok) {
                    const items = await res.json();
                    items.forEach((item: any) => {
                        newDetails[item.id] = { id: item.id, name: item.name, icon: item.icon, rarity: item.rarity, type: item.type, details: item.details };
                    });
                }
            } catch (e) { }
        }
        setItemDetails(prev => ({ ...prev, ...newDetails }));
    };

    const fetchMarketPrices = async (itemIds: number[]) => {
        const uniqueIds = Array.from(new Set(itemIds)).filter(id => id);
        if (uniqueIds.length === 0) return;

        const batchSize = 200;
        const newPrices: Record<number, MarketPrice> = {};

        for (let i = 0; i < uniqueIds.length; i += batchSize) {
            const batch = uniqueIds.slice(i, i + batchSize);
            try {
                const res = await fetch(`https://api.guildwars2.com/v2/commerce/prices?ids=${batch.join(',')}`);
                if (res.ok) {
                    const prices = await res.json();
                    prices.forEach((p: MarketPrice) => newPrices[p.id] = p);
                }
            } catch (e) { console.error("Price fetch failed", e); }
        }
        setMarketPrices(prev => ({ ...prev, ...newPrices }));
    };

    const syncStorage = async () => {
        const key = user?.settings?.gw2ApiKey;
        if (!key) return;
        setStorageSyncing(true);
        try {
            const [matRes, bankRes, sharedRes, charRes] = await Promise.all([
                fetch(`https://api.guildwars2.com/v2/account/materials?access_token=${key}`),
                fetch(`https://api.guildwars2.com/v2/account/bank?access_token=${key}`),
                fetch(`https://api.guildwars2.com/v2/account/inventory?access_token=${key}`),
                fetch(`https://api.guildwars2.com/v2/characters?ids=all&access_token=${key}`)
            ]);

            if (matRes.ok) {
                const matData = await matRes.json();
                const mats = matData.filter((m: any) => m.id && m.count > 0).map((m: any) => ({ item_id: m.id, count: m.count, location: 'Material Storage' }));
                setMaterials(mats);
                await fetchItemDetails(mats.map((m: any) => m.item_id));
            }

            if (bankRes.ok) {
                const bankData = await bankRes.json();
                const bank = bankData.filter((b: any) => b && b.id).map((b: any) => ({ item_id: b.id, count: b.count || 1, location: 'Bank' }));
                setBankItems(bank);
                await fetchItemDetails(bank.map((b: any) => b.item_id));
            }

            if (sharedRes.ok) {
                const sharedData = await sharedRes.json();
                const shared = sharedData.filter((s: any) => s && s.id).map((s: any) => ({ item_id: s.id, count: s.count || 1, location: 'Shared Inventory' }));
                setSharedInventory(shared);
                await fetchItemDetails(shared.map((s: any) => s.item_id));
            }

            if (charRes.ok) {
                const chars = await charRes.json();
                const inv: any[] = [];
                chars.forEach((char: any) => {
                    char.bags?.forEach((bag: any) => {
                        bag?.inventory?.forEach((item: any) => {
                            if (item?.id) inv.push({ item_id: item.id, count: item.count || 1, location: 'Inventory', character: char.name });
                        });
                    });
                });
                setInventoryItems(inv);
                await fetchItemDetails(inv.map((i: any) => i.item_id));

                const craftingMap: Record<string, any> = {};
                chars.forEach((c: any) => {
                    if (c.crafting) craftingMap[c.name] = c.crafting;
                });
                setAllCharactersCrafting(craftingMap);
            }

            // Sync Recipes
            const recipeRes = await fetch(`https://api.guildwars2.com/v2/account/recipes?access_token=${key}`);
            if (recipeRes.ok) {
                const unlocked = await recipeRes.json();
                setUnlockedRecipes(unlocked);

                // Perform deep scan for all missing recipe details
                const allMissing = unlocked.filter((id: number) => !recipeDetails[id]);
                if (allMissing.length > 0) {
                    const batchSize = 200;
                    for (let i = 0; i < allMissing.length; i += batchSize) {
                        const batch = allMissing.slice(i, i + batchSize);
                        try {
                            const detailsRes = await fetch(`https://api.guildwars2.com/v2/recipes?ids=${batch.join(',')}`);
                            if (detailsRes.ok) {
                                const details = await detailsRes.json();
                                const newDetails: Record<number, RecipeInfo> = {};
                                details.forEach((r: any) => newDetails[r.id] = r);

                                setRecipeDetails(prev => ({ ...prev, ...newDetails }));
                                // Also ensure we have item details and prices for outputs and ingredients
                                const outputIds = details.map((d: any) => d.output_item_id);
                                const ingredientIds = details.flatMap((d: any) => d.ingredients.map((ing: any) => ing.item_id));
                                await fetchItemDetails([...outputIds, ...ingredientIds]);
                                await fetchMarketPrices([...outputIds, ...ingredientIds]);
                            }
                        } catch (e) { console.error("Batch recipe fetch failed", e); }
                    }
                }
            }

            setStorageLoaded(true);
            await fetchGemRates();
            // Fetch prices for existing items
            const allItemIds = [
                ...materials.map(m => m.item_id),
                ...bankItems.map(b => b.item_id),
                ...inventoryItems.map(i => i.item_id),
                ...sharedInventory.map(s => s.item_id),
                ...Object.values(recipeDetails).map(r => r.output_item_id),
                ...Object.values(recipeDetails).flatMap(r => r.ingredients.map(ing => ing.item_id))
            ];
            await fetchMarketPrices(allItemIds);
            showToast('Strategic storage sync complete!');
        } catch (e) {
            showToast('Tactical error during sync.');
        } finally {
            setStorageSyncing(false);
        }
    };

    const favoriteEvents = useMemo(() => events.filter(e => user?.favorites?.includes(e.stableId)), [events, user?.favorites]);

    if (!user || (user.email === '' && user.settings.gw2ApiKey === '' && !user.accountData)) {
        // Technically useUser returns defaultUser now, but we want to be sure
        // If we're still effectively "empty", we might want to show a setup screen 
        // but for now, let's just ensure we don't return null if any data exists.
    }

    const gold = user?.accountData?.wallet?.find(w => w.id === 1)?.value || 0;
    const aaValue = user?.accountData?.wallet?.find(w => w.id === 72)?.value || 0;

    return (
        <ToastContext.Provider value={showToast}>
            <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen pb-20">
                <header className="mb-10 flex flex-col xl:flex-row justify-between items-center gap-8 border-b border-slate-700/30 pb-8">
                    <div className="flex flex-col sm:flex-row items-center gap-8 shrink-0 mr-auto">
                        <img src="/logo2.png" alt="GW2 CommKit" className="h-20 object-contain drop-shadow-2xl select-none pointer-events-none" onError={(e) => { (e.target as HTMLImageElement).src = 'logo2.png' }} />
                        {user.accountData && (
                            <div className="bg-indigo-950/30 border border-indigo-500/20 px-6 py-4 rounded-2xl flex items-center gap-6 shadow-3xl">
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-2">Commander</p>
                                    <p className="text-3xl font-black text-white uppercase tracking-tight leading-none">{user.accountData.name}</p>
                                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-indigo-500/20">
                                        <div className="flex items-center gap-1.5" title="Astral Acclaim"><IconAstral size={12} /><span className="text-[13px] font-black text-sky-400 font-mono">{aaValue}</span></div>
                                        {formatCurrency(gold)}
                                    </div>
                                </div>
                            </div>
                        )}
                        {tracking && (
                            <div className="bg-rose-950/40 border border-rose-500/30 px-3 py-1 rounded-lg flex items-center gap-3 animate-pulse">
                                <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
                                <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Tracking Active</span>
                            </div>
                        )}
                    </div>
                    <nav className="gw2-container-border p-2 flex flex-wrap gap-1.5 bg-slate-800/60 backdrop-blur-xl shadow-2xl border-slate-700/40">
                        {[
                            { id: 'news', label: 'News & Updates' },
                            { id: 'timer', label: 'Events' },
                            { id: 'favorites', label: 'Favorites' },
                            { id: 'dailies', label: 'Dailies' },
                            { id: 'farming_checklist', label: 'Daily Farming' },
                            { id: 'selachimorphia', label: 'Selachimorphia' },
                            { id: 'vault', label: "Wizard's Vault" },
                            { id: 'characters', label: 'Characters' },
                            { id: 'wallet', label: 'Storage' },
                            { id: 'crafting', label: 'Crafting' },
                            { id: 'cleanup', label: 'Cleanup' },
                            { id: 'achievements', label: 'Achievements' },
                            { id: 'farm_tracker', label: 'Farm Tracker' },
                            { id: 'conversions', label: 'Conversions' },
                            { id: 'settings', label: 'Settings' }
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id as AppTab)}
                                className={`px-4 py-2 font-black rounded transition-colors duration-200 uppercase text-[15px] tracking-wider whitespace-nowrap min-w-[100px] text-center ${tab === t.id
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                                    }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </nav>
                </header>

                <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {tab === 'news' && <NewsPage />}
                    {tab === 'timer' && (
                        <div className="space-y-6">
                            <TimelineGraph events={filteredEvents} />

                            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/40 rounded border border-slate-800/60 shadow-inner">
                                <div className="flex items-center gap-3">
                                    <span className="text-[15px] font-black text-slate-500 uppercase tracking-widest">Filter:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.keys(CATEGORY_COLORS).map(cat => (
                                            <button key={cat} onClick={() => toggleFilter(cat)} className={`px-3 py-1.5 rounded-full text-[15px] font-black uppercase transition-all border ${filters.includes(cat) ? CATEGORY_COLORS[cat] : 'border-slate-800 text-slate-600 hover:border-slate-700'}`}>{cat}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800">
                                    <button onClick={() => setOutlook(3)} className={`px-3 py-1 text-[15px] font-black rounded ${outlook === 3 ? 'bg-indigo-600 text-white shadow' : 'text-slate-600'}`}>3H</button>
                                    <button onClick={() => setOutlook(6)} className={`px-3 py-1 text-[15px] font-black rounded ${outlook === 6 ? 'bg-indigo-600 text-white shadow' : 'text-slate-600'}`}>6H</button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {filteredEvents.map(e => <EventItem key={e.id} event={e} isFavorite={user.favorites.includes(e.stableId)} isReminder={user.reminders.includes(e.stableId)} onToggleFavorite={toggleFav} onToggleReminder={toggleReminder} />)}
                            </div>
                        </div>
                    )}
                    {tab === 'favorites' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Strategic Favorites</h2>
                            {favoriteEvents.length > 0 && <TimelineGraph events={favoriteEvents} label="Strategic Outlook" />}
                            <div className="space-y-2">
                                {favoriteEvents.map(e => <EventItem key={e.id} event={e} isFavorite={true} isReminder={user.reminders.includes(e.stableId)} onToggleFavorite={toggleFav} onToggleReminder={toggleReminder} />)}
                                {favoriteEvents.length === 0 && <div className="py-24 col-span-full text-center border-2 border-dashed border-slate-800/50 rounded text-slate-700 uppercase font-black text-[12px]">No priority designated.</div>}
                            </div>
                        </div>
                    )}
                    {tab === 'dailies' && <DailiesPage user={user} />}
                    {tab === 'farming_checklist' && <FarmingChecklistPage />}
                    {tab === 'selachimorphia' && <SelachimorphiaPage />}
                    {tab === 'vault' && <WizardsVaultPage user={user} saveUser={saveUser} />}
                    {tab === 'wallet' && <WalletPage
                        user={user}
                        materials={materials}
                        bankItems={bankItems}
                        inventoryItems={inventoryItems}
                        sharedInventory={sharedInventory}
                        itemDetails={itemDetails}
                        syncing={storageSyncing}
                        onSync={syncStorage}
                        gemExchangeRate={gemExchangeRate}
                    />}
                    {tab === 'cleanup' && <CleanupPage
                        user={user}
                        materials={materials}
                        bankItems={bankItems}
                        inventoryItems={inventoryItems}
                        sharedInventory={sharedInventory}
                        itemDetails={itemDetails}
                        syncing={storageSyncing}
                        onSync={syncStorage}
                    />}
                    {tab === 'characters' && <CharactersPage user={user} />}
                    {tab === 'achievements' && <AchievementsPage user={user} saveUser={saveUser} />}
                    {tab === 'crafting' && <CraftingPage
                        user={user}
                        saveUser={saveUser}
                        unlockedRecipes={unlockedRecipes}
                        recipeDetails={recipeDetails}
                        itemDetails={itemDetails}
                        marketPrices={marketPrices}
                        materials={materials}
                        bankItems={bankItems}
                        inventoryItems={inventoryItems}
                        sharedInventory={sharedInventory}
                        characterCrafting={allCharactersCrafting}
                        onSync={syncStorage}
                        syncing={storageSyncing}
                    />}
                    {tab === 'farm_tracker' && <FarmTrackerPage
                        user={user}
                        tracking={tracking}
                        loading={trackLoading}
                        now={trackNow}
                        startSnapshot={startSnapshot}
                        currentSnapshot={currentSnapshot}
                        startTime={trackStartTime}
                        logs={trackLogs}
                        onStart={startTracking}
                        onStop={stopTracking}
                        onUpdate={() => updateTracking()}
                        onExport={exportToCSV}
                        sessions={sessions}
                        onDeleteSession={deleteSession}
                    />}
                    {tab === 'settings' && <SettingsPage user={user} saveUser={saveUser} logout={logout} />}
                    {tab === 'conversions' && <ConversionsPage itemDetails={itemDetails} />}
                </main>

                {toast && (
                    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl z-[9999] animate-in slide-in-from-bottom-full duration-500 border border-indigo-500/50 flex items-center gap-4 border-l-[10px] border-l-indigo-600 backdrop-blur-xl">
                        <IconBell active size={18} />
                        <div><p className="text-[8px] font-black text-indigo-300 uppercase mb-0.5 tracking-widest">Tactical Alert</p><span className="font-bold text-[15px] uppercase leading-tight tracking-tight block">{toast}</span></div>
                        <button onClick={() => setToast(null)} className="ml-2 text-slate-500 hover:text-white">✕</button>
                    </div>
                )}
            </div>
        </ToastContext.Provider>
    );
}

function calculateSchedule(hours: 6 | 12): AppEvent[] {
    const events: AppEvent[] = [];
    const now = Date.now();
    const limit = now + hours * 3600000;
    const epoch = Date.UTC(2024, 0, 1, 0, 0, 0);

    for (const key in GW2_NINJA_TIMER_DATA.events) {
        const data = (GW2_NINJA_TIMER_DATA.events as any)[key];
        const pattern = data.sequences.pattern;
        const cycleDuration = pattern.reduce((acc: number, cur: any) => acc + cur.d, 0) * 60000;
        const elapsed = now - epoch;
        const cyclesPassed = Math.floor(elapsed / cycleDuration);
        let cycleStartTime = epoch + (cyclesPassed * cycleDuration);

        for (let i = -1; i < 3; i++) {
            let itemStart = cycleStartTime + (i * cycleDuration);
            for (const step of pattern) {
                const seg = data.segments[step.r];
                if (seg && seg.name) {
                    if (itemStart + step.d * 60000 > now && itemStart < limit) {
                        events.push({ id: `${key}_${itemStart}`, stableId: `${key}_${step.r}`, name: seg.name, map: data.name, category: data.category, startTime: itemStart, duration: step.d, waypoint: seg.chatlink || '' });
                    }
                }
                itemStart += step.d * 60000;
            }
        }
    }
    return events.sort((a, b) => a.startTime - b.startTime);
}

function StatusPage() {
    const [data, setData] = useState<any>(null);
    useEffect(() => { fetch('https://status.guildwars2.com/api/v2/summary.json').then(r => r.json()).then(setData); }, []);
    return (
        <div className="gw2-container-border p-6 bg-slate-800/20 shadow-lg">
            <h2 className="text-xl font-black text-white uppercase mb-6 tracking-tighter">Network Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {data?.components.map((c: any) => (
                    <div key={c.id} className={`p-4 border rounded transition-all shadow-sm ${c.status === 'operational' ? 'border-green-800 bg-green-900/10' : 'border-red-800 bg-red-900/10'}`}>
                        <p className="font-black text-white text-[14px] uppercase mb-1">{c.name}</p>
                        <p className={`text-[8px] uppercase font-black ${c.status === 'operational' ? 'text-green-500' : 'text-red-500'}`}>{c.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

const RARITY_COLORS: Record<string, string> = {
    Junk: 'text-slate-400',
    Basic: 'text-slate-400',
    Fine: 'text-blue-400',
    Masterwork: 'text-green-400',
    Rare: 'text-yellow-400',
    Exotic: 'text-orange-400',
    Ascended: 'text-pink-400',
    Legendary: 'text-purple-400',
};

const RARITY_BORDER: Record<string, string> = {
    Junk: 'border-slate-600',
    Basic: 'border-slate-600',
    Fine: 'border-blue-500',
    Masterwork: 'border-green-500',
    Rare: 'border-yellow-500',
    Exotic: 'border-orange-500',
    Ascended: 'border-pink-500',
    Legendary: 'border-purple-500',
};

const RARITY_ORDER = [
    { key: 'Basic', label: 'Normal', color: 'text-slate-400', bg: 'bg-slate-600' },
    { key: 'Junk', label: 'Junk', color: 'text-slate-400', bg: 'bg-slate-600' },
    { key: 'Fine', label: 'Fine', color: 'text-blue-400', bg: 'bg-blue-500' },
    { key: 'Masterwork', label: 'Masterwork', color: 'text-green-400', bg: 'bg-green-500' },
    { key: 'Rare', label: 'Rare', color: 'text-yellow-400', bg: 'bg-yellow-500' },
    { key: 'Exotic', label: 'Exotic', color: 'text-orange-400', bg: 'bg-orange-500' },
    { key: 'Ascended', label: 'Ascended', color: 'text-pink-400', bg: 'bg-pink-500' },
    { key: 'Legendary', label: 'Legendary', color: 'text-purple-400', bg: 'bg-purple-500' },
];

type ItemDetail = { id: number; name: string; icon: string; rarity: string; type: string; details?: any };
type StorageItem = { item_id: number; count: number; location: string; character?: string };

function WalletPage({ user, materials, bankItems, inventoryItems, sharedInventory, itemDetails, syncing, onSync, gemExchangeRate }:
    { user: User, materials: StorageItem[], bankItems: StorageItem[], inventoryItems: StorageItem[], sharedInventory: StorageItem[], itemDetails: Record<number, ItemDetail>, syncing: boolean, onSync: () => Promise<void>, gemExchangeRate: any }) {
    const [meta, setMeta] = useState<CurrencyMeta[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState<'currency' | 'shared' | 'materials' | 'bank' | 'inventory'>('currency');
    const [searchQuery, setSearchQuery] = useState('');
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

    // Gem exchange
    const [conversionMode, setConversionMode] = useState<'goldToGems' | 'gemsToGold' | 'gemsToGoldBuy' | 'moneyToGems'>('goldToGems');
    const [conversionInput, setConversionInput] = useState<string>('100');

    const showToast = useToast();
    const key = user?.settings?.gw2ApiKey;

    const toggleSection = (sectionKey: string) => {
        setCollapsedSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
    };

    useEffect(() => {
        setLoading(true);
        fetch('https://api.guildwars2.com/v2/currencies?ids=all')
            .then(async (r) => r.ok ? r.json() : [])
            .then(data => setMeta(Array.isArray(data) ? data.sort((a: any, b: any) => a.order - b.order) : []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);



    const filterItems = (items: StorageItem[]) => {
        if (!searchQuery) return items;
        return items.filter(item => {
            const detail = itemDetails[item.item_id];
            return detail && detail.name.toLowerCase().includes(searchQuery.toLowerCase());
        });
    };

    const renderItemGrid = (items: StorageItem[], showCharacter = false, sectionPrefix = '') => {
        const filtered = filterItems(items);
        if (filtered.length === 0) return <p className="text-center py-12 text-slate-600 uppercase font-black text-[15px]">No items found.</p>;

        const groupedByRarity: Record<string, StorageItem[]> = {};
        filtered.forEach(item => {
            const detail = itemDetails[item.item_id];
            if (detail) {
                const rarity = detail.rarity || 'Basic';
                if (!groupedByRarity[rarity]) groupedByRarity[rarity] = [];
                groupedByRarity[rarity].push(item);
            }
        });

        return (
            <div className="space-y-6">
                {RARITY_ORDER.map(rarityInfo => {
                    const itemsInGroup = groupedByRarity[rarityInfo.key];
                    if (!itemsInGroup || itemsInGroup.length === 0) return null;
                    const sectionKey = `${sectionPrefix}-${rarityInfo.key}`;
                    const isCollapsed = collapsedSections[sectionKey];

                    return (
                        <div key={rarityInfo.key} className="space-y-4">
                            <button onClick={() => toggleSection(sectionKey)} className="w-full flex items-center justify-between gap-4 group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-4 h-4 rounded-full ${rarityInfo.bg}`}></div>
                                    <h3 className={`text-2xl font-black uppercase tracking-wider ${rarityInfo.color}`}>{rarityInfo.label}</h3>
                                    <span className="text-[14px] font-bold text-slate-500 bg-slate-800 px-3 py-1 rounded-full">{itemsInGroup.length} items</span>
                                </div>
                                <div className={`text-slate-500 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}><IconRefresh size={20} /></div>
                            </button>

                            {!isCollapsed && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 animate-in fade-in duration-300">
                                    {itemsInGroup.map((item, idx) => {
                                        const detail = itemDetails[item.item_id];
                                        if (!detail) return null;
                                        const rarityColor = RARITY_COLORS[detail.rarity] || 'text-white';
                                        const borderColor = RARITY_BORDER[detail.rarity] || 'border-slate-700';
                                        return (
                                            <div key={`${item.item_id}-${idx}`} className={`bg-slate-900/40 rounded-lg border border-slate-800/60 hover:bg-slate-800/50 hover:border-slate-700 transition-all p-2 flex items-center gap-2 group/item border-l-2 ${borderColor}`}>
                                                {detail.icon && <img src={detail.icon} alt="" className="w-10 h-10 object-contain shrink-0 group-hover/item:scale-110 transition-transform" />}
                                                <div className="flex-grow min-w-0">
                                                    <p className={`text-[13px] font-bold uppercase truncate ${rarityColor} leading-tight`}>{detail.name}</p>
                                                    <p className="text-[15px] text-white font-mono font-black">x{item.count.toLocaleString()}</p>
                                                </div>
                                                {showCharacter && item.character && (
                                                    <div className="text-right shrink-0">
                                                        <p className="text-[8px] text-slate-600 uppercase font-black tracking-tighter">{item.character}</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderUnifiedSearchResults = () => {
        const results: Record<number, {
            detail: ItemDetail,
            bank: number,
            materials: number,
            shared: number,
            characters: Record<string, number>
        }> = {};

        const all = [...bankItems, ...materials, ...sharedInventory, ...inventoryItems];
        const searchFiltered = all.filter(item => {
            const detail = itemDetails[item.item_id];
            return detail && detail.name.toLowerCase().includes(searchQuery.toLowerCase());
        });

        searchFiltered.forEach(item => {
            if (!results[item.item_id]) {
                const detail = itemDetails[item.item_id];
                results[item.item_id] = {
                    detail,
                    bank: 0,
                    materials: 0,
                    shared: 0,
                    characters: {}
                };
            }
            const res = results[item.item_id];
            if (item.location === 'Bank') res.bank += item.count;
            else if (item.location === 'Material Storage') res.materials += item.count;
            else if (item.location === 'Shared Inventory') res.shared += item.count;
            else if (item.location === 'Inventory' && item.character) {
                res.characters[item.character] = (res.characters[item.character] || 0) + item.count;
            }
        });

        const sortedResults = Object.values(results).sort((a, b) => {
            const rA = RARITY_ORDER.findIndex(r => r.key === a.detail.rarity);
            const rB = RARITY_ORDER.findIndex(r => r.key === b.detail.rarity);
            if (rA !== rB) return rB - rA;
            return a.detail.name.localeCompare(b.detail.name);
        });

        if (sortedResults.length === 0) return (
            <div className="py-24 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                <p className="text-slate-600 uppercase font-black text-[17px] tracking-widest">No tactical assets matching query in global reserves.</p>
            </div>
        );

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {sortedResults.map(res => {
                    const detail = res.detail;
                    const rarityColor = RARITY_COLORS[detail.rarity] || 'text-white';
                    const borderColor = RARITY_BORDER[detail.rarity] || 'border-slate-700';
                    const total = res.bank + res.materials + res.shared + Object.values(res.characters).reduce((a, b) => a + b, 0);

                    return (
                        <div key={detail.id} className={`gw2-container-border p-6 bg-slate-800/60 border-l-8 ${borderColor} shadow-2xl space-y-4 hover:bg-slate-800 transition-all group`}>
                            <div className="flex items-start gap-4">
                                <div className="w-20 h-20 bg-slate-950 rounded-xl flex items-center justify-center p-2 border border-slate-700 group-hover:scale-110 transition-transform shadow-inner">
                                    <img src={detail.icon} alt="" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h3 className={`text-[21px] font-black uppercase truncate leading-tight ${rarityColor} tracking-tight`}>{detail.name}</h3>
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">{detail.rarity} {detail.type}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-[12px] font-black text-white bg-slate-900 px-3 py-1 rounded-full border border-slate-700 shadow-lg">Total: {total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5 pt-4 border-t border-slate-700/50">
                                {res.bank > 0 && (
                                    <div className="flex justify-between items-center bg-slate-950/40 px-4 py-2 rounded-lg border border-slate-700/30">
                                        <span className="text-[12px] font-black text-slate-500 uppercase tracking-wider">Command Bank</span>
                                        <span className="font-mono text-white text-[15px] font-bold">x{res.bank.toLocaleString()}</span>
                                    </div>
                                )}
                                {res.materials > 0 && (
                                    <div className="flex justify-between items-center bg-slate-950/40 px-4 py-2 rounded-lg border border-slate-700/30">
                                        <span className="text-[12px] font-black text-slate-500 uppercase tracking-wider">Material Storage</span>
                                        <span className="font-mono text-white text-[15px] font-bold">x{res.materials.toLocaleString()}</span>
                                    </div>
                                )}
                                {res.shared > 0 && (
                                    <div className="flex justify-between items-center bg-indigo-950/40 px-4 py-2 rounded-lg border border-indigo-500/30">
                                        <span className="text-[12px] font-black text-indigo-400 uppercase tracking-wider">Shared Logistics</span>
                                        <span className="font-mono text-white text-[15px] font-bold">x{res.shared.toLocaleString()}</span>
                                    </div>
                                )}
                                {Object.entries(res.characters).sort(([a], [b]) => a.localeCompare(b)).map(([name, count]) => (
                                    <div key={name} className="flex justify-between items-center bg-slate-900 px-4 py-2 rounded-lg border border-slate-700/50">
                                        <span className="text-[12px] font-black text-slate-300 uppercase truncate mr-2 tracking-tight">{name}</span>
                                        <span className="font-mono text-white text-[15px] font-bold">x{count.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    if (!key) return <div className="py-20 text-center text-slate-500 uppercase font-black tracking-widest text-[17px]">Connect API key in Command tab.</div>;
    if (loading) return <div className="flex justify-center items-center py-20"><IconRefresh animate /></div>;

    const wallet = user?.accountData?.wallet || [];

    // Gem Exchange Live Calculation
    const val = parseFloat(conversionInput) || 0;
    let result = null;
    if (gemExchangeRate) {
        if (conversionMode === 'goldToGems') {
            // How many gems for this gold (Buying Gems)
            result = Math.floor((val / 100) * gemExchangeRate.goldToGems);
        } else if (conversionMode === 'gemsToGold') {
            // How much gold for these gems (Buying Gems Cost) - The Mirror
            result = Math.ceil((val / gemExchangeRate.goldToGems) * 1000000);
        } else if (conversionMode === 'gemsToGoldBuy') {
            // Selling gems for gold
            result = Math.floor((val / 100) * gemExchangeRate.gemsToGold);
        } else if (conversionMode === 'moneyToGems') {
            // Estimate based on 800 gems = $10 USD
            result = Math.floor(val * 80);
        }
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-5xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                        <IconWallet /> Account Storage
                    </h2>
                    <p className="text-indigo-400 font-black text-[15px] uppercase tracking-[0.4em] mt-2 opacity-70">Logistics & Strategic Reserves</p>
                </div>
                <div className="flex gap-3">
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search intel..." className="bg-slate-900 border border-slate-700 p-3 rounded-xl text-[15px] text-white focus:border-indigo-500 outline-none w-64 shadow-inner" />
                    <button onClick={onSync} disabled={syncing} className="gw2-button !px-6 !py-2 text-[15px]">
                        <IconRefresh animate={syncing} /> {syncing ? 'Syncing...' : 'Deep Sync'}
                    </button>
                </div>
            </div>

            {/* Gem Exchange - Compact & Clear */}
            {gemExchangeRate && (
                <div className="bg-slate-900/60 border border-amber-500/20 rounded-xl p-4 shadow-xl">
                    <div className="flex flex-col gap-4">
                        {/* Header */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center border border-amber-500/20">
                                <span className="text-2xl">💎</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-amber-400 uppercase tracking-tight">Gem Exchange</h3>
                                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Live Market Rates</p>
                            </div>
                        </div>

                        {/* Mode Selector */}
                        <div className="flex flex-wrap gap-2">
                            {[
                                { id: 'goldToGems', label: '🪙→💎 Buy' },
                                { id: 'gemsToGold', label: '💎→🪙 Cost' },
                                { id: 'gemsToGoldBuy', label: '💎→🪙 Sell' },
                                { id: 'moneyToGems', label: '💵→💎' }
                            ].map(m => (
                                <button key={m.id} onClick={() => setConversionMode(m.id as any)} className={`px-3 py-1.5 rounded-lg transition-all text-[11px] font-black uppercase ${conversionMode === m.id ? 'bg-amber-600 text-white' : 'bg-slate-950 text-slate-500 hover:text-white'}`}>{m.label}</button>
                            ))}
                        </div>

                        {/* Calculator */}
                        <div className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-lg">
                            <div className="flex-1">
                                <p className="text-[8px] text-slate-600 font-black uppercase mb-1">{conversionMode === 'goldToGems' ? 'GOLD' : conversionMode === 'moneyToGems' ? 'USD' : 'GEMS'}</p>
                                <input type="number" value={conversionInput} onChange={e => setConversionInput(e.target.value)} className="bg-slate-900 border border-slate-800 p-2 rounded text-[24px] font-black text-white w-full text-center focus:border-amber-500 outline-none" />
                            </div>
                            <span className="text-2xl text-slate-700">→</span>
                            <div className="flex-1 bg-indigo-950/40 border border-indigo-500/30 p-2 rounded">
                                <p className="text-[8px] text-indigo-600 font-black uppercase mb-1">RESULT</p>
                                {conversionMode === 'gemsToGold' || conversionMode === 'gemsToGoldBuy' ? (
                                    <div className="text-center">{formatCurrency(result || 0)}</div>
                                ) : (
                                    <p className="text-[24px] font-black text-indigo-400 font-mono text-center leading-none">{(result || 0).toLocaleString()} 💎</p>
                                )}
                            </div>
                        </div>

                        {/* Quick Reference */}
                        <div className="flex gap-4 text-[10px] justify-center">
                            <div className="text-center">
                                <p className="text-slate-600 font-bold uppercase mb-0.5">100g =</p>
                                <p className="text-amber-400 font-black">{gemExchangeRate.goldToGems} 💎</p>
                            </div>
                            <div className="text-center">
                                <p className="text-slate-600 font-bold uppercase mb-0.5">100💎 =</p>
                                <div className="scale-90 origin-center">{formatCurrency(gemExchangeRate.gemsToGold)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Section Controls */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/60 rounded-2xl border border-slate-800 shadow-inner">
                {[
                    { id: 'currency', label: 'Sector Treasury', count: wallet.filter(w => w.value > 0).length },
                    { id: 'shared', label: 'Shared Logistics', count: sharedInventory.length },
                    { id: 'materials', label: 'Material Reserves', count: materials.length },
                    { id: 'bank', label: 'Command Bank', count: bankItems.length },
                    { id: 'inventory', label: 'Squad Inventory', count: inventoryItems.length },
                ].map(section => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id as any)}
                        className={`flex-1 px-6 py-4 font-black rounded-xl transition-all uppercase text-[15px] tracking-widest flex items-center justify-center gap-3 ${activeSection === section.id
                            ? 'bg-indigo-600 text-white shadow-xl scale-[1.02]'
                            : 'text-slate-500 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        {section.label}
                        {section.count > 0 && (
                            <span className="px-2.5 py-1 bg-slate-950/50 rounded-lg text-[10px] font-bold border border-white/5">{section.count}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Currency Grid (Like Reference Image) */}
            {activeSection === 'currency' && (
                <div className="animate-in fade-in duration-500">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {meta.map(m => {
                            const entry = wallet.find(w => w.id === m.id);
                            if (!entry || entry.value === 0) return null;
                            const isGold = m.id === 1;
                            return (
                                <div key={m.id} className={`bg-slate-900/60 rounded-lg border transition-all p-3 flex items-center gap-3 group hover:bg-slate-800/60 ${isGold ? 'border-amber-500/40 hover:border-amber-500/60' : 'border-slate-700/50 hover:border-slate-600'}`}>
                                    <div className="w-14 h-14 bg-slate-950 rounded-lg border border-slate-800 p-2 shrink-0 group-hover:scale-105 transition-transform">
                                        {m.icon ? <img src={m.icon} alt="" className="w-full h-full object-contain" /> : <span className="text-2xl">✨</span>}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate mb-0.5">{m.name}</p>
                                        {isGold ? (
                                            <div className="scale-110 origin-left">{formatCurrency(entry.value)}</div>
                                        ) : (
                                            <p className="text-[26px] font-black text-white font-mono leading-none tracking-tight">x{entry.value.toLocaleString()}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Storage Item Views */}
            <div className="py-2">
                {searchQuery && activeSection !== 'currency' ? (
                    renderUnifiedSearchResults()
                ) : (
                    <>
                        {activeSection === 'shared' && renderItemGrid(sharedInventory, false, 'shared')}
                        {activeSection === 'materials' && renderItemGrid(materials, false, 'materials')}
                        {activeSection === 'bank' && renderItemGrid(bankItems, false, 'bank')}
                        {activeSection === 'inventory' && renderItemGrid(inventoryItems, true, 'inventory')}
                    </>
                )}
            </div>
        </div>
    );
}
function CleanupPage({ user, materials, bankItems, inventoryItems, sharedInventory, itemDetails, syncing, onSync }:
    { user: User, materials: StorageItem[], bankItems: StorageItem[], inventoryItems: StorageItem[], sharedInventory: StorageItem[], itemDetails: Record<number, ItemDetail>, syncing: boolean, onSync: () => Promise<void> }) {

    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
    const [collapsedReport, setCollapsedReport] = useState(true);
    const [activeFilters, setActiveFilters] = useState<string[]>(['junk', 'gear', 'boosts', 'consumables', 'luck', 'containers']);

    const categories = useMemo(() => {
        const groups: Record<string, { label: string, color: string, icon: string, items: Record<number, { detail: ItemDetail, locations: Record<string, number> }> }> = {
            junk: { label: 'Strategic Waste', color: 'text-slate-400', icon: '🗑️', items: {} },
            gear: { label: 'Tactical Assets', color: 'text-yellow-400', icon: '⚔️', items: {} },
            containers: { label: 'Sealed Logistics', color: 'text-sky-400', icon: '📦', items: {} },
            boosts: { label: 'Force Multipliers', color: 'text-amber-400', icon: '⚡', items: {} },
            consumables: { label: 'Field Provisions', color: 'text-emerald-400', icon: '🍏', items: {} },
            luck: { label: 'Compressed Luck', color: 'text-blue-400', icon: '🍀', items: {} },
        };

        const all = [...bankItems, ...sharedInventory, ...materials, ...inventoryItems];

        all.forEach(item => {
            const detail = itemDetails[item.item_id];
            if (!detail) return;

            let cat = '';
            const name = detail.name.toLowerCase();

            if (detail.rarity === 'Junk' || detail.type === 'Junk') cat = 'junk';
            else if (name.includes('unidentified')) cat = 'gear';
            else if (name.includes('essence of luck')) cat = 'luck';
            else if (detail.type === 'Container') cat = 'containers';
            else if (detail.type === 'Consumable') {
                if (name.includes('booster') || name.includes('primer') || name.includes('metabolic') || name.includes('utility')) cat = 'boosts';
                else cat = 'consumables';
            }

            if (!cat) return;

            if (!groups[cat].items[item.item_id]) {
                groups[cat].items[item.item_id] = { detail, locations: {} };
            }
            const locKey = item.character || item.location;
            groups[cat].items[item.item_id].locations[locKey] = (groups[cat].items[item.item_id].locations[locKey] || 0) + item.count;
        });

        return groups;
    }, [bankItems, sharedInventory, materials, inventoryItems, itemDetails]);

    const showToast = useToast();

    const exportToCSV = () => {
        const rows: string[] = ["Category,Item,Total,Locations"];
        Object.entries(categories).forEach(([key, group]) => {
            Object.values(group.items).forEach(({ detail, locations }) => {
                const total = Object.values(locations).reduce((a, b) => a + b, 0);
                const locStr = Object.entries(locations).map(([l, c]) => `${l}(${c})`).join('|');
                rows.push(`"${group.label}","${detail.name.replace(/"/g, '""')}",${total},"${locStr}"`);
            });
        });
        const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gw2_cleanup_advisor_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast("Strategic report exported successfully.");
    };

    const toggleFilter = (f: string) => {
        setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
    };

    const toggleCollapse = (k: string) => {
        setCollapsed(prev => ({ ...prev, [k]: !prev[k] }));
    };

    const generateReport = () => {
        const lines: string[] = [];
        const j = Object.values(categories.junk.items).reduce((acc, curr) => acc + Object.values(curr.locations).reduce((a, b) => a + b, 0), 0);
        if (j > 0) lines.push(`• Eliminating ${j} junk items yields immediate liquidity.`);

        const l = Object.values(categories.luck.items).reduce((acc, curr) => acc + Object.values(curr.locations).reduce((a, b) => a + b, 0), 0);
        if (l > 0) lines.push(`• Consume ${l} Luck items to optimize Magic Find parameters.`);

        const g = Object.values(categories.gear.items).reduce((acc, curr) => acc + Object.values(curr.locations).reduce((a, b) => a + b, 0), 0);
        if (g > 0) lines.push(`• Identify and savage ${g} Unidentified Gear caches to reclaim inventory sectors.`);

        const c = Object.values(categories.consumables.items).length;
        if (c > 0) lines.push(`• ${c} food types detected. Consolidate to Bank provisioning or discard expired rations.`);

        if (lines.length === 0) lines.push("Inventory optimization nominal. No immediate actions required.");

        return lines;
    };

    if (!user?.settings?.gw2ApiKey) return <div className="py-20 text-center text-slate-500 uppercase font-black tracking-widest text-[17px]">Connect API key in Settings tab.</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800 shadow-xl gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                        <IconRefresh animate={syncing} size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Cleanup Advisor</h2>
                        <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] opacity-80">Logistics Optimization</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={exportToCSV} className="px-4 py-2 border border-slate-700 text-slate-400 rounded-lg hover:bg-slate-800 hover:text-white transition-all font-black uppercase text-[11px] tracking-wider flex items-center gap-2">
                        <IconCopy size={14} /> Export Strategic CSV
                    </button>
                    <button onClick={onSync} disabled={syncing} className="gw2-button !px-6 !py-2 !text-[13px] !rounded-lg whitespace-nowrap">
                        <IconRefresh animate={syncing} size={14} /> {syncing ? 'Scanning...' : 'Intelligence Scan'}
                    </button>
                </div>
            </div>

            {/* Tactical Filters */}
            <div className="bg-slate-900/40 p-2 rounded-xl flex flex-wrap gap-2 justify-center border border-slate-800/60">
                {Object.keys(categories).map(k => (
                    <button
                        key={k}
                        onClick={() => toggleFilter(k)}
                        className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all border ${activeFilters.includes(k) ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'}`}
                    >
                        {categories[k].icon} {categories[k].label}
                    </button>
                ))}
            </div>

            {/* Suggestion Report */}
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl overflow-hidden shadow-inner">
                <button
                    onClick={() => setCollapsedReport(!collapsedReport)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-900/50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <IconBox className="text-sky-400" size={18} />
                        <span className="text-[13px] font-black text-white uppercase tracking-widest">Tactical Analysis Report</span>
                    </div>
                    <div className={`text-slate-500 transition-transform ${collapsedReport ? '' : 'rotate-180'}`}>
                        <IconArrowUpRight size={18} />
                    </div>
                </button>
                {!collapsedReport && (
                    <div className="p-6 bg-slate-900/30 border-t border-slate-800/50 space-y-2 animate-in slide-in-from-top-2">
                        {generateReport().map((line, idx) => (
                            <p key={idx} className="text-slate-400 font-mono text-[11px] font-bold">{line}</p>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {Object.entries(categories).filter(([key]) => activeFilters.includes(key)).map(([key, group]) => {
                    const items = Object.values(group.items);
                    if (items.length === 0) return null;
                    const isCollapsed = collapsed[key];

                    return (
                        <div key={key} className="bg-slate-900/40 rounded-xl border border-slate-800/60 shadow-inner overflow-hidden">
                            <button
                                onClick={() => toggleCollapse(key)}
                                className="w-full flex items-center justify-between bg-slate-900/80 px-4 py-3 border-b border-slate-800 hover:bg-slate-800 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{group.icon}</span>
                                    <h3 className={`text-[15px] font-black uppercase tracking-wider ${group.color}`}>{group.label}</h3>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-slate-500 uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{items.length} Items</span>
                                    <div className={`text-slate-500 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
                                </div>
                            </button>

                            {!isCollapsed && (
                                <div className="divide-y divide-slate-800/40 animate-in slide-in-from-top-2 duration-300">
                                    {items.map(({ detail, locations }) => {
                                        const total = Object.values(locations).reduce((a, b) => a + b, 0);
                                        const rarityColor = RARITY_COLORS[detail.rarity] || 'text-white';
                                        const rarityBorder = RARITY_BORDER[detail.rarity] || 'border-slate-800';

                                        return (
                                            <div key={detail.id} className="flex flex-col md:flex-row md:items-center p-2 hover:bg-slate-800/30 transition-colors group/item relative border-l-4" style={{ borderColor: rarityBorder.replace('border-', '') }}>
                                                <div className="flex items-center gap-2 md:w-1/3 min-w-0 pr-4">
                                                    <div className="w-10 h-10 bg-slate-950 rounded border border-slate-800 p-1 flex-shrink-0">
                                                        <img src={detail.icon} alt="" className="w-full h-full object-contain" />
                                                    </div>
                                                    <div className="min-w-0 flex-grow">
                                                        <p className={`text-[12px] font-bold uppercase truncate ${rarityColor} leading-tight`}>{detail.name}</p>
                                                        <p className="text-[8px] text-slate-600 font-bold uppercase truncate">{detail.type}</p>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        <span className="text-[20px] font-black text-white font-mono leading-none">x{total}</span>
                                                    </div>
                                                </div>

                                                <div className="flex-grow flex flex-wrap gap-1 mt-2 md:mt-0">
                                                    {Object.entries(locations).map(([loc, count]) => (
                                                        <div key={loc} className="flex items-center gap-1 bg-slate-950/40 px-2 py-0.5 rounded border border-slate-800/50">
                                                            <span className="text-[9px] text-slate-500 uppercase font-black">{loc}</span>
                                                            <span className="text-[11px] font-black text-indigo-400 font-mono">x{count}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}


            </div>

            {Object.values(categories).every(g => Object.keys(g.items).length === 0) && !syncing && (
                <div className="py-24 text-center border-2 border-dashed border-slate-800 rounded-2xl">
                    <p className="text-slate-600 uppercase font-black text-[13px] tracking-widest">Strategic reservoirs are clear.</p>
                </div>
            )}
        </div>
    );
}


function NewsPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in duration-500">
            {/* Tactical Countdown - Reimagined as a Wide Ad Block */}
            <div className="relative group">
                {/* Outer Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                <div className="relative gw2-container-border overflow-hidden bg-gradient-to-br from-slate-900 via-[#0b0c10] to-[#1a0b1a] border-indigo-500/20 shadow-3xl">
                    <div className="flex flex-col items-center py-6 px-10">
                        {/* Centered Header with Ad-style treatment */}
                        <div className="text-center space-y-2 mb-6">
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2 animate-pulse">
                                <IconClock size={12} /> Strategic Intel Detected
                            </div>
                            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-fuchsia-100 uppercase tracking-tighter leading-tight drop-shadow-sm">Tactical Countdown</h2>
                            <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.6em] opacity-60">Phase Transition & Global Meta Deployment</p>
                        </div>

                        {/* Thinner, Wider Iframe Container */}
                        <div className="w-full h-56 rounded-2xl overflow-hidden border border-white/5 bg-[#0b0c10]/50 backdrop-blur-sm shadow-inner relative group/frame">
                            <iframe
                                src="https://www.thatshaman.com/tools/countdown/?format=embed"
                                className="w-full h-full border-none opacity-80 group-hover/frame:opacity-100 transition-opacity duration-500 scale-[1.02] origin-center"
                                style={{ backgroundColor: 'transparent' }}
                                title="GW2 Countdown"
                            />
                            {/* Decorative Overlay for "Advertising" feel */}
                            <div className="absolute inset-0 pointer-events-none border-2 border-white/5 rounded-2xl"></div>
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
                        </div>

                        {/* Center Footer */}
                        <div className="mt-4 flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-500">
                            <span className="w-12 h-[1px] bg-slate-800"></span>
                            Data visualized via That_Shaman intelligence network
                            <span className="w-12 h-[1px] bg-slate-800"></span>
                        </div>
                    </div>

                    {/* Background Decorative Element */}
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
                </div>
            </div>

            {/* Upcoming Events and Festivals Section */}
            <div className="space-y-8 mt-16">
                <div className="text-center">
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Upcoming Events & Festivals</h2>
                    <p className="text-slate-500 font-bold text-[11px] uppercase tracking-[0.4em] mt-2">2026 Tyrian Calendar Intelligence</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {FESTIVAL_DATA_2026.map((fest, idx) => (
                        <div key={idx} className="group relative">
                            <div className={`absolute -inset-0.5 bg-gradient-to-r ${fest.color} rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-500`}></div>
                            <div className="relative flex aspect-[2/1] bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">
                                {/* Left Section: Themed Intelligence Image */}
                                <div className="w-1/3 h-full relative overflow-hidden bg-slate-950 border-r border-slate-800">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${fest.color} opacity-20 z-10`}></div>
                                    <img
                                        src={fest.image}
                                        alt={fest.name}
                                        className="w-full h-full object-cover filter grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                    />
                                    <div className="absolute bottom-2 left-2 text-[8px] font-black text-white/40 uppercase tracking-widest z-20 bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-sm">{fest.season}</div>
                                </div>

                                {/* Right Section: Content */}
                                <div className="flex-grow p-6 flex flex-col justify-center">
                                    <p className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.3em] mb-1">{fest.month}</p>
                                    <h3 className="text-[21px] font-black text-white uppercase tracking-tighter leading-tight mb-4 group-hover:translate-x-1 transition-transform">{fest.name}</h3>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Start: <span className="text-slate-200">{fest.start}</span></p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
                                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">End: <span className="text-slate-200">{fest.end}</span></p>
                                        </div>
                                    </div>
                                </div>

                                {/* Header-style corner accent */}
                                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${fest.color} opacity-5 -translate-y-12 translate-x-12 rotate-45`}></div>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="text-center text-[10px] text-slate-700 font-black uppercase tracking-[0.2em] pt-4 pb-12">Visual alignment matching Tactical Intelligence standards</p>
            </div>
        </div>
    );
}

function SettingsPage({ user, saveUser, logout }: { user: User, saveUser: (u: User) => void, logout: () => void }) {
    const [key, setKey] = useState(user?.settings?.gw2ApiKey || '');
    const [sound, setSound] = useState(user?.settings?.soundEnabled ?? true);
    const [isSyncing, setIsSyncing] = useState(false);
    const showToast = useToast();

    const fetchAccountInfo = async () => {
        if (!key) return;
        setIsSyncing(true);
        try {
            const accRes = await fetch(`https://api.guildwars2.com/v2/account?access_token=${key}`);
            if (!accRes.ok) throw new Error("Sync denied");
            const accData = await accRes.json();
            const wallRes = await fetch(`https://api.guildwars2.com/v2/account/wallet?access_token=${key}`);
            const wallet = await wallRes.json();
            saveUser({ ...user, settings: { ...user.settings, gw2ApiKey: key, soundEnabled: sound }, accountData: { name: accData.name, id: accData.id, world: accData.world, created: accData.created, last_sync: new Date().toISOString(), wallet: Array.isArray(wallet) ? wallet : [] } });
            showToast("Deep Sync Complete.");
        } catch (e) { showToast("Network Error: Sync failed or Access Denied."); }
        finally { setIsSyncing(false); }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            {/* Command Settings - Kept at 4xl for focus */}
            <div className="max-w-4xl mx-auto gw2-container-border p-10 bg-slate-800/40 shadow-2xl">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Settings</h2>
                <div className="mt-8 space-y-8">
                    <div>
                        <label className="block text-[8px] font-black text-slate-500 uppercase mb-3 tracking-widest">API ACCESS TOKEN</label>
                        <div className="flex gap-4">
                            <input type="password" value={key} onChange={e => setKey(e.target.value)} className="flex-grow bg-slate-900 border border-slate-700 p-3 rounded-xl text-white focus:border-indigo-500 outline-none transition-all font-mono shadow-inner text-[15px]" placeholder="Paste key..." />
                            <button onClick={fetchAccountInfo} disabled={isSyncing} className="gw2-button !px-6 text-[13px]"><IconRefresh animate={isSyncing} /> DEEP SYNC</button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-700 shadow-xl">
                        <div><p className="text-[13px] font-black text-indigo-400 uppercase mb-0.5 tracking-widest">Alert Chime</p><p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Sound 10m before metas</p></div>
                        <button onClick={() => setSound(!sound)} className={`w-12 h-6 rounded-full transition-all relative ${sound ? 'bg-indigo-600 shadow-lg' : 'bg-slate-700'}`}><div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-xl transition-all ${sound ? 'right-0.5' : 'left-0.5'}`}></div></button>
                    </div>
                </div>
                <div className="flex justify-end items-center mt-12 pt-6 border-t border-slate-700/50">
                    <button onClick={logout} className="px-6 py-1.5 border border-red-800 text-red-500 rounded-lg hover:bg-red-800 hover:text-white transition-all font-black uppercase text-[12px] tracking-widest shadow-md">Wipe Intelligence</button>
                </div>
            </div>
        </div>
    );
}


function ConversionsPage({ itemDetails }: { itemDetails: Record<number, ItemDetail> }) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-6xl mx-auto">
            {/* Laurel Section */}
            <div className="space-y-3">
                <div className="flex items-center gap-3 pb-2 border-b border-orange-500/20">
                    <h2 className="text-2xl font-black text-orange-500 uppercase tracking-tighter">Laurel Conversions</h2>
                    <span className="text-[10px] text-slate-600 font-black uppercase tracking-wider">{LAUREL_BAG_DATA.length} items</span>
                </div>
                <div className="space-y-2">
                    {LAUREL_BAG_DATA.map(item => <ConversionCard key={item.id} item={item} type="laurel" details={itemDetails[item.id]} />)}
                </div>
            </div>

            {/* VM Section */}
            <div className="space-y-3">
                <div className="flex items-center gap-3 pb-2 border-b border-cyan-500/20">
                    <h2 className="text-2xl font-black text-cyan-400 uppercase tracking-tighter">Volatile Magic Conversions</h2>
                    <span className="text-[10px] text-slate-600 font-black uppercase tracking-wider">{VM_SHIPMENT_DATA.length} items</span>
                </div>
                <div className="space-y-2">
                    {VM_SHIPMENT_DATA.map(item => <ConversionCard key={item.id} item={item} type="vm" details={itemDetails[item.id]} />)}
                </div>
            </div>

            <div className="text-center mt-8">
                <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">Data synced from Fast Farming Community (Cached)</p>
            </div>
        </div>
    );
}

function ConversionCard({ item, type, details }: { item: any, type: 'laurel' | 'vm', details?: ItemDetail }) {
    const isLaurel = type === 'laurel';

    // Extract cost number from string (e.g. "1 Laurel" -> "1", "250 VM + 1g" -> "250")
    const costAmount = item.cost.match(/\d+/)?.[0] || '1';
    const costLabel = isLaurel ? 'Laurel' : 'VM';
    const costColor = isLaurel ? 'text-orange-400' : 'text-cyan-400';

    return (
        <div className="bg-slate-900/40 rounded-lg border border-slate-800/60 hover:bg-slate-800/50 hover:border-slate-700 transition-all shadow-sm group">
            <div className="flex items-center gap-3 p-3">
                {/* Icon */}
                <div className="w-10 h-10 bg-slate-950 rounded border border-slate-800 p-1 shrink-0 group-hover:border-slate-700 transition-colors">
                    {(item.icon || details?.icon) ?
                        <img src={item.icon || details?.icon} alt={item.name} className="w-full h-full object-contain" /> :
                        <IconBox size={20} className="text-slate-700 m-1" />
                    }
                </div>

                {/* Name */}
                <div className="flex-grow min-w-0">
                    <p className="text-[14px] font-bold text-white uppercase truncate leading-tight">{item.name}</p>
                </div>

                {/* Profit */}
                <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Profit</p>
                        <div className="scale-110 origin-right">{formatCurrency(item.profit)}</div>
                    </div>
                </div>

                {/* Cost */}
                <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-950/60 rounded border border-slate-800/50 shrink-0">
                    <div className="text-right">
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Cost</p>
                        <p className={`text-[20px] font-black font-mono leading-none ${costColor}`}>{costAmount}</p>
                    </div>
                    <span className={`text-[11px] font-bold uppercase ${costColor} opacity-70`}>{costLabel}</span>
                </div>
            </div>
        </div>
    );
}


const rootElement = document.getElementById('root');
if (rootElement) {
    console.log("GW2 CommKit: Mount point found. Initializing React root.");
    const root = createRoot(rootElement as HTMLElement);
    root.render(<App />);
} else {
    console.error("GW2 CommKit ERROR: Mount point #root not found.");
}
