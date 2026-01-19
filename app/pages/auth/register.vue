<script setup>
  import { ref } from 'vue';
  import LayoutAuth from '~/components/auth/LayoutAuth.vue';
  import InputText from '~/components/forms/InputText.vue';
  import InputPassword from '~/components/forms/InputPassword.vue';
  import Button from '~/components/forms/Button.vue';

  // Configurar título da página
  useHead({
    title: 'Criar Conta - Identifica Trânsito',
    meta: [
      { name: 'description', content: 'Crie sua conta para gerenciar seus veículos e etiquetas.' }
    ]
  });

  const formData = ref({
    fullName: 'Wesley Souza',
    email: 'wesleysouza.dev@gmail.com',
    cpf: '411.222.333-44',
    birthDate: '01/10/1991',
    phone: '(11) 99233-6903',
    password: 'abc123',
    acceptTerms: false
  });

  const loading = ref(false);

  const handleRegister = () => {
    if (!formData.value.acceptTerms) {
      alert('Você precisa aceitar os termos para continuar.');
      return;
    }

    loading.value = true;
    console.log('Registrando usuário:', formData.value);

    // Simular registro
    setTimeout(() => {
      loading.value = false;
      // Redirecionar para login ou dashboard
    }, 2000);
  };
</script>

<template>
  <LayoutAuth hiddenLinksFooter>
    <h1 class="text-[24px]! font-bold text-it-primary mb-2!">Crie sua Conta</h1>
    <p class="text-it-gray text-sm mb-8!">Preencha todos os dados abaixo para se registrar na plataforma</p>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <!-- Grid de 2 colunas no desktop -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Nome Completo -->
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
          wrapperClass="md:col-span-2"
        />

        <!-- E-mail -->
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
          wrapperClass="md:col-span-2"
        />

        <!-- CPF -->
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

        <!-- Data de Nascimento -->
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

        <!-- Celular / Whatsapp -->
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

        <!-- Senha -->
        <InputPassword
          v-model="formData.password"
          id="password"
          label="Senha"
          placeholder="••••••••••••••••"
          required
          inputClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400"
        />
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
          <a href="#" class="text-blue-600 hover:text-blue-700 font-medium">Lei Geral de Proteção de Dados (LGPD)</a> 
          e com a 
          <a href="#" class="text-blue-600 hover:text-blue-700 font-medium">Política de Privacidade</a>.
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
