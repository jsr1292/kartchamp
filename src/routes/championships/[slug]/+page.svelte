<script>
  let { params } = $props();
</script>

<svelte:head>
  <title>Championship — KartChamp</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-8">
  <a href="/leaderboard" class="text-sm text-[var(--text-secondary)] hover:text-[var(--neon-red)] transition-colors mb-4 inline-block">
    ← Back to standings
  </a>
  
  <div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-12 text-center">
    <div class="text-5xl mb-4">🏆</div>
    <h3 class="text-lg font-bold mb-2">Championship: {params.slug}</h3>
    <p class="text-sm text-[var(--text-secondary)]">Coming soon — standings, races, and driver stats.</p>
  </div>
</div>
