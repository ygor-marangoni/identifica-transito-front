<script setup>
  import { computed, ref } from 'vue';
  import LayoutAuth from '~/components/auth/LayoutAuth.vue';
  import InputText from '~/components/forms/InputText.vue';
  import InputPassword from '~/components/forms/InputPassword.vue';
  import SelectInput from '~/components/forms/SelectInput.vue';
  import PasswordStrengthIndicator from '~/components/forms/PasswordStrengthIndicator.vue';
  import Button from '~/components/forms/Button.vue';
  import { formatBirthDate } from '~/utils/date';
  import { BIOLOGICAL_SEX_OPTIONS } from '~/utils/userBiologicalSex';

  // Configurar título da página
  useHead({
    title: 'Criar Conta - Identifica Trânsito',
    meta: [
      { name: 'description', content: 'Crie sua conta para gerenciar seus veículos e etiquetas.' }
    ]
  });

  definePageMeta({
    middleware: ['logged']
  });

  const formData = ref({
    fullName: '',
    email: '',
    biologicalSex: '',
    cpf: '',
    birthDate: '',
    phone: '',
    password: '',
    acceptTerms: false
  });

  const loading = ref(false);
  const errorMessage = ref('');
  const successMessage = ref('');
  const formRef = ref(null);

  const toast = useToast();
  const handleRegister = async () => {
    const formEl = formRef.value;
    if (formEl && !formEl.reportValidity()) {
      return;
    }

    if ((formData.value.password || '').length < 8) {
      toast.add({
        severity: 'error',
        summary: 'Erro ao criar conta',
        detail: 'A senha deve ter no minimo 8 caracteres.',
        life: 5000
      });
      return;
    }

    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    try {
      const { $api } = useNuxtApp();
      await $api('/users', {
        method: 'POST',
        body: {
          name: formData.value.fullName,
          email: formData.value.email,
          gender: formData.value.biologicalSex || null,
          cpf: formData.value.cpf.replace(/\D/g, ''),
          birth_date: formatBirthDate(formData.value.birthDate),
          phone: formData.value.phone.replace(/\D/g, ''),
          password: formData.value.password
        }
      });

      successMessage.value = 'Conta criada com sucesso. Voce pode entrar agora.';
      toast.add({ severity: 'success', summary: 'Sucesso', detail: successMessage.value, life: 5000 });
      await navigateTo('/auth/login');
    } catch (error) {
      if (error?.data?.errors) {
        const errorsArray = Object.values(error.data.errors).flat();
        errorMessage.value = errorsArray.join('\n');
      } else {
        const apiMessage = error?.data?.message || error?.data?.error;
        errorMessage.value = apiMessage || error?.message || 'Nao foi possivel criar sua conta.';
      }
      toast.add({ severity: 'error', summary: 'Erro ao criar conta', detail: errorMessage.value, life: 5000 });
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <LayoutAuth hiddenLinksFooter>
    <h1 class="text-[24px]! font-bold text-it-primary mb-2!">Crie sua Conta</h1>
    <p class="text-it-gray text-sm mb-8!">Preencha todos os dados abaixo para se registrar na plataforma</p>

    <form ref="formRef" @submit.prevent="handleRegister" class="space-y-4">
      <InputText
        v-model="formData.fullName"
        type="text"
        id="fullName"
        label="Nome Completo"
        placeholder="Digite seu nome completo"
        required
        showIcon
        icon="pi pi-user"
        inputClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400"
      />

      <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
        <InputText
          v-model="formData.email"
          type="email"
          id="email"
          label="E-mail"
          placeholder="seu@email.com"
          required
          showIcon
          icon="pi pi-envelope"
          inputClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400"
          wrapperClass="md:col-span-3"
        />

        <SelectInput
          v-model="formData.biologicalSex"
          id="biologicalSex"
          label="Sexo Biológico"
          :options="BIOLOGICAL_SEX_OPTIONS"
          placeholder="Selecione"
          icon="pi pi-user"
          required
          wrapperClass="md:col-span-2"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputText
          v-model="formData.cpf"
          type="text"
          id="cpf"
          label="CPF"
          placeholder="000.000.000-00"
          mask="999.999.999-*?*"
          required
          showIcon
          icon="pi pi-id-card"
          inputClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400"
        />

        <InputText
          v-model="formData.birthDate"
          type="text"
          id="birthDate"
          label="Data de Nascimento"
          placeholder="01/10/1991"
          mask="99/99/9999"
          required
          showIcon
          icon="pi pi-calendar"
          inputClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400"
        />

        <InputText
          v-model="formData.phone"
          type="tel"
          id="phone"
          label="Celular / Whatsapp"
          placeholder="99999-9999"
          mask="(99) ?99999-9999"
          required
          showIcon
          icon="pi pi-phone"
          inputClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400"
        />

        <InputPassword
          v-model="formData.password"
          id="password"
          label="Senha"
          placeholder="••••••••••••••••"
          required
          minlength="8"
          inputClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400"
        >
          <PasswordStrengthIndicator :password="formData.password" />
        </InputPassword>
      </div>

      <!-- Aceite de Termos -->
      <div class="flex items-start gap-3 pt-2 mb-6">
        <input
          type="checkbox"
          v-model="formData.acceptTerms"
          id="acceptTerms"
          required
          class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label for="acceptTerms" class="text-sm text-gray-600">
          Declaro que li e estou de acordo com os termos da 
          <NuxtLink to="/politica-de-privacidade#base-legal" target="_blank" class="text-blue-600 hover:text-blue-700 font-medium">Lei Geral de Proteção de Dados (LGPD)</NuxtLink> 
          e com a 
          <NuxtLink to="/politica-de-privacidade" target="_blank" class="text-blue-600 hover:text-blue-700 font-medium">Política de Privacidade</NuxtLink>.
        </label>
      </div>

      <!-- Botão Cadastrar -->
      <Button type="submit" fullWidth :loading="loading" size="lg">
        Cadastrar
      </Button>
    </form>

    <!-- Já tem conta -->
    <p class="text-center text-gray-600 text-sm mt-6">
      Já tem uma conta? 
      <NuxtLink to="/auth/login" class="text-blue-600 hover:text-blue-700 font-medium">
        Faça seu Login
      </NuxtLink>
    </p>
  </LayoutAuth>
</template>

<style scoped>
/* Estilos herdados do LayoutAuth */
</style>
