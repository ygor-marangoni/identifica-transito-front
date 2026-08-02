<script setup lang="ts">
import HeroSection from '~/components/dashboard/HeroSection.vue';
import FormInputText from '~/components/forms/InputText.vue';
import Button from '~/components/forms/Button.vue';
import { useToast } from 'primevue/usetoast';

definePageMeta({ layout: 'dashboard' });
useHead({ title: 'Editar Etiqueta - SuperAdmin | Identifica Trânsito' });

const { $api } = useNuxtApp();
const toast = useToast();
const route = useRoute();
const tagId = Number(route.params.id);

const loading = ref(false);
const loadingTag = ref(false);

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

const fetchTag = async () => {
    loadingTag.value = true;
    try {
        const res = await $api(`/admin/tags/${tagId}`) as any;
        const tag = res?.data ?? res;
        form.value.name = tag.name ?? '';
        form.value.description = tag.description ?? '';
        form.value.color_name = tag.color_name ?? '';
        form.value.price = tag.price ?? '';
        await nextTick();
        form.value.slug = tag.slug ?? '';
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os dados da etiqueta.', life: 5000 });
        navigateTo('/dashboard/superadmin/etiquetas');
    } finally {
        loadingTag.value = false;
    }
};

onMounted(() => fetchTag());

const handleSubmit = async () => {
    if (!form.value.name || !form.value.color_name || !form.value.price) {
        toast.add({ severity: 'error', summary: 'Campos obrigatórios', detail: 'Preencha o nome, a cor e o preço da etiqueta.', life: 3000 });
        return;
    }

    loading.value = true;
    try {
        await $api(`/admin/tags/${tagId}`, {
            method: 'PUT',
            body: {
                name: form.value.name,
                slug: form.value.slug || null,
                description: form.value.description || null,
                color_name: form.value.color_name || null,
                price: form.value.price,
            },
        });
        toast.add({ severity: 'success', summary: 'Etiqueta atualizada!', detail: 'Os dados foram salvos com sucesso.', life: 3000 });
        navigateTo('/dashboard/superadmin/etiquetas');
    } catch (error: any) {
        const msg = error?.data?.message || error?.data?.error || 'Não foi possível salvar as alterações.';
        toast.add({ severity: 'error', summary: 'Erro ao salvar', detail: msg, life: 5000 });
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="admin-page space-y-6 md:space-y-7">
        <HeroSection
            title="Editar Etiqueta"
            subtitle="Atualize os dados e a disponibilidade desta etiqueta no catálogo."
            greeting="Catálogo de identificação"
            :showButton="true"
            buttonLabel="Voltar para Etiquetas"
            buttonLink="/dashboard/superadmin/etiquetas"
            buttonIcon="pi pi-arrow-left"
        />

        <div class="w-full">
            <!-- Skeleton -->
            <div v-if="loadingTag" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
                <Skeleton width="40%" height="2rem" class="mb-4" />
                <div class="grid grid-cols-2 gap-6">
                    <Skeleton height="60px" />
                    <Skeleton height="60px" />
                    <Skeleton height="60px" />
                </div>
                <Skeleton height="100px" />
            </div>

            <div v-else class="admin-user-form-shell catalog-form-shell bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <div class="mb-8">
                    <h1 class="text-3xl! font-bold text-it-primary mb-2">Editar Etiqueta</h1>
                    <p class="text-gray-600">Atualize os campos desejados.</p>
                </div>

                <form @submit.prevent="handleSubmit" class="admin-user-form-grid space-y-8">
                    <div class="space-y-5 col-span-full">
                        <h2 class="flex items-center gap-3 text-lg! font-semibold text-gray-900 border-b border-gray-100 pb-3"><span class="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef2ff] text-[#1f46ee]"><i class="pi pi-tag"></i></span>Informações da Etiqueta</h2>

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
                            label="Nome da Cor *"
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
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none placeholder-gray-400 resize-none"
                                :disabled="loading"
                            ></textarea>
                        </div>
                    </div>

                    <div class="border-t border-gray-200"></div>

                    <Button type="submit" fullWidth :loading="loading" size="lg">
                        <i v-if="!loading" class="pi pi-check"></i>
                        Salvar Alterações
                    </Button>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
:global(.layout-admin .admin-page .catalog-form-shell.catalog-form-shell input:not([type='checkbox']):not([type='radio']):focus),
:global(.layout-admin .admin-page .catalog-form-shell.catalog-form-shell textarea:focus),
:global(.layout-admin .admin-page .catalog-form-shell.catalog-form-shell .p-select:focus-within) {
    border: 1px solid #64748b !important;
    outline: none !important;
    box-shadow: none !important;
}
</style>
