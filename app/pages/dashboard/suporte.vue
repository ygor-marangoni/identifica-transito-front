<script setup lang="ts">
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
        icon: 'pi pi-envelope',
        title: 'E-mail',
        description: 'Envie sua dúvida para nosso time de suporte.',
        contact: 'identificatransito@gmail.com',
        action: 'Enviar e-mail',
        href: 'mailto:identificatransito@gmail.com'
    },
    {
        icon: 'pi pi-whatsapp',
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
        icon: 'pi pi-comments',
        title: 'Chat Online (Em Breve)',
        description: 'Uma forma rápida de tirar dúvidas diretamente pelo aplicativo ou site.',
        contact: 'Disponível em breve',
        action: 'Abrir chat',
        href: '#'
    }
];
</script>

<template>
    <div class="space-y-8">
        <!-- Hero Section -->
        <HeroSection
            title="Central de Suporte"
            subtitle="Encontre respostas para suas dúvidas e entre em contato com nosso time"
            greeting="Precisa de ajuda?"
            :showButton="false"
        />

        <!-- FAQ Accordion Section -->
        <section class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div class="mb-6">
                <h2 class="text-2xl! font-bold text-gray-900 mb-2!">Perguntas Frequentes (FAQ)</h2>
                <p class="text-gray-600">Encontre as respostas para as dúvidas mais comuns</p>
            </div>

            <div v-if="faqLoading" class="space-y-3">
                <Skeleton v-for="n in 4" :key="n" height="50px" class="w-full" />
            </div>

            <div v-else-if="faqLoadError" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {{ faqLoadError }}
            </div>

            <Accordion v-else-if="faqItems.length > 0" :multiple="false" :activeIndex="0" class="w-full">
                <AccordionTab
                    v-for="(item, index) in faqItems"
                    :key="item.id ?? index"
                    :header="item.question"
                    headerClass="text-gray-900 font-semibold text-base"
                    contentClass="text-gray-600"
                >
                    {{ item.answer }}
                </AccordionTab>
            </Accordion>

            <div v-else class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                Nenhuma pergunta frequente disponível no momento.
            </div>
        </section>

        <!-- Support Channels Section -->
        <section class="space-y-6">
            <div>
                <h2 class="text-2xl! font-bold text-gray-900 mb-2!">Ainda precisa de ajuda?</h2>
                <p class="text-gray-600">Entre em contato conosco através dos canais abaixo.</p>
            </div>

            <SupportContactCard :channels="contactChannels" />
        </section>

        <!-- Additional Info -->
        <section class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
            <div class="flex gap-4">
                <div class="flex-shrink-0">
                    <i class="pi pi-info-circle text-it-primary text-2xl"></i>
                </div>
                <div>
                    <h3 class="text-lg! font-bold text-gray-900 mb-1! -mt-2!">Horário de Atendimento</h3>
                    <p class="text-gray-700 leading-6">
                        Segunda a Sexta: <span class="font-semibold">10h00 às 18h00 (WhatsApp)</span><br>
                        Sábado, Domingo e Feriados: Atendimento por e-mail
                    </p>
                </div>
            </div>
        </section>
    </div>
</template>
