import { computed } from 'vue';

export const useAuth = () => {
  const token = useState<string | null>('auth_token', () => null);
  const user = useState<Record<string, unknown> | null>('auth_user', () => null);
  const initialized = useState<boolean>('auth_initialized', () => false);

  const init = () => {
    if (!import.meta.client) return;

    let storedToken = localStorage.getItem('auth_token');
    const rawUser = localStorage.getItem('auth_user');
    let parsedUser: Record<string, unknown> | null = null;

    try {
      parsedUser = rawUser ? JSON.parse(rawUser) : null;
    } catch {
      // Uma sessão antiga ou corrompida não deve quebrar a inicialização
      // do dashboard nem gerar erro no console durante a demonstração.
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      storedToken = null;
    }

    token.value = storedToken;
    user.value = parsedUser;
    initialized.value = true;
  };

  const setSession = (newToken: string, newUser?: Record<string, unknown> | null) => {
    token.value = newToken;
    user.value = newUser ?? null;

    if (import.meta.client) {
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

    if (import.meta.client) {
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
