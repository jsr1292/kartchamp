<script>
  let name = $state('');
  let description = $state('');
  let dropWorst = $state(0);
  let pointsSystem = $state('25-18-15-12-10-8-6-4-2-1');

  const presets = {
    'f1': { label: 'F1 Style (25-18-15-12-10-8-6-4-2-1)', value: '25-18-15-12-10-8-6-4-2-1' },
    'karting': { label: 'Karting Standard (15-12-10-8-6-5-4-3-2-1)', value: '15-12-10-8-6-5-4-3-2-1' },
    'simple': { label: 'Simple (10-7-5-3-1)', value: '10-7-5-3-1' },
  };

  function handleSubmit(e) {
    e.preventDefault();
    const points = pointsSystem.split('-').map(Number);
    console.log({ name, description, dropWorst, points });
  }
</script>

<svelte:head>
  <title>New Championship — KartChamp</title>
</svelte:head>

<div class="max-w-lg mx-auto px-4 py-8">
  <a href="/" class="text-sm text-[var(--text-secondary)] hover:text-[var(--neon-red)] transition-colors mb-4 inline-block">
    ← Home
  </a>

  <h1 class="text-3xl font-black mb-6">🏁 New Championship</h1>

  <form onsubmit={handleSubmit} class="space-y-5">
    <div>
      <label class="block text-sm font-semibold mb-1.5 text-[var(--text-secondary)]">Championship Name</label>
      <input
        type="text"
        bind:value={name}
        placeholder="e.g. Summer 2026 League"
        required
        class="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--neon-red)] transition-colors"
      />
    </div>

    <div>
      <label class="block text-sm font-semibold mb-1.5 text-[var(--text-secondary)]">Description (optional)</label>
      <textarea
        bind:value={description}
        placeholder="Race rules, track info..."
        rows="3"
        class="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--neon-red)] transition-colors resize-none"
      ></textarea>
    </div>

    <div>
      <label class="block text-sm font-semibold mb-1.5 text-[var(--text-secondary)]">Points System</label>
      <div class="grid grid-cols-1 gap-2 mb-3">
        {#each Object.entries(presets) as [key, preset]}
          <button
            type="button"
            onclick={() => pointsSystem = preset.value}
            class="text-left px-4 py-2.5 rounded-lg border transition-colors text-sm {pointsSystem === preset.value ? 'border-[var(--neon-red)] bg-red-950/30 text-[var(--text-primary)]' : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]'}"
          >
            {preset.label}
          </button>
        {/each}
      </div>
      <input
        type="text"
        bind:value={pointsSystem}
        class="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] font-mono text-sm focus:outline-none focus:border-[var(--neon-red)] transition-colors"
      />
    </div>

    <div>
      <label class="block text-sm font-semibold mb-1.5 text-[var(--text-secondary)]">Drop Worst Races</label>
      <input
        type="number"
        bind:value={dropWorst}
        min="0"
        max="10"
        class="w-24 px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] text-center focus:outline-none focus:border-[var(--neon-red)] transition-colors"
      />
      <span class="text-sm text-[var(--text-secondary)] ml-2">races dropped from standings</span>
    </div>

    <button
      type="submit"
      class="w-full py-3.5 bg-[var(--neon-red)] text-white font-bold rounded-xl hover:bg-red-600 transition-colors text-lg"
    >
      Create Championship 🏁
    </button>
  </form>
</div>
