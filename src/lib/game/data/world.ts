import type { AreaId, WorldNode } from '../types/game';

export const areaOrder: AreaId[] = ['glyphroot-grove', 'rust-mine', 'sunken-library'];

export const nodes: Record<string, WorldNode> = {
  village: {
    id: 'village',
    name: 'Glyphbound Village',
    shortName: 'Village',
    kind: 'town',
    danger: 0,
    minLevel: 1,
    maxLevel: 1,
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
      { id: 'go-grove', label: 'Go to Glyphroot Grove', help: 'Area 1. Easier fights. Farm glyphroot and wood.' },
      { id: 'go-mine', label: 'Go to Rust Mine', help: 'Area 2. Better iron and stronger enemies.' },
      { id: 'go-library', label: 'Go to Sunken Library', help: 'Area 3. Pages, rare loot and dangerous enemies.' },
      { id: 'go-forge', label: 'Visit The Old Forge', help: 'Rotating shop. Stock changes every 2 minutes.' },
      { id: 'go-boss', label: 'Open The Watcher Gate', help: 'Locked until the 3 areas are cleared.' }
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
    description: 'Area 1. Fight 3 times to clear it. Farm glyphroot.',
    actions: [
      { id: 'fight', label: 'Fight nearby monster', help: 'Progresses this area. Rare monsters can appear.' },
      { id: 'gather', label: 'Gather glyphroot', help: 'Farm materials for the forge. Sometimes starts a fight.' },
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
    description: 'Area 2. Harder fights. Farm iron for real gear.',
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
    description: 'Area 3. Pages, cursed scraps and dangerous drops.',
    actions: [
      { id: 'fight', label: 'Fight library monster', help: 'High risk. Better chance for expensive gear.' },
      { id: 'gather', label: 'Search pages', help: 'Farm pages for epic and legendary crafts.' },
      { id: 'back-village', label: 'Return to village', help: 'Go back safely.' }
    ]
  },
  'old-forge': {
    id: 'old-forge',
    name: 'The Old Forge',
    shortName: 'Forge',
    kind: 'forge',
    danger: 0,
    minLevel: 1,
    maxLevel: 25,
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
    description: 'Rotating stock. If you see a great item, farm fast.',
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
  }
};
