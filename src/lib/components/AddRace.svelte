<script>
  import { DEMO_DRIVERS } from '$lib/demo-data';

  let { drivers, onsubmit } = $props();

  let trackName = $state('');
  let layout = $state('');
  let raceName = $state('Race 1');
  let raceDate = $state(new Date().toISOString().split('T')[0]);
  let weather = $state('dry');
  let laps = $state('');
  let results = $state([]);

  const weatherOptions = [
    { value: 'dry', label: '☀️ Dry', icon: '☀️' },
    { value: 'wet', label: '🌧️ Wet', icon: '🌧️' },
    { value: 'mixed', label: '🌤️ Mixed', icon: '🌤️' },
  ];

  // Create empty results for each driver
  let resultSlots = $derived(
    drivers.map(d => ({
      driverId: d.id,
      nickname: d.nickname,
      number: d.number,
      position: null,
      totalTimeMin: '',
      totalTimeSec: '',
      totalTimeMs: '',
      bestLapSec: '',
      bestLapMs: '',
    }))
  );

  function handleSubmit(e) {
    e.preventDefault();
    // Convert times to ms and build results
    const finalResults = resultSlots.map((r, i) => {
      const totalTimeMs = r.totalTimeMin && r.totalTimeSec
        ? (parseInt(r.totalTimeMin) * 60000 + parseFloat(r.totalTimeSec) * 1000 + parseInt(r.totalTimeMs || '0'))
        : null;
      const bestLapMs = r.bestLapSec
        ? (parseFloat(r.bestLapSec) * 1000 + parseInt(r.bestLapMs || '0'))
        : null;
      return {
        driverId: r.driverId,
        driverNickname: r.nickname,
        driverNumber: r.number,
        position: i + 1, // position based on order in form
        totalTimeMs,
        bestLapMs,
      };
    });
    onsubmit?.({
      track: trackName,
      layout,
      name: raceName,
      date: raceDate,
      weather,
      laps: laps ? parseInt(laps) : null,
      results: finalResults,
    });
  }

  // Sort drivers by dragging or auto-assign positions
  let sorted = $state([...drivers]);

  function moveUp(index) {
    if (index === 0) return;
    const arr = [...sorted];
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    sorted = arr;
  }

  function moveDown(index) {
    if (index === sorted.length - 1) return;
    const arr = [...sorted];
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    sorted = arr;
  }
</script>

<div class="max-w-lg mx-auto px-4 py-6">
  <h2 class="text-xl font-bold mb-4">🏁 Add Race Results</h2>

  <form onsubmit={handleSubmit} class="space-y-5">
    <!-- Race info -->
    <div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label for="track" class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Track</label>
          <input id="track" type="text" bind:value={trackName} placeholder="Karting Madrid"
            class="w-full px-3 py-2.5 bg-[var(--bg-dark)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--neon-red)]" />
        </div>
        <div>
          <label for="layout" class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Layout</label>
          <input id="layout" type="text" bind:value={layout} placeholder="GP Layout"
            class="w-full px-3 py-2.5 bg-[var(--bg-dark)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--neon-red)]" />
        </div>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div>
          <label for="rname" class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Race name</label>
          <input id="rname" type="text" bind:value={raceName} placeholder="Race 1"
            class="w-full px-3 py-2.5 bg-[var(--bg-dark)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-red)]" />
        </div>
        <div>
          <label for="rdate" class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Date</label>
          <input id="rdate" type="date" bind:value={raceDate}
            class="w-full px-3 py-2.5 bg-[var(--bg-dark)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-red)]" />
        </div>
        <div>
          <label for="rlaps" class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Laps</label>
          <input id="rlaps" type="number" bind:value={laps} placeholder="10" min="1"
            class="w-full px-3 py-2.5 bg-[var(--bg-dark)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-red)]" />
        </div>
      </div>
      <!-- Weather -->
      <div>
        <div class="text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Weather</div>
        <div class="flex gap-2">
          {#each weatherOptions as w}
            <button type="button"
              onclick={() => weather = w.value}
              class="flex-1 py-2 rounded-lg border text-sm font-medium transition-colors
                {weather === w.value ? 'border-[var(--neon-red)] bg-red-950/30 text-[var(--text-primary)]' : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]'}"
            >{w.label}</button>
          {/each}
        </div>
      </div>
    </div>

    <!-- Positions — drag to reorder -->
    <div>
      <div class="text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
        Positions (reorder by moving up/down)
      </div>
      <div class="space-y-1.5">
        {#each sorted as driver, i}
          <div class="flex items-center gap-2 px-3 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
            <!-- Position badge -->
            <div class="w-7 text-center font-black text-sm {i === 0 ? 'text-[var(--neon-yellow)]' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-[var(--text-secondary)]'}">
              P{i + 1}
            </div>
            <!-- Number -->
            {#if driver.number}
              <div class="w-7 h-7 rounded-full bg-[var(--neon-red)]/20 border border-[var(--neon-red)]/40 flex items-center justify-center text-[10px] font-bold text-[var(--neon-red)]">
                {driver.number}
              </div>
            {/if}
            <!-- Name -->
            <span class="flex-1 font-medium text-sm">{driver.nickname}</span>
            <!-- Move buttons -->
            <div class="flex flex-col">
              <button type="button" onclick={() => moveUp(i)} disabled={i === 0}
                class="text-xs text-[var(--text-secondary)] hover:text-white disabled:opacity-20 leading-none">▲</button>
              <button type="button" onclick={() => moveDown(i)} disabled={i === sorted.length - 1}
                class="text-xs text-[var(--text-secondary)] hover:text-white disabled:opacity-20 leading-none">▼</button>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <button type="submit"
      class="w-full py-3.5 bg-[var(--neon-red)] text-white font-bold rounded-xl hover:bg-red-600 transition-colors text-lg"
    >
      Save Race Results 🏁
    </button>
  </form>
</div>
