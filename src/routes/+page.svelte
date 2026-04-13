<script>
  import { DEMO_RESULTS, DEMO_RACES, DEMO_DRIVERS } from '$lib/demo-data';

  const navItems = [
    { href: '/leaderboard', icon: '🏆', label: 'Championships', desc: 'View standings & results' },
    { href: '/compare', icon: '⚖️', label: 'Compare', desc: 'Head-to-head driver stats' },
    { href: '/championships/new', icon: '➕', label: 'New Championship', desc: 'Start a new league' },
  ];

  // Recent activity for demo
  const recentResults = DEMO_RACES.slice(-2).reverse();
</script>

<svelte:head>
  <title>KartChamp — Go-Kart Championship Tracker</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-6">
  <!-- Hero -->
  <div class="text-center py-8 mb-6 relative">
    <div class="absolute inset-0 opacity-5" style="background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><rect width=%2220%22 height=%2220%22 fill=%22white%22/><rect x=%2220%22 y=%2220%22 width=%2220%22 height=%2220%22 fill=%22white%22/></svg>'); background-size: 40px 40px;"></div>
    <div class="text-5xl mb-3">🏎️</div>
    <h1 class="text-4xl font-black mb-2">Kart<span class="text-[var(--neon-red)]">Champ</span></h1>
    <p class="text-[var(--text-secondary)] text-sm">Track your go-kart championships with friends</p>
  </div>

  <!-- Quick Nav -->
  <div class="space-y-2 mb-8">
    {#each navItems as item}
      <a href={item.href} class="flex items-center gap-4 px-5 py-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl hover:border-[var(--neon-red)]/40 transition-colors group">
        <div class="text-2xl">{item.icon}</div>
        <div class="flex-1">
          <div class="font-bold text-sm group-hover:text-[var(--neon-red)] transition-colors">{item.label}</div>
          <div class="text-xs text-[var(--text-secondary)]">{item.desc}</div>
        </div>
        <div class="text-[var(--text-secondary)] group-hover:text-[var(--neon-red)] transition-colors">→</div>
      </a>
    {/each}
  </div>

  <!-- Demo Championship Card -->
  <div class="bg-gradient-to-br from-[var(--bg-card)] to-red-950/20 border border-[var(--neon-red)]/20 rounded-2xl p-5 mb-8">
    <div class="flex items-center justify-between mb-3">
      <div>
        <div class="text-xs text-[var(--neon-red)] font-semibold uppercase tracking-wider">Live Championship</div>
        <h2 class="text-lg font-bold mt-0.5">Summer 2026 League</h2>
      </div>
      <a href="/championships/summer-2026" class="px-4 py-2 bg-[var(--neon-red)] text-white font-bold rounded-lg text-sm hover:bg-red-600 transition-colors">
        View →
      </a>
    </div>

    <div class="grid grid-cols-3 gap-3 text-center">
      <div class="bg-[var(--bg-dark)]/50 rounded-xl py-2.5">
        <div class="text-xl font-black text-[var(--neon-yellow)]">{DEMO_DRIVERS.length}</div>
        <div class="text-[10px] text-[var(--text-secondary)] uppercase">Drivers</div>
      </div>
      <div class="bg-[var(--bg-dark)]/50 rounded-xl py-2.5">
        <div class="text-xl font-black text-[var(--neon-red)]">{DEMO_RACES.length}</div>
        <div class="text-[10px] text-[var(--text-secondary)] uppercase">Races</div>
      </div>
      <div class="bg-[var(--bg-dark)]/50 rounded-xl py-2.5">
        <div class="text-xl font-black text-[var(--neon-green)]">{DEMO_RESULTS.filter(r => r.position === 1 && r.raceId === DEMO_RACES[DEMO_RACES.length - 1]?.id)[0]?.driverNickname || '—'}</div>
        <div class="text-[10px] text-[var(--text-secondary)] uppercase">Last Winner</div>
      </div>
    </div>
  </div>

  <!-- Recent Races -->
  <div class="mb-8">
    <h2 class="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3">Recent Races</h2>
    <div class="space-y-2">
      {#each recentResults as race}
        {@const winner = DEMO_RESULTS.find(r => r.raceId === race.id && r.position === 1)}
        <a href="/championships/summer-2026" class="flex items-center gap-3 px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl hover:border-[var(--border)] transition-colors">
          <div class="text-lg">🏁</div>
          <div class="flex-1">
            <div class="font-bold text-sm">{race.name}</div>
            <div class="text-xs text-[var(--text-secondary)]">{race.track} · {new Date(race.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
          </div>
          {#if winner}
            <div class="text-right">
              <div class="text-xs font-bold text-[var(--neon-yellow)]">🏆 {winner.driverNickname}</div>
            </div>
          {/if}
        </a>
      {/each}
    </div>
  </div>

  <!-- Footer -->
  <div class="text-center text-xs text-[var(--text-secondary)] py-6 border-t border-[var(--border)]">
    <p>KartChamp v0.1 · Built with SvelteKit</p>
  </div>
</div>
