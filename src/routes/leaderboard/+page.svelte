<script>
  let { data } = $props();
  let championships = $derived(data.championships || []);
</script>

<svelte:head>
  <title>Championships — KartChamp</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-6">
  <h1 class="text-3xl font-black mb-2">🏆 Championships</h1>
  <p class="text-[var(--text-secondary)] mb-6">Your racing leagues</p>

  {#if championships.length > 0}
    <div class="space-y-3">
      {#each championships as champ}
        <a href="/championships/{champ.slug}" class="block bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 hover:border-[var(--neon-red)]/50 transition-colors group">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold group-hover:text-[var(--neon-red)] transition-colors">{champ.name}</h3>
              <p class="text-sm text-[var(--text-secondary)] mt-0.5">{champ.description || 'No description'}</p>
            </div>
            <div class="text-right text-xs text-[var(--text-secondary)]">
              <div class="text-base font-bold">{new Date(champ.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
            </div>
          </div>
        </a>
      {/each}
    </div>
  {:else}
    <div class="text-center py-12">
      <div class="text-4xl mb-3">🏁</div>
      <p class="text-[var(--text-secondary)] mb-4">No championships yet</p>
      <a href="/championships/new" class="inline-block px-6 py-3 bg-[var(--neon-red)] text-white font-bold rounded-xl hover:bg-red-600 transition-colors">
        Create Your First Championship
      </a>
    </div>
  {/if}
</div>
