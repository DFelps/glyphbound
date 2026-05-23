<script lang="ts">
  import { onMount } from 'svelte';
  import { game, saveKeyForSlot, saveSlots, type SaveSlot } from '../state/gameStore';
  import { nodes, areaOrder } from '../data/world';
  import { itemCatalogByArea, materialInfo } from '../data/items';
  import { enemies, enemiesByArea } from '../data/enemies';
  import { combatStep } from '../systems/combat';
  import { attackPower, defensePower, luckPower } from '../systems/player';
  import type { ActionId, Item, ItemSlot, NodeAction, Rarity } from '../types/game';

  let combatTimer: ReturnType<typeof setInterval> | null = null;
  let clockTimer: ReturnType<typeof setInterval> | null = null;
  let inventoryOpen = $state(false);
  let wikiOpen = $state(false);
  let selectedItem = $state<Item | null>(null);
  let viewedForgeItem = $state<Item | null>(null);
  let optionsOpen = $state(false);
  let newGameConfirmOpen = $state(false);
  let nowTime = $state(Date.now());
  let menuOpen = $state(true);
  let gathering = $state(false);
  let hasSave = $state(false);
  let tutorialOpen = $state(false);
  let tutorialStep = $state(0);
  let selectedSlot = $state<SaveSlot>('slot-1');
  let slotHasSave = $state<Record<SaveSlot, boolean>>({
    'slot-1': false,
    'slot-2': false,
    'slot-3': false
  });

  const tutorialSeenKey = 'glyphbound-tutorial-v1';
  const equipmentSlots: ItemSlot[] = ['weapon', 'armor', 'charm', 'relic'];

  const tutorialSteps = [
  {
    target: '.stat-card',
    title: 'Your character',
    text: 'HP, XP, gold and progression live here.'
  },
  {
    target: '.place-actions',
    title: 'Actions',
    text: 'Choose where to go and what to do.'
  },
  {
    target: '.ascii-menu',
    title: 'Menu',
    text: 'Inventory, wiki and options.'
  },
  {
    target: '.log-box',
    title: 'Activity log',
    text: 'Recent events are tracked here.'
  }
];

    onMount(() => {
      refreshSaveSlots();
      game.boot(selectedSlot);

      menuOpen = true;

    clockTimer = setInterval(() => {
      nowTime = Date.now();
      game.rawUpdate(() => {});
    }, 1000);

    return () => {
      if (combatTimer) {
        clearInterval(combatTimer);
      }

      if (clockTimer) {
        clearInterval(clockTimer);
      }
    };
  });

  $effect(() => {
    if ($game.combat.active && !combatTimer) {
      combatTimer = setInterval(() => {
        game.rawUpdate((state) => combatStep(state));
      }, 900);
    }

    if (!$game.combat.active && combatTimer) {
      clearInterval(combatTimer);
      combatTimer = null;
    }
  });

  $effect(() => {
    if (!$game.notice) {
      return;
    }

    const timer = setTimeout(() => {
      game.clearNotice();
    }, 2600);

    return () => clearTimeout(timer);
  });

  const currentNode = $derived(nodes[$game.location]);
  const enemyPercent = $derived(
    $game.combat.enemy ? Math.max(0, Math.min(100, ($game.combat.enemy.hp / $game.combat.enemy.maxHp) * 100)) : 0
  );
  const forgeCountdown = $derived(Math.max(0, Math.ceil(($game.forge.nextRefreshAt - nowTime) / 1000)));
  const currentPreview = $derived(viewedForgeItem ?? selectedItem);
  const totalWikiItems = $derived(areaOrder.reduce((total, areaId) => total + itemCatalogByArea[areaId].length, 0));
  const totalWikiEnemies = $derived(areaOrder.reduce((total, areaId) => total + enemiesByArea[areaId].length, 1));
  const wikiItemCount = $derived(Object.keys($game.wiki.items).length);
  const wikiEnemyCount = $derived(Object.keys($game.wiki.enemies).length);
  const wikiRareCount = $derived(Object.keys($game.wiki.rareEnemies).length);
  

  function hpBar(value: number, max: number, size: number) {
    const filled = Math.max(0, Math.min(size, Math.round((value / max) * size)));
    return `${'█'.repeat(filled)}${'░'.repeat(size - filled)}`;
  }

  function actionMeta(action: NodeAction) {
    const parts: string[] = [];

    if (action.cost) {
      parts.push(`${action.cost}g`);
    }

    if (action.needs) {
      for (const [key, value] of Object.entries(action.needs)) {
        parts.push(`${value} ${key}`);
      }
    }

    return parts.join(' / ');
  }

  function actionDisabled(action: NodeAction) {
    if ($game.combat.active) {
      return true;
    }

    if (action.id === 'go-boss' && !$game.bossUnlocked) {
      return true;
    }

    if (action.id === 'challenge-boss' && (!$game.bossUnlocked || $game.bossDefeated)) {
      return true;
    }

    const goldBlocked = action.cost ? $game.player.gold < action.cost : false;
    const materialBlocked = action.needs
      ? Object.entries(action.needs).some(([key, value]) => ($game.player.materials[key] ?? 0) < (value ?? 0))
      : false;

    return goldBlocked || materialBlocked;
  }

  function selectItem(item: Item) {
    selectedItem = item;
    viewedForgeItem = null;
  }

  function previewForgeItem(item: Item) {
    viewedForgeItem = item;
    selectedItem = null;
  }

  function equipSelected() {
    if (!selectedItem) {
      return;
    }

    game.equip(selectedItem);
  }

  function logClass(line: string) {
    if (line.startsWith('[item]')) {
      return 'log-item';
    }

    if (line.startsWith('[material]')) {
      return 'log-material';
    }

    return '';
  }

  function logText(line: string) {
    return line.replace(/^\[(item|material)\]\s*/, '');
  }

  function nextTutorial() {
    if (tutorialStep >= tutorialSteps.length - 1) {
      closeTutorial();
      return;
    }

    tutorialStep++;
  }

  function closeTutorial() {
    tutorialOpen = false;
    localStorage.setItem(tutorialSeenKey, '1');
  }

  function gatherWithDelay() {
    if (gathering || $game.combat.active) {
      return;
    }

    gathering = true;

    setTimeout(() => {
      game.act('gather');
      gathering = false;
    }, 1800);
  }

  function startNewGame() {
    game.setSlot(selectedSlot);
    game.reset();
    localStorage.removeItem(tutorialSeenKey);
    tutorialStep = 0;
    tutorialOpen = true;
    refreshSaveSlots();
    hasSave = true;
    menuOpen = false;
    newGameConfirmOpen = false;
    optionsOpen = false;
  }

  function refreshSaveSlots() {
    slotHasSave = {
      'slot-1': Boolean(localStorage.getItem(saveKeyForSlot('slot-1'))),
      'slot-2': Boolean(localStorage.getItem(saveKeyForSlot('slot-2'))),
      'slot-3': Boolean(localStorage.getItem(saveKeyForSlot('slot-3')))
    };

    hasSave = slotHasSave[selectedSlot];
  }

  function selectSaveSlot(slot: SaveSlot) {
    selectedSlot = slot;
    hasSave = slotHasSave[slot];
    game.setSlot(slot);
  }

  function actionIcon(action: ActionId) {
    const icons: Partial<Record<ActionId, string>> = {
      rest: 'Zz',
      'go-grove': '01',
      'go-mine': '02',
      'go-library': '03',
      'go-forge': '##',
      'go-boss': 'Ø ',
      'back-village': '<-',
      fight: '!!',
      gather: '**',
      'challenge-boss': 'B!'
    };

    return icons[action] ?? '>>';
  }

  function actionClass(action: NodeAction) {
    if (action.id.includes('boss') || action.id === 'challenge-boss') {
      return 'boss-action';
    }

    if (action.id.includes('forge')) {
      return 'forge-action';
    }

    if (action.id.includes('grove') || action.id.includes('mine') || action.id.includes('library') || action.id === 'fight' || action.id === 'gather') {
      return 'area-action';
    }

    return 'town-action';
  }

  function materialClass(key: string) {
    return materialInfo[key]?.rarity ?? 'normal';
  }

  function materialTitle(key: string) {
    return materialInfo[key]?.source ?? 'Unknown material.';
  }

  function materialName(key: string) {
    return materialInfo[key]?.label ?? key;
  }

  function knownItemName(id: string) {
    const item = Object.values(itemCatalogByArea).flat().find((entry) => entry.id === id);
    return item?.name ?? id;
  }

  function enemyName(id: string) {
    return enemies[id]?.name ?? id;
  }

  function rarityClass(rarity: Rarity) {
    return `rarity-${rarity}`;
  }

  function itemStat(item: Item | null, stat: 'attack' | 'defense' | 'luck') {
    const currentValue = stat === 'attack' ? attackPower($game.player) : stat === 'defense' ? defensePower($game.player) : luckPower($game.player);

    if (!item?.slot) {
      return currentValue;
    }

    const equipped = $game.player.equipment[item.slot];

    const currentContribution = equipped?.stats[stat] ?? 0;
    return currentValue - currentContribution + item.stats[stat];
  }

  function deltaClass(value: number) {
    if (value > 0) {
      return 'better';
    }

    if (value < 0) {
      return 'worse';
    }

    return 'same';
  }

  function costText(item: Item) {
    const materials = Object.entries(item.cost.materials)
      .filter(([, value]) => (value ?? 0) > 0)
      .map(([key, value]) => `${value} ${key}`);

    return [`${item.cost.gold}g`, ...materials].join(' / ');
  }

  function canBuy(item: Item) {
    if ($game.player.gold < item.cost.gold) {
      return false;
    }

    return Object.entries(item.cost.materials).every(([key, value]) => ($game.player.materials[key] ?? 0) >= (value ?? 0));
  }

  function timeLabel(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const rest = String(seconds % 60).padStart(2, '0');

    return `${minutes}:${rest}`;
  }
