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

const faqItems = ref([
    {
        header: 'Como funciona o pagamento da etiqueta?',
        content: 'O pagamento pode ser realizado via cartão de crédito, PIX ou boleto. Após confirmar o pedido, você receberá a etiqueta no endereço cadastrado ou poderá retirar em um ponto de coleta.'
    },
    {
        header: 'Como faço para retirar minha etiqueta em um ponto de coleta?',
        content: 'Ao finalizar a compra, selecione a opção "Retirar em Ponto de Coleta" e escolha o local mais próximo. Você receberá um número de pedido via e-mail que deve ser apresentado na retirada.'
    },
    {
        header: 'Como aplicar a etiqueta no veículo?',
        content: 'A etiqueta é autoadesiva. Limpe bem a superfície antes de aplicar para garantir a melhor aderência. Aplique uma etiqueta na parte superior direita do para-brisa (vidro dianteiro) e outra na parte superior direita do vidro traseiro. Certifique-se de que não obstrua a visão do condutor e esteja em conformidade com as leis de trânsito locais.'
    },
    {
        header: 'Posso alterar os dados do meu veículo após cadastrá-lo?',
        content: 'Sim, você pode editar as informações do seu veículo na seção "Meus Veículos" no aplicativo. Algumas informações, como a placa, podem ter restrições de alteração após a emissão de uma etiqueta.'
    },
    {
        header: 'O que fazer se eu perder minha etiqueta?',
        content: 'Caso perca sua etiqueta, entre em contato com nosso suporte. Poderá ser necessário adquirir uma nova etiqueta para o veículo.'
    }
]);

const contactChannels = [
    {
        icon: 'pi pi-envelope',
        title: 'E-mail',
        description: 'Envie sua dúvida para nosso time de suporte.',
        contact: 'suporte@identificatransito.com.br',
        action: 'Enviar e-mail',
        href: 'mailto:suporte@identificatransito.com.br'
    },
    {
        icon: 'pi pi-phone',
        title: 'Telefone / WhatsApp',
        description: 'Fale conosco durante o horário comercial (Seg-Sex, 9h-18h).',
        contact: '(XX) YYYYY-YYYY',
        action: 'Ligar agora',
        href: 'tel:+5511999999999'
    },
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

            <Accordion :multiple="false" :activeIndex="0" class="w-full">
                <AccordionTab
                    v-for="(item, index) in faqItems"
                    :key="index"
                    :header="item.header"
                    headerClass="text-gray-900 font-semibold text-base"
                    contentClass="text-gray-600"
                >
                    {{ item.content }}
                </AccordionTab>
            </Accordion>
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
                    <h3 class="text-lg font-bold text-gray-900 mb-1">Horário de Atendimento</h3>
                    <p class="text-gray-700 leading-6">
                        Segunda a Sexta: <span class="font-semibold">9h00 às 18h00</span><br>
                        Sábado, Domingo e Feriados: Atendimento por e-mail
                    </p>
                </div>
            </div>
        </section>
    </div>
</template>
