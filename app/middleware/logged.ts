import { getDashboardByType, getUserType } from '~/utils/authRedirect';

export default defineNuxtRouteMiddleware(() => {
    const auth = useAuth();
    auth.init();

    if (auth.isAuthenticated.value) {
        const userType = getUserType(auth.user.value);
        return navigateTo(getDashboardByType(userType));
    }

    if (import.meta.client) {
        auth.clearSession();
    }
});

  