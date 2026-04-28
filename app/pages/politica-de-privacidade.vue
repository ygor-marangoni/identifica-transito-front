<script setup lang="ts">
definePageMeta({
  layout: 'default'
});

useHead({
  title: 'Política de Privacidade - Identifica Trânsito',
  meta: [
    {
      name: 'description',
      content:
        'Conheça como o Identifica Trânsito coleta, utiliza, compartilha e protege os dados pessoais dos usuários em conformidade com a LGPD.'
    }
  ]
});

const lastUpdated = '27 de abril de 2026';

const contactChannels = [
  {
    label: 'E-mail',
    value: 'identificatransito@gmail.com',
    href: 'mailto:identificatransito@gmail.com'
  },
  {
    label: 'WhatsApp',
    value: '(11) 98497-1689',
    href: 'https://wa.me/5511984971689'
  }
];
</script>

<template>
  <main class="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-100">
    <section class="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div class="bg-white border border-blue-100 rounded-3xl shadow-sm overflow-hidden">
        <div class="bg-linear-to-r from-[#0C1DB8] via-[#1E3AFA] to-[#2563EB] p-8 sm:p-10 text-white relative">
          <div class="absolute right-0 top-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -translate-y-1/3 translate-x-1/3"></div>
          <img src="/images/logo-it-white.svg" alt="Identifica Trânsito" class="h-12 sm:h-14 mb-6 relative z-10" />
          <h1 class="text-3xl sm:text-4xl font-extrabold leading-tight mb-3 relative z-10">Política de Privacidade</h1>
          <p class="text-blue-100 text-sm sm:text-base max-w-3xl relative z-10">
            Transparência sobre como tratamos seus dados pessoais e respeitamos seus direitos, em conformidade com a Lei no 13.709/2018 (LGPD).
          </p>
          <p class="text-blue-200 text-xs sm:text-sm mt-4 relative z-10">
            Última atualização: {{ lastUpdated }}
          </p>
        </div>

        <div class="p-6 sm:p-10 space-y-8 text-slate-700">
          <section>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-3">1. Compromisso com sua privacidade</h2>
            <p class="leading-7">
              O Identifica Trânsito valoriza a privacidade e a proteção dos dados pessoais de seus usuários, realizando o tratamento das informações em conformidade com a Lei no 13.709/2018 (Lei Geral de Proteção de Dados - LGPD). Ao utilizar a plataforma, o usuário declara estar ciente e de acordo com a coleta e uso de seus dados pessoais para as finalidades descritas nesta política.
            </p>
          </section>

          <section>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-3">2. Quais dados podemos coletar</h2>
            <p class="leading-7 mb-3">
              Para operar nossos serviços, os dados coletados podem incluir:
            </p>
            <ul class="list-disc pl-6 space-y-2 leading-7">
              <li>Nome completo, CPF e data de nascimento;</li>
              <li>Informações de contato, como e-mail e telefone;</li>
              <li>Dados do veículo vinculados ao cadastro;</li>
              <li>Dados de pagamento necessários para processar transações;</li>
              <li>Informações de navegação e uso da plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-3">3. Finalidades do tratamento de dados</h2>
            <p class="leading-7 mb-3">Utilizamos os dados exclusivamente para:</p>
            <ul class="list-disc pl-6 space-y-2 leading-7">
              <li>Cadastro e identificação do usuário;</li>
              <li>Liberação e gestão de etiquetas;</li>
              <li>Processamento de pagamentos;</li>
              <li>Comunicação com o usuário e suporte;</li>
              <li>Prevenção a fraudes e reforço de segurança;</li>
              <li>Melhoria contínua da experiência na plataforma.</li>
            </ul>
          </section>

          <section id="base-legal" class="scroll-mt-20">
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-3">4. Bases legais (LGPD)</h2>
            <p class="leading-7">
              O tratamento dos dados pessoais é realizado com base no consentimento do titular, na execução de contrato e no cumprimento de obrigações legais e regulatórias aplicáveis.
            </p>
          </section>

          <section>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-3">5. Compartilhamento de dados</h2>
            <p class="leading-7">
              Poderá haver compartilhamento com terceiros estritamente necessários à operação do serviço, como plataformas de pagamento, serviços de tecnologia e parceiros logísticos. Não realizamos comercialização de dados pessoais.
            </p>
          </section>

          <section>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-3">6. Segurança e retenção</h2>
            <p class="leading-7">
              O Identifica Trânsito adota medidas técnicas e administrativas adequadas para proteger os dados contra acessos não autorizados, perdas ou vazamentos. Os dados são armazenados pelo tempo necessário ao cumprimento das finalidades informadas e das exigências legais.
            </p>
          </section>

          <section>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-3">7. Direitos do titular</h2>
            <p class="leading-7 mb-3">Nos termos da LGPD, o usuário pode solicitar:</p>
            <ul class="list-disc pl-6 space-y-2 leading-7">
              <li>Acesso aos dados pessoais tratados;</li>
              <li>Correção e atualização de dados;</li>
              <li>Exclusão de dados, quando aplicável;</li>
              <li>Portabilidade de dados;</li>
              <li>Revogação do consentimento.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-3">8. Cookies e tecnologias semelhantes</h2>
            <p class="leading-7">
              A plataforma pode utilizar cookies e tecnologias semelhantes para melhorar a navegação e personalizar a experiência do usuário.
            </p>
          </section>

          <section>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-3">9. Responsabilidade de uso</h2>
            <p class="leading-7">
              O uso da plataforma e da etiqueta é de responsabilidade exclusiva do usuário, não substituindo sistemas oficiais de identificação veicular ou segurança pública. O Identifica Trânsito se isenta de responsabilidade por uso indevido por terceiros.
            </p>
          </section>

          <section>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-3">10. Atualizações desta política</h2>
            <p class="leading-7">
              Esta política pode ser atualizada a qualquer momento. Recomendamos revisão periódica. O uso contínuo da plataforma será interpretado como concordância com eventuais alterações.
            </p>
          </section>

          <section class="rounded-2xl border border-blue-200 bg-blue-50/70 p-5 sm:p-6">
            <h2 class="text-lg sm:text-xl font-bold text-slate-900 mb-3">Canal de contato sobre privacidade</h2>
            <p class="leading-7 mb-4">
              Para exercer seus direitos como titular de dados ou esclarecer dúvidas sobre esta política, fale com nossa equipe:
            </p>
            <ul class="space-y-2">
              <li v-for="channel in contactChannels" :key="channel.label" class="text-sm sm:text-base">
                <span class="font-semibold text-slate-900">{{ channel.label }}:</span>
                <a :href="channel.href" target="_blank" rel="noopener noreferrer" class="text-blue-700 hover:text-blue-900 underline ml-1">
                  {{ channel.value }}
                </a>
              </li>
            </ul>
          </section>

          <div class="pt-2">
            <NuxtLink
              to="/"
              class="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold"
            >
              <i class="pi pi-arrow-left text-xs"></i>
              Voltar para a página inicial
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
