export default defineNuxtRouteMiddleware(() => {
    const auth = useAuth();
    auth.init();
    if (auth.isAuthenticated.value) {
        return navigateTo('/dashboard');
    }

    if (import.meta.client) {
        auth.clearSession();
    }
});

  