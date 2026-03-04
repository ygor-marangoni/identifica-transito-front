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
      console.log('API response error:', response.status);
      if (response.status === 401) {
        auth.clearSession();
        throw createError({
          statusCode: 401,
          statusMessage: 'Não autorizado',
          fatal: true
        });
      }
      
      if (response.status === 403) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Acesso negado',
          fatal: true
        });
      }
      
      if (response.status === 500) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Erro interno do servidor',
          fatal: true
        });
      }
    }
  });

  return {
    provide: {
      api
    }
  };
});
