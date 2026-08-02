<script setup lang="ts">
    import { ref } from 'vue';
    import { ShieldCheck } from '@lucide/vue';

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

    const benefitDescriptions = [
        'Etiquetas tornam a identificação mais clara e incentivam condutas mais seguras no trânsito.',
        'Reconhece diferentes perfis de motoristas e incentiva uma condução mais atenta e respeitosa.',
        'Promove respeito entre motoristas e uma convivência mais harmoniosa no trânsito.',
        'Ajuda a antecipar necessidades e torna o fluxo de trânsito mais seguro e fluido.',
        'Previne riscos e reduz impactos humanos e econômicos dos acidentes.'
    ];

    const carouselPage = ref(0);
    const carouselRef = ref<any>(null);
    const dragStartX = ref<number | null>(null);
    const carouselAutoplayInterval = 5000;

    const handleCarouselDragStart = (event: PointerEvent) => {
        if (event.pointerType === 'mouse') dragStartX.value = event.clientX;
    };

    const handleCarouselDragEnd = (event: PointerEvent) => {
        if (dragStartX.value === null) return;

        const deltaX = event.clientX - dragStartX.value;
        dragStartX.value = null;

        if (Math.abs(deltaX) < 40) return;
        if (deltaX < 0) {
            carouselRef.value?.navForward(event);
        } else {
            carouselRef.value?.navBackward(event);
        }
    };
</script>

<template>
    <section class="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 lg:grid lg:grid-cols-[minmax(18rem,0.82fr)_minmax(0,1.18fr)] lg:items-center lg:gap-10">
        <!-- Imagem do projeto -->
        <div class="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div class="relative aspect-[1.15/1] w-full overflow-hidden rounded-[2rem] bg-[#eef2ff]">
                <img
                    :src="assetWithBase('/images/dashboard/sobre-it.jpg')"
                    alt="Identifica Trânsito"
                    class="w-full h-full object-cover"
                />
            </div>
            <div class="absolute -bottom-4 -left-3 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl border-4 border-white bg-[#1f46ee] text-white sm:-left-5">
                <ShieldCheck :size="35" :stroke-width="1.8" aria-hidden="true" />
            </div>
        </div>

        <!-- Carrossel de Benefícios -->
        <div class="mt-8 min-w-0 text-center lg:mt-0 lg:pr-3">
            <div class="relative -top-2 mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-[#eef2ff] px-3.5 py-2 text-sm font-semibold text-[#1f46ee]">
                <ShieldCheck :size="19" :stroke-width="2" aria-hidden="true" />
                Dirija com segurança
            </div>
            <div
                class="cursor-grab touch-pan-y select-none active:cursor-grabbing"
                @pointerdown="handleCarouselDragStart"
                @pointerup="handleCarouselDragEnd"
                @pointercancel="dragStartX = null"
            >
                <Carousel
                    ref="carouselRef"
                    v-model:page="carouselPage"
                    :value="benefits"
                    :numVisible="1"
                    :numScroll="1"
                    :showIndicators="true"
                    :showNavigators="false"
                    :autoplayInterval="carouselAutoplayInterval"
                    circular
                    class="w-full"
                >
                    <template #item="slotProps">
                        <div class="px-1 pb-0.5">
                            <div>
                                <h3 class="text-2xl! font-bold leading-tight text-[#0c0f1a] mb-0!">{{ slotProps.data.title }}</h3>
                                <p class="mt-3 text-base leading-relaxed text-gray-600">{{ benefitDescriptions[slotProps.data.number - 1] }}</p>
                            </div>
                        </div>
                    </template>
                </Carousel>
            </div>

            <!-- Botões -->
            <div class="mt-4 flex flex-wrap justify-center gap-3">
                <NuxtLink to="/project" class="rounded-lg bg-[#1f46ee] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1739d4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f46ee]">Saiba mais sobre o projeto</NuxtLink>
                <NuxtLink to="/project/faq" class="rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-[#1f46ee] hover:text-[#1f46ee] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f46ee]">Perguntas frequentes</NuxtLink>
            </div>
        </div>
    </section>
</template>

<style scoped>
:deep(.p-carousel) {
    --p-carousel-indicator-background: #E5E7EB;
    --p-carousel-indicator-hover-background: #D1D5DB;
    --p-carousel-indicator-active-background: #1422E4;
}

:deep(.p-carousel .p-carousel-indicators) {
    justify-content: center;
    margin-top: 1rem;
}

</style>
