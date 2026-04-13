<script>
  import { DEMO_RESULTS, DEMO_RACES, DEMO_POINTS_SYSTEM } from '$lib/demo-data';

  const demoChampionships = [
    {
      slug: 'summer-2026',
      name: 'Summer 2026 League',
      description: 'Weekend karting with the crew',
      driverCount: 8,
      raceCount: 4,
    },
  ];
</script>

<svelte:head>
  <title>Leaderboard — KartChamp</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-6">
  <h1 class="text-3xl font-black mb-2">🏆 Championships</h1>
  <p class="text-[var(--text-secondary)] mb-6">Select a championship to view standings and results.</p>

  <div class="space-y-3">
    {#each demoChampionships as champ}
      <a href="/championships/{champ.slug}" class="block bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 hover:border-[var(--neon-red)]/50 transition-colors group">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold group-hover:text-[var(--neon-red)] transition-colors">{champ.name}</h3>
            <p class="text-sm text-[var(--text-secondary)] mt-0.5">{champ.description}</p>
          </div>
          <div class="text-right text-xs text-[var(--text-secondary)]">
            <div class="text-lg font-black text-[var(--neon-yellow)]">{champ.driverCount}</div>
            <div>drivers</div>
            <div class="mt-1 text-base font-bold">{champ.raceCount} races</div>
          </div>
        </div>
      </a>
    {/each}
  </div>

  <!-- Create new -->
  <div class="mt-6 text-center">
    <a href="/championships/new" class="inline-block px-6 py-3 border border-dashed border-[var(--border)] text-[var(--text-secondary)] font-semibold rounded-xl hover:border-[var(--neon-red)] hover:text-[var(--neon-red)] transition-colors">
      + Create New Championship
    </a>
  </div>
</div>