</script>

{#if menuOpen}
  <div class="main-menu">
    <div class="menu-frame">
      <pre class="menu-art left-art">
        .          .
       / \        / \
      / _ \      / _ \
     / / \ \____/ / \ \
    /_/   \______/_/  \_\
       .-._  ||  _.-.
      /  _ \ || / _  \
     |  / \ \||/ / \  |
     |  \_/ /||\ \_/  |
      \____/ || \____/
          ___||___
         /   ||   \
        /____||____\
      </pre>

      <div class="menu-center">
        <pre class="menu-logo">
 ██████╗ ██╗  ██╗██╗   ██╗██████╗ ██╗  ██╗██████╗  ██████╗ ██╗   ██╗███╗   ██╗██████╗
██╔════╝ ██║  ██║╚██╗ ██╔╝██╔══██╗██║  ██║██╔══██╗██╔═══██╗██║   ██║████╗  ██║██╔══██╗
██║  ███╗███████║ ╚████╔╝ ██████╔╝███████║██████╔╝██║   ██║██║   ██║██╔██╗ ██║██║  ██║
██║   ██║██╔══██║  ╚██╔╝  ██╔═══╝ ██╔══██║██╔══██╗██║   ██║██║   ██║██║╚██╗██║██║  ██║
╚██████╔╝██║  ██║   ██║   ██║     ██║  ██║██████╔╝╚██████╔╝╚██████╔╝██║ ╚████║██████╔╝
 ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝     ╚═╝  ╚═╝╚═════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═════╝
        </pre>

        <pre class="menu-subtitle">+------------------------------------------------------------+
|          fragments wake where broken glyphs remain          |
+------------------------------------------------------------+</pre>

        <div class="save-slots">
          {#each saveSlots as slot, index}
            <button type="button" class:selected={selectedSlot === slot} onclick={() => selectSaveSlot(slot)}>
              [ SLOT {index + 1} ] {slotHasSave[slot] ? 'SAVE FOUND' : 'EMPTY'}
            </button>
          {/each}
        </div>

        <div class="menu-actions">
          {#if hasSave}
            <button type="button" onclick={() => { game.setSlot(selectedSlot); newGameConfirmOpen = false; menuOpen = false; }}>[ CONTINUE ]</button>
          {/if}

          <button type="button" onclick={() => slotHasSave[selectedSlot] ? newGameConfirmOpen = true : startNewGame()}>[ NEW GAME ]</button>
        </div>

        <div class="menu-hint">
          <span>ASCII action RPG / assisted combat / cursed progression</span>
        </div>
      </div>

      <pre class="menu-art right-art">
              /\ 
             /  \
            / /\ \
           / ____ \
          /_/    \_\
             ||
          ___||___
         /   ||   \
        /_   ||   _\
          |  ||  |
          |  ||  |
       ___|  ||  |___
      /___   ||   ___\
          |__||__|
             /\
            /__\
        </pre>
    </div>

    <div class="menu-footer">
      <span>v0.1 first region</span>
      <span>press new game to begin the fracture</span>
    </div>

    {#if newGameConfirmOpen}
      <div class="modal-backdrop" role="presentation" onclick={() => newGameConfirmOpen = false} onkeydown={(event) => event.key === 'Escape' && (newGameConfirmOpen = false)}>
        <section class="confirm-modal" role="dialog" aria-modal="true" tabindex="-1" onclick={(event) => event.stopPropagation()} onkeydown={(event) => event.stopPropagation()}>
        <pre class="modal-title">+------------------------------+
|        OVERWRITE SAVE?       |
+------------------------------+</pre>
          <p>This will erase your current run and start a new one.</p>
          <div class="confirm-actions">
            <button type="button" class="modal-button danger-button" onclick={startNewGame}>[ yes, start new game ]</button>
            <button type="button" class="modal-button" onclick={() => newGameConfirmOpen = false}>[ cancel ]</button>
          </div>
        </section>
      </div>
    {/if}
  </div>
{:else}
  <main class="game-screen">
    <aside class="side-panel left-panel">
      <pre class="ascii-box title-box">+--------------------+
|    GLYPHBOUND      |
|    first region    |
+--------------------+</pre>

    <div class="stat-card" class:tutorial-focus={tutorialOpen && tutorialSteps[tutorialStep].target === '.stat-card'}>
      <div class="stat-card-title">[@] The Fragment</div>

      <div class="big-stats">
        <div><span>ATK</span><strong>{attackPower($game.player)}</strong></div>
        <div><span>DEF</span><strong>{defensePower($game.player)}</strong></div>
        <div><span>LUCK</span><strong>{luckPower($game.player)}</strong></div>
        <div><span>LVL</span><strong>{$game.player.level}</strong></div>
      </div>

      <div class="bar-line"><span>HP</span><pre>{hpBar($game.player.hp, $game.player.maxHp, 12)}</pre><strong>{$game.player.hp}/{$game.player.maxHp}</strong></div>
      <div class="bar-line"><span>XP</span><pre>{hpBar($game.player.xp, $game.player.nextLevel, 12)}</pre><strong>{$game.player.xp}/{$game.player.nextLevel}</strong></div>
      <div class="gold-line">$ {$game.player.gold}</div>
    </div>

    <div class="material-panel">
      <div class="panel-label">Materials</div>

      {#each Object.entries($game.player.materials) as [key, value]}
        <div class={`material-row ${materialClass(key)}`} title={materialTitle(key)}>
          <span>{materialName(key)}</span>
          <strong>{value}</strong>
        </div>
      {/each}
    </div>

    <nav class="ascii-menu" class:tutorial-focus={tutorialOpen && tutorialSteps[tutorialStep].target === '.ascii-menu'} aria-label="main menu">
      <button type="button" onclick={() => game.act('back-village')}>+--------------------+<br />|      VILLAGE       |<br />+--------------------+</button>
      <button type="button" onclick={() => inventoryOpen = true}>+--------------------+<br />| INVENTORY / EQUIP  |<br />+--------------------+</button>
      <button type="button" onclick={() => wikiOpen = true}>+--------------------+<br />|        WIKI        |<br />+--------------------+</button>
      <button type="button" class="danger-menu" onclick={() => optionsOpen = true}>+--------------------+<br />|      OPTIONS       |<br />+--------------------+</button>
    </nav>
  </aside>

  <section class={`stage-panel node-${currentNode.kind}`}>
    <div class="stage-top">
      <pre>+----------------------------------------------------------------------------------------------+</pre>
      <div class="stage-title">{currentNode.name}</div>
    </div>

    <div class="place-view">
      <pre class={`place-art art-${currentNode.kind}`}>{currentNode.art}</pre>

      <div class="place-copy">
        <div class={`location-card ${currentNode.kind}`}>
          <div>
            <span>Current place</span>
            <strong>{currentNode.shortName}</strong>
          </div>
          <div>
            <span>Danger</span>
            <strong>{currentNode.danger}/5</strong>
          </div>
        </div>

        <pre class="ascii-box info-box">+--------------------------------------------------+
| {currentNode.description.padEnd(48, ' ').slice(0, 48)} |
+--------------------------------------------------+</pre>

        <div class="progress-list">
          {#each areaOrder as areaId, index}
            {@const progress = $game.areaProgress[areaId]}
            <div class:done={progress.cleared} class="area-progress">
              <strong>{index + 1}. {nodes[areaId].shortName}</strong>
              <span>{progress.cleared ? 'cleared' : `${progress.fights}/3 fights`}</span>
            </div>
          {/each}

          <div class:done={$game.bossDefeated} class:locked={!$game.bossUnlocked} class:boss-ready={$game.bossUnlocked && !$game.bossDefeated} class="boss-progress">
            <strong>Boss: The Watcher</strong>
            <span>{#if $game.bossDefeated}defeated{:else if $game.bossUnlocked}unlocked{:else}locked{/if}</span>
          </div>
        </div>

        <div class="guide-box">
          {#if currentNode.id === 'village'}
            <strong>What now?</strong>
            <span>Clear the 3 areas. If a fight gets hard, farm materials and check the Forge before the stock rotates.</span>
          {:else if currentNode.kind === 'wilds'}
            <strong>Area goal</strong>
            <span>Fight 3 times to clear this area. Rare monsters can appear and are logged in the Wiki.</span>
          {:else if currentNode.kind === 'forge'}
            <strong>Forge stock</strong>
            <span>Stock refreshes in {timeLabel(forgeCountdown)}. Expensive rarities are meant to make you farm hard.</span>
          {:else}
            <strong>Boss warning</strong>
            <span>The Watcher is much harder than normal enemies. Legendary or unique gear helps a lot.</span>
          {/if}
        </div>

        {#if currentNode.kind === 'forge'}
          <div class="forge-stock">
            <div class="forge-head">
              <strong>Rotating Stock (4 items)</strong>
              <span>refresh {timeLabel(forgeCountdown)}</span>
            </div>

            {#each $game.forge.stock as item}
              <button type="button" class={`forge-item ${rarityClass(item.rarity)}`} onmouseenter={() => previewForgeItem(item)} onclick={() => game.buyForgeItem(item.id)} disabled={!canBuy(item)}>
                <span>{item.art}</span>
                <strong>{item.name}</strong>
                <em>lvl {item.level} / {item.rarity}</em>
                <small>{costText(item)}</small>
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <div class="place-actions" class:tutorial-focus={tutorialOpen && tutorialSteps[tutorialStep].target === '.place-actions'}>
        {#each currentNode.actions as action}
          <button type="button" class={`ascii-action ${actionClass(action)}`} disabled={actionDisabled(action) || gathering} title={action.help} onclick={() => action.id === 'gather' ? gatherWithDelay() : game.act(action.id)}>
            <span>[{actionIcon(action.id)}]</span>
            <strong class:gathering-text={gathering && action.id === 'gather'}>{gathering && action.id === 'gather' ? 'Gathering...' : action.label}</strong>
            {#if actionMeta(action)}
              <em>{actionMeta(action)}</em>
            {/if}
            <small>{action.help}</small>
          </button>
        {/each}
      </div>
    </div>

    {#if $game.combat.active && $game.combat.enemy}
      <div class="combat-overlay">
        <pre class="combat-card" class:rare-enemy={$game.combat.enemy.rare}>+------------------------------------------+
|             ASSISTED COMBAT              |
+------------------------------------------+
{$game.combat.enemy.art}

 enemy: {$game.combat.enemy.name}
 hp: {hpBar($game.combat.enemy.hp, $game.combat.enemy.maxHp, 22)} {$game.combat.enemy.hp}/{$game.combat.enemy.maxHp}
 you: {hpBar($game.player.hp, $game.player.maxHp, 22)} {$game.player.hp}/{$game.player.maxHp}

 controls locked. watching battle...
+------------------------------------------+</pre>
        <div class="combat-fill" style={`width: ${enemyPercent}%`}></div>
      </div>
    {/if}
  </section>

  <aside class="side-panel right-panel">
    <div class={`mini-panel location-mini ${currentNode.kind}`}>
      <span>Location</span>
      <strong>{currentNode.shortName}</strong>
      <small>{currentNode.kind} / danger {currentNode.danger}</small>
    </div>

    <div class="equipment-panel">
      <div class="panel-label">Equipment</div>

      {#each equipmentSlots as slot}
        {@const item = $game.player.equipment[slot]}
        <div class={`equipment-row ${item ? rarityClass(item.rarity) : ''}`}>
          <span>{slot === 'weapon' ? '⚔' : slot === 'armor' ? '🛡' : slot === 'charm' ? '◇' : '✕'}</span>
          <strong>{slot}</strong>
          <em>{item ? `${item.glyph} ${item.name}` : '-'}</em>
        </div>
      {/each}
    </div>

    <div class="wiki-mini">
      <div><span>Items found</span><strong>{wikiItemCount}</strong></div>
      <div><span>Enemies seen</span><strong>{wikiEnemyCount}</strong></div>
      <div><span>Rare mobs</span><strong>{wikiRareCount}</strong></div>
    </div>

    <section class="log-box" class:tutorial-focus={tutorialOpen && tutorialSteps[tutorialStep].target === '.log-box'}>
      <div class="log-title">+---------- LOG ----------+</div>
      <div class="log-lines">
        {#each $game.log as line}
          <p class={logClass(line)}>&gt; {logText(line)}</p>
        {/each}
      </div>
    </section>
  </aside>

  {#if $game.notice}
    <div class={`result-notice ${$game.notice.kind}`}>
      <strong>{$game.notice.title}</strong>
      <span>{$game.notice.message}</span>
    </div>
  {/if}

  {#if inventoryOpen}
    <div class="modal-backdrop" role="presentation" onclick={() => inventoryOpen = false} onkeydown={(event) => event.key === 'Escape' && (inventoryOpen = false)}>
      <section class="inventory-modal" role="dialog" aria-modal="true" tabindex="-1" onclick={(event) => event.stopPropagation()} onkeydown={(event) => event.stopPropagation()}>
        <pre class="modal-title">+------------------------------------------------------------+
|                    INVENTORY / EQUIPMENT                   |
+------------------------------------------------------------+</pre>

        <div class="inventory-layout">
          <div class="bag-grid">
            {#each $game.player.inventory as item}
              <button type="button" class={`bag-slot ${rarityClass(item.rarity)}`} class:selected={selectedItem?.id === item.id} onclick={() => selectItem(item)} title={`${item.name} - ${item.source}`}>
                <span>{item.art}</span>
                <small>{item.name}</small>
              </button>
            {/each}

            {#each Array.from({ length: Math.max(0, 16 - $game.player.inventory.length) }) as _}
              <div class="bag-slot empty"><span>.</span><small>empty</small></div>
            {/each}
          </div>

          <div class="item-card">
            {#if currentPreview}
              {@const atkNow = attackPower($game.player)}
              {@const defNow = defensePower($game.player)}
              {@const luckNow = luckPower($game.player)}
              {@const atkNext = itemStat(currentPreview, 'attack')}
              {@const defNext = itemStat(currentPreview, 'defense')}
              {@const luckNext = itemStat(currentPreview, 'luck')}

              <div class={`item-detail ${rarityClass(currentPreview.rarity)}`}>
                <pre>{currentPreview.art}</pre>
                <h3>{currentPreview.name}</h3>
                <p>{currentPreview.text}</p>

                <div class="item-meta">
                  <span>slot</span><strong>{currentPreview.slot}</strong>
                  <span>rarity</span><strong>{currentPreview.rarity}</strong>
                  <span>requires</span><strong>lvl {currentPreview.level}</strong>
                  <span>cost</span><strong>{costText(currentPreview)}</strong>
                </div>

                <div class="compare-box">
                  <div class={deltaClass(atkNext - atkNow)}>
                    <span>Attack</span>
                    <strong>{atkNow} → {atkNext}</strong>
                  </div>
                  <div class={deltaClass(defNext - defNow)}>
                    <span>Defense</span>
                    <strong>{defNow} → {defNext}</strong>
                  </div>
                  <div class={deltaClass(luckNext - luckNow)}>
                    <span>Luck</span>
                    <strong>{luckNow} → {luckNext}</strong>
                  </div>
                </div>

                <div class="source-box">
                  <strong>Where to get it</strong>
                  <span>{currentPreview.source}</span>
                </div>
              </div>

              {#if selectedItem}
                <button type="button" class="modal-button" onclick={equipSelected}>[ equip ]</button>
              {/if}
            {:else}
              <pre>+------------------------------+
| choose an item               |
+------------------------------+
| click inventory items        |
| hover forge stock            |
| green = better               |
| red = worse                  |
+------------------------------+</pre>
            {/if}

            <button type="button" class="modal-button" onclick={() => inventoryOpen = false}>[ close ]</button>
          </div>
        </div>
      </section>
    </div>
  {/if}

  {#if wikiOpen}
    <div class="modal-backdrop" role="presentation" onclick={() => wikiOpen = false} onkeydown={(event) => event.key === 'Escape' && (wikiOpen = false)}>
      <section class="inventory-modal wiki-modal" role="dialog" aria-modal="true" tabindex="-1" onclick={(event) => event.stopPropagation()} onkeydown={(event) => event.stopPropagation()}>
        <pre class="modal-title">+------------------------------------------------------------+
|                          WIKI                              |
+------------------------------------------------------------+</pre>

        <div class="wiki-grid">
          <div>
            <h3>Items discovered</h3>
            <strong>{wikiItemCount}/{totalWikiItems}</strong>
            <p>Area item families are hidden as ??? until discovered.</p>
          </div>
          <div>
            <h3>Enemies found</h3>
            <strong>{wikiEnemyCount}/{totalWikiEnemies}</strong>
            <p>Each area has its own monster checklist.</p>
          </div>
          <div>
            <h3>Rare monsters</h3>
            <strong>{wikiRareCount}</strong>
            <p>Rare mobs are low chance spawns for completion grind.</p>
          </div>
        </div>

        <div class="wiki-area-list">
          {#each areaOrder as areaId, areaIndex}
            <section class="wiki-area-card">
              <h3>{areaIndex + 1}. {nodes[areaId].shortName}</h3>

              <div class="wiki-split">
                <div>
                  <h4>Items</h4>
                  {#each itemCatalogByArea[areaId] as item}
                    <p class:unknown={!$game.wiki.items[item.id]} title={item.source}>
                      &gt; {$game.wiki.items[item.id] ? item.name : '???'}
                    </p>
                  {/each}
                </div>

                <div>
                  <h4>Monsters</h4>
                  {#each enemiesByArea[areaId] as enemyId}
                    {@const enemy = enemies[enemyId]}
                    <p class:unknown={!$game.wiki.enemies[enemy.id]} class:rare-monster={enemy.rare}>
                      <span>{enemy.rare ? '*' : '>'}</span>
                      {$game.wiki.enemies[enemy.id] ? enemy.name : '???'}
                    </p>
                    {#if $game.wiki.enemies[enemy.id]}
                      <pre class="wiki-enemy-art">{enemy.art}</pre>
                    {/if}
                  {/each}
                </div>
              </div>
            </section>
          {/each}

          <section class="wiki-area-card boss-wiki-card">
            <h3>Boss</h3>
            <p class:unknown={!$game.wiki.enemies['the-watcher']}>&gt; {$game.wiki.enemies['the-watcher'] ? 'The Watcher' : '???'}</p>
            {#if $game.wiki.enemies['the-watcher']}
              <pre class="wiki-enemy-art">{enemies.watcher.art}</pre>
            {/if}
          </section>
        </div>

        <button type="button" class="modal-button" onclick={() => wikiOpen = false}>[ close ]</button>
      </section>
    </div>
  {/if}

  {#if optionsOpen}
    <div class="modal-backdrop" role="presentation" onclick={() => optionsOpen = false} onkeydown={(event) => event.key === 'Escape' && (optionsOpen = false)}>
      <section class="confirm-modal" role="dialog" aria-modal="true" tabindex="-1" onclick={(event) => event.stopPropagation()} onkeydown={(event) => event.stopPropagation()}>
        <pre class="modal-title">+------------------------------+
|           OPTIONS            |
+------------------------------+</pre>
        <p>Your progress is saved automatically.</p>
        <div class="confirm-actions">
          <button type="button" class="modal-button" onclick={() => { optionsOpen = false; inventoryOpen = false; wikiOpen = false; menuOpen = true; }}>[ back to main menu ]</button>
          <button type="button" class="modal-button" onclick={() => optionsOpen = false}>[ close ]</button>
        </div>
      </section>
    </div>
  {/if}

  {#if tutorialOpen}
    <div class="tutorial-backdrop"></div>

    <div class="tutorial-arrow">
      ↓
    </div>

    <div class="tutorial-card">
      <strong>{tutorialSteps[tutorialStep].title}</strong>
      <p>{tutorialSteps[tutorialStep].text}</p>

      <div class="tutorial-actions">
        <button type="button" onclick={closeTutorial}>
          Skip
        </button>

        <button type="button" onclick={nextTutorial}>
          {tutorialStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  {/if}

</main>
{/if}