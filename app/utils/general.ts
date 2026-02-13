export const handleLogout = async (toast: { add: (arg0: { severity: string; summary: string; detail: any; life: number; }) => void; }) => {
    const auth = useAuth();
    const result = await auth.logout();

    if (!result?.ok) {
        const apiMessage = result?.error?.data?.message || result?.error?.data?.error;
        toast.add({
            severity: 'error',
            summary: 'Erro de Logout',
            detail: apiMessage || 'Nao foi possivel fazer logout. Tente novamente.',
            life: 5000
        });
    }
}