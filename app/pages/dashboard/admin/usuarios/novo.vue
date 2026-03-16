<script setup lang="ts">
import HeroSection from '~/components/dashboard/HeroSection.vue';
import FormInputText from '~/components/forms/InputText.vue';
import InputPassword from '~/components/forms/InputPassword.vue';
import PasswordStrengthIndicator from '~/components/forms/PasswordStrengthIndicator.vue';
import Button from '~/components/forms/Button.vue';
import { useToast } from 'primevue/usetoast';

definePageMeta({ layout: 'dashboard' });
useHead({ title: 'Novo Usuário - Admin | Identifica Trânsito' });

const { $api } = useNuxtApp();
const toast = useToast();
const loading = ref(false);

const form = ref({
    name: '',
    email: '',
    password: '',
    cpf: '',
    birth_date: '',
    phone: '',
});

const handleSubmit = async () => {
    if (!form.value.name || !form.value.email || !form.value.password) {
        toast.add({ severity: 'error', summary: 'Campos obrigatórios', detail: 'Preencha nome, e-mail e senha.', life: 3000 });
        return;
    }

    loading.value = true;
    try {
        await $api('/admin-pdv/users', {
            method: 'POST',
            body: {
                name: form.value.name,
                email: form.value.email,
                password: form.value.password,
                cpf: form.value.cpf || null,
                birth_date: form.value.birth_date || null,
                phone: form.value.phone || null,
            },
        });
        toast.add({ severity: 'success', summary: 'Usuário cadastrado!', detail: 'O usuário foi criado com sucesso.', life: 3000 });
        navigateTo('/dashboard/admin/usuarios');
    } catch (error: any) {
        const msg = error?.data?.message || error?.data?.error || 'Não foi possível cadastrar o usuário.';
        toast.add({ severity: 'error', summary: 'Erro ao cadastrar', detail: msg, life: 5000 });
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="space-y-10">
        <HeroSection
            title="Novo Usuário"
            subtitle="Cadastre um novo usuário na plataforma."
            greeting="Admin"
            :showButton="true"
            buttonLabel="Voltar para Usuários"
            buttonLink="/dashboard/admin/usuarios"
            buttonIcon="pi pi-arrow-left"
        />

        <div class="max-w-3xl mx-auto">
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <div class="mb-8">
                    <h1 class="text-3xl! font-bold text-it-primary mb-2">Cadastrar Novo Usuário</h1>
                    <p class="text-gray-600">Preencha as informações para criar um novo usuário na plataforma.</p>
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-8">
                    <!-- Dados Pessoais -->
                    <div class="space-y-5">
                        <h2 class="text-lg! font-semibold text-gray-900 border-b border-gray-100 pb-3">Dados Pessoais</h2>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInputText
                                v-model="form.name"
                                id="name"
                                label="Nome completo *"
                                placeholder="Nome do usuário"
                                showIcon
                                icon="pi pi-user"
                                wrapper-class="w-full"
                                inputClass="w-full"
                                :disabled="loading"
                            />
                            <FormInputText
                                v-model="form.email"
                                id="email"
                                type="email"
                                label="E-mail *"
                                placeholder="email@exemplo.com"
                                showIcon
                                icon="pi pi-envelope"
                                wrapper-class="w-full"
                                inputClass="w-full"
                                :disabled="loading"
                            />
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInputText
                                v-model="form.cpf"
                                id="cpf"
                                label="CPF"
                                placeholder="000.000.000-00"
                                mask="999.999.999-99"
                                showIcon
                                icon="pi pi-id-card"
                                wrapper-class="w-full"
                                inputClass="w-full"
                                :disabled="loading"
                            />
                            <FormInputText
                                v-model="form.phone"
                                id="phone"
                                label="Telefone"
                                placeholder="(00) 00000-0000"
                                mask="(99) 99999-9999"
                                showIcon
                                icon="pi pi-phone"
                                wrapper-class="w-full"
                                inputClass="w-full"
                                :disabled="loading"
                            />
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInputText
                                v-model="form.birth_date"
                                id="birth_date"
                                type="date"
                                label="Data de Nascimento"
                                showIcon
                                icon="pi pi-calendar"
                                wrapper-class="w-full"
                                inputClass="w-full"
                                :disabled="loading"
                            />
                        </div>
                    </div>

                    <div class="border-t border-gray-200"></div>

                    <!-- Acesso -->
                    <div class="space-y-5">
                        <h2 class="text-lg! font-semibold text-gray-900 border-b border-gray-100 pb-3">Acesso</h2>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputPassword
                                    v-model="form.password"
                                    id="password"
                                    label="Senha *"
                                    placeholder="Senha de acesso"
                                    autocomplete="new-password"
                                    wrapper-class="w-full"
                                    inputClass="w-full"
                                    :disabled="loading"
                                />
                                <PasswordStrengthIndicator :password="form.password" />
                            </div>
                        </div>
                    </div>

                    <div class="border-t border-gray-200"></div>

                    <Button type="submit" fullWidth :loading="loading" size="lg">
                        <i v-if="!loading" class="pi pi-check"></i>
                        Cadastrar Usuário
                    </Button>
                </form>
            </div>
        </div>
    </div>
</template>
