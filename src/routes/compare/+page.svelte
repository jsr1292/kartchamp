<script>
  import { DEMO_RESULTS, DEMO_DRIVERS, DEMO_RACES } from '$lib/demo-data';
  import { formatTime } from '$lib/scoring';

  let selected = $state(['d1', 'd2']);

  function toggle(id) {
    if (selected.includes(id)) {
      if (selected.length > 1) selected = selected.filter(s => s !== id);
    } else {
      if (selected.length < 4) selected = [...selected, id];
    }
  }

  function getDriverStats(id) {
    const res = DEMO_RESULTS.filter(r => r.driverId === id);
    const wins = res.filter(r => r.position === 1).length;
    const podiums = res.filter(r => r.position <= 3).length;
    const avgPos = res.length ? (res.reduce((s, r) => s + r.position, 0) / res.length).toFixed(1) : '—';
    const bestLap = res.reduce((best, r) => (!r.bestLapMs ? best : (!best || r.bestLapMs < best) ? r.bestLapMs : best), null);
    const totalPoints = res.reduce((s, r) => s + r.points, 0);
    return { driver: DEMO_DRIVERS.find(d => d.id === id), wins, podiums, avgPos, bestLap, totalPoints, races: res.length };
  }

  let stats = $derived(selected.map(getDriverStats));
  let fastest = $derived(Math.min(...stats.map(s => s.bestLap).filter(Boolean)));

  function barPct(val, max, range, lower) {
    if (lower) return Math.max(5, 100 - ((val - max) / range) * 80);
    return Math.max(5, (val / range) * 100);
  }

  const barColor = ['bg-[var(--neon-red)]', 'bg-blue-500', 'bg-[var(--neon-green)]', 'bg-[var(--neon-yellow)]'];

  const statDefs = [
    { label: 'Total Points', key: 'totalPoints', lower: false },
    { label: 'Wins', key: 'wins', lower: false },
    { label: 'Podiums', key: 'podiums', lower: false },
    { label: 'Avg Position', key: 'avgPos', lower: true },
    { label: 'Races', key: 'races', lower: false },
  ];
</script>

<svelte:head>
  <title>Compare — KartChamp</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-6">
  <a href="/" class="text-xs text-[var(--text-secondary)] hover:text-[var(--neon-red)]">← Home</a>
  <h1 class="text-2xl font-black mt-2 mb-1">⚖️ Driver Comparison</h1>
  <p class="text-sm text-[var(--text-secondary)] mb-6">Select 2-4 drivers to compare stats</p>

  <!-- Driver selector -->
  <div class="flex flex-wrap gap-2 mb-6">
    {#each DEMO_DRIVERS as d}
      <button onclick={() => toggle(d.id)}
        class="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-colors
          {selected.includes(d.id) ? 'border-[var(--neon-red)] bg-red-950/30 text-[var(--neon-red)]' : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]'}">
        {#if d.number}<span class="text-xs opacity-70">#{d.number}</span>{/if}
        {d.nickname}
      </button>
    {/each}
  </div>

  {#if selected.length >= 2}
    <!-- Head to head -->
    {#if selected.length === 2}
      <div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 mb-4 text-center">
        <div class="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-2">Head to Head</div>
        <div class="flex items-center justify-center gap-4">
          <div class="text-right flex-1">
            <div class="font-bold text-lg">{stats[0].driver.nickname}</div>
            <div class="text-2xl font-black text-[var(--neon-red)]">{stats[0].wins}</div>
          </div>
          <div class="text-xs text-[var(--text-secondary)]">wins each</div>
          <div class="text-left flex-1">
            <div class="font-bold text-lg">{stats[1].driver.nickname}</div>
            <div class="text-2xl font-black text-blue-500">{stats[1].wins}</div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Stats bars -->
    <div class="space-y-3">
      {#each statDefs as stat}
        {@const values = stats.map(s => parseFloat(s[stat.key]) || 0)}
        {@const maxVal = stat.lower ? Math.min(...values) : Math.max(...values)}
        {@const range = stat.lower ? (Math.max(...values) - Math.min(...values)) || 1 : Math.max(...values) || 1}
        <div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3">
          <div class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">{stat.label}</div>
          {#each stats as s, i}
            {@const val = parseFloat(s[stat.key]) || 0}
            {@const pct = barPct(val, maxVal, range, stat.lower)}
            <div class="flex items-center gap-2 mb-1.5">
              <div class="w-20 text-xs font-medium truncate">{s.driver.nickname}</div>
              <div class="flex-1 bg-[var(--bg-dark)] rounded-full h-5 overflow-hidden">
                <div class="h-full {barColor[i]} rounded-full transition-all" style="width: {pct}%"></div>
              </div>
              <div class="w-12 text-right text-sm font-bold">{s[stat.key]}</div>
            </div>
          {/each}
        </div>
      {/each}

      <!-- Best lap -->
      <div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3">
        <div class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Best Lap</div>
        {#each stats as s, i}
          <div class="flex items-center gap-2 mb-1.5">
            <div class="w-20 text-xs font-medium truncate">{s.driver.nickname}</div>
            <div class="flex-1 text-sm">
              {#if s.bestLap && s.bestLap === fastest}
                <span class="text-[var(--neon-green)] font-bold">⚡ {formatTime(s.bestLap)}</span>
              {:else if s.bestLap}
                <span class="text-[var(--text-secondary)]">+{(s.bestLap - fastest)}ms · {formatTime(s.bestLap)}</span>
              {:else}
                <span class="text-[var(--text-secondary)]">—</span>
              {/if}
            </div>
          </div>
        {/each}
      </div>

      <!-- Position history -->
      <div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3">
        <div class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Position History</div>
        <div class="flex gap-1">
          {#each DEMO_RACES as race, ri}
            <div class="flex-1 text-center">
              <div class="text-[10px] text-[var(--text-secondary)] mb-1">R{ri + 1}</div>
              {#each stats as s}
                {@const pos = DEMO_RESULTS.find(r => r.driverId === s.driver.id && r.raceId === race.id)?.position}
                <div class="text-sm font-bold mb-0.5 {pos === 1 ? 'text-[var(--neon-yellow)]' : pos === 2 ? 'text-gray-300' : pos === 3 ? 'text-amber-600' : 'text-[var(--text-secondary)]'}">
                  P{pos ?? '-'}
                </div>
              {/each}
            </div>
          {/each}
        </div>
        <div class="flex gap-3 mt-2 pt-2 border-t border-[var(--border)]">
          {#each stats as s, i}
            <div class="flex items-center gap-1 text-xs">
              <div class="w-2.5 h-2.5 rounded-full {barColor[i]}"></div>
              {s.driver.nickname}
            </div>
          {/each}
        </div>
      </div>
    </div>
  {:else}
    <div class="text-center py-12 text-[var(--text-secondary)]">Select at least 2 drivers to compare</div>
  {/if}
</div>
