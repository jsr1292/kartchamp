<script>
  let { data } = $props();
  let user = $derived(data.user);

  const navItems = [
    { href: '/leaderboard', icon: '🏆', label: 'Championships', desc: 'View standings & results' },
    { href: '/compare', icon: '⚖️', label: 'Compare', desc: 'Head-to-head driver stats' },
    { href: '/championships/new', icon: '➕', label: 'New Championship', desc: 'Start a new league' },
  ];

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.reload();
  }
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
    {#if user}
      <div class="mt-3 text-sm text-[var(--text-secondary)]">
        Hey, <span class="text-[var(--neon-red)] font-bold">{user.nickname}</span> · 
        <button onclick={handleLogout} class="text-[var(--text-secondary)] hover:text-[var(--neon-red)] underline">Sign out</button>
      </div>
    {/if}
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
        <div class="text-[var(--text-secondary)] group-hover:text-[var(--neon-red)]">→</div>
      </a>
    {/each}
  </div>

  <!-- Footer -->
  <div class="text-center text-xs text-[var(--text-secondary)] py-6 border-t border-[var(--border)]">
    <p>KartChamp v0.1 · Built with SvelteKit + Neon</p>
  </div>
</div>
