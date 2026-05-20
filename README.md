# GLYPHBOUND

```txt
   _____ _                 _     _                           _
  / ____| |               | |   | |                         | |
 | |  __| |_   _ _ __ ___ | |__ | |__   ___  _   _ _ __   __| |
 | | |_ | | | | | '_ ` _ \| '_ \| '_ \ / _ \| | | | '_ \ / _` |
 | |__| | | |_| | | | | | | |_) | |_) | (_) | |_| | | | | (_| |
  \_____|_|\__, |_| |_| |_|_.__/|_.__/ \___/ \__,_|_| |_|\__,_|
            __/ |
           |___/
```

**ASCII loot progression RPG built with SvelteKit.**

You are **@**, *The Fragment* — a surviving glyph in a collapsing reality.

The world is being erased by **The Null**.

Fight, grind, gather resources, hunt rare monsters, chase rotating forge items, build stronger gear, complete your codex, and eventually challenge **The Watcher**.

---

# CURRENT GAMEPLAY

```txt
VILLAGE HUB
   ↓
Choose area
   ↓
Fight monsters / Gather resources
   ↓
Upgrade gear / Buy forge loot
   ↓
Unlock stronger content
   ↓
Challenge boss
   ↓
Repeat (harder progression)
```

Current gameplay focuses on:

- click-first interaction
- assisted combat
- heavy loot progression
- rotating forge economy
- monster discovery
- item collection / codex completion
- grind-heavy progression loops
- rare / unique item hunting

---

# FEATURES

## Core Systems

- Click-first gameplay
- Assisted auto-combat
- No potions / mana micromanagement
- Auto save via `localStorage`
- Death with no item loss
- Village hub progression
- Area-based unlock progression

---

## Loot System

Five rarity tiers:

```txt
[ Normal    ] Common progression gear
[ Rare      ] Better stat scaling
[ Epic      ] Strong mid/high progression items
[ Legendary ] Expensive chase gear
[ Unique    ] Randomized premium loot with strong rolls
```

Unique items generate randomized stats.

Example:

```txt
Voidfang Blade
ATK +18
DEF +4
LUCK +9
```

---

## Forge Market

The forge is now a rotating market.

```txt
Stock refreshes every 2 minutes
```

Meaning:

- desirable items can disappear
- you must farm quickly
- progression decisions matter
- expensive items become long-term goals

Drop distribution:

```txt
80.0% Normal
10.0% Rare
 7.0% Epic
 2.5% Legendary
 0.5% Unique
```

Forge stock scales with progression.

Example:

```txt
Area 1 → level 1–10 gear
Area 2 → stronger unlock pool
Area 3 → advanced progression pool
```

---

## Areas

Current region includes:

```txt
[1] Glyphroot Grove
[2] Rust Mine
[3] Sunken Library
```

Each area contains:

- unique monsters
- unique materials
- loot progression
- discovery tracking

Example materials:

```txt
Wood
Iron
Glyphroot
Pages
Living Bark
Fracture Crystal
Black Ink
Null Scrap
```

---

## Boss

Current boss:

```txt
THE WATCHER
```

Boss fights are intentionally much harder than standard encounters.

Normal areas teach progression.

Boss checks build quality.

---

## Wiki / Codex

Discovery system tracks:

### Monsters

Unknown enemies remain hidden:

```txt
???
???
Rootling
???
Mine Crawler
```

### Items

Undiscovered loot remains hidden:

```txt
???
???
Iron Glyph Blade
???
```

Completionist grind is intended.

Rare monsters and hidden discoveries are planned.

---

# CONTROLS

Primary interaction:

```txt
MOUSE
```

Actions include:

- selecting areas
- entering combat
- buying forge gear
- opening inventory
- equipping items
- navigating menus

Combat is automatic.

Once combat begins:

```txt
YOU WATCH
```

---

# TECH STACK

```txt
SvelteKit
TypeScript
CSS
localStorage persistence
```

Planned later:

```txt
Electron desktop build
```

---

# INSTALL

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

---

# DESIGN GOALS

Glyphbound is designed around:

- satisfying progression
- loot dopamine
- visible upgrades
- rare chase items
- collection completion
- "just one more run" gameplay

Inspirations in spirit:

- idle progression loops
- loot RPG systems
- codex completion games
- ASCII terminal aesthetics

---

# ROADMAP

Planned systems:

- enchantment system
- item corruption
- failed upgrades
- monster variants
- rare encounter events
- hidden bosses
- multiple regions
- region progression gates
- advanced crafting
- legendary hunt loops
- ultra rare unique chase drops
- achievement / completion systems
- desktop release via Electron

---

# LORE

```txt
Reality was once written.
Now it is being erased.
```

You are not a hero.

You are simply a surviving glyph trying not to become nothing.