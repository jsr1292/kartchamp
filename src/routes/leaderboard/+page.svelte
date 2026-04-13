<svelte:head>
  <title>Leaderboard — KartChamp</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-black mb-2">🏆 Standings</h1>
  <p class="text-[var(--text-secondary)] mb-8">Select a championship to view live standings.</p>

  <!-- Empty state -->
  <div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-12 text-center">
    <div class="text-5xl mb-4">🏁</div>
    <h3 class="text-lg font-bold mb-2">No championships yet</h3>
    <p class="text-sm text-[var(--text-secondary)] mb-6">Create your first championship to get started.</p>
    <a href="/championships/new" class="inline-block px-6 py-3 bg-[var(--neon-red)] text-white font-bold rounded-xl hover:bg-red-600 transition-colors">
      Create Championship
    </a>
  </div>
</div>
