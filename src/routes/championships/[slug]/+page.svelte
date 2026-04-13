<script>
  import Standings from '$lib/components/Standings.svelte';
  import RaceCard from '$lib/components/RaceCard.svelte';
  import AddRace from '$lib/components/AddRace.svelte';
  import { DEMO_RESULTS, DEMO_RACES, DEMO_DRIVERS, DEMO_POINTS_SYSTEM } from '$lib/demo-data';
  import { formatTime } from '$lib/scoring';

  let { data } = $props();

  // Use real data if championship exists, otherwise demo
  let championship = $derived(data.championship || {
    name: 'Summer 2026 League',
    description: 'Weekend karting championship with friends',
    drop_worst: 1,
    points_system: DEMO_POINTS_SYSTEM,
  });

  let drivers = $derived(data.drivers?.length ? data.drivers : DEMO_DRIVERS);
  let racesWithResults = $derived(data.racesWithResults?.length ? data.racesWithResults : 
    DEMO_RACES.map(race => ({
      race: { id: race.id, name: race.name, date: race.date },
      trackName: race.track,
      results: DEMO_RESULTS.filter(r => r.raceId === race.id),
    }))
  );

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

  let pointsSystem = $derived(championship.points_system || DEMO_POINTS_SYSTEM);
</script>

<svelte:head>
  <title>{championship.name} — KartChamp</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-6">
  <a href="/" class="text-xs text-[var(--text-secondary)] hover:text-[var(--neon-red)]">← Home</a>
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
    <div class="space-y-3">
      {#each racesWithResults as race}
        <RaceCard name={race.race.name} date={race.race.date?.toISOString?.() || race.race.date} track={race.trackName || ''} results={race.results} />
      {/each}
    </div>
  {:else if tab === 'drivers'}
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
  {:else if tab === 'add-race'}
    <AddRace {drivers} onsubmit={(d) => { console.log('TODO: save race', d); tab = 'races'; }} />
  {/if}
</div>
