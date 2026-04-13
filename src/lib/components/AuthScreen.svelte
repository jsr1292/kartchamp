<script>
  let mode = $state('login'); // login | register
  let email = $state('');
  let password = $state('');
  let nickname = $state('');
  let error = $state('');
  let loading = $state(false);

  async function handleSubmit(e) {
    e.preventDefault();
    error = '';
    loading = true;

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          mode === 'register'
            ? { action: 'register', email, password, nickname }
            : { action: 'login', email, password }
        ),
      });
      const data = await res.json();
      if (!res.ok) {
        error = data.error || 'Something went wrong';
        return;
      }
      window.location.reload();
    } catch {
      error = 'Network error';
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center px-4">
  <div class="w-full max-w-sm">
    <!-- Logo -->
    <div class="text-center mb-8">
      <div class="text-5xl mb-3">🏎️</div>
      <h1 class="text-3xl font-black">Kart<span class="text-[var(--neon-red)]">Champ</span></h1>
      <p class="text-sm text-[var(--text-secondary)] mt-1">{mode === 'login' ? 'Welcome back' : 'Create your account'}</p>
    </div>

    <form onsubmit={handleSubmit} class="space-y-4">
      {#if error}
        <div class="px-4 py-3 bg-red-950/50 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      {/if}

      <div>
        <label for="email" class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Email</label>
        <input id="email" type="email" bind:value={email} placeholder="you@email.com" required
          class="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--neon-red)]" />
      </div>

      {#if mode === 'register'}
        <div>
          <label for="nick" class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Nickname</label>
          <input id="nick" type="text" bind:value={nickname} placeholder="Speedy" required
            class="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--neon-red)]" />
        </div>
      {/if}

      <div>
        <label for="pw" class="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Password</label>
        <input id="pw" type="password" bind:value={password} placeholder="••••••••" required minlength="6"
          class="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--neon-red)]" />
      </div>

      <button type="submit" disabled={loading}
        class="w-full py-3.5 bg-[var(--neon-red)] text-white font-bold rounded-xl hover:bg-red-600 transition-colors text-lg disabled:opacity-50">
        {loading ? '...' : mode === 'login' ? 'Sign In' : 'Create Account'}
      </button>
    </form>

    <div class="text-center mt-4 text-sm text-[var(--text-secondary)]">
      {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
      <button onclick={() => { mode = mode === 'login' ? 'register' : 'login'; error = ''; }}
        class="text-[var(--neon-red)] font-semibold ml-1 hover:underline">
        {mode === 'login' ? 'Sign up' : 'Sign in'}
      </button>
    </div>
  </div>
</div>
