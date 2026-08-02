<script setup lang="ts">
import { CircleHelp, Clock3 } from '@lucide/vue';
import HeroSection from '~/components/dashboard/HeroSection.vue';
import SupportContactCard from '~/components/dashboard/SupportContactCard.vue';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

definePageMeta({
    layout: 'dashboard'
});

useHead({
    title: 'Suporte - Identifica Trânsito',
    meta: [
        { name: 'description', content: 'Perguntas frequentes e canais de suporte.' }
    ]
});

const { $api } = useNuxtApp();

interface FaqItem {
    id: number;
    question: string;
    answer: string;
    active?: boolean | number;
    order?: number;
}

const faqItems = ref<FaqItem[]>([]);
const faqLoading = ref(false);
const faqLoadError = ref('');

const fetchFaqs = async () => {
    faqLoading.value = true;
    faqLoadError.value = '';

    try {
        const res = await $api('/faqs') as any;
        const payload = res?.data ?? res;

        const list = Array.isArray(payload)
            ? payload
            : (Array.isArray(payload?.data) ? payload.data : []);

        faqItems.value = list
            .filter((item: FaqItem) => item?.active === undefined || item?.active === true || item?.active === 1)
            .sort((a: FaqItem, b: FaqItem) => (a?.order ?? 0) - (b?.order ?? 0));
    } catch (error) {
        console.error('Erro ao carregar FAQs públicas:', error);
        faqLoadError.value = 'Não foi possível carregar as perguntas frequentes no momento.';
    } finally {
        faqLoading.value = false;
    }
};

onMounted(() => {
    fetchFaqs();
});

const contactChannels = [
    {
        icon: 'mail',
        title: 'E-mail',
        description: 'Envie sua dúvida para nosso time de suporte.',
        contact: 'identificatransito@gmail.com',
        action: 'Enviar e-mail',
        href: 'mailto:identificatransito@gmail.com'
    },
    {
        icon: 'whatsapp',
        title: 'Telefone / WhatsApp',
        description: 'Fale conosco durante o horário comercial (Seg-Sex, 9h-18h).',
        contact: 'Disponível em breve',
        action: 'Chame no WhatsApp',
        href: '#'
    },
    // {
    //     icon: 'pi pi-whatsapp',
    //     title: 'Telefone / WhatsApp',
    //     description: 'Fale conosco durante o horário comercial (Seg-Sex, 9h-18h).',
    //     contact: '(11) 98497-1689',
    //     action: 'Chame no WhatsApp',
    //     href: 'https://wa.me/5511984971689'
    // },
    {
        icon: 'chat',
        title: 'Chat Online (Em Breve)',
        description: 'Uma forma rápida de tirar dúvidas diretamente pelo aplicativo ou site.',
        contact: 'Disponível em breve',
        action: 'Abrir chat',
        href: '#'
    }
];
</script>

<template>
    <div class="space-y-6 md:space-y-7">
        <!-- Hero Section -->
        <HeroSection
            title="Central de suporte"
            subtitle="Encontre respostas e fale com nosso time quando precisar."
            greeting="Precisa de ajuda?"
            :greeting-icon="CircleHelp"
            :showButton="false"
        />

        <section class="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
            <div class="mb-5 flex items-center gap-3">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf0ff] text-[#1f46ee]"><CircleHelp :size="19" :stroke-width="1.9" aria-hidden="true" /></div>
                <h2 class="relative -top-3 leading-none text-xl! font-semibold text-[#172b4d] mb-0!">Perguntas frequentes</h2>
            </div>

            <div v-if="faqLoading" class="space-y-3">
                <Skeleton v-for="n in 4" :key="n" height="50px" class="w-full" />
            </div>

            <div v-else-if="faqLoadError" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {{ faqLoadError }}
            </div>

            <Accordion v-else-if="faqItems.length > 0" :multiple="false" :activeIndex="0" class="support-faq w-full">
                <AccordionTab
                    v-for="(item, index) in faqItems"
                    :key="item.id ?? index"
                    :header="item.question"
                    headerClass="text-[#172b4d] font-semibold text-sm"
                    contentClass="text-slate-600 text-sm leading-6"
                >
                    {{ item.answer }}
                </AccordionTab>
            </Accordion>

            <div v-else class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                Nenhuma pergunta frequente disponível no momento.
            </div>
        </section>

        <!-- Support Channels Section -->
        <section class="space-y-5">
            <div>
                <h2 class="relative top-0.5 text-xl! font-semibold text-[#172b4d] mb-2!">Ainda precisa de ajuda?</h2>
                <p class="text-sm text-slate-600 mb-0!">Escolha o canal mais conveniente para falar conosco.</p>
            </div>

            <SupportContactCard :channels="contactChannels" />
        </section>

        <section class="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
            <div class="flex items-start gap-3">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eaf0ff] text-[#1f46ee]"><Clock3 :size="18" :stroke-width="1.9" aria-hidden="true" /></div>
                <div>
                    <h3 class="relative top-0.5 text-base! font-semibold text-[#172b4d] mb-2!">Horário de atendimento</h3>
                    <p class="text-sm leading-6 text-slate-600 mb-0!">
                        Segunda a sexta, das <span class="font-semibold text-[#172b4d]">10h às 18h</span>, pelo WhatsApp.<br>
                        Sábados, domingos e feriados: atendimento por e-mail.
                    </p>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
:deep(.support-faq .p-accordionpanel) {
    margin-bottom: 0.5rem;
    overflow: hidden;
    border: 1px solid rgba(148, 163, 184, 0.24);
    border-radius: 0.625rem;
    background: #fafafa !important;
}

:deep(.support-faq .p-accordionheader) {
    padding: 1rem;
    color: #172b4d !important;
    background: #fafafa !important;
    border: 0;
}

:deep(.support-faq .p-accordionheader *),
:deep(.support-faq .p-accordionheader .p-accordionheader-label) {
    color: #172b4d !important;
}

:deep(.support-faq .p-accordioncontent) {
    background: #fafafa !important;
}

:deep(.support-faq .p-accordioncontent-content) {
    padding: 0 1rem 1rem;
    background: #fafafa !important;
}

:deep(.support-faq .p-accordionpanel:last-child) {
    margin-bottom: 0;
}
</style>
