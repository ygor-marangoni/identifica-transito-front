<script setup lang="ts">
import HeroSection from '~/components/dashboard/HeroSection.vue';
import InputText from '~/components/forms/InputText.vue';
import SelectInput from '~/components/forms/SelectInput.vue';
import Button from '~/components/forms/Button.vue';
import InputSwitch from 'primevue/inputswitch';
import Skeleton from 'primevue/skeleton';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { getDashboardByType, getUserType } from '~/utils/authRedirect';

definePageMeta({
    layout: 'dashboard',
    middleware: [() => {
        if (import.meta.server) return;

        const auth = useAuth();
        auth.init();

        const userType = getUserType(auth.user.value);
        if (userType !== 3) {
            return navigateTo(getDashboardByType(userType));
        }
    }]
});

useHead({
    title: 'Notificações de Motoristas - Identifica Trânsito',
    meta: [
        { name: 'description', content: 'Notifique motoristas sobre situações observadas no veículo.' }
    ]
});

interface DriverNotification {
    id: number;
    plate: string;
    type: number;
    typeLabel: string;
    createdAt: string;
    read: boolean;
}

interface ApiDriverNotification {
    id: number;
    user_id: number;
    plate: string;
    type: number;
    type_label: string;
    read: number | string | boolean;
    created_at: string;
    updated_at: string;
}

type NotificationsTab = 'sent' | 'received';

const form = ref({
    placa: '',
    tipo: null as number | null
});

const confirm = useConfirm();
const toast = useToast();
const { $api } = useNuxtApp();
const loading = ref(false);
const unreadNotificationsCount = useState<number>('driver_notifications_unread_total', () => 0);
const activeTab = ref<NotificationsTab>('sent');

const typeOptions = [
    { label: 'Pneu murcho/furado', value: 1 },
    { label: 'Farol ou lanterna queimada', value: 2 },
    { label: 'Porta Aberta', value: 3 },
    { label: 'Algo caindo do carro', value: 4 }
];

const sentNotifications = ref<DriverNotification[]>([]);
const receivedNotifications = ref<DriverNotification[]>([]);

const totalUnread = computed(() => receivedNotifications.value.filter((item) => !item.read).length);

const normalizePlate = (value: string) => {
    return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
};

const nowFormatted = () => {
    return new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const toBool = (value: number | string | boolean | null | undefined) => {
    return value === true || value === 1 || value === '1';
};

const resolveTypeLabel = (type: number, typeLabel?: string) => {
    if (typeLabel) return typeLabel;
    return typeOptions.find((option) => option.value === type)?.label || 'Tipo não informado';
};

const mapNotification = (item: ApiDriverNotification): DriverNotification => ({
    id: item.id,
    plate: item.plate,
    type: Number(item.type),
    typeLabel: resolveTypeLabel(Number(item.type), item.type_label),
    createdAt: item.created_at,
    read: toBool(item.read)
});

const extractNotificationList = (res: { data?: ApiDriverNotification[] } | ApiDriverNotification[]) => {
    return (res as { data?: ApiDriverNotification[] })?.data ?? (Array.isArray(res) ? res : []);
};

const fetchUnreadTotal = async () => {
    try {
        const res = await $api('/notifications-drivers/unread-total') as { unread_total?: number | string };
        unreadNotificationsCount.value = Number(res?.unread_total ?? 0);
    } catch {
        unreadNotificationsCount.value = totalUnread.value;
    }
};

const notifyUnreadCountChanged = () => {
    if (import.meta.client) {
        window.dispatchEvent(new CustomEvent('driver-notifications-unread-changed'));
    }
};

const fetchNotifications = async () => {
    loading.value = true;
    sentNotifications.value = [];
    receivedNotifications.value = [];

    let hasAnyError = false;

    try {
        const sentRes = await $api('/notifications-drivers') as { data?: ApiDriverNotification[] } | ApiDriverNotification[];
        const sentList = extractNotificationList(sentRes);
        sentNotifications.value = sentList.map(mapNotification);
    } catch {
        hasAnyError = true;
    }

    try {
        const receivedRes = await $api('/notifications-drivers/received') as { data?: ApiDriverNotification[] } | ApiDriverNotification[];
        const receivedList = extractNotificationList(receivedRes);
        receivedNotifications.value = receivedList.map(mapNotification);
    } catch {
        hasAnyError = true;
    }

    try {
        await fetchUnreadTotal();
        notifyUnreadCountChanged();
    } catch {
        hasAnyError = true;
    }

    if (hasAnyError && sentNotifications.value.length === 0 && receivedNotifications.value.length === 0) {
        toast.add({
            severity: 'error',
            summary: 'Erro ao carregar',
            detail: 'Não foi possível carregar as notificações.',
            life: 5000
        });
    }

    loading.value = false;
};

const handleSubmit = async () => {
    const plate = normalizePlate(form.value.placa);
    if (!plate || !form.value.tipo) return;

    try {
        const created = await $api('/notifications-drivers', {
            method: 'POST',
            body: {
                plate,
                type: form.value.tipo
            }
        }) as { data?: ApiDriverNotification } | ApiDriverNotification;

        const payload = (created as { data?: ApiDriverNotification })?.data ?? (created as ApiDriverNotification);
        sentNotifications.value.unshift(mapNotification(payload));
        await fetchUnreadTotal();

        form.value.placa = '';
        form.value.tipo = null;

        toast.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: 'Notificação enviada com sucesso.',
            life: 3000
        });
    } catch (error: any) {
        const msg = error?.data?.message || error?.message || 'Não foi possível enviar a notificação.';
        toast.add({ severity: 'error', summary: 'Erro ao enviar', detail: msg, life: 5000 });
    }
};

