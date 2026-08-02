<script setup lang="ts">
import { BellRing, FileText, Settings, ShieldCheck } from '@lucide/vue';
import HeroSection from '~/components/dashboard/HeroSection.vue';
import InputSwitch from 'primevue/inputswitch';

definePageMeta({
    layout: 'dashboard'
});

useHead({
    title: 'Configurações - Identifica Trânsito',
    meta: [
        { name: 'description', content: 'Gerencie suas preferências e configurações.' }
    ]
});

const { $api } = useNuxtApp();
const route = useRoute();

// Notificações
interface Setting {
    id: number;
    type: string;
    value: number;
    active: number;
}

const settingsMap = ref<Record<string, Setting>>({});
const notifications = ref({
    email: false,
    sms: false,
    alertsDrivers: false
});

const loadSettings = async () => {
    try {
        const data = await $api('/settings');
        const payload = (data as { data?: unknown })?.data ?? data;
        const toBool = (v: unknown) => v !== 0 && v !== '0' && !!v;

        // A API pode retornar uma lista de configurações ou um objeto resumido.
        if (!Array.isArray(payload)) {
            const summary = payload as Record<string, unknown>;
            notifications.value.email = toBool(summary.notification_email);
            notifications.value.sms = toBool(summary.notification_whatsapp);
            notifications.value.alertsDrivers = toBool(summary.notification_drivers ?? summary.alerts_drivers);
            return;
        }

        const list = payload as Setting[];
        settingsMap.value = {};
        list.forEach((s: Setting) => {
            settingsMap.value[s.type] = s;
        });
        notifications.value.email = toBool(settingsMap.value['EMAIL']?.value);
        notifications.value.sms = toBool(settingsMap.value['SMS_WHATSAPP']?.value);
        notifications.value.alertsDrivers = toBool(settingsMap.value['ALERTS_DRIVERS']?.value);
    } catch (e) {
        console.error('Erro ao carregar configurações:', e);
    }
};

const saveNotification = async (type: string, value: boolean) => {
    const payload = { type, value: value ? '1' : '0' };
    try {
        const existing = settingsMap.value[type];
        if (existing) {
            const updated = await $api(`/settings/${existing.id}`, { method: 'PUT', body: payload }) as { data?: Setting } | Setting;
            settingsMap.value[type] = (updated as { data?: Setting }).data ?? (updated as Setting);
        } else {
            const created = await $api('/settings', { method: 'POST', body: payload }) as { data?: Setting } | Setting;
            settingsMap.value[type] = (created as { data?: Setting }).data ?? (created as Setting);
        }
    } catch (e) {
        console.error('Erro ao salvar configuração:', e);
    }
};

// Tema
const isDarkMode = ref(false);

// Inicializar tema do localStorage
onMounted(() => {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme === 'dark') {
        isDarkMode.value = true;
        applyTheme('dark');
    } else if (savedTheme === 'light') {
        isDarkMode.value = false;
        applyTheme('light');
    } else {
        // Se não tem preferência salva, verifica preferência do sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        isDarkMode.value = prefersDark;
        applyTheme(prefersDark ? 'dark' : 'light');
    }

    loadSettings();
});

// Aplicar tema
const applyTheme = (theme: 'dark' | 'light') => {
    const html = document.documentElement;
    if (theme === 'dark') {
        html.classList.add('app-dark');
    } else {
        html.classList.remove('app-dark');
    }
    localStorage.setItem('app-theme', theme);
};

// Watcher para mudança de tema
watch(isDarkMode, (newValue) => {
    applyTheme(newValue ? 'dark' : 'light');
});

const termsAndPolicies = [
    {
        icon: FileText,
        title: 'Política de Privacidade',
        description: 'Saiba como coletamos, usamos e protegemos seus dados pessoais.',
        link: '/politica-de-privacidade',
        target: '_blank',
        buttonText: 'Ler Política'
    },
    {
        icon: ShieldCheck,
        title: 'Termo de Consentimento LGPD',
        description: 'Informações sobre como tratamos seus dados de acordo com a Lei Geral de Proteção de Dados.',
        link: '/politica-de-privacidade#base-legal',
        target: '_blank',
        buttonText: 'Ler Termo'
    }
];
</script>

