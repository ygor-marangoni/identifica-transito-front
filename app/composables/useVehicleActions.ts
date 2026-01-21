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
            rejectLabel: 'Não',
            acceptLabel: 'Sim',
            rejectClass: 'p-button-danger',
            acceptClass: 'p-button-success',
            reject: () => {
                console.log('Exclusão cancelada');
            },
            accept: () => {
                deleteVehicle(vehicleId, onSuccess);
            }
        });
    };

    const deleteVehicle = (vehicleId: number | string, onSuccess?: () => void) => {
        // Aqui você faria a chamada real da API
        // Por enquanto, vamos simular
        console.log('Excluindo veículo:', vehicleId);

        // Simular delay da API
        setTimeout(() => {
            toast.add({
                severity: 'success',
                summary: 'Sucesso!',
                detail: 'Veículo excluído com sucesso.',
                life: 3000
            });

            // Executar callback de sucesso (se fornecido)
            if (onSuccess) {
                onSuccess();
            }
        }, 1000);
    };

    return {
        confirmDelete
    };
};
