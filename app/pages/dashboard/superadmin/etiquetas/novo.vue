<script setup lang="ts">
import HeroSection from '~/components/dashboard/HeroSection.vue';
import FormInputText from '~/components/forms/InputText.vue';
import Button from '~/components/forms/Button.vue';
import { useToast } from 'primevue/usetoast';

definePageMeta({ layout: 'dashboard' });
useHead({ title: 'Nova Etiqueta - SuperAdmin | Identifica Trânsito' });

const { $api } = useNuxtApp();
const toast = useToast();
const loading = ref(false);

const form = ref({
    name: '',
    slug: '',
    description: '',
    color_name: '',
    price: '',
});

const generateSlug = (val: string) =>
    val.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

watch(() => form.value.name, (val) => {
    form.value.slug = generateSlug(val);
});

const handleSubmit = async () => {
    if (!form.value.name || !form.value.price) {
        toast.add({ severity: 'error', summary: 'Campos obrigatórios', detail: 'Preencha o nome e o preço da etiqueta.', life: 3000 });
        return;
    }

    loading.value = true;
    try {
        await $api('/admin/tags', {
            method: 'POST',
            body: {
                name: form.value.name,
                slug: form.value.slug || null,
                description: form.value.description || null,
                color_name: form.value.color_name || null,
                price: form.value.price,
            },
        });
        toast.add({ severity: 'success', summary: 'Etiqueta criada!', detail: 'A etiqueta foi cadastrada com sucesso.', life: 3000 });
        navigateTo('/dashboard/superadmin/etiquetas');
    } catch (error: any) {
        const msg = error?.data?.message || error?.data?.error || 'Não foi possível cadastrar a etiqueta.';
        toast.add({ severity: 'error', summary: 'Erro ao cadastrar', detail: msg, life: 5000 });
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="space-y-10">
        <HeroSection
            title="Nova Etiqueta"
            subtitle="Cadastre uma nova etiqueta na plataforma."
            greeting="SuperAdmin"
            :showButton="true"
            buttonLabel="Voltar para Etiquetas"
            buttonLink="/dashboard/superadmin/etiquetas"
            buttonIcon="pi pi-arrow-left"
        />

        <div class="max-w-3xl mx-auto">
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <div class="mb-8">
                    <h1 class="text-3xl! font-bold text-it-primary mb-2">Cadastrar Nova Etiqueta</h1>
                    <p class="text-gray-600">Preencha as informações para criar uma nova etiqueta.</p>
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-8">
                    <div class="space-y-5">
                        <h2 class="text-lg! font-semibold text-gray-900 border-b border-gray-100 pb-3">Informações da Etiqueta</h2>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInputText
                                v-model="form.name"
                                id="name"
                                label="Nome *"
                                placeholder="Ex: Azul"
                                showIcon
                                icon="pi pi-tag"
                                wrapper-class="w-full"
                                inputClass="w-full"
                                :disabled="loading"
                            />
                            <FormInputText
                                v-model="form.slug"
                                id="slug"
                                label="Slug"
                                placeholder="Ex: azul"
                                showIcon
                                icon="pi pi-link"
                                wrapper-class="w-full"
                                inputClass="w-full"
                                :disabled="loading"
                            />
                        </div>

                        <FormInputText
                            v-model="form.color_name"
                            id="color_name"
                            label="Nome da Cor"
                            placeholder="Ex: azul"
                            showIcon
                            icon="pi pi-palette"
                            wrapper-class="w-full"
                            inputClass="w-full"
                            :disabled="loading"
                        />

                        <FormInputText
                            v-model="form.price"
                            id="price"
                            type="number"
                            label="Preço *"
                            placeholder="0.00"
                            showIcon
                            icon="pi pi-dollar"
                            wrapper-class="w-full"
                            inputClass="w-full"
                            :disabled="loading"
                        />

                        <div class="w-full">
                            <label class="block text-sm font-semibold text-gray-900 mb-2">Descrição</label>
                            <textarea
                                v-model="form.description"
                                rows="4"
                                placeholder="Descreva a etiqueta..."
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400 resize-none"
                                :disabled="loading"
                            ></textarea>
                        </div>
                    </div>

                    <div class="border-t border-gray-200"></div>

                    <Button type="submit" fullWidth :loading="loading" size="lg">
                        <i v-if="!loading" class="pi pi-check"></i>
                        Cadastrar Etiqueta
                    </Button>
                </form>
            </div>
        </div>
    </div>
</template>
