# GLYPHBOUND

```txt
 ██████╗ ██╗  ██╗██╗   ██╗██████╗ ██╗  ██╗██████╗  ██████╗ ██╗   ██╗███╗   ██╗██████╗
██╔════╝ ██║  ██║╚██╗ ██╔╝██╔══██╗██║  ██║██╔══██╗██╔═══██╗██║   ██║████╗  ██║██╔══██╗
██║  ███╗███████║ ╚████╔╝ ██████╔╝███████║██████╔╝██║   ██║██║   ██║██╔██╗ ██║██║  ██║
██║   ██║██╔══██║  ╚██╔╝  ██╔═══╝ ██╔══██║██╔══██╗██║   ██║██║   ██║██║╚██╗██║██║  ██║
╚██████╔╝██║  ██║   ██║   ██║     ██║  ██║██████╔╝╚██████╔╝╚██████╔╝██║ ╚████║██████╔╝
 ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝     ╚═╝  ╚═╝╚═════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═════╝
```

**ASCII loot progression RPG built with SvelteKit.**

Glyphbound is a browser-based progression RPG focused on loot hunting, material farming, gear upgrades, rotating forge economy, and codex completion.

You play as **@, The Fragment** — a surviving glyph in a collapsing reality being erased by **The Null**.

Farm. Upgrade. Discover. Survive.

---

## Overview

Glyphbound is designed around satisfying progression loops.

The core gameplay is intentionally simple:

```txt
Enter area
→ Fight enemies
→ Gather materials
→ Upgrade gear
→ Buy forge items
→ Unlock stronger progression
→ Challenge bosses
→ Repeat
```

Combat is assisted.

Progression is the focus.

---

## Features

### Progression Gameplay

- Click-first gameplay
- Assisted auto combat
- Area-based progression
- Material farming
- Gear progression
- Gold economy
- Boss progression checks
- Death penalties (without item loss)
- Auto save via localStorage

---

### Loot System

Five rarity tiers:

```txt
Normal
Rare
Epic
Legendary
Unique
```

Loot categories:

- Weapons
- Armor
- Charms
- Relics

Higher rarity gear offers stronger progression paths.

Unique items can roll randomized stat combinations.

Example:

```txt
Voidfang Blade
+18 ATK
+4 DEF
+9 LUCK
```

---

### Rotating Forge Market

The forge acts as a live rotating shop.

```txt
Refresh every 2 minutes
```

This creates decision pressure:

- buy now or save gold
- farm materials for upgrades
- chase premium gear before stock rotates
- prioritize short-term vs long-term progression

Forge distribution:

```txt
80.0% Normal
10.0% Rare
 7.0% Epic
 2.5% Legendary
 0.5% Unique
```

---

## Current Content

### Region 1

Areas currently available:

```txt
1. Glyphroot Grove
2. Rust Mine
3. Sunken Library
```

Material progression:

### Common

```txt
Wood
Iron
Old Pages
```

### Rare

```txt
Living Bark
Fracture Crystal
```

### Epic

```txt
Black Ink
```

---

## Boss Encounter

Current boss:

```txt
THE WATCHER
```

Bosses are intended to be significant progression checks.

Normal enemies teach farming.

Bosses test builds.

---

## Discovery / Codex

The discovery system tracks:

- enemies encountered
- rare monsters
- items collected
- progression milestones

Unknown content remains hidden until discovered.

Example:

```txt
???
???
Mine Crawler
???
```

Completionist progression is intentional.

---

## Controls

Primary input:

```txt
Mouse
```

Actions include:

- selecting locations
- gathering
- buying gear
- equipping items
- opening inventory
- navigating menus

Combat is automatic once started.

---

## Tech Stack

Built with:

```txt
SvelteKit
TypeScript
CSS
localStorage persistence
```

Planned:

```txt
Electron desktop version
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/glyphbound.git
cd glyphbound
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build production version:

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

---

## Design Philosophy

Glyphbound is built around:

- satisfying progression
- visible power growth
- loot excitement
- rare item chasing
- codex completion
- repeatable progression loops
- retro terminal aesthetics

Inspirations in spirit:

- loot RPGs
- incremental progression games
- collection systems
- classic terminal interfaces

---

## Roadmap

Planned systems:

- additional regions
- stronger bosses
- enchantments
- item corruption
- failed upgrades
- advanced crafting
- rare encounter events
- hidden bosses
- achievements
- codex expansion
- ultra rare loot hunts
- desktop release

---

## Lore

```txt
Reality was once written.

Now it is being erased.
```

You are not a chosen hero.

You are a fragment trying not to become nothing.
