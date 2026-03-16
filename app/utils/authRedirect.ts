type AuthUserLike = Record<string, unknown> | null | undefined;

export const getUserType = (user: AuthUserLike): number => {
    const candidate =
        user?.type ??
        user?.user_type ??
        user?.userType ??
        user?.role ??
        user?.perfil ??
        user?.nivel;

    const rawType = typeof candidate === 'string' ? candidate.trim() : candidate;
    const normalized = typeof rawType === 'string' ? rawType.toLowerCase() : rawType;

    if (normalized === 'superadmin' || normalized === 'super_admin') return 1;
    if (normalized === 'admin') return 2;
    if (normalized === 'client' || normalized === 'cliente' || normalized === 'user') return 3;

    const numericType = Number(rawType);
    if ([1, 2, 3].includes(numericType)) return numericType;

    return 3;
};

export const getDashboardByType = (type: number): string => {
    if (type === 1) return '/dashboard/superadmin';
    if (type === 2) return '/dashboard/admin';
    return '/dashboard';
};
