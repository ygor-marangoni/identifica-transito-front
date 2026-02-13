export default defineNuxtRouteMiddleware((to) => {
  const protectedPrefixes = ['/dashboard'];
  const isProtected = protectedPrefixes.some((prefix) => to.path.startsWith(prefix));

  if (!isProtected) return;

  const auth = useAuth();
  auth.init();

  if (!auth.isAuthenticated.value) {
    return navigateTo('/auth/login');
  }
});
