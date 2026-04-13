<script>
  let step = $state(1);
  let name = $state('');
  let description = $state('');
  let dropWorst = $state(0);
  let pointsSystem = $state('25-18-15-12-10-8-6-4-2-1');
  let drivers = $state([]);
  let newNickname = $state('');
  let newNumber = $state('');
  let newRealName = $state('');
  let submitting = $state(false);

  const presets = {
    f1: { label: 'F1 (25-18-15-12-10-8-6-4-2-1)', value: '25-18-15-12-10-8-6-4-2-1' },
    karting: { label: 'Karting (15-12-10-8-6-5-4-3-2-1)', value: '15-12-10-8-6-5-4-3-2-1' },
    simple: { label: 'Simple (10-7-5-3-1)', value: '10-7-5-3-1' },
    sprint: { label: 'Sprint (12-10-8-6-4-2)', value: '12-10-8-6-4-2' },
  };

  function addDriver() {
    if (!newNickname.trim()) return;
    drivers = [...drivers, {
      id: crypto.randomUUID(),
      nickname: newNickname.trim(),
      number: newNumber ? parseInt(newNumber) : null,
      realName: newRealName.trim() || null,
    }];
    newNickname = ''; newNumber = ''; newRealName = '';
  }

  function removeDriver(id) {
    drivers = drivers.filter(d => d.id !== id);
  }

  async function handleSubmit() {
    submitting = true;
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/championships/new';

    const fields = {
      name, description,
      pointsSystem,
      dropWorst: String(dropWorst),
      drivers: JSON.stringify(drivers),
    };

    for (const [key, value] of Object.entries(fields)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  }
</script>

<svelte:head>
  <title>New Championship — KartChamp</title>
</svelte:head>

<div class="max-w-lg mx-auto px-4 py-6">
  <a href="/" class="text-xs text-[var(--text-secondary)] hover:text-[var(--neon-red)] transition-colors">← Home</a>

  <!-- Progress bar -->
  <div class="flex items-center gap-1 mt-4 mb-6">
    {#each [1,2,3,4] as s}
      <div class="flex-1 h-1.5 rounded-full transition-colors {s <= step ? 'bg-[var(--neon-red)]' : 'bg-[var(--border)]'}"></div>
    {/each}
  </div>

  {#if step === 1}
    <h1 class="text-2xl font-black mb-1">🏁 New Championship</h1>
    <p class="text-sm text-[var(--text-secondary)] mb-6">Step 1 — Give it a name</p>
    <div class="space-y-4">
      <div>
        <label for="cname" class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Championship Name</label>
        <input id="cname" type="text" bind:value={name} placeholder="e.g. Summer 2026 League"
          class="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--neon-red)]" />
      </div>
      <div>
        <label for="cdesc" class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Description (optional)</label>
        <textarea id="cdesc" bind:value={description} placeholder="Weekend races with friends..." rows="2"
          class="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--neon-red)] resize-none"></textarea>
      </div>
      <button onclick={() => name.trim() && (step = 2)} disabled={!name.trim()}
        class="w-full py-3.5 bg-[var(--neon-red)] text-white font-bold rounded-xl hover:bg-red-600 transition-colors text-lg disabled:opacity-30">
        Next →
      </button>
    </div>

  {:else if step === 2}
    <h1 class="text-2xl font-black mb-1">⚙️ Scoring</h1>
    <p class="text-sm text-[var(--text-secondary)] mb-6">Step 2 — Choose a points system</p>
    <div class="space-y-3 mb-4">
      {#each Object.entries(presets) as [key, preset]}
        <button type="button" onclick={() => pointsSystem = preset.value}
          class="w-full text-left px-4 py-3 rounded-xl border transition-colors
            {pointsSystem === preset.value ? 'border-[var(--neon-red)] bg-red-950/30' : 'border-[var(--border)] hover:border-[var(--text-secondary)]'}">
          <div class="font-bold text-sm {pointsSystem === preset.value ? 'text-[var(--neon-red)]' : ''}">{preset.label}</div>
        </button>
      {/each}
    </div>
    <div class="mb-4">
      <label for="custompts" class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Custom</label>
      <input id="custompts" type="text" bind:value={pointsSystem}
        class="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-red)]" />
    </div>
    <div class="mb-4">
      <label for="dw" class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Drop worst races</label>
      <div class="flex items-center gap-3">
        <input id="dw" type="number" bind:value={dropWorst} min="0" max="20"
          class="w-20 px-3 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-center text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-red)]" />
        <span class="text-xs text-[var(--text-secondary)]">races dropped from final standings</span>
      </div>
    </div>
    <div class="flex gap-3">
      <button onclick={() => step = 1} class="flex-1 py-3 border border-[var(--border)] text-[var(--text-secondary)] font-bold rounded-xl">← Back</button>
      <button onclick={() => step = 3} class="flex-1 py-3.5 bg-[var(--neon-red)] text-white font-bold rounded-xl">Next →</button>
    </div>

  {:else if step === 3}
    <h1 class="text-2xl font-black mb-1">🏎️ Drivers</h1>
    <p class="text-sm text-[var(--text-secondary)] mb-6">Step 3 — Add racers (min 2)</p>

    {#if drivers.length > 0}
      <div class="space-y-2 mb-4">
        {#each drivers as driver, i}
          <div class="flex items-center gap-3 px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
            {#if driver.number}
              <div class="w-8 h-8 rounded-full bg-[var(--neon-red)]/20 border border-[var(--neon-red)]/40 flex items-center justify-center text-xs font-bold text-[var(--neon-red)]">{driver.number}</div>
            {:else}
              <div class="w-8 h-8 rounded-full bg-[var(--bg-dark)] border border-[var(--border)] flex items-center justify-center text-xs text-[var(--text-secondary)]">{i + 1}</div>
            {/if}
            <div class="flex-1">
              <span class="font-bold text-sm">{driver.nickname}</span>
              {#if driver.realName}<span class="text-xs text-[var(--text-secondary)] ml-2">{driver.realName}</span>{/if}
            </div>
            <button type="button" onclick={() => removeDriver(driver.id)} class="text-[var(--text-secondary)] hover:text-red-500 text-lg">×</button>
          </div>
        {/each}
      </div>
    {/if}

    <div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 mb-4">
      <div class="flex gap-2 mb-3">
        <input type="number" bind:value={newNumber} placeholder="#" min="1" max="999"
          class="w-16 px-3 py-2.5 bg-[var(--bg-dark)] border border-[var(--border)] rounded-lg text-center text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-red)]" />
        <input type="text" bind:value={newNickname} placeholder="Nickname *"
          class="flex-1 px-3 py-2.5 bg-[var(--bg-dark)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--neon-red)]" />
        <input type="text" bind:value={newRealName} placeholder="Real name"
          class="flex-1 px-3 py-2.5 bg-[var(--bg-dark)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--neon-red)]" />
      </div>
      <button type="button" onclick={addDriver} disabled={!newNickname.trim()}
        class="w-full py-2.5 border border-[var(--neon-red)]/40 text-[var(--neon-red)] font-semibold rounded-lg text-sm hover:bg-[var(--neon-red)]/10 disabled:opacity-30">
        + Add Driver
      </button>
    </div>

    <div class="flex gap-3">
      <button onclick={() => step = 2} class="flex-1 py-3 border border-[var(--border)] text-[var(--text-secondary)] font-bold rounded-xl">← Back</button>
      <button onclick={() => drivers.length >= 2 && (step = 4)} disabled={drivers.length < 2}
        class="flex-1 py-3.5 bg-[var(--neon-red)] text-white font-bold rounded-xl disabled:opacity-30">
        Review ({drivers.length} drivers) →
      </button>
    </div>

  {:else if step === 4}
    <h1 class="text-2xl font-black mb-1">✅ Review</h1>
    <p class="text-sm text-[var(--text-secondary)] mb-6">Confirm your championship</p>

    <div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 text-left mb-6">
      <div class="text-sm space-y-2">
        <div class="flex justify-between"><span class="text-[var(--text-secondary)]">Name</span><span class="font-bold">{name}</span></div>
        {#if description}<div class="flex justify-between"><span class="text-[var(--text-secondary)]">Description</span><span class="font-medium">{description}</span></div>{/if}
        <div class="flex justify-between"><span class="text-[var(--text-secondary)]">Drivers</span><span class="font-bold">{drivers.length}</span></div>
        <div class="flex justify-between"><span class="text-[var(--text-secondary)]">Points</span><span class="font-mono text-xs">{pointsSystem}</span></div>
        <div class="flex justify-between"><span class="text-[var(--text-secondary)]">Drop worst</span><span class="font-bold">{dropWorst}</span></div>
      </div>
      <div class="mt-3 pt-3 border-t border-[var(--border)]">
        <div class="text-xs text-[var(--text-secondary)] mb-1">Drivers:</div>
        <div class="flex flex-wrap gap-2">
          {#each drivers as d}
            <span class="px-2 py-1 bg-[var(--bg-dark)] rounded-lg text-xs font-medium">
              {#if d.number}#{d.number} {/if}{d.nickname}
            </span>
          {/each}
        </div>
      </div>
    </div>

    <div class="flex gap-3">
      <button onclick={() => step = 3} class="flex-1 py-3 border border-[var(--border)] text-[var(--text-secondary)] font-bold rounded-xl">← Back</button>
      <button onclick={handleSubmit} disabled={submitting}
        class="flex-1 py-3.5 bg-[var(--neon-red)] text-white font-bold rounded-xl hover:bg-red-600 disabled:opacity-50 text-lg">
        {submitting ? 'Creating...' : 'Create 🏁'}
      </button>
    </div>
  {/if}
</div>
