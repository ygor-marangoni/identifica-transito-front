<script setup lang="ts">
import { ArrowUpRight, CarFront, ChevronDown, CircleHelp, Info, MessageCircle, ScanLine, ShieldCheck, Tag } from '@lucide/vue';

const section = ref<HTMLElement | null>(null);
const openFaq = ref(0);
let animation: { kill: () => void } | undefined;

const faqItems = [
    { question: 'O que aparece quando o QR Code é escaneado?', answer: 'Informações relacionadas ao veículo, ao perfil de uso e à situação da etiqueta.', icon: ScanLine },
    { question: 'O QR Code mostra dados pessoais?', answer: 'Não. Documentos, telefone, endereço e identidade civil do motorista não são expostos.', icon: ShieldCheck },
    { question: 'Como escolho minha etiqueta?', answer: 'A escolha é feita na plataforma de acordo com o perfil de uso aplicável ao veículo.', icon: Tag },
    { question: 'Posso cadastrar mais de um veículo?', answer: 'Sim. A plataforma permite cadastrar veículos diferentes e acompanhar suas etiquetas.', icon: CarFront },
    { question: 'Como recebo minha etiqueta?', answer: 'O fluxo atual permite envio para casa ou retirada em um ponto de coleta, conforme a opção disponível no pedido.', icon: MessageCircle },
    { question: 'A etiqueta funciona à noite?', answer: 'Sim. As etiquetas são refletivas para ampliar a visibilidade em cenários de baixa luminosidade.', icon: Info },
    { question: 'Existe mensalidade?', answer: 'Não. A proposta pública atual é de pagamento único, sem mensalidade.', icon: CircleHelp }
];

const actions = [
    { title: 'Falar com a equipe', detail: 'Entre em contato', href: 'mailto:contato@identificatransito.com.br', icon: MessageCircle },
    { title: 'Conhecer as etiquetas', detail: 'Ver como funciona', href: '#etiquetas', icon: Tag }
];

onMounted(async () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    await waitForLandingV2Ready();
    const { gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);
    if (!section.value) return;
    const intro = section.value.querySelector<HTMLElement>('.v2-faq__intro');
    const actions = section.value.querySelectorAll<HTMLElement>('.v2-faq__action');
    const items = section.value.querySelectorAll<HTMLElement>('.v2-faq__item');
    const introParts = intro ? Array.from(intro.children) as HTMLElement[] : [];
    const compact = window.matchMedia('(max-width: 850px)').matches;
    animation = gsap.timeline({
        scrollTrigger: { trigger: section.value, start: 'top 80%', once: true }
    })
        .from(introParts, { y: 42, autoAlpha: 0, duration: .7, stagger: .1, ease: 'power3.out' })
        .from(actions, { x: compact ? -18 : -34, y: 18, autoAlpha: 0, duration: .52, stagger: .09, ease: 'power3.out' }, '-=.48')
        .from(items, { x: compact ? 18 : 44, y: 26, autoAlpha: 0, scale: .985, duration: .56, stagger: .085, ease: 'power3.out' }, '-=.54');
});

onBeforeUnmount(() => animation?.kill());
</script>

<template>
    <section id="faq" ref="section" class="v2-faq" aria-labelledby="v2-faq-title">
        <div class="v2-faq__grid">
            <div class="v2-faq__aside">
            <header class="v2-faq__intro">
                <p class="v2-faq__eyebrow">FAQ</p>
                <h2 id="v2-faq-title">Ficou com<br>alguma <span class="heading-highlight">dúvida?</span></h2>
                <p class="v2-faq__description">Reunimos as principais respostas sobre o projeto, as etiquetas e o funcionamento da plataforma.</p>
                <div class="v2-faq__actions">
                    <a v-for="action in actions" :key="action.title" class="v2-faq__action" :href="action.href">
                        <span class="v2-faq__action-icon"><component :is="action.icon" :size="19" /></span>
                        <span class="v2-faq__action-copy"><strong>{{ action.title }}</strong><small>{{ action.detail }}</small></span>
                        <ArrowUpRight :size="16" aria-hidden="true" />
                    </a>
                </div>
            </header>
            </div>

            <div class="v2-faq__list">
                <article v-for="(item, index) in faqItems" :key="item.question" class="v2-faq__item" :class="{ 'is-open': openFaq === index }">
                    <button :id="`v2-faq-question-${index}`" class="v2-faq__trigger" type="button" :aria-expanded="openFaq === index" :aria-controls="`v2-faq-answer-${index}`" @click="openFaq = openFaq === index ? -1 : index">
                        <span class="v2-faq__question"><i><component :is="item.icon" :size="18" /></i><span>{{ item.question }}</span></span>
                        <ChevronDown :size="18" aria-hidden="true" />
                    </button>
                    <div :id="`v2-faq-answer-${index}`" class="v2-faq__answer" role="region" :aria-labelledby="`v2-faq-question-${index}`">
                        <p>{{ item.answer }}</p>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>

