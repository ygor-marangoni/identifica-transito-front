<script setup lang="ts">
import { computed, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import HeroSection from '~/components/dashboard/HeroSection.vue';
import InputText from '~/components/forms/InputText.vue';
import InputPassword from '~/components/forms/InputPassword.vue';
import Button from '~/components/forms/Button.vue';

definePageMeta({
    layout: 'dashboard'
});

useHead({
    title: 'Meu Perfil - Identifica Trânsito',
    meta: [
        { name: 'description', content: 'Gerencie suas informações de perfil.' }
    ]
});

// Função helper para assets com baseURL
const config = useRuntimeConfig();
const assetWithBase = (path: string) => {
    if (path.startsWith('data:') || path.startsWith('http')) {
        return path; // Já é URL absoluta ou data URL
    }
    return `${config.app.baseURL}${path}`.replace(/\/+/g, '/').replace(':/', '://');
};

// Dados do usuário
const userProfile = ref({
    nome: 'Wesley Souza',
    cpf: '123.456.789-00',
    email: 'wesley.souza@example.com',
    telefone: '(11) 99234-5678',
    dataNascimento: '01/01/1990',
    avatar: '/images/dashboard/avatar.jpg'
});

const isEditing = ref(false);
const isSaving = ref(false);

const toast = useToast();

const editingData = ref({ ...userProfile.value });

const startEditing = () => {
    isEditing.value = true;
    editingData.value = { ...userProfile.value };
};

const cancelEditing = () => {
    isEditing.value = false;
    editingData.value = { ...userProfile.value };
};

const saveProfile = async () => {
    isSaving.value = true;
    // Simular chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    userProfile.value = { ...editingData.value };
    isEditing.value = false;
    isSaving.value = false;
    toast.add({
        severity: 'success',
        summary: 'Perfil atualizado!',
        detail: 'Suas informações foram salvas com sucesso.',
        life: 3000
    });
};

const uploadAvatar = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            userProfile.value.avatar = e.target?.result as string;
            editingData.value.avatar = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
};

// Segurança
const securityData = ref({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
});

const showSecurityForm = ref(false);
const isChangingPassword = ref(false);

const passwordError = computed(() => {
    if (!securityData.value.novaSenha || !securityData.value.confirmarSenha) return '';
    if (securityData.value.novaSenha !== securityData.value.confirmarSenha) return 'A nova senha e a confirmação precisam ser iguais.';
    return '';
});

const changePassword = async () => {
    if (passwordError.value) return;

    isChangingPassword.value = true;
    // Simular chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    securityData.value = {
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
    };
    showSecurityForm.value = false;
    isChangingPassword.value = false;
    toast.add({
        severity: 'success',
        summary: 'Senha alterada!',
        detail: 'Sua senha foi atualizada com sucesso.',
        life: 3000
    });
};
</script>

