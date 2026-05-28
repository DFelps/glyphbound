import type { AreaId, WorldNode, WorldNodeId } from '../types/game';
import { allAreaOrder, regionAreaOrder } from './regions';

export const areaOrder: AreaId[] = regionAreaOrder[1];

export { allAreaOrder, regionAreaOrder };

export const nodes: Record<WorldNodeId, WorldNode> = {
  village: {
    id: 'village',
    name: 'Glyphbound Village',
    shortName: 'Village',
    kind: 'town',
    danger: 0,
    minLevel: 1,
    maxLevel: 1,
    regionId: 1,
    art: [
      '              /\\                         []',
      '             /  \\        ____            ||',
      '        /\\  /____\\      /____\\           ||',
      '       /  \\ | [] |      | [] |           ||',
      '  ____/____\\|____|______|____|____      /__\\',
      ' |  _   _      _      _      _    |    /____\\',
      ' | | | | |    | |    | |    | |   |      ||',
      ' |_| |_| |____|_|____|_|____|_|___|   ___||___',
      '     /\\        /\\              /\\       /____\\',
      '    /__\\      /__\\    ~ village road ~'
    ].join('\n'),
    description: 'Safe place. Rest, choose an area, visit the forge.',
    actions: [
      { id: 'rest', label: 'Rest at the inn', help: 'Recover all HP.' },
      { id: 'go-grove', label: 'Go to Glyphroot Grove', help: 'Area 1. Easier fights. Farm wood.' },
      { id: 'go-mine', label: 'Go to Rust Mine', help: 'Area 1. Better iron and stronger enemies.' },
      { id: 'go-library', label: 'Go to Sunken Library', help: 'Area 1. Pages, rare loot and dangerous enemies.' },
      { id: 'go-forge', label: 'Visit The Old Forge', help: 'Rotating shop. Stock changes every 2 minutes.' },
      { id: 'go-boss', label: 'Open The Watcher Gate', help: 'Locked until the 3 areas are cleared.' }
    ]
  },
  'ashen-refuge': {
    id: 'ashen-refuge',
    name: 'Ashen Refuge',
    shortName: 'Ashen Refuge',
    kind: 'town',
    danger: 1,
    minLevel: 20,
    maxLevel: 40,
    regionId: 2,
    art: [
      '        . . . ash falls . . .',
      '        ____        _______',
      '       / __ \\______/ _____ \\',
      '      / /  \\_ ember _/   \\ \\',
      '     | | [] |______| []  | |',
      '     | |____|  __  |_____| |',
      '     |   __   /  \\   __    |',
      '     |__/  \\_/____\\_/  \\___|',
      '          smoke road >>>',
      '       refuge under black sky'
    ].join('\n'),
    description: 'Second region hub. Mine, enchant, and push deeper.',
    actions: [
      { id: 'rest', label: 'Rest near the ember well', help: 'Recover all HP.' },
      { id: 'go-obsidian', label: 'Go to Obsidian Pit', help: 'Area 2. Level 20+ monsters and obsidian materials.' },
      { id: 'go-cathedral', label: 'Go to Ashen Cathedral', help: 'Area 2. Stronger enemies and ember drops.' },
      { id: 'go-archives', label: 'Go to Void Archives', help: 'Area 2. Dangerous archives and high tier loot.' },
      { id: 'go-forge', label: 'Visit The Old Forge', help: 'Forge now sells tier 2 gear.' },
      { id: 'go-deep-mine', label: 'Enter the 1500 Floor Mine', help: 'Long-form challenge. Reach floor 1000, then 1500.' },
      { id: 'go-enchanter', label: 'Open the Glyph Anvil', help: 'Enchant equipped items from +1 to +20.' },
      { id: 'go-hollow-boss', label: 'Open The Hollow Gate', help: 'Locked until the 3 Ashen Depths areas are cleared.' }
    ]
  },
  'glyphroot-grove': {
    id: 'glyphroot-grove',
    name: 'Glyphroot Grove',
    shortName: 'Grove',
    kind: 'wilds',
    danger: 1,
    minLevel: 1,
    maxLevel: 10,
    regionId: 1,
    art: [
      '          &&&        &&&',
      '       &&&&&&&    &&&&&&&',
      '      &&&  @ &&  && @  &&&',
      '          /|\\      /|\\',
      '     &&  / | \\ && / | \\  &&',
      '        /  |  \\  /  |  \\',
      '       /___|___\\/___|___\\',
      '          *** glyph roots ***',
      '      . . . glowing undergrowth . . .',
      '          { }        { }        { }'
    ].join('\n'),
    description: 'Area 1. Fight 3 times to clear it. Farm wood.',
    actions: [
      { id: 'fight', label: 'Fight nearby monster', help: 'Progresses this area. Rare monsters can appear.' },
      { id: 'gather', label: 'Gather wood', help: 'Farm materials for the forge. Sometimes starts a fight.' },
      { id: 'back-village', label: 'Return to village', help: 'Go back safely.' }
    ]
  },
  'rust-mine': {
    id: 'rust-mine',
    name: 'Rust Mine',
    shortName: 'Mine',
    kind: 'wilds',
    danger: 3,
    minLevel: 8,
    maxLevel: 18,
    regionId: 1,
    art: [
      '        _______________________',
      '       /  _   _   _   _   _   \\',
      '      /__/ \\_/ \\_/ \\_/ \\_/ \\___\\',
      '      | #   #   #   #   #   # |',
      '      | #   #   #   #   #   # |',
      '      |___     _______     ___|',
      '          |   |  []   |   |',
      '     _____|___|_______|___|_____',
      '    / rusty rails >>>>>>>>>>>>  \\',
      '   /__[]____________________[]___\\'
    ].join('\n'),
    description: 'Area 1. Harder fights. Farm iron for real gear.',
    actions: [
      { id: 'fight', label: 'Fight mine monster', help: 'Stronger enemies. Better gold and loot.' },
      { id: 'gather', label: 'Mine iron', help: 'Main material for weapons and armor.' },
      { id: 'back-village', label: 'Return to village', help: 'Go back safely.' }
    ]
  },
  'sunken-library': {
    id: 'sunken-library',
    name: 'Sunken Library',
    shortName: 'Library',
    kind: 'wilds',
    danger: 4,
    minLevel: 15,
    maxLevel: 25,
    regionId: 1,
    art: [
      '        _________________________',
      '       /  []   []   []   []      \\',
      '      /___________________________\\',
      '      |  ??   ??   ??   ??   ??  |',
      '      |  []   []   []   []   []  |',
      '      |~~~~~~~ waterline ~~~~~~~~|',
      '      |   __        ____      __ |',
      '      |__/  \\______/    \\____/  \\|',
      '          drowned pages drift...',
      '             < < <  glyph ink'
    ].join('\n'),
    description: 'Area 1. Pages, cursed scraps and dangerous drops.',
    actions: [
      { id: 'fight', label: 'Fight library monster', help: 'High risk. Better chance for expensive gear.' },
      { id: 'gather', label: 'Search pages', help: 'Farm pages for epic crafts.' },
      { id: 'back-village', label: 'Return to village', help: 'Go back safely.' }
    ]
  },
  'obsidian-pit': {
    id: 'obsidian-pit',
    name: 'Obsidian Pit',
    shortName: 'Obsidian Pit',
    kind: 'wilds',
    danger: 3,
    minLevel: 20,
    maxLevel: 28,
    regionId: 2,
    art: [
      '          _______________',
      '        _/ black glass  \\_',
      '       /  __   __   __    \\',
      '      |  /  \\_/  \\_/  \\    |',
      '      |  \\__/ \\__/ \\__/    |',
      '       \\      cracks      /',
      '        \\____  ____  ____/',
      '             \\/    \\/',
      '          obsidian breath'
    ].join('\n'),
    description: 'Area 2. Level 20+ fights. Obsidian starts tier 2 crafting.',
    actions: [
      { id: 'fight', label: 'Fight pit monster', help: 'Progresses this area. Tier 2 monsters hit harder.' },
      { id: 'gather', label: 'Mine obsidian', help: 'Farm obsidian and rare ashen materials.' },
      { id: 'back-village', label: 'Return to refuge', help: 'Go back safely.' }
    ]
  },
  'ashen-cathedral': {
    id: 'ashen-cathedral',
    name: 'Ashen Cathedral',
    shortName: 'Cathedral',
    kind: 'wilds',
    danger: 4,
    minLevel: 27,
    maxLevel: 35,
    regionId: 2,
    art: [
      '          /\\          /\\',
      '         /  \\  ____  /  \\',
      '        /____\\/____\\/____\\',
      '        | []   ASH   [] |',
      '        |  ___      ___ |',
      '        |_/   \\____/   \\|',
      '             bells with no sound',
      '          burnt prayers remain'
    ].join('\n'),
    description: 'Area 2. Ember enemies and stronger rare drops.',
    actions: [
      { id: 'fight', label: 'Fight cathedral monster', help: 'Progresses this area. Rare monsters can appear.' },
      { id: 'gather', label: 'Collect ember dust', help: 'Farm ember dust and cinder glass.' },
      { id: 'back-village', label: 'Return to refuge', help: 'Go back safely.' }
    ]
  },
  'void-archives': {
    id: 'void-archives',
    name: 'Void Archives',
    shortName: 'Archives',
    kind: 'wilds',
    danger: 5,
    minLevel: 34,
    maxLevel: 40,
    regionId: 2,
    art: [
      '        _____________________',
      '       /  VOID  VOID  VOID  \\',
      '      /_______________________\\',
      '      |  []  []  []  []  [] |',
      '      |  ??  ??  ??  ??  ?? |',
      '      |____      ____      __|',
      '           \\____/    \\____/',
      '        records rewrite themselves'
    ].join('\n'),
    description: 'Area 2. High danger archive with level 40 gear.',
    actions: [
      { id: 'fight', label: 'Fight archive monster', help: 'Progresses this area. Best tier 2 drops.' },
      { id: 'gather', label: 'Search burned scripts', help: 'Farm burned scripts and rare cinders.' },
      { id: 'back-village', label: 'Return to refuge', help: 'Go back safely.' }
    ]
  },
  'old-forge': {
    id: 'old-forge',
    name: 'The Old Forge',
    shortName: 'Forge',
    kind: 'forge',
    danger: 0,
    minLevel: 1,
    maxLevel: 40,
    art: [
      '             _____________',
      '            /  _________  \\',
      '           /  /  _____  \\  \\',
      '          |  |  |     |  |  |',
      '          |  |  | FIRE|  |  |',
      '          |  |  |_____|  |  |',
      '          |  |___________|  |',
      '          |   ___     ___   |',
      '          |__/###\\___/###\\__|',
      '             sparks  *  *'
    ].join('\n'),
    description: 'Rotating stock. Tier follows your current region.',
    actions: [
      { id: 'back-village', label: 'Return to village', help: 'Go back safely.' }
    ]
  },
  'watcher-gate': {
    id: 'watcher-gate',
    name: 'The Watcher Gate',
    shortName: 'Watcher',
    kind: 'boss',
    danger: 5,
    minLevel: 20,
    maxLevel: 30,
    regionId: 1,
    art: [
      '          _________________',
      '      ___/   Ø       Ø     \\___',
      '     /        _______          \\',
      '    |      __/       \\__        |',
      '    |     /  WATCHER    \\       |',
      '    |     \\__       ___/        |',
      '     \\       \\_____/          /',
      '      \\______________________/',
      '             sealed gate',
      '          do not wake it'
    ].join('\n'),
    description: 'Boss fight. Upgrade before trying.',
    actions: [
      { id: 'challenge-boss', label: 'Challenge The Watcher', help: 'Very hard. Farm and buy gear first.' },
      { id: 'back-village', label: 'Return to village', help: 'Go back safely.' }
    ]
  },
  'hollow-gate': {
    id: 'hollow-gate',
    name: 'The Hollow Gate',
    shortName: 'Hollow Gate',
    kind: 'boss',
    danger: 5,
    minLevel: 40,
    maxLevel: 45,
    regionId: 2,
    art: [
      '          ___________________',
      '      ___/   ASH       VOID  \\___',
      '     /      ______________      \\',
      '    |      / HOLLOW KING  \\      |',
      '    |      \\______________/      |',
      '     \\          smoke          /',
      '      \\_______________________/',
      '          gate after the ashes'
    ].join('\n'),
    description: 'Second boss. Tier 2 gear and enchants recommended.',
    actions: [
      { id: 'challenge-hollow-king', label: 'Challenge The Hollow King', help: 'Region 2 boss. Bring enchanted gear.' },
      { id: 'back-village', label: 'Return to refuge', help: 'Go back safely.' }
    ]
  },
  'deep-mine': {
    id: 'deep-mine',
    name: 'The 1500 Floor Mine',
    shortName: 'Deep Mine',
    kind: 'wilds',
    danger: 5,
    minLevel: 20,
    maxLevel: 60,
    regionId: 2,
    art: [
      '          ||',
      '          ||      floor after floor',
      '       ___||___',
      '      /  ____  \\',
      '     /__/    \\__\\',
      '      |  []  [] |',
      '      |  []  [] |',
      '      |_________|',
      '        descent: 1500'
    ].join('\n'),
    description: 'Long challenge mine. Reach 1000, then challenger 1500.',
    actions: [
      { id: 'mine-floor', label: 'Push next mine floor', help: 'Fight one scaling mine encounter.' },
      { id: 'leave-mine', label: 'Leave the mine', help: 'Return to the Ashen Refuge.' }
    ]
  },
  'glyph-anvil': {
    id: 'glyph-anvil',
    name: 'The Glyph Anvil',
    shortName: 'Glyph Anvil',
    kind: 'forge',
    danger: 0,
    minLevel: 20,
    maxLevel: 40,
    regionId: 2,
    art: [
      '          ___________',
      '         /  + + + +  \\',
      '        /_____________\\',
      '           |  ANVIL |',
      '        ___|________|___',
      '       /   glyph heat   \\',
      '       \\________________/'
    ].join('\n'),
    description: 'Enchant equipped items up to +20.',
    actions: [
      { id: 'enchant-weapon', label: 'Enchant weapon', help: 'Adds +1 attack to equipped weapon. Max +20 for now.' },
      { id: 'enchant-armor', label: 'Enchant armor', help: 'Adds +1 defense to equipped armor. Max +20 for now.' },
      { id: 'enchant-charm', label: 'Enchant charm', help: 'Adds +1 luck to equipped charm. Max +20 for now.' },
      { id: 'enchant-relic', label: 'Enchant relic', help: 'Adds +1 to relic scaling. Max +20 for now.' },
      { id: 'back-village', label: 'Return to refuge', help: 'Go back safely.' }
    ]
  }
};
