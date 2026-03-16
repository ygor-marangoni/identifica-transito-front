import { getDashboardByType, getUserType } from '~/utils/authRedirect';

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return; // 🔥 ESSENCIAL

  const protectedPrefixes = ['/dashboard'];

  const isProtected = protectedPrefixes.some((prefix) =>
    to.path.startsWith(prefix)
  );

  if (!isProtected) return;

  const auth = useAuth();
  auth.init();

  if (!auth.isAuthenticated.value) {
    return navigateTo('/auth/login');
  }

  const userType = getUserType(auth.user.value);
  const homeByType = getDashboardByType(userType);
  const path = to.path;

  const isSuperAdminArea = path.startsWith('/dashboard/superadmin');
  const isAdminArea = path.startsWith('/dashboard/admin');
  const isCommonArea = path.startsWith('/dashboard/perfil');

  // Redirect generic dashboard root to each role home.
  if (path === '/dashboard' && userType !== 3) {
    return navigateTo(homeByType);
  }

  if (isCommonArea) return;

  if (userType === 1) {
    if (isAdminArea) return navigateTo(homeByType);
    if (!isSuperAdminArea && path !== '/dashboard') return navigateTo(homeByType);
    return;
  }

  if (userType === 2) {
    if (isSuperAdminArea) return navigateTo(homeByType);
    if (!isAdminArea && path !== '/dashboard') return navigateTo(homeByType);
    return;
  }

  // Client (type 3) cannot access admin-only areas.
  if (isSuperAdminArea || isAdminArea) {
    return navigateTo('/dashboard');
  }
});
