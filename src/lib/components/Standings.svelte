<script>
  import { calculateStandings, positionSuffix, positionColor, formatTime } from '$lib/scoring';

  let { results, pointsSystem, dropWorst = 0 } = $props();

  let standings = $derived(calculateStandings(results, pointsSystem, dropWorst));
  let showPodium = $state(true);

  // Top 3 for podium
  let podium = $derived(standings.slice(0, 3));
</script>

{#if showPodium && podium.length >= 3}
  <!-- Podium Section -->
  <div class="flex items-end justify-center gap-3 mb-8 h-48">
    <!-- 2nd place -->
    <div class="flex flex-col items-center">
      <div class="text-2xl mb-1">🥈</div>
      <div class="text-sm font-bold text-gray-300 mb-1">#{podium[1].number ?? '?'}</div>
      <div class="text-sm font-bold text-gray-300 mb-2">{podium[1].nickname}</div>
      <div class="w-20 bg-gradient-to-t from-gray-600 to-gray-500 rounded-t-lg flex flex-col items-center justify-end pb-3 h-20">
        <span class="text-xl font-black text-gray-300">2nd</span>
        <span class="text-xs text-gray-400">{podium[1].totalPoints} pts</span>
      </div>
    </div>

    <!-- 1st place -->
    <div class="flex flex-col items-center">
      <div class="text-3xl mb-1">🏆</div>
      <div class="text-sm font-bold text-[var(--neon-yellow)] mb-1">#{podium[0].number ?? '?'}</div>
      <div class="text-base font-black text-[var(--neon-yellow)] mb-2">{podium[0].nickname}</div>
      <div class="w-24 bg-gradient-to-t from-[var(--neon-red)] to-red-500 rounded-t-lg flex flex-col items-center justify-end pb-3 h-28 border-t-2 border-[var(--neon-yellow)]">
        <span class="text-2xl font-black text-white">1st</span>
        <span class="text-xs text-red-100">{podium[0].totalPoints} pts</span>
      </div>
    </div>

    <!-- 3rd place -->
    <div class="flex flex-col items-center">
      <div class="text-2xl mb-1">🥉</div>
      <div class="text-sm font-bold text-amber-600 mb-1">#{podium[2].number ?? '?'}</div>
      <div class="text-sm font-bold text-amber-600 mb-2">{podium[2].nickname}</div>
      <div class="w-20 bg-gradient-to-t from-amber-800 to-amber-700 rounded-t-lg flex flex-col items-center justify-end pb-3 h-14">
        <span class="text-xl font-black text-amber-200">3rd</span>
        <span class="text-xs text-amber-300">{podium[2].totalPoints} pts</span>
      </div>
    </div>
  </div>
{/if}

<!-- Full Standings Table -->
<div class="space-y-2">
  {#each standings as driver, i}
    <div class="flex items-center gap-3 px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl hover:border-[var(--neon-red)]/30 transition-colors">
      <!-- Position -->
      <div class="w-8 text-center">
        <span class="text-lg font-black {positionColor(i + 1)}">{i + 1}</span>
      </div>

      <!-- Number -->
      {#if driver.number}
        <div class="w-10 h-10 rounded-full bg-[var(--neon-red)]/20 border border-[var(--neon-red)]/40 flex items-center justify-center text-sm font-bold text-[var(--neon-red)]">
          {driver.number}
        </div>
      {:else}
        <div class="w-10 h-10 rounded-full bg-[var(--bg-dark)] border border-[var(--border)] flex items-center justify-center text-sm text-[var(--text-secondary)]">
          ?
        </div>
      {/if}

      <!-- Info -->
      <div class="flex-1 min-w-0">
        <div class="font-bold text-sm truncate">{driver.nickname}</div>
        <div class="text-xs text-[var(--text-secondary)]">
          {driver.wins}W · {driver.podiums}P · Best lap: {formatTime(driver.bestLapMs)}
        </div>
      </div>

      <!-- Points -->
      <div class="text-right">
        <div class="text-xl font-black text-[var(--neon-yellow)]">{driver.totalPoints}</div>
        <div class="text-[10px] text-[var(--text-secondary)] uppercase">points</div>
      </div>
    </div>
  {/each}
</div>
