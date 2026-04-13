<script>
  import Standings from '$lib/components/Standings.svelte';
  import RaceCard from '$lib/components/RaceCard.svelte';
  import AddRace from '$lib/components/AddRace.svelte';
  import { DEMO_POINTS_SYSTEM } from '$lib/demo-data';
  import { formatTime } from '$lib/scoring';

  let { data } = $props();

  // Only use real data - no demo fallbacks when championship exists
  let championship = $derived(data.hasChampionship ? data.championship : null);
  let drivers = $derived(data.drivers ?? []);
  let racesWithResults = $derived(data.racesWithResults ?? []);

  let tab = $state('standings');

  // Build flat results for scoring engine
  let allResults = $derived(
    racesWithResults.flatMap(r => r.results.map(res => ({
      driverId: res.driverId,
      driverNickname: res.driverNickname,
      driverNumber: res.driverNumber ?? null,
      position: res.position,
      totalTimeMs: res.totalTimeMs ?? null,
      bestLapMs: res.bestLapMs ?? null,
      points: res.points ?? 0,
      raceId: r.race.id,
    })))
  );

  let pointsSystem = $derived(
    championship?.points_system?.length ? championship.points_system : DEMO_POINTS_SYSTEM
  );

  async function handleAddRace(raceData) {
    const res = await fetch('/api/races', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        championshipId: championship.id,
        name: raceData.name,
        date: raceData.date,
        track: raceData.track || null,
        weather: raceData.weather || 'dry',
        laps: raceData.laps || null,
        results: raceData.results.map((r, i) => ({
          driverId: r.driverId,
          position: i + 1,
          totalTimeMs: r.totalTimeMs ?? null,
          bestLapMs: r.bestLapMs ?? null,
        })),
      }),
    });
    if (res.ok) {
      tab = 'races';
      // Reload the page to get updated data
      window.location.reload();
    }
  }
</script>

<svelte:head>
  <title>{championship ? `${championship.name} — KartChamp` : 'Championship — KartChamp'}</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-6">
  <a href="/" class="text-xs text-[var(--text-secondary)] hover:text-[var(--neon-red)]">← Home</a>

  {#if !championship}
    <div class="text-center py-16">
      <div class="text-4xl mb-3">🏁</div>
      <h1 class="text-2xl font-black mb-2">Championship not found</h1>
      <p class="text-[var(--text-secondary)] mb-6">This championship doesn't exist or you don't have access.</p>
      <a href="/championships/new" class="inline-block px-6 py-3 bg-[var(--neon-red)] text-white font-bold rounded-xl hover:bg-red-600 transition-colors">
        Create a Championship
      </a>
    </div>
  {:else}
    <div class="flex items-start justify-between mt-2">
      <div>
        <h1 class="text-2xl font-black">{championship.name}</h1>
        {#if championship.description}
          <p class="text-sm text-[var(--text-secondary)] mt-0.5">{championship.description}</p>
        {/if}
      </div>
      <button onclick={() => tab = 'add-race'}
        class="px-4 py-2 bg-[var(--neon-red)] text-white font-bold rounded-lg text-sm hover:bg-red-600 whitespace-nowrap">
        + Add Race
      </button>
    </div>
    <div class="flex gap-4 mt-3 text-xs text-[var(--text-secondary)]">
      <span>🏁 {racesWithResults.length} races</span>
      <span>🏎️ {drivers.length} drivers</span>
      <span>📉 Drop worst {championship.drop_worst}</span>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-1 my-6">
      {#each [{ id: 'standings', label: '🏆 Standings' }, { id: 'races', label: '📋 Races' }, { id: 'drivers', label: '🏎️ Drivers' }] as t}
        <button onclick={() => tab = t.id}
          class="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors
            {tab === t.id ? 'bg-[var(--neon-red)]/20 text-[var(--neon-red)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}">
          {t.label}
        </button>
      {/each}
    </div>

    {#if tab === 'standings'}
      <Standings results={allResults} pointsSystem={pointsSystem} dropWorst={championship.drop_worst} />
    {:else if tab === 'races'}
      {#if racesWithResults.length === 0}
        <div class="text-center py-12">
          <div class="text-4xl mb-3">🏁</div>
          <p class="text-[var(--text-secondary)] mb-4">No races yet. Add the first race!</p>
          <button onclick={() => tab = 'add-race'} class="px-6 py-3 bg-[var(--neon-red)] text-white font-bold rounded-xl hover:bg-red-600 transition-colors">
            + Add First Race
          </button>
        </div>
      {:else}
        <div class="space-y-3">
          {#each racesWithResults as race}
            <RaceCard name={race.race.name} date={race.race.date?.toISOString?.() || race.race.date} track={race.trackName || ''} results={race.results} />
          {/each}
        </div>
      {/if}
    {:else if tab === 'drivers'}
      {#if drivers.length === 0}
        <div class="text-center py-12">
          <div class="text-4xl mb-3">🏎️</div>
          <p class="text-[var(--text-secondary)]">No drivers yet.</p>
        </div>
      {:else}
        <div class="space-y-2">
          {#each drivers as driver}
            <div class="flex items-center gap-3 px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
              {#if driver.number}
                <div class="w-10 h-10 rounded-full bg-[var(--neon-red)]/20 border border-[var(--neon-red)]/40 flex items-center justify-center text-sm font-bold text-[var(--neon-red)]">
                  {driver.number}
                </div>
              {:else}
                <div class="w-10 h-10 rounded-full bg-[var(--bg-dark)] border border-[var(--border)] flex items-center justify-center text-sm text-[var(--text-secondary)]">?</div>
              {/if}
              <div class="flex-1">
                <div class="font-bold text-sm">{driver.nickname}</div>
                {#if driver.realName}<div class="text-xs text-[var(--text-secondary)]">{driver.realName}</div>{/if}
              </div>
              <div class="text-right text-xs text-[var(--text-secondary)]">
                <div>{allResults.filter(r => r.driverId === driver.id).length} races · {allResults.filter(r => r.driverId === driver.id && r.position === 1).length}W</div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    {:else if tab === 'add-race'}
      {#if drivers.length === 0}
        <div class="text-center py-12">
          <div class="text-4xl mb-3">🏎️</div>
          <p class="text-[var(--text-secondary)] mb-4">Add drivers before recording a race.</p>
        </div>
      {:else}
        <AddRace {drivers} onsubmit={handleAddRace} />
      {/if}
    {/if}
  {/if}
</div>
