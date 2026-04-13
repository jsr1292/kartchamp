<script>
  import { formatTime, positionColor } from '$lib/scoring';

  let { name, date, track, results } = $props();

  let expanded = $state(false);
  let sorted = $derived([...results].sort((a, b) => a.position - b.position));
</script>

<div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
  <!-- Header -->
  <button
    onclick={() => expanded = !expanded}
    class="w-full flex items-center justify-between p-4 hover:bg-[var(--bg-card-hover)] transition-colors"
  >
    <div class="text-left">
      <div class="font-bold text-sm">{name}</div>
      <div class="text-xs text-[var(--text-secondary)]">{track} · {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
    </div>
    <div class="flex items-center gap-3">
      <!-- Winner badge -->
      {#if sorted[0]}
        <span class="text-xs font-bold text-[var(--neon-yellow)]">🏆 {sorted[0].driverNickname}</span>
      {/if}
      <span class="text-[var(--text-secondary)] text-xs">{expanded ? '▲' : '▼'}</span>
    </div>
  </button>

  <!-- Results (expandable) -->
  {#if expanded}
    <div class="border-t border-[var(--border)] px-4 py-3 space-y-1.5">
      {#each sorted as r}
        <div class="flex items-center gap-2 text-sm">
          <span class="w-6 text-center font-bold {positionColor(r.position)}">
            {r.position}
          </span>
          {#if r.driverNumber}
            <span class="text-xs text-[var(--text-secondary)]">#{r.driverNumber}</span>
          {/if}
          <span class="flex-1 font-medium">{r.driverNickname}</span>
          <span class="text-xs text-[var(--text-secondary)] font-mono">
            {formatTime(r.totalTimeMs)}
          </span>
          <span class="text-xs font-bold text-[var(--neon-red)]">
            +{r.points}pts
          </span>
        </div>
      {/each}

      <!-- Best lap -->
      {#if sorted.length}
        {@const bestLap = [...sorted].sort((a, b) => (a.bestLapMs ?? Infinity) - (b.bestLapMs ?? Infinity))[0]}
        {#if bestLap?.bestLapMs}
          <div class="mt-2 pt-2 border-t border-[var(--border)] flex items-center gap-2 text-xs text-[var(--neon-green)]">
            <span>⚡ Fastest lap</span>
            <span class="font-bold">{bestLap.driverNickname}</span>
            <span class="font-mono">{formatTime(bestLap.bestLapMs)}</span>
          </div>
        {/if}
      {/if}
    </div>
  {/if}
</div>
