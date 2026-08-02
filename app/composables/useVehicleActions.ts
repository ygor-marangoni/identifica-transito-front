import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

export const useVehicleActions = () => {
    const confirm = useConfirm();
    const toast = useToast();
    const router = useRouter();

    const confirmDelete = (vehicleId: number | string, vehicleName?: string, onSuccess?: () => void) => {
        confirm.require({
            message: vehicleName 
                ? `Tem certeza que deseja excluir o veículo ${vehicleName}?`
                : 'Tem certeza que deseja excluir este veículo?',
            header: 'Confirmar Exclusão',
            icon: 'pi pi-exclamation-triangle',
            dismissableMask: true,
            rejectLabel: 'Cancelar',
            acceptLabel: 'Excluir veículo',
            rejectClass: 'p-button-secondary',
            acceptClass: 'p-button-danger',
            reject: () => {
                console.log('Exclusão cancelada');
            },
            accept: () => {
                deleteVehicle(vehicleId, onSuccess);
            }
        });
    };

    const deleteVehicle = async (vehicleId: number | string, onSuccess?: () => void) => {
        try {
            const { $api } = useNuxtApp();
            await $api(`/vehicles/${vehicleId}`, { method: 'DELETE' });

            toast.add({
                severity: 'success',
                summary: 'Sucesso!',
                detail: 'Veículo excluído com sucesso.',
                life: 3000
            });

            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            const apiMessage = error?.data?.message || error?.data?.error;
            const errorMsg = apiMessage || error?.message || 'Não foi possível excluir o veículo.';
            toast.add({
                severity: 'error',
                summary: 'Erro ao excluir',
                detail: errorMsg,
                life: 5000
            });
        }
    };

    return {
        confirmDelete
    };
};
