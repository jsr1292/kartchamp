<script>
  import { page } from '$app/stores';
  let { children } = $props();
  let currentPath = $derived($page.url.pathname);

  const nav = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/leaderboard', label: 'Championships', icon: '🏆' },
    { href: '/compare', label: 'Compare', icon: '⚖️' },
  ];
</script>

<div class="min-h-screen bg-[var(--bg-dark)] text-[var(--text-primary)]">
  <main>
    {@render children()}
  </main>

  <!-- Bottom nav (mobile) -->
  <nav class="fixed bottom-0 left-0 right-0 bg-[var(--bg-card)]/95 backdrop-blur-lg border-t border-[var(--border)] safe-area-inset-bottom">
    <div class="max-w-lg mx-auto flex">
      {#each nav as item}
        <a href={item.href}
          class="flex-1 flex flex-col items-center py-2.5 text-[10px] font-medium transition-colors
            {currentPath === item.href ? 'text-[var(--neon-red)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}">
          <span class="text-lg mb-0.5">{item.icon}</span>
          {item.label}
        </a>
      {/each}
      <a href="/championships/new"
        class="flex-1 flex flex-col items-center py-2.5 text-[10px] font-medium transition-colors
          {currentPath === '/championships/new' ? 'text-[var(--neon-red)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}">
        <span class="text-lg mb-0.5">➕</span>
        New
      </a>
    </div>
  </nav>
</div>
