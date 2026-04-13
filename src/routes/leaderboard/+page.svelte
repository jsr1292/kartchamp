<script>
  import Standings from '$lib/components/Standings.svelte';
  import RaceCard from '$lib/components/RaceCard.svelte';
  import { DEMO_RESULTS, DEMO_RACES, DEMO_POINTS_SYSTEM } from '$lib/demo-data';
  import { calculateStandings } from '$lib/scoring';

  // Group results by race
  let resultsByRace = $derived(
    DEMO_RACES.map(race => ({
      ...race,
      results: DEMO_RESULTS.filter(r => r.raceId === race.id)
    }))
  );

  const championship = {
    name: 'Summer 2026 League',
    track: 'Karting Madrid',
    dropWorst: 1,
  };
</script>

<svelte:head>
  <title>Leaderboard — KartChamp</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-6">
  <!-- Championship Header -->
  <div class="mb-6">
    <div class="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-1">
      <span>🏁</span>
      <span>{championship.track}</span>
      <span>·</span>
      <span>{DEMO_RACES.length} races</span>
      <span>·</span>
      <span>Drop worst {championship.dropWorst}</span>
    </div>
    <h1 class="text-3xl font-black">{championship.name}</h1>
  </div>

  <!-- Standings -->
  <div class="mb-8">
    <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
      🏆 Standings
    </h2>
    <Standings results={DEMO_RESULTS} pointsSystem={DEMO_POINTS_SYSTEM} dropWorst={championship.dropWorst} />
  </div>

  <!-- Race Results -->
  <div>
    <h2 class="text-lg font-bold mb-4">📋 Race Results</h2>
    <div class="space-y-3">
      {#each resultsByRace as race}
        <RaceCard name={race.name} date={race.date} track={race.track} results={race.results} />
      {/each}
    </div>
  </div>
</div>
