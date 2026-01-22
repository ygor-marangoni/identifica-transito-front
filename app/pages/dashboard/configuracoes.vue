<script setup lang="ts">
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

// Notificações
const notifications = ref({
    email: true,
    sms: false
});

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
});

// Aplicar tema
const applyTheme = (theme: 'dark' | 'light') => {
    const html = document.documentElement;
    if (theme === 'dark') {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
    localStorage.setItem('app-theme', theme);
};

// Watcher para mudança de tema
watch(isDarkMode, (newValue) => {
    applyTheme(newValue ? 'dark' : 'light');
});

// Salvar notificações
const saveNotifications = () => {
    localStorage.setItem('app-notifications', JSON.stringify(notifications.value));
    // Aqui você pode adicionar uma chamada de API para salvar no servidor
};

// Carregar notificações
onMounted(() => {
    const saved = localStorage.getItem('app-notifications');
    if (saved) {
        notifications.value = JSON.parse(saved);
    }
});

const termsAndPolicies = [
    {
        icon: 'pi pi-file-pdf',
        title: 'Política de Privacidade',
        description: 'Saiba como coletamos, usamos e protegemos seus dados pessoais.',
        link: '#',
        buttonText: 'Ler Política'
    },
    {
        icon: 'pi pi-shield',
        title: 'Termo de Consentimento LGPD',
        description: 'Informações sobre como tratamos seus dados de acordo com a Lei Geral de Proteção de Dados.',
        link: '#',
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
            :showButton="false"
        />

        <!-- Notificações -->
        <section class="bg-white dark:bg-surface-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-surface-700">
            <div class="flex items-start gap-4 mb-6">
                <div class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                        <i class="pi pi-bell text-it-primary text-xl"></i>
                    </div>
                </div>
                <div>
                    <h2 class="text-2xl! font-bold text-gray-900 dark:text-white mb-1!">Notificações</h2>
                    <p class="text-gray-600 dark:text-gray-400">Escolha como você recebe notificações.</p>
                </div>
            </div>

            <div class="space-y-4 border-t border-gray-200 dark:border-surface-700 pt-6">
                <!-- Email Notifications -->
                <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-surface-700 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-600 transition">
                    <div class="flex-1">
                        <h3 class="text-lg! font-semibold text-gray-900 dark:text-white mb-1!">Notificações por E-mail</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Receba e-mails sobre atualizações de pedidos e novidades.</p>
                    </div>
                    <InputSwitch v-model="notifications.email" @update:modelValue="saveNotifications" />
                </div>

                <!-- SMS/WhatsApp Notifications -->
                <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-surface-700 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-600 transition">
                    <div class="flex-1">
                        <h3 class="text-lg! font-semibold text-gray-900 dark:text-white mb-1!">Notificações por SMS/WhatsApp</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Alertas importantes sobre seus pedidos.</p>
                    </div>
                    <InputSwitch v-model="notifications.sms" @update:modelValue="saveNotifications" />
                </div>
            </div>
        </section>

        <!-- Termos e Políticas -->
        <section class="bg-white dark:bg-dark rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-surface-700">
            <div class="flex items-start gap-4 mb-6">
                <div class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                        <i class="pi pi-file text-it-primary text-xl"></i>
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
                    class="p-4 bg-gray-50 dark:bg-surface-700 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-600 transition flex items-start justify-between"
                >
                    <div class="flex items-start gap-4 flex-1">
                        <div class="flex-shrink-0 mt-1">
                            <i :class="[item.icon, 'text-it-primary text-xl']"></i>
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
                        class="flex-shrink-0 ml-4 px-4 py-2 bg-it-primary text-white rounded-lg font-semibold text-sm hover:bg-blue-600 transition whitespace-nowrap"
                    >
                        {{ item.buttonText }}
                    </a>
                </div>
            </div>
        </section>
    </div>
</template>
