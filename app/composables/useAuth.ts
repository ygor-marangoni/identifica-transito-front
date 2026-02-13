import { computed } from 'vue';

export const useAuth = () => {
  const token = useState<string | null>('auth_token', () => null);
  const user = useState<Record<string, unknown> | null>('auth_user', () => null);
  const initialized = useState<boolean>('auth_initialized', () => false);

  const init = () => {
    if (initialized.value) return;
    if (process.client) {
      token.value = localStorage.getItem('auth_token');
      const rawUser = localStorage.getItem('auth_user');
      user.value = rawUser ? JSON.parse(rawUser) : null;
    }
    initialized.value = true;
  };

  const setSession = (newToken: string, newUser?: Record<string, unknown> | null) => {
    token.value = newToken;
    user.value = newUser ?? null;

    if (process.client) {
      localStorage.setItem('auth_token', newToken);
      if (newUser) {
        localStorage.setItem('auth_user', JSON.stringify(newUser));
      } else {
        localStorage.removeItem('auth_user');
      }
    }
  };

  const clearSession = () => {
    token.value = null;
    user.value = null;

    if (process.client) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  };

  const logout = async () => {
    const { $api } = useNuxtApp();

    try {
      await $api('/logout', { method: 'POST' });
      clearSession();
      await navigateTo('/auth/login');
      return { ok: true };
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      return { ok: false, error };
    }
  };

  const isAuthenticated = computed(() => Boolean(token.value));
  const getToken = () => token.value;

  return {
    token,
    user,
    isAuthenticated,
    init,
    setSession,
    clearSession,
    logout,
    getToken
  };
};
