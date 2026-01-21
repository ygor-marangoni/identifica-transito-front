<script setup lang="ts">
import { useRouter } from 'vue-router';
import Button from '~/components/forms/Button.vue';

const router = useRouter();

const goBack = () => {
    router.back();
};

useHead({
    title: '404 - Página não encontrada - Identifica Trânsito',
    meta: [
        { name: 'description', content: 'Página não encontrada.' }
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
                    <!-- Ícone 404 -->
                    <div class="mb-8">
                        <div class="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-it-primary to-blue-600 rounded-3xl shadow-lg mb-6 animate-bounce">
                            <span class="text-white text-6xl font-bold">404</span>
                        </div>
                    </div>

                    <!-- Título -->
                    <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Página não encontrada
                    </h2>

                    <!-- Descrição -->
                    <p class="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                        Desculpe, a página que você está procurando não existe ou foi movida para outro local.
                    </p>

                    <!-- Botões de Ação -->
                    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            label="Voltar à Página Anterior"
                            icon="pi pi-arrow-left"
                            @click="goBack"
                            buttonClass="bg-white! border-2 border-it-primary text-it-primary hover:bg-blue-50! px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                        />
                        
                        <NuxtLink to="/dashboard">
                            <Button
                                label="Ir para o Dashboard"
                                icon="pi pi-home"
                                buttonClass="bg-it-primary text-white hover:bg-blue-600 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                            />
                        </NuxtLink>
                    </div>
                </div>

                <!-- Rodapé com Links Úteis -->
                <div class="bg-gray-50 border-t border-gray-100 px-8 py-6">
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
            </div>

            <!-- Informação adicional -->
            <div class="text-center mt-8">
                <p class="text-sm text-gray-500">
                    Se você acredita que isso é um erro, entre em contato com o suporte.
                </p>
            </div>
        </div>
    </div>
</template>