const readLabel = (read: boolean) => (read ? 'Lido' : 'Não Lido');

const handleDeleteNotification = (item: DriverNotification) => {
    confirm.require({
        message: `Tem certeza que deseja excluir a notificação de "${item.typeLabel}" para a placa ${item.plate}?`,
        header: 'Confirmar Exclusão',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Não',
        acceptLabel: 'Sim, excluir',
        rejectClass: 'p-button-danger',
        acceptClass: 'p-button-success',
        accept: async () => {
            try {
                await $api(`/notifications-drivers/${item.id}`, { method: 'DELETE' });
                sentNotifications.value = sentNotifications.value.filter((n) => n.id !== item.id);
                receivedNotifications.value = receivedNotifications.value.filter((n) => n.id !== item.id);
                await fetchUnreadTotal();
                notifyUnreadCountChanged();
                toast.add({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Notificação excluída com sucesso.',
                    life: 3000
                });
            } catch (error: any) {
                const msg = error?.data?.message || error?.message || 'Não foi possível excluir a notificação.';
                toast.add({ severity: 'error', summary: 'Erro ao excluir', detail: msg, life: 5000 });
            }
        }
    });
};

const handleToggleRead = async (item: DriverNotification, read: boolean) => {
    const previous = item.read;
    item.read = read;
    try {
        await $api(`/notifications-drivers/${item.id}`, {
            method: 'PUT',
            body: {
                read: read ? 1 : 0
            }
        });
        await fetchNotifications();
        notifyUnreadCountChanged();
    } catch (error: any) {
        item.read = previous;
        const msg = error?.data?.message || error?.message || 'Não foi possível atualizar o status da notificação.';
        toast.add({ severity: 'error', summary: 'Erro ao atualizar', detail: msg, life: 5000 });
    }
};

const onReadToggle = (item: DriverNotification, value: boolean | string | number | null | undefined) => {
    handleToggleRead(item, toBool(value));
};

onMounted(() => {
    fetchNotifications();
});
</script>

