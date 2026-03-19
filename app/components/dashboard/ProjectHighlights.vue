<script setup lang="ts">
    const config = useRuntimeConfig();
    const assetWithBase = (path: string) => {
        if (path.startsWith('data:') || path.startsWith('http')) return path;
        return `${config.app.baseURL}${path}`.replace(/\/+/g, '/').replace(':/', '://');
    };

    const benefits = [
        {
            number: 1,
            title: 'Redução de acidentes e aumento da segurança',
            description: 'Etiquetas coloridas facilitam a identificação do tipo de condutor, promovendo condução mais segura. Outros motoristas podem adotar medidas apropriadas, reduzindo a probabilidade de acidentes.'
        },
        {
            number: 2,
            title: 'Adaptação às necessidades dos motoristas',
            description: 'Ambiente mais adaptativo reconhece motoristas recém-habilitados, gestantes, idosos e pessoas com deficiência. Incentiva abordagem cuidadosa, proporcionando experiência de direção mais confortável.'
        },
        {
            number: 3,
            title: 'Fomento ao respeito mútuo',
            description: 'Conscientização sobre diferentes tipos de condutores promove cultura de respeito mútuo. Coexistência mais harmoniosa no trâfego, atmosfera menos competitiva e mais segura.'
        },
        {
            number: 4,
            title: 'Eficiência no trânsito',
            description: 'Identificação prévia das características dos motoristas possibilita adaptação suave ao estilo de direção. Facilita manobras e evita situações de perigo.'
        },
        {
            number: 5,
            title: 'Redução dos custos relacionados a acidentes',
            description: 'Projeto contribui para a prevenção de acidentes e redução de custos econômicos associados. Alinha-se com estudo do Ipea sobre prejuízos econômicos causados por acidentes de trânsito.'
        }
    ];
</script>

<template>
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col lg:flex-row gap-6 items-center">
        <!-- Imagem Fixa -->
        <div class="lg:w-1/3 shrink-0">
            <div class="relative w-full aspect-square bg-linear-to-br from-blue-50 to-indigo-100 rounded-2xl border border-gray-200 overflow-hidden">
                <img 
                    :src="assetWithBase('/images/dashboard/sobre-it.jpg')"
                    alt="Identifica Trânsito" 
                    class="w-full h-full object-cover"
                />
                <!-- Máscara escura -->
                <div class="absolute inset-0 bg-black/40 rounded-2xl"></div>
                <!-- Texto por cima -->
                <div class="absolute inset-0 flex items-center justify-center rounded-2xl max-w-[90%] mx-auto">
                    <h3 class="text-2xl font-bold text-white! text-center px-4">Conheça os benefícios do projeto</h3>
                </div>
            </div>
        </div>

        <!-- Carrossel de Benefícios -->
        <div class="lg:w-2/3 flex items-center flex-col gap-8 w-full lg:pr-5">
            <Carousel 
                :value="benefits" 
                :numVisible="1" 
                :numScroll="1" 
                :showIndicators="true"
                :showNavigators="true"
                :autoplayInterval="5000"
                circular
                class="w-full"
            >
                <template #item="slotProps">
                    <div class="px-2">
                        <div class="space-y-3">
                            <!-- Número e Título -->
                            <div class="flex flex-col items-center">
                                <div class="shrink-0 w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                                    <span class="text-lg font-bold text-yellow-700">{{ slotProps.data.number }}</span>
                                </div>
                                <h4 class="text-lg font-semibold text-gray-900 pt-0 mt-0! text-center">{{ slotProps.data.title }}</h4>
                            </div>

                            <!-- Descrição -->
                            <p class="text-sm text-gray-600 leading-relaxed text-center">{{ slotProps.data.description }}</p>
                        </div>
                    </div>
                </template>
            </Carousel>

            <!-- Botões -->
            <div class="flex justify-center flex-wrap gap-3 mt-2">
                <NuxtLink to="/project" class="px-4 py-2 rounded-lg bg-it-primary text-white text-sm font-medium hover:bg-it-secondary transition">Saber Mais</NuxtLink>
                <NuxtLink to="/project/faq" class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-it-primary hover:text-it-primary transition">Perguntas frequentes</NuxtLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
:deep(.p-carousel) {
    --p-carousel-indicator-background: #E5E7EB;
    --p-carousel-indicator-hover-background: #D1D5DB;
    --p-carousel-indicator-active-background: #1422E4;
}

:deep(.p-carousel .p-carousel-button) {
    /* @apply bg-it-primary hover:bg-it-secondary text-white; */
}
</style>
