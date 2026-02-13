export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const auth = useAuth();

  auth.init();

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    headers: {
      Accept: 'application/json'
    },
    onRequest({ options }) {
      const token = auth.getToken();
      if (token) {
        options.headers = {
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`
        };
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        console.warn('[api] 401 for:', response.url);
        auth.clearSession();
      }
    }
  });

  return {
    provide: {
      api
    }
  };
});