<template>
    <div class="space-y-8">
        <HeroSection
            title="Notificações de Motoristas"
            subtitle="Registre alertas rápidos para ajudar outros condutores"
            greeting="Boa atitude no trânsito"
            :showButton="false"
        />

        <section class="bg-white dark:bg-surface-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-surface-700">
            <div class="mb-6">
                <h2 class="text-2xl! font-bold text-gray-900 dark:text-white mb-1!">Nova notificação</h2>
                <p class="text-gray-600 dark:text-gray-400">Preencha os dados abaixo para gerar uma notificação.</p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputText
                        v-model="form.placa"
                        id="placa"
                        label="Placa do Veículo"
                        placeholder="AAA0A00 ou AAA0000"
                        required
                        showIcon
                        icon="pi pi-car"
                        mask="aaa9*99"
                        :slotChar="''"
                        inputClass="w-full px-4 py-3 uppercase border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400"
                    />

                    <SelectInput
                        v-model="form.tipo"
                        id="tipo"
                        label="Tipo"
                        :options="typeOptions"
                        placeholder="Selecione o tipo"
                        required
                        icon="pi pi-exclamation-triangle"
                    />
                </div>

                <div class="flex justify-end">
                    <Button type="submit" icon="pi pi-send" label="Enviar notificação" />
                </div>
            </form>
        </section>

        <section class="space-y-4">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl! font-bold text-gray-900 dark:text-white mb-1!">Notificações</h2>
                    <p class="text-gray-600 dark:text-gray-400">Acompanhe notificações enviadas e recebidas no Identifica Trânsito.</p>
                </div>
                <span v-if="unreadNotificationsCount > 0" class="px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-700">
                    {{ unreadNotificationsCount }} não lida(s)
                </span>
            </div>

            <div class="inline-flex rounded-xl border border-gray-200 dark:border-surface-700 p-1 bg-gray-50 dark:bg-surface-800">
                <button
                    class="px-4 py-2 text-sm font-semibold rounded-lg transition"
                    :class="activeTab === 'sent' ? 'bg-white dark:bg-surface-700 text-it-primary shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-it-primary'"
                    @click="activeTab = 'sent'"
                >
                    Notificações enviadas
                </button>
                <button
                    class="px-4 py-2 text-sm font-semibold rounded-lg transition"
                    :class="activeTab === 'received' ? 'bg-white dark:bg-surface-700 text-it-primary shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-it-primary'"
                    @click="activeTab = 'received'"
                >
                    Notificações recebidas
                </button>
            </div>

            <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div v-for="n in 4" :key="`notification-skeleton-${n}`" class="bg-white dark:bg-surface-800 rounded-xl p-5 border border-gray-100 dark:border-surface-700 shadow-sm space-y-3">
                    <Skeleton width="70%" height="16px" />
                    <Skeleton width="40%" height="14px" />
                    <Skeleton width="50%" height="14px" />
                    <Skeleton width="100%" height="1px" />
                    <Skeleton width="35%" height="16px" />
                </div>
            </div>

            <div v-else-if="activeTab === 'sent' && sentNotifications.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <article
                    v-for="item in sentNotifications"
                    :key="item.id"
                    class="bg-white dark:bg-surface-800 rounded-xl p-5 border border-gray-100 dark:border-surface-700 shadow-sm"
                >
                    <div class="flex items-start justify-between gap-4">
                        <div class="space-y-2">
                            <div class="flex items-center gap-2 text-it-primary">
                                <i class="pi pi-bell"></i>
                                <span class="text-sm font-semibold">{{ item.typeLabel }}</span>
                            </div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Placa: <span class="font-semibold text-gray-900 dark:text-white">{{ item.plate }}</span></p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Data: {{ item.createdAt }}</p>
                        </div>

                        <div class="flex items-center gap-2">
                            <button
                                @click="handleDeleteNotification(item)"
                                class="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                                title="Excluir notificação"
                            >
                                <i class="pi pi-trash text-sm"></i>
                            </button>
                        </div>
                    </div>
                </article>
            </div>

            <div v-else-if="activeTab === 'received' && receivedNotifications.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <article
                    v-for="item in receivedNotifications"
                    :key="item.id"
                    class="bg-white dark:bg-surface-800 rounded-xl p-5 border border-gray-100 dark:border-surface-700 shadow-sm"
                >
                    <div class="flex items-start justify-between gap-4">
                        <div class="space-y-2">
                            <div class="flex items-center gap-2 text-it-primary">
                                <i class="pi pi-bell"></i>
                                <span class="text-sm font-semibold">{{ item.typeLabel }}</span>
                            </div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Placa: <span class="font-semibold text-gray-900 dark:text-white">{{ item.plate }}</span></p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Data: {{ item.createdAt }}</p>
                        </div>

                        <div class="flex items-center gap-2">
                            <span
                                class="text-xs px-2.5 py-1 rounded-full font-semibold"
                                :class="item.read ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
                            >
                                {{ readLabel(item.read) }}
                            </span>
                            <button
                                @click="handleDeleteNotification(item)"
                                class="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                                title="Excluir notificação"
                            >
                                <i class="pi pi-trash text-sm"></i>
                            </button>
                        </div>
                    </div>

                    <div class="mt-4 pt-4 border-t border-gray-100 dark:border-surface-700 flex items-center justify-between">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Marcar como {{ item.read ? 'Não Lido' : 'Lido' }}</span>
                        <InputSwitch :modelValue="item.read" @update:modelValue="onReadToggle(item, $event)" />
                    </div>
                </article>
            </div>

            <div v-else class="flex flex-col items-center justify-center py-12 gap-2 text-gray-400 bg-white dark:bg-surface-800 rounded-xl border border-gray-100 dark:border-surface-700">
                <i class="pi pi-bell text-4xl"></i>
                <p>{{ activeTab === 'sent' ? 'Não há notificações enviadas' : 'Não há notificações recebidas' }}</p>
                <p class="text-sm">Quando houver notificações, elas aparecerão aqui nesta aba.</p>
            </div>
        </section>
    </div>
</template>