<template>
    <div class="space-y-8">
        <!-- Hero Section -->
        <HeroSection
            title="Configurações"
            subtitle="Gerencie suas preferências e informações pessoais"
            greeting="Personalize sua experiência"
            :greeting-icon="Settings"
            :showButton="false"
        />

        <!-- Notificações -->
        <section class="bg-white dark:bg-surface-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-surface-700">
            <div class="flex items-start gap-4 mb-6">
                <div class="flex-shrink-0">
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eaf0ff]">
                        <BellRing :size="20" :stroke-width="1.9" class="text-[#1f46ee]" aria-hidden="true" />
                    </div>
                </div>
                <div>
                    <h2 class="text-2xl! font-bold text-gray-900 dark:text-white mb-1!">Notificações</h2>
                    <p class="text-gray-600 dark:text-gray-400">Escolha como você recebe notificações.</p>
                </div>
            </div>

            <div class="space-y-4 border-t border-gray-200 dark:border-surface-700 pt-6">
                <!-- Email Notifications -->
                <div class="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-surface-700">
                    <div class="flex-1">
                        <h3 class="text-lg! font-semibold text-gray-900 dark:text-white mb-1!">Notificações por E-mail</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Receba e-mails sobre atualizações de pedidos e novidades.</p>
                    </div>
                    <InputSwitch v-model="notifications.email" @update:modelValue="(v: boolean) => saveNotification('EMAIL', v)" />
                </div>

                <!-- SMS/WhatsApp Notifications -->
                <div class="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-surface-700">
                    <div class="flex-1">
                        <h3 class="text-lg! font-semibold text-gray-900 dark:text-white mb-1!">Notificações por SMS/WhatsApp</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Alertas importantes sobre seus pedidos.</p>
                    </div>
                    <InputSwitch v-model="notifications.sms" @update:modelValue="(v: boolean) => saveNotification('SMS_WHATSAPP', v)" />
                </div>

                <!-- Alerts Drivers Notifications -->
                <div class="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-surface-700">
                    <div class="flex-1">
                        <h3 class="text-lg! font-semibold text-gray-900 dark:text-white mb-1!">Notificações de Outros Motoristas</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Receba alertas sobre infrações e atividades de outros motoristas.</p>
                    </div>
                    <InputSwitch v-model="notifications.alertsDrivers" @update:modelValue="(v: boolean) => saveNotification('ALERTS_DRIVERS', v)" />
                </div>
            </div>
        </section>

        <!-- Termos e Políticas -->
        <section class="bg-white dark:bg-dark rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-surface-700">
            <div class="flex items-start gap-4 mb-6">
                <div class="flex-shrink-0">
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eaf0ff]">
                        <FileText :size="20" :stroke-width="1.9" class="text-[#1f46ee]" aria-hidden="true" />
                    </div>
                </div>
                <div>
                    <h2 class="text-2xl! font-bold text-gray-900 dark:text-white mb-1!">Termos e Políticas</h2>
                    <p class="text-gray-600 dark:text-gray-400">Informações legais sobre o uso da plataforma.</p>
                </div>
            </div>

            <div class="space-y-4 border-t border-gray-200 dark:border-surface-700 pt-6">
                <div
                    v-for="(item, index) in termsAndPolicies"
                    :key="index"
                    class="flex flex-col items-start rounded-lg bg-gray-50 p-4 dark:bg-surface-700 sm:flex-row sm:justify-between"
                >
                    <div class="flex items-start gap-4 flex-1">
                        <div class="flex-shrink-0 mt-1">
                            <component :is="item.icon" :size="19" :stroke-width="1.9" class="text-[#1f46ee]" aria-hidden="true" />
                        </div>
                        <div>
                            <h3 class="text-lg! font-semibold text-gray-900 dark:text-white mb-1!">{{ item.title }}</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">{{ item.description }}</p>
                        </div>
                    </div>
                    <a
                        :href="item.link"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="terms-policy-link mt-3 shrink-0 whitespace-nowrap self-start rounded-lg border border-slate-300 bg-[#f1f3f5] px-4 py-2 text-sm font-semibold text-[#172b4d] transition-colors hover:bg-slate-200 sm:mt-0 sm:ml-4"
                    >
                        {{ item.buttonText }}
                    </a>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
@media (max-width: 639px) {
    .terms-policy-link { min-height: 2.5rem !important; }
}
</style>
