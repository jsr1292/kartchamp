<script>
  import Standings from '$lib/components/Standings.svelte';
  import RaceCard from '$lib/components/RaceCard.svelte';
  import AddRace from '$lib/components/AddRace.svelte';
  import { DEMO_RESULTS, DEMO_RACES, DEMO_DRIVERS, DEMO_POINTS_SYSTEM } from '$lib/demo-data';
  import { formatTime } from '$lib/scoring';

  const championship = {
    name: 'Summer 2026 League',
    description: 'Weekend karting championship with friends',
    dropWorst: 1,
    pointsSystem: DEMO_POINTS_SYSTEM,
  };

  let tab = $state('standings'); // standings | races | drivers | add-race
  let races = $state(DEMO_RACES);
  let results = $state(DEMO_RESULTS);

  let resultsByRace = $derived(
    races.map(race => ({
      ...race,
      results: results.filter(r => r.raceId === race.id)
    }))
  );

  function handleNewRace(data) {
    const raceId = crypto.randomUUID();
    races = [{ id: raceId, name: data.name, date: data.date, track: `${data.track}${data.layout ? ' - ' + data.layout : ''}` }, ...races];
    results = [
      ...data.results.map(r => ({
        ...r,
        raceId,
        points: 0, // will be calculated by scoring engine
      })),
      ...results
    ];
    tab = 'races';
  }
</script>

<svelte:head>
  <title>{championship.name} — KartChamp</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-6">
  <!-- Header -->
  <div class="mb-6">
    <a href="/" class="text-xs text-[var(--text-secondary)] hover:text-[var(--neon-red)] transition-colors">← Home</a>
    <div class="flex items-start justify-between mt-2">
      <div>
        <h1 class="text-2xl font-black">{championship.name}</h1>
        <p class="text-sm text-[var(--text-secondary)] mt-0.5">{championship.description}</p>
      </div>
      <button
        onclick={() => tab = 'add-race'}
        class="px-4 py-2 bg-[var(--neon-red)] text-white font-bold rounded-lg text-sm hover:bg-red-600 transition-colors whitespace-nowrap"
      >
        + Add Race
      </button>
    </div>
    <div class="flex gap-4 mt-3 text-xs text-[var(--text-secondary)]">
      <span>🏁 {races.length} races</span>
      <span>🏎️ {DEMO_DRIVERS.length} drivers</span>
      <span>📉 Drop worst {championship.dropWorst}</span>
    </div>
  </div>

  <!-- Tabs -->
  <div class="flex gap-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-1 mb-6">
    {#each [
      { id: 'standings', label: '🏆 Standings' },
      { id: 'races', label: '📋 Races' },
      { id: 'drivers', label: '🏎️ Drivers' },
    ] as t}
      <button
        onclick={() => tab = t.id}
        class="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors
          {tab === t.id ? 'bg-[var(--neon-red)]/20 text-[var(--neon-red)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}"
      >{t.label}</button>
    {/each}
  </div>

  <!-- Content -->
  {#if tab === 'standings'}
    <Standings {results} pointsSystem={championship.pointsSystem} dropWorst={championship.dropWorst} />
  {:else if tab === 'races'}
    <div class="space-y-3">
      {#each resultsByRace as race}
        <RaceCard name={race.name} date={race.date} track={race.track} results={race.results} />
      {/each}
    </div>
  {:else if tab === 'drivers'}
    <div class="space-y-2">
      {#each DEMO_DRIVERS as driver}
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
            <div class="text-xs text-[var(--text-secondary)]">{driver.realName}</div>
          </div>
          <div class="text-right text-xs text-[var(--text-secondary)]">
            <div>{results.filter(r => r.driverId === driver.id).length} races · {results.filter(r => r.driverId === driver.id && r.position === 1).length}W</div>
          </div>
        </div>
      {/each}
    </div>
  {:else if tab === 'add-race'}
    <AddRace drivers={DEMO_DRIVERS} onsubmit={handleNewRace} />
  {/if}
</div>