<template>
    <div class="space-y-8">
        <!-- Hero Section -->
        <HeroSection
            title="Meu Perfil"
            subtitle="Gerencie suas informações pessoais"
            greeting="Bem-vindo"
            :showButton="false"
        />

        <!-- Informações do Usuário -->
        <section class="bg-white dark:bg-surface-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-surface-700">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <h2 class="text-2xl! font-bold text-gray-900 dark:text-white">Informações Pessoais</h2>
                <div class="flex gap-2">
                    <Button
                        v-if="!isEditing"
                        label="Editar Perfil"
                        icon="pi pi-pencil"
                        @click="startEditing"
                        size="sm"
                    />
                    <template v-else>
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            @click="cancelEditing"
                            size="sm"
                            variant="danger"
                        />
                        <Button
                            label="Salvar"
                            icon="pi pi-check"
                            @click="saveProfile"
                            :disabled="isSaving"
                            size="sm"
                        />
                    </template>
                </div>
            </div>

            <!-- Avatar Section -->
            <div class="mb-8 flex flex-col items-center">
                <div class="relative mb-4">
                    <img
                        :src="assetWithBase(isEditing ? editingData.avatar : userProfile.avatar)"
                        :alt="userProfile.nome"
                        class="w-32 h-32 rounded-full object-cover border-4 border-it-primary shadow-lg"
                    />
                    <label
                        v-if="isEditing"
                        for="avatar-upload"
                        class="absolute bottom-0 right-0 w-10 h-10 bg-it-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition shadow-md"
                    >
                        <i class="pi pi-camera text-lg"></i>
                    </label>
                    <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="uploadAvatar"
                    />
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ userProfile.nome }}</p>
            </div>

            <!-- Form Grid -->
            <div class="space-y-6">
                <!-- Nome Completo (Full Width) -->
                <InputText
                    v-model="editingData.nome"
                    label="Nome Completo"
                    placeholder="Seu nome e sobrenome"
                    icon="pi pi-user"
                    :readonly="!isEditing"
                    :disabled="!isEditing"
                    wrapper-class="w-full"
                    inputClass="w-full"
                />

                <!-- Outros campos em grid 2 colunas -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- CPF (Read-only) -->
                    <div class="relative">
                        <InputText
                            v-model="userProfile.cpf"
                            label="CPF"
                            placeholder="000.000.000-00"
                            icon="pi pi-id-card"
                            :readonly="true"
                            :disabled="!isEditing"
                            wrapper-class="w-full"
                            inputClass="w-full"
                        />
                        <div class="absolute top-0 right-0 pt-8 pr-3">
                            <span class="inline-block bg-gray-100 dark:bg-surface-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded text-xs font-medium">
                                <i class="pi pi-lock text-xs mr-1"></i> Protegido
                            </span>
                        </div>
                    </div>

                    <!-- Email -->
                    <InputText
                        v-model="editingData.email"
                        label="E-mail"
                        placeholder="seu.email@example.com"
                        icon="pi pi-envelope"
                        type="email"
                        :readonly="!isEditing"
                        :disabled="!isEditing"
                        wrapper-class="w-full"
                        inputClass="w-full"
                    />

                    <!-- Telefone -->
                    <InputText
                        v-model="editingData.telefone"
                        label="Telefone"
                        placeholder="(11) 99999-9999"
                        icon="pi pi-phone"
                        mask="(99) 99999-9999"
                        :readonly="!isEditing"
                        :disabled="!isEditing"
                        wrapper-class="w-full"
                        inputClass="w-full"
                    />

                    <!-- Data de Nascimento -->
                    <InputText
                        v-model="editingData.dataNascimento"
                        label="Data de Nascimento"
                        placeholder="DD/MM/YYYY"
                        mask="99/99/9999"
                        icon="pi pi-calendar"
                        type="text"
                        :readonly="!isEditing"
                        :disabled="!isEditing"
                        wrapper-class="w-full"
                        inputClass="w-full"
                    />
                </div>
            </div>
        </section>

        <!-- Segurança -->
        <section class="bg-white dark:bg-surface-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-surface-700">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div>
                    <h2 class="text-2xl! font-bold text-gray-900 dark:text-white mb-1!">Segurança</h2>
                    <p class="text-gray-600 dark:text-gray-400 mt-1">Altere a segurança da sua conta. Preferir uma senha mais segura.</p>
                </div>
                <Button
                    v-if="!showSecurityForm"
                    label="Alterar Senha"
                    icon="pi pi-key"
                    @click="showSecurityForm = true"
                    size="sm"
                />
            </div>

            <!-- Security Form -->
            <div v-if="showSecurityForm" class="bg-gray-50 dark:bg-surface-700 rounded-lg p-6 space-y-4">
                <InputPassword
                    v-model="securityData.senhaAtual"
                    label="Senha Atual"
                    labelClass="font-bold!"
                    placeholder="Digite sua senha atual"
                    id="senha-atual"
                    autocomplete="current-password"
                    wrapper-class="w-full"
                    inputClass="w-full"
                />

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputPassword
                        v-model="securityData.novaSenha"
                        label="Nova Senha"
                        labelClass="font-bold!"
                        placeholder="Digite uma nova senha"
                        id="nova-senha"
                        autocomplete="new-password"
                        wrapper-class="w-full"
                        inputClass="w-full"
                    />

                    <InputPassword
                        v-model="securityData.confirmarSenha"
                        label="Confirmar Nova Senha"
                        labelClass="font-bold!"
                        placeholder="Confirme a nova senha"
                        id="confirmar-senha"
                        autocomplete="new-password"
                        wrapper-class="w-full"
                        inputClass="w-full"
                    />
                </div>
                <p v-if="passwordError" class="text-sm text-red-600 dark:text-red-400 -mt-2">{{ passwordError }}</p>

                <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4 mt-4">
                    <p class="text-sm text-blue-800 dark:text-blue-200">
                        <i class="pi pi-info-circle mr-2"></i>
                        Sua senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos.
                    </p>
                </div>

                <div class="flex gap-2 justify-end pt-4">
                    <Button
                        label="Cancelar"
                        icon="pi pi-times"
                        @click="showSecurityForm = false"
                        size="sm"
                        variant="danger"
                    />
                    <Button
                        label="Alterar Senha"
                        icon="pi pi-check"
                        @click="changePassword"
                        :disabled="isChangingPassword || !!passwordError"
                        size="sm"
                    />
                </div>
            </div>

            <!-- Info Box -->
            <div v-else class="bg-gray-50 dark:bg-surface-700 rounded-lg p-4">
                <p class="text-sm text-gray-700 dark:text-gray-300">
                    <i class="pi pi-shield text-it-primary mr-2"></i>
                    Última alteração de senha: há 3 meses
                </p>
            </div>
        </section>
    </div>
</template>
