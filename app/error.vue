<script setup lang="ts">
import type { NuxtError } from '#app';
import { useRouter } from 'vue-router';
import Button from '~/components/forms/Button.vue';

const props = defineProps({
    error: Object as () => NuxtError
});

const router = useRouter();

const is404 = computed(() => props.error?.statusCode === 404);

const errorCode = computed(() => props.error?.statusCode || 500);
const errorTitle = computed(() => {
    if (is404.value) return 'Página não encontrada';
    if (errorCode.value === 500) return 'Erro interno do servidor';
    if (errorCode.value === 403) return 'Acesso negado';
    if (errorCode.value === 401) return 'Não autorizado';
    return 'Ops! Algo deu errado';
});

const errorDescription = computed(() => {
    if (is404.value) return 'Desculpe, a página que você está procurando não existe ou foi movida para outro local.';
    if (errorCode.value === 500) return 'Ocorreu um erro inesperado no servidor. Nossa equipe foi notificada e está trabalhando para resolver.';
    if (errorCode.value === 403) return 'Você não tem permissão para acessar este recurso.';
    if (errorCode.value === 401) return 'Você precisa estar autenticado para acessar este recurso.';
    return props.error?.message || 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.';
});

const goBack = () => {
    router.back();
};

const handleClearError = () => {
    clearError({ redirect: '/' });
};

useHead({
    title: computed(() => `${errorCode.value} - ${errorTitle.value} - Identifica Trânsito`),
    meta: [
        { name: 'description', content: computed(() => errorDescription.value) }
    ]
});
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center px-4 py-8">
        <div class="max-w-2xl w-full">
            <!-- Logo -->
            <div class="text-center mb-12">
                <NuxtLink to="/" class="inline-block">
                    <div class="flex items-center justify-center gap-3">
                        <img src="/images/logo-it.svg" alt="Identifica Trânsito" class="w-52 h-52"/>
                    </div>
                </NuxtLink>
            </div>

            <!-- Card Principal -->
            <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <!-- Conteúdo -->
                <div class="p-8 md:p-12 text-center">
                    <!-- Ícone de Erro -->
                    <div class="mb-8">
                        <div class="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-it-primary to-blue-600 rounded-3xl shadow-lg mb-6 animate-bounce">
                            <span class="text-white text-6xl font-bold">{{ errorCode }}</span>
                        </div>
                    </div>

                    <!-- Título -->
                    <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        {{ errorTitle }}
                    </h2>

                    <!-- Descrição -->
                    <p class="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                        {{ errorDescription }}
                    </p>

                    <!-- Ilustração com ícone
                    <div v-if="is404" class="mb-10 flex justify-center">
                        <div class="relative">
                            <div class="w-64 h-64 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center opacity-50">
                                <i class="pi pi-map text-it-primary text-8xl opacity-30"></i>
                            </div>
                            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <i class="pi pi-exclamation-triangle text-it-primary text-6xl"></i>
                            </div>
                        </div>
                    </div>
                    <div v-else class="mb-10 flex justify-center">
                        <div class="relative">
                            <div class="w-64 h-64 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center opacity-50">
                                <i class="pi pi-times-circle text-red-500 text-8xl opacity-30"></i>
                            </div>
                            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <i class="pi pi-exclamation-circle text-red-500 text-6xl"></i>
                            </div>
                        </div>
                    </div> -->

                    <!-- Botões de Ação -->
                    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            v-if="is404"
                            label="Voltar à Página Anterior"
                            icon="pi pi-arrow-left"
                            @click="goBack"
                            buttonClass="bg-white! border-2 border-it-primary text-it-primary hover:bg-blue-50! px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                        />
                        
                        <Button
                            v-if="!is404"
                            label="Tentar Novamente"
                            icon="pi pi-refresh"
                            @click="goBack"
                            buttonClass="bg-white! border-2 border-it-primary text-it-primary hover:bg-blue-50! px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                        />
                        
                        <Button
                            label="Ir para o Dashboard"
                            icon="pi pi-home"
                            @click="handleClearError"
                            buttonClass="bg-it-primary! text-white hover:bg-blue-600! px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                        />
                    </div>
                </div>

                <!-- Rodapé com Links Úteis -->
                <div v-if="is404" class="bg-gray-50 border-t border-gray-100 px-8 py-6">
                    <p class="text-center text-sm text-gray-600 mb-4">Links úteis:</p>
                    <div class="flex flex-wrap justify-center gap-4 text-sm">
                        <NuxtLink to="/dashboard" class="text-it-primary hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
                            <i class="pi pi-home"></i>
                            <span>Dashboard</span>
                        </NuxtLink>
                        <NuxtLink to="/dashboard/veiculos" class="text-it-primary hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
                            <i class="pi pi-car"></i>
                            <span>Veículos</span>
                        </NuxtLink>
                        <NuxtLink to="/dashboard/etiquetas" class="text-it-primary hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
                            <i class="pi pi-tags"></i>
                            <span>Etiquetas</span>
                        </NuxtLink>
                    </div>
                </div>
                <div v-else class="bg-red-50 border-t border-red-100 px-8 py-6">
                    <p class="text-center text-sm text-red-700 font-medium">
                        <i class="pi pi-info-circle mr-2"></i>
                        Se o problema persistir, entre em contato com o suporte técnico.
                    </p>
                </div>
            </div>

            <!-- Informação adicional -->
            <div class="text-center mt-8">
                <p class="text-sm text-gray-500">
                    {{ is404 ? 'Se você acredita que isso é um erro, entre em contato com o suporte.' : 'Código do erro: ' + errorCode + (error?.message ? ' - ' + error.message : '') }}
                </p>
            </div>
        </div>
    </div>
</template>
