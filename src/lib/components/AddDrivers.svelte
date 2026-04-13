<script>
  import { DEMO_DRIVERS } from '$lib/demo-data';

  let { onsubmit, existingDrivers = [] } = $props();

  let drivers = $state([]);
  let newNickname = $state('');
  let newNumber = $state('');
  let newRealName = $state('');
  let showAdd = $state(false);

  function addDriver() {
    if (!newNickname.trim()) return;
    const num = newNumber ? parseInt(newNumber) : null;
    drivers = [...drivers, {
      id: crypto.randomUUID(),
      nickname: newNickname.trim(),
      number: num,
      realName: newRealName.trim() || null,
    }];
    newNickname = '';
    newNumber = '';
    newRealName = '';
  }

  function removeDriver(id) {
    drivers = drivers.filter(d => d.id !== id);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onsubmit?.(drivers);
  }
</script>

<div class="max-w-lg mx-auto px-4 py-6">
  <h2 class="text-xl font-bold mb-4">🏎️ Add Drivers</h2>
  <p class="text-sm text-[var(--text-secondary)] mb-6">Add the drivers who'll be racing in this championship.</p>

  <!-- Quick add from existing -->
  {#if existingDrivers.length > 0}
    <div class="mb-4">
      <button
        onclick={() => showAdd = !showAdd}
        class="text-sm text-[var(--neon-red)] hover:underline"
      >
        {showAdd ? 'Hide' : 'Add from previous championships'}
      </button>
    </div>
  {/if}

  <form onsubmit={handleSubmit} class="space-y-6">
    <!-- Current drivers list -->
    {#if drivers.length > 0}
      <div class="space-y-2">
        {#each drivers as driver, i}
          <div class="flex items-center gap-3 px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
            {#if driver.number}
              <div class="w-8 h-8 rounded-full bg-[var(--neon-red)]/20 border border-[var(--neon-red)]/40 flex items-center justify-center text-xs font-bold text-[var(--neon-red)]">
                {driver.number}
              </div>
            {:else}
              <div class="w-8 h-8 rounded-full bg-[var(--bg-dark)] border border-[var(--border)] flex items-center justify-center text-xs text-[var(--text-secondary)]">
                {i + 1}
              </div>
            {/if}
            <div class="flex-1">
              <div class="font-bold text-sm">{driver.nickname}</div>
              {#if driver.realName}
                <div class="text-xs text-[var(--text-secondary)]">{driver.realName}</div>
              {/if}
            </div>
            <button
              type="button"
              onclick={() => removeDriver(driver.id)}
              class="text-[var(--text-secondary)] hover:text-red-500 transition-colors text-lg"
            >×</button>
          </div>
        {/each}
      </div>
    {/if}

    <!-- Add driver form -->
    <div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 space-y-3">
      <div class="text-sm font-semibold text-[var(--text-secondary)]">Add Driver</div>
      <div class="flex gap-2">
        <input
          type="number"
          bind:value={newNumber}
          placeholder="#"
          min="1"
          max="999"
          class="w-16 px-3 py-2.5 bg-[var(--bg-dark)] border border-[var(--border)] rounded-lg text-center text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-red)] transition-colors"
        />
        <input
          type="text"
          bind:value={newNickname}
          placeholder="Nickname *"
          class="flex-1 px-3 py-2.5 bg-[var(--bg-dark)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--neon-red)] transition-colors"
        />
        <input
          type="text"
          bind:value={newRealName}
          placeholder="Real name"
          class="flex-1 px-3 py-2.5 bg-[var(--bg-dark)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--neon-red)] transition-colors"
        />
      </div>
      <button
        type="button"
        onclick={addDriver}
        disabled={!newNickname.trim()}
        class="w-full py-2.5 border border-[var(--neon-red)]/40 text-[var(--neon-red)] font-semibold rounded-lg text-sm hover:bg-[var(--neon-red)]/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        + Add Driver ({drivers.length} added)
      </button>
    </div>

    {#if drivers.length > 0}
      <button
        type="submit"
        class="w-full py-3.5 bg-[var(--neon-red)] text-white font-bold rounded-xl hover:bg-red-600 transition-colors text-lg"
      >
        Continue to Races ({drivers.length} drivers) →
      </button>
    {:else}
      <div class="text-center text-sm text-[var(--text-secondary)] py-4">
        Add at least 2 drivers to continue
      </div>
    {/if}
  </form>
</div>