<style scoped>
.v2-faq { display:block!important; box-sizing:border-box; width:100%; max-width:none; padding:clamp(105px,12vw,170px) var(--v2-grid-inset); background:#fafaf7; color:#101114; font-family:'Instrument Sans',Arial,sans-serif; }
.v2-faq__grid { display:grid; grid-template-columns:minmax(280px,.72fr) minmax(0,1.28fr); gap:clamp(52px,9vw,150px); width:min(100%,var(--v2-grid-max)); max-width:var(--v2-grid-max); margin:0 auto; align-items:start; box-sizing:border-box; }
.v2-faq__aside { width:100%; max-width:470px; min-width:0; box-sizing:border-box; align-self:start; }.v2-faq__intro { max-width:470px; }
.v2-faq__eyebrow { display:block; margin:0 0 21px; color:#145df5; font-size:12px; font-weight:700; letter-spacing:.13em; line-height:1.2; text-transform:uppercase; }
.v2-faq__eyebrow::before { content:'{ '; }.v2-faq__eyebrow::after { content:' }'; }
.v2-faq h2 { max-width:440px; margin:0; color:#29374d; font-size:56px; font-weight:600; letter-spacing:-.025em; line-height:.98; }
.v2-faq__description { max-width:420px; margin:24px 0 0; color:#69717d; font-size:18px; line-height:1.5; }
.v2-faq__actions { display:grid; gap:12px; margin-top:34px; }
.v2-faq__action { display:grid; grid-template-columns:48px 1fr 16px; align-items:center; gap:14px; min-height:86px; padding:15px 17px; border:1px solid #d8e0ec; border-radius:17px; background:linear-gradient(112deg,#fff,#f5f8fd); color:#29374d; text-decoration:none; box-shadow:inset 0 1px 0 rgba(255,255,255,.9); transition:border-color .25s ease,transform .25s ease,background .25s ease; }
@media (min-width:851px) { .v2-faq__actions { width:calc(100% - 19px); margin-left:19px; } }
.v2-faq__action:hover { border-color:#9ebcf2; background:linear-gradient(112deg,#fff,#edf4ff); transform:translateY(-2px); }
.v2-faq__action-icon { display:grid; width:48px; height:48px; place-items:center; border:1px solid #cbdafa; border-radius:14px; background:#f0f5ff; color:#145df5; }
.v2-faq__action-copy { display:grid; gap:5px; }.v2-faq__action strong { font-size:15px; font-weight:600; line-height:1.1; }.v2-faq__action small { color:#718096; font-size:13px; }.v2-faq__action>svg { color:#718096; transition:transform .25s ease,color .25s ease; }.v2-faq__action:hover>svg { color:#145df5; transform:translate(2px,-2px); }
.v2-faq__list { min-width:0; box-sizing:border-box; }.v2-faq__item { box-sizing:border-box; margin-bottom:12px; border:1px solid #d8e0ec; border-radius:18px; background:rgba(255,255,255,.72); transition:border-color .25s ease,background .25s ease; }.v2-faq__item.is-open { border-color:#b7caf0; background:linear-gradient(110deg,#fff,#f7faff); }
.v2-faq > .v2-faq__grid > .v2-faq__list { width:100%!important; max-width:100%!important; min-width:0; margin:0; }
.v2-faq__trigger { display:flex; width:100%; align-items:center; justify-content:space-between; gap:24px; padding:19px 22px; border:0; background:transparent; color:#29374d; font:600 clamp(16px,1.22vw,18px)/1.32 'Instrument Sans',Arial,sans-serif; text-align:left; cursor:pointer; }.v2-faq__trigger>svg { flex:none; color:#718096; transition:transform .3s ease,color .3s ease; }.v2-faq__item.is-open .v2-faq__trigger>svg { color:#145df5; transform:rotate(180deg); }
.v2-faq__question { display:flex; min-width:0; align-items:center; gap:14px; }.v2-faq__question>span { min-width:0; }.v2-faq__question i { display:grid; width:42px; height:42px; flex:none; place-items:center; border:1px solid #cbdafa; border-radius:13px; background:#f0f5ff; color:#145df5; font-style:normal; }.v2-faq__item.is-open .v2-faq__question i { border-color:#a9c2f5; background:#e8f0ff; }
.v2-faq__answer { display:grid; grid-template-rows:0fr; transition:grid-template-rows .38s cubic-bezier(.2,.75,.25,1); }.v2-faq__answer p { max-width:710px; overflow:hidden; margin:0; padding:0 60px 0 78px; color:#718096; font-size:15px; line-height:1.58; opacity:0; transform:translateY(-7px); transition:opacity .22s ease,transform .3s ease,padding .38s cubic-bezier(.2,.75,.25,1); }.v2-faq__item.is-open .v2-faq__answer { grid-template-rows:1fr; }.v2-faq__item.is-open .v2-faq__answer p { padding-bottom:27px; opacity:1; transform:translateY(0); }
@media (max-width:1200px) { .v2-faq h2 { font-size:52px; } }
@media (max-width:1000px) { .v2-faq h2 { font-size:48px; }.v2-faq__grid { gap:52px; } }
@media (max-width:850px) { .v2-faq { padding-top:142px; padding-bottom:88px; }.v2-faq h2 { font-size:32px; }.v2-faq__grid { display:block; width:100%; }.v2-faq__aside,.v2-faq > .v2-faq__grid > .v2-faq__list { inline-size:100%!important; max-width:none!important; margin-left:0!important; margin-right:0!important; box-sizing:border-box; }.v2-faq__actions { inline-size:calc(100% - var(--v2-grid-inset)); box-sizing:border-box; margin:8px 0 0 var(--v2-grid-inset); }.v2-faq__action { inline-size:100%; box-sizing:border-box; margin:0; }.v2-faq > .v2-faq__grid > .v2-faq__list { margin-top:72px!important; } }
@media (max-width:560px) { .v2-faq { padding:126px 20px 72px; }.v2-faq h2 { font-size:30px; }.v2-faq__description { margin-top:18px; font-size:16px; }.v2-faq__actions { margin-top:8px!important; }.v2-faq__action { min-height:78px; padding:13px 14px; }.v2-faq__action-icon { width:42px; height:42px; border-radius:12px; }.v2-faq__action strong { font-size:14px; }.v2-faq__action small { font-size:12px; }.v2-faq > .v2-faq__grid > .v2-faq__list { margin-top:72px!important; }.v2-faq__item { margin-bottom:10px; border-radius:15px; }.v2-faq__trigger { gap:12px; padding:15px 16px; font-size:.94rem; }.v2-faq__question { gap:10px; }.v2-faq__question i { width:38px; height:38px; border-radius:12px; }.v2-faq__answer p { padding-right:18px; padding-left:64px; font-size:.87rem; }.v2-faq__item.is-open .v2-faq__answer p { padding-bottom:21px; } }
@media (max-width:1000px) { .v2-faq h2 { font-size:32px; } }
@media (max-width:380px) { .v2-faq h2 { font-size:30px; } }
@media (prefers-reduced-motion:reduce) { .v2-faq__action,.v2-faq__trigger>svg,.v2-faq__answer,.v2-faq__answer p { transition:none; } }
</style>
