<script>
  import { onMount } from 'svelte';

  let championships = $state([]);

  onMount(async () => {
    // Will wire up real data later
    championships = [];
  });
</script>

<svelte:head>
  <title>KartChamp — Go-Kart Championship Tracker</title>
</svelte:head>

<div class="min-h-screen flex flex-col">
  <!-- Hero -->
  <header class="relative overflow-hidden">
    <div class="absolute inset-0 checkered opacity-5"></div>
    <div class="relative max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
      <div class="text-6xl mb-4">🏎️</div>
      <h1 class="text-5xl font-black tracking-tight mb-3">
        Kart<span class="text-[var(--neon-red)]">Champ</span>
      </h1>
      <p class="text-lg text-[var(--text-secondary)] max-w-md mx-auto mb-8">
        Track your go-kart championships. Race results, standings, stats — all in one place.
      </p>
      <div class="flex gap-3 justify-center">
        <a href="/championships/new" class="px-6 py-3 bg-[var(--neon-red)] text-white font-bold rounded-xl hover:bg-red-600 transition-colors">
          Create Championship
        </a>
        <a href="/leaderboard" class="px-6 py-3 border border-[var(--border)] text-[var(--text-primary)] font-semibold rounded-xl hover:border-[var(--neon-red)] transition-colors">
          View Leaderboard
        </a>
      </div>
    </div>
  </header>

  <!-- Features -->
  <main class="max-w-4xl mx-auto px-4 py-12 flex-1">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
        <div class="text-3xl mb-3">🏁</div>
        <h3 class="font-bold mb-1">Custom Scoring</h3>
        <p class="text-sm text-[var(--text-secondary)]">F1-style points, drop worst races, fully configurable per championship.</p>
      </div>
      <div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
        <div class="text-3xl mb-3">📊</div>
        <h3 class="font-bold mb-1">Live Standings</h3>
        <p class="text-sm text-[var(--text-secondary)]">Auto-calculated leaderboards, driver stats, head-to-head comparisons.</p>
      </div>
      <div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
        <div class="text-3xl mb-3">📱</div>
        <h3 class="font-bold mb-1">Mobile First</h3>
        <p class="text-sm text-[var(--text-secondary)]">Check standings at the track. Share public links with friends.</p>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="text-center py-6 text-xs text-[var(--text-secondary)] border-t border-[var(--border)]">
    KartChamp — Built for racers, by racers 🏁
  </footer>
</div>
