<script setup lang="ts">
import { ArrowRight, CircleUserRound, HelpCircle, ScanLine, ShoppingBag, CarFront } from '@lucide/vue';
import LandingV2Closing from './LandingV2Closing.vue';
import LandingV2Faq from './LandingV2Faq.vue';

const steps = [
    { title: 'Crie sua conta', description: 'Entre na plataforma para iniciar seu cadastro.', icon: CircleUserRound },
    { title: 'Cadastre seu veículo', description: 'Inclua as informações do veículo que receberá a etiqueta.', icon: CarFront },
    { title: 'Escolha sua etiqueta', description: 'Selecione a cor adequada ao perfil de uso.', icon: ScanLine },
    { title: 'Receba e aplique', description: 'Receba em casa ou retire no ponto de coleta e aplique no vidro.', icon: ShoppingBag }
];
const pricing = ref<HTMLElement | null>(null);
let pricingAnimation: { kill: () => void } | undefined;

onMounted(async () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    await waitForLandingV2Ready();
    const { gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);
    if (!pricing.value) return;
    const heading = pricing.value.querySelector<HTMLElement>('.v2-pricing__heading');
    const card = pricing.value.querySelector<HTMLElement>('.v2-pricing__card');
    const footnote = pricing.value.querySelector<HTMLElement>('.v2-pricing__footnote');
    const summary = pricing.value.querySelector<HTMLElement>('.v2-pricing__summary');
    const benefits = pricing.value.querySelectorAll<HTMLElement>('.v2-pricing__list li');
    const tags = pricing.value.querySelectorAll<HTMLElement>('.v2-pricing__tags figure');
    pricingAnimation = gsap.timeline({
        scrollTrigger: { trigger: pricing.value, start: 'top 80%', once: true }
    })
        .from(heading, { y: 46, autoAlpha: 0, duration: .76, ease: 'power3.out' })
        .from(card, { y: 62, autoAlpha: 0, scale: .96, rotateX: 2, transformPerspective: 900, duration: .86, ease: 'power3.out' }, '-=.34')
        .from(summary, { x: -30, autoAlpha: 0, duration: .54, ease: 'power3.out' }, '-=.46')
        .from(benefits, { x: 34, autoAlpha: 0, duration: .44, stagger: .075, ease: 'power3.out' }, '-=.48')
        .from(tags, { y: 18, autoAlpha: 0, scale: .84, duration: .36, stagger: .055, ease: 'back.out(1.6)' }, '-=.38')
        .from(footnote, { y: 16, autoAlpha: 0, duration: .42, ease: 'power2.out' }, '-=.26');
});

onBeforeUnmount(() => pricingAnimation?.kill());
</script>

<template>
    <section v-if="false" id="como-funciona" class="v2-how" aria-labelledby="v2-how-title"><header><p class="v2-pill">Comece em poucos passos</p><h2 id="v2-how-title">Da escolha ao vidro.</h2></header><div class="v2-how__road"><article v-for="(step,index) in steps" :key="step.title"><span>{{ String(index + 1).padStart(2, '0') }}</span><component :is="step.icon" :size="28" /><h3>{{ step.title }}</h3><p>{{ step.description }}</p></article></div></section>
    <section id="preco" ref="pricing" class="v2-pricing" aria-labelledby="v2-price-title">
        <div class="v2-pricing__inner">
            <header class="v2-pricing__heading">
                <p class="v2-pill">{ SEGURANÇA E IDENTIFICAÇÃO PARA CADA TRAJETO }</p>
                <h2 id="v2-price-title">Preço único, simples e <span class="heading-highlight">acessível</span></h2>
                <p>Etiquetas refletivas para mais segurança em cada trajeto.</p>
            </header>
            <article class="v2-pricing__card">
                <div class="v2-pricing__summary">
                    <span class="v2-pricing__label">Combo Identifica Trânsito</span>
                    <div class="v2-pricing__value"><small>R$</small><strong>29,90</strong></div>
                    <p class="v2-pricing__meta">Pagamento único, sem recorrência.</p>
                    <NuxtLink to="/auth/register" class="v2-pricing__cta">Criar minha conta <ArrowRight :size="18" /></NuxtLink>
                </div>
                <ul class="v2-pricing__list">
                    <li><span class="v2-pricing__benefit-icon"><ShoppingBag :size="14" /></span><span>Kit com etiquetas refletivas</span></li>
                    <li><span class="v2-pricing__benefit-icon"><CircleUserRound :size="14" /></span><span>Cadastro na plataforma</span></li>
                    <li><span class="v2-pricing__benefit-icon"><CarFront :size="14" /></span><span>Etiquetas para todos os veículos da sua casa ou frota</span></li>
                    <li><span class="v2-pricing__benefit-icon"><HelpCircle :size="14" /></span><span>Suporte via e-mail e WhatsApp</span></li>
                </ul>
                <div class="v2-pricing__tags"><span>Etiquetas disponíveis:</span><div><figure v-for="tag in ['vermelho','azul','amarelo','branco','verde']" :key="tag"><img :src="`/landing-v2/images/pricing/${tag}.svg`" :alt="`Etiqueta ${tag}`" loading="lazy" width="61" height="61"></figure></div></div>
            </article>
            <p class="v2-pricing__footnote"><span aria-hidden="true">!</span> Permitida a compra de 1 kit de etiqueta por veículo.</p>
        </div>
    </section>
    <LandingV2Faq />
    <LandingV2Closing />
</template>

<style scoped>
.v2-how,.v2-faq { padding:clamp(120px,15vw,200px) clamp(24px,8vw,130px); background:#f4f8ff; color:#101114; font-family:'Instrument Sans',Arial,sans-serif; }.v2-pill { display:inline-flex; margin:0 0 21px; padding:8px 12px; border:1px solid rgba(20,93,245,.2); border-radius:999px; background:#fff; color:#0b42a8; font-size:11px; font-weight:750; letter-spacing:.12em; text-transform:uppercase; }.v2-how header,.v2-faq header { max-width:1250px; margin:auto; }.v2-how h2,.v2-pricing h2,.v2-faq h2,.v2-final h2 { margin:0; font-size:clamp(47px,5.5vw,80px); font-weight:700; letter-spacing:-.065em; line-height:.97; }.v2-how__road { position:relative; display:grid; grid-template-columns:repeat(4,1fr); gap:clamp(20px,4vw,60px); max-width:1250px; margin:clamp(65px,8vw,105px) auto 0; }.v2-how__road:before { content:''; position:absolute; top:38px; left:5%; right:5%; height:3px; border-radius:3px; background:linear-gradient(90deg,#145df5,#7fb0ff); }.v2-how__road article { position:relative; z-index:1; }.v2-how__road span { display:grid; place-items:center; width:77px; height:77px; border:10px solid #f4f8ff; border-radius:50%; background:#145df5; color:#fff; font-size:15px; font-weight:750; }.v2-how__road svg { display:block; margin-top:29px; color:#145df5; }.v2-how__road h3 { margin:14px 0 7px; font-size:23px; letter-spacing:-.04em; }.v2-how__road p { max-width:190px; margin:0; color:#687282; font-size:14px; line-height:1.5; }
.v2-pricing { display:grid; grid-template-columns:1fr 1fr; min-height:820px; background:#061333; color:#fff; font-family:'Instrument Sans',Arial,sans-serif; }.v2-pricing__art { position:relative; display:grid; place-items:center; overflow:hidden; min-height:480px; background:radial-gradient(circle at 35% 25%,#356ddd,transparent 38%),linear-gradient(145deg,#0d347e,#061333 74%); }.v2-pricing__art:before { content:''; position:absolute; width:71%; aspect-ratio:1; border:1px solid rgba(255,255,255,.18); border-radius:50%; }.v2-pricing__art>span { position:absolute; left:12%; top:13%; color:#a8c5ff; font-size:11px; font-weight:750; letter-spacing:.12em; text-transform:uppercase; }.v2-pricing__art :deep(.tag-art){position:relative;z-index:2;width:min(54%,340px)}.v2-pricing__art :deep(.tag-art:last-child){position:absolute;right:12%;bottom:16%;width:20%;z-index:3}.v2-pricing__copy { max-width:590px; padding:clamp(90px,12vw,175px) clamp(25px,7vw,110px); }.v2-pricing .v2-pill { border-color:rgba(255,255,255,.2); background:rgba(255,255,255,.1); color:#dbe8ff; }.v2-pricing__copy>p:not(.v2-pill) { max-width:460px; margin:27px 0 0; color:#c9d8f2; font-size:18px; line-height:1.55; }.v2-pricing__value { display:flex; align-items:baseline; gap:7px; margin-top:34px; }.v2-pricing__value span { font-size:20px; font-weight:700; }.v2-pricing__value strong { font-size:clamp(59px,6vw,82px); letter-spacing:-.075em; line-height:.8; }.v2-pricing__value small { margin-left:7px; color:#aebddb; font-size:11px; line-height:1.35; }.v2-pricing ul { display:grid; gap:9px; margin:29px 0; padding:0; list-style:none; color:#dbe6fa; font-size:14px; }.v2-pricing li { display:flex; align-items:center; gap:8px; }.v2-pricing li svg{color:#8bb2ff}.v2-pricing__copy>a,.v2-final__copy a:first-child { display:inline-flex; align-items:center; gap:10px; padding:15px 19px; border-radius:999px; background:#fff; color:#061333; font-size:14px; font-weight:750; text-decoration:none; transition:transform .2s; }.v2-pricing__copy>a:hover,.v2-final__copy a:hover{transform:translateY(-2px)}
.v2-faq { display:grid; grid-template-columns:.8fr 1.2fr; gap:9vw; background:#fafaf7; }.v2-faq__list { border-top:1px solid #d7dce2; }.v2-faq__list article { border-bottom:1px solid #d7dce2; }.v2-faq__list button { display:flex; width:100%; justify-content:space-between; gap:15px; padding:22px 0; border:0; background:none; color:#17213a; font:650 clamp(16px,1.65vw,20px)/1.3 'Instrument Sans',Arial,sans-serif; text-align:left; cursor:pointer; }.v2-faq__list i { font-size:25px; font-style:normal; font-weight:400; transition:transform .25s; }.v2-faq__list .is-open i { transform:rotate(45deg); }.v2-faq__list div { padding:0 45px 21px 0; }.v2-faq__list p { max-width:560px; margin:0; color:#687282; font-size:15px; line-height:1.55; }
.v2-final { position:relative; display:grid; min-height:720px; place-items:center; padding:100px 24px; overflow:hidden; background:#061333; color:#fff; font-family:'Instrument Sans',Arial,sans-serif; text-align:center; }.v2-final :deep(.landing-v2-video) { position:absolute; inset:0; }.v2-final__veil { position:absolute; inset:0; background:linear-gradient(rgba(5,16,44,.48),rgba(5,16,44,.78)); }.v2-final__copy { position:relative; z-index:1; }.v2-final .v2-pill{border-color:rgba(255,255,255,.25);background:rgba(255,255,255,.1);color:#e4edff}.v2-final h2 { font-size:clamp(56px,7vw,105px); }.v2-final__copy>p:not(.v2-pill) { max-width:460px; margin:27px auto 0; color:#d5e0f5; font-size:18px; line-height:1.5; }.v2-final__copy>div { display:flex; justify-content:center; gap:16px; margin-top:31px; }.v2-final__copy a:last-child { display:inline-flex; align-items:center; gap:8px; color:#fff; font-size:14px; font-weight:700; text-decoration:none; }.v2-footer { display:grid; grid-template-columns:1.1fr .8fr 1.2fr auto; align-items:center; gap:30px; padding:34px clamp(24px,5vw,76px); background:#061333; color:#cad8f1; font-family:'Instrument Sans',Arial,sans-serif; }.v2-footer img { width:166px; filter:brightness(0) invert(1); }.v2-footer p,.v2-footer small { margin:0; font-size:12px; line-height:1.4; }.v2-footer nav { display:flex; flex-wrap:wrap; gap:14px; }.v2-footer a { display:flex; align-items:center; gap:4px; color:#cad8f1; font-size:12px; text-decoration:none; }
@media(max-width:850px){.v2-how__road{grid-template-columns:repeat(2,1fr);row-gap:42px}.v2-how__road:before{display:none}.v2-pricing,.v2-faq{grid-template-columns:1fr}.v2-pricing__copy{max-width:none;padding:90px 10vw}.v2-faq{gap:55px}.v2-footer{grid-template-columns:1fr 1fr}}@media(max-width:560px){.v2-how,.v2-faq{padding-left:20px;padding-right:20px}.v2-how h2,.v2-pricing h2,.v2-faq h2{font-size:49px}.v2-how__road{grid-template-columns:1fr;gap:21px;margin-top:50px}.v2-how__road article{display:grid;grid-template-columns:65px 1fr;column-gap:15px}.v2-how__road span{width:58px;height:58px;border-width:7px;grid-row:span 3}.v2-how__road svg{margin:4px 0 0}.v2-how__road h3{margin:12px 0 4px}.v2-how__road p{grid-column:2}.v2-pricing__copy{padding:75px 20px}.v2-pricing__art{min-height:390px}.v2-faq__list div{padding-right:0}.v2-final{min-height:650px}.v2-final__copy>div{flex-direction:column;align-items:center}.v2-footer{grid-template-columns:1fr;padding:34px 20px;gap:18px}}
/* Pricing ported from the official landing, with V2 typography and tokens. */
.v2-pricing{position:relative;display:block;overflow:hidden;min-height:0;background:linear-gradient(140deg,#040714 0%,#0d1693 100%);color:#fff}.v2-pricing::before{content:'';position:absolute;inset:0;background:url('/images/lp/bg-preco.webp') center/cover no-repeat;opacity:.12}.v2-pricing::after{content:'';position:absolute;right:0;bottom:0;width:min(38vw,600px);height:100%;background:url('/images/lp/textura-colmeia.webp') center/180% no-repeat;opacity:.12;transform:rotate(40deg);pointer-events:none}.v2-pricing__inner{position:relative;z-index:1;width:min(100%,1240px);margin:0 auto}.v2-pricing__heading{max-width:760px;margin:0 auto clamp(42px,6vw,76px);text-align:center}.v2-pricing__heading .v2-pill{border-color:rgba(255,255,255,.24);background:rgba(255,255,255,.1);color:#dbe8ff}.v2-pricing__heading h2{margin:0;color:#2f75ff;font-size:clamp(44px,5.4vw,78px);font-weight:600;letter-spacing:-.025em;line-height:.98}.v2-pricing__heading>p:last-child{max-width:560px;margin:24px auto 0;color:#c9d8f2;font-size:18px;line-height:1.5}.v2-pricing__card{display:grid;grid-template-columns:minmax(16rem,23rem) minmax(0,1fr);align-items:center;gap:24px;padding:32px;border:1px solid rgba(255,255,255,.15);border-radius:28px;background:rgba(8,15,78,.34);box-shadow:0 24px 54px rgba(4,8,28,.32);backdrop-filter:blur(16px)}.v2-pricing__summary{display:grid;gap:16px}.v2-pricing__label{width:max-content;padding:8px 14px;border-radius:999px;background:rgba(255,255,255,.14);font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}.v2-pricing__value{display:flex;align-items:flex-end;gap:5px}.v2-pricing__value small{margin-bottom:12px;font-size:16px}.v2-pricing__value strong{color:#2f75ff;font-size:clamp(52px,7vw,76px);font-weight:600;letter-spacing:-.06em;line-height:1}.v2-pricing__meta{margin:0;color:rgba(255,255,255,.78);font-size:15px}.v2-pricing__notice{display:inline-flex;width:max-content;align-items:center;gap:8px;margin:0;padding:8px 13px;border:1px solid rgba(245,158,11,.35);border-radius:999px;background:rgba(245,158,11,.14);color:#fbbf24;font-size:12px;font-weight:600}.v2-pricing__notice>span:first-child{display:grid;width:17px;height:17px;place-items:center;border:1px solid currentColor;border-radius:50%;font-size:11px}.v2-pricing__cta{display:inline-flex;width:max-content;align-items:center;gap:10px;min-height:50px;padding:0 18px;border-radius:.7rem;background:#fff;color:#061333;font-size:14px;font-weight:750;text-decoration:none;transition:transform .2s,background .2s}.v2-pricing__cta:hover{background:#eaf2ff;transform:translateY(-2px)}.v2-pricing__list{display:grid;gap:10px;margin:0;padding:0;list-style:none;color:#dbe6fa;font-size:14px;line-height:1.45}.v2-pricing__list li{display:flex;align-items:flex-start;gap:9px;padding:13px 14px;border-radius:10px;background:rgba(255,255,255,.08)}.v2-pricing__list svg{flex:none;margin-top:2px;color:#8bb2ff}.v2-pricing__tags{grid-column:1/-1;display:grid;justify-items:center;gap:12px;padding-top:18px;border-top:1px solid rgba(255,255,255,.14);color:rgba(255,255,255,.78);font-size:13px;font-weight:700}.v2-pricing__tags>div{display:flex;flex-wrap:nowrap;justify-content:center;gap:10px}.v2-pricing__tags figure{display:grid;width:72px;height:72px;margin:0;place-items:center;border:1px solid rgba(255,255,255,.16);border-radius:16px;background:rgba(255,255,255,.08)}.v2-pricing__tags img{display:block;width:61px;height:61px;object-fit:contain}
.v2-pricing::before { background-image: url('/landing-v2/images/pricing/bg-preco.webp'); }
.v2-pricing::after { background-image: url('/landing-v2/images/pricing/textura-colmeia.webp'); }
@media(max-width:850px){.v2-pricing__card{grid-template-columns:1fr}.v2-pricing__list{order:2}.v2-pricing__tags{order:3}.v2-pricing__summary{max-width:30rem}.v2-pricing__tags{grid-column:auto}}
@media(max-width:560px){.v2-pricing__heading h2{font-size:clamp(36px,10vw,49px)}.v2-pricing__heading>p:last-child{font-size:16px}.v2-pricing__card{padding:20px;border-radius:22px}.v2-pricing__value strong{font-size:58px}.v2-pricing__list{font-size:13px}.v2-pricing__tags>div{gap:5px}.v2-pricing__tags figure{width:56px;height:56px;border-radius:12px}.v2-pricing__tags img{width:47px;height:47px}}
.v2-pricing{background:linear-gradient(140deg,#040714 0%,#0d1693 100%)!important}.v2-pricing__inner{width:min(100%,1040px)!important}.v2-pricing__heading{max-width:920px!important;margin-bottom:38px!important}.v2-pricing__heading .v2-pill{display:block!important;width:auto!important;margin:0 0 22px!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;color:#dbe8ff!important;font-size:11px!important;font-weight:600!important;letter-spacing:.12em!important;line-height:1.2!important}.v2-pricing__heading h2{color:#fff!important;font-size:clamp(42px,4.5vw,64px)!important;font-weight:600!important;letter-spacing:-.025em!important;line-height:.98!important}.v2-pricing__heading>p:last-child{max-width:590px!important;margin:22px auto 0!important;color:#d5e0f5!important;font-size:16px!important;line-height:1.45!important}.v2-pricing__card{grid-template-columns:minmax(250px,.9fr) minmax(0,1.35fr)!important;width:min(100%,840px)!important;margin:0 auto!important;gap:0!important;padding:25px 25px 0!important;border-radius:22px!important;background:rgba(3,8,32,.55)!important;box-shadow:0 18px 45px rgba(2,7,27,.28)!important}.v2-pricing__summary{padding:0 28px 24px 0;border-right:1px solid rgba(255,255,255,.18)}.v2-pricing__label{padding:7px 12px!important;font-size:10px!important}.v2-pricing__value strong{font-size:clamp(48px,5vw,66px)!important;font-weight:600!important}.v2-pricing__meta{font-size:13px!important}.v2-pricing__cta{min-height:44px!important;padding:0 17px!important;font-size:13px!important}.v2-pricing__list{padding:0 0 24px 22px!important;gap:7px!important;font-size:12px!important}.v2-pricing__list li{align-items:center!important;padding:10px 11px!important;border:1px solid rgba(255,255,255,.16)!important;border-radius:9px!important;background:rgba(255,255,255,.04)!important}.v2-pricing__list svg{color:#9dbfff!important}.v2-pricing__tags{grid-column:1/-1!important;grid-row:2!important;padding:16px 0 19px!important;gap:9px!important}.v2-pricing__tags>div{gap:9px!important}.v2-pricing__tags figure{width:58px!important;height:58px!important;border-radius:12px!important;background:rgba(255,255,255,.05)!important}.v2-pricing__tags img{width:49px!important;height:49px!important}.v2-pricing__footnote{position:relative;z-index:1;width:max-content;max-width:100%;margin:10px auto 0;color:rgba(219,232,255,.7);font-size:10px;line-height:1.4;text-align:center}.v2-pricing__footnote span{display:inline-grid;width:14px;height:14px;place-items:center;border:1px solid currentColor;border-radius:50%;color:#fbbf24;font-size:9px}
@media(max-width:850px){.v2-pricing__card{grid-template-columns:1fr!important;padding:22px 22px 0!important}.v2-pricing__summary{padding:0 0 22px;border-right:0;border-bottom:1px solid rgba(255,255,255,.18)}.v2-pricing__list{padding:22px 0!important}.v2-pricing__tags{grid-row:auto!important}}
@media(max-width:560px){.v2-pricing__heading .v2-pill{font-size:10px!important}.v2-pricing__heading h2{font-size:clamp(34px,9vw,44px)!important}.v2-pricing__heading>p:last-child{font-size:15px!important}.v2-pricing__card{padding:18px 18px 0!important}.v2-pricing__list li{font-size:12px!important}.v2-pricing__tags figure{width:52px!important;height:52px!important}.v2-pricing__tags img{width:44px!important;height:44px!important}}
.v2-pricing__benefit-icon{display:grid;flex:0 0 26px;width:26px;height:26px;place-items:center;border:1px solid rgba(205,221,255,.28);border-radius:50%;color:#c9d8f2!important;background:rgba(255,255,255,.04)}.v2-pricing__list li>span:last-child{display:block;padding-top:3px}
@media(min-width:1601px){.v2-pricing__heading h2{font-size:56px!important;font-weight:600!important;letter-spacing:-.025em!important;line-height:.98!important}}
@media(min-width:1441px) and (max-width:1600px){.v2-pricing__heading h2{font-size:52px!important;font-weight:600!important;letter-spacing:-.025em!important;line-height:.98!important}}
@media(min-width:1200px) and (max-width:1440px){.v2-pricing__heading h2{font-size:48px!important;font-weight:600!important;letter-spacing:-.025em!important;line-height:.98!important}}
@media(min-width:1001px) and (max-width:1199px){.v2-pricing__heading h2{font-size:44px!important;font-weight:600!important;letter-spacing:-.025em!important;line-height:.98!important}}
@media(max-width:1000px){.v2-pricing__heading h2{font-size:32px!important;font-weight:600!important;letter-spacing:-.025em!important;line-height:1.04!important}}
@media(max-width:390px){.v2-pricing__heading h2{font-size:30px!important}}
.v2-pricing,.v2-pricing *{text-shadow:none!important}
.v2-pricing{padding-top:clamp(88px,10vw,132px)!important;padding-bottom:clamp(88px,10vw,132px)!important}
.v2-pricing__list{border-left:1px solid rgba(255,255,255,.18);padding-left:22px!important}
.v2-pricing__list li{position:relative;border:0!important;border-bottom:1px solid rgba(255,255,255,.16)!important;border-radius:0!important;background:transparent!important;padding:12px 0!important}
.v2-pricing__list li:last-child{border-bottom:0!important}
.v2-pricing__list li::after{content:'';position:absolute;right:0;bottom:-1px;left:0;height:1px;background:linear-gradient(90deg,rgba(255,255,255,.18),transparent)}
.v2-pricing__list li:last-child::after{display:none}
.v2-pricing__summary{border-right:1px solid rgba(255,255,255,.2)!important}
.v2-pricing__tags{border-top:1px solid rgba(255,255,255,.2)!important}
@media(max-width:850px){.v2-pricing{padding-top:78px!important;padding-bottom:88px!important}.v2-pricing__list{border-left:0;border-top:1px solid rgba(255,255,255,.2);padding-left:0!important}.v2-pricing__summary{border-right:0!important;border-bottom:1px solid rgba(255,255,255,.2)!important}.v2-pricing__list li{padding:12px 0!important}}
@media(max-width:560px){.v2-pricing{padding-top:62px!important;padding-bottom:72px!important}}
.v2-pricing__inner{width:min(100%,1600px)!important}
.v2-pricing__heading{max-width:900px!important;margin-bottom:56px!important}
.v2-pricing__card{grid-template-columns:minmax(420px,.82fr) minmax(0,1.18fr)!important;width:100%!important;padding:40px 48px 34px!important;border-radius:38px!important}
.v2-pricing__summary{padding:14px 52px 28px 96px!important}
.v2-pricing__label{font-size:16px!important;padding:11px 20px!important}
.v2-pricing__value{margin-top:22px!important}
.v2-pricing__value small{margin-bottom:20px!important;font-size:22px!important}
.v2-pricing__value strong{font-size:clamp(84px,7vw,128px)!important}
.v2-pricing__meta{font-size:22px!important}
.v2-pricing__cta{min-height:84px!important;padding:0 36px!important;font-size:25px!important}
.v2-pricing__list{border-left:1px solid rgba(255,255,255,.2)!important;padding:0 0 0 76px!important;gap:12px!important;font-size:22px!important}
.v2-pricing__list li{min-height:92px!important;box-sizing:border-box;align-items:center!important;padding:20px 26px!important;border:2px solid rgba(190,207,240,.22)!important;border-radius:16px!important;background:#111a2d!important}
.v2-pricing__list li::after{display:none!important}
.v2-pricing__benefit-icon{flex-basis:52px!important;width:52px!important;height:52px!important;border:2px solid rgba(205,221,255,.28)!important}
.v2-pricing__benefit-icon svg{width:25px;height:25px}
.v2-pricing__list li>span:last-child{padding-top:0!important}
.v2-pricing__tags{position:relative;grid-column:1/-1!important;margin-top:0;padding:52px 0 0!important;border-top:1px solid rgba(255,255,255,.22)!important}
.v2-pricing__tags>span{position:absolute;top:0;left:50%;padding:0 22px;background:#080d28;color:#e7edf9;font-size:20px;line-height:1;transform:translate(-50%,-50%);white-space:nowrap}
.v2-pricing__tags>div{gap:30px!important}
.v2-pricing__tags figure{width:120px!important;height:120px!important;border-radius:16px!important}
.v2-pricing__tags img{width:104px!important;height:104px!important}
.v2-pricing__footnote{font-size:13px!important}
@media(max-width:1100px){.v2-pricing__card{grid-template-columns:minmax(300px,.85fr) minmax(0,1.15fr)!important;padding:30px!important}.v2-pricing__summary{padding-left:20px!important;padding-right:30px!important}.v2-pricing__list{padding-left:30px!important;font-size:16px!important}.v2-pricing__list li{min-height:72px!important}.v2-pricing__benefit-icon{flex-basis:38px!important;width:38px!important;height:38px!important}.v2-pricing__tags figure{width:82px!important;height:82px!important}.v2-pricing__tags img{width:70px!important;height:70px!important}}
@media(max-width:850px){.v2-pricing__card{grid-template-columns:1fr!important;padding:24px 22px 0!important;border-radius:28px!important}.v2-pricing__summary{padding:0 0 26px!important;border-right:0!important}.v2-pricing__list{border-left:0!important;border-top:1px solid rgba(255,255,255,.2);padding:26px 0!important}.v2-pricing__list li{min-height:64px!important}.v2-pricing__tags{padding-top:42px!important}.v2-pricing__tags figure{width:66px!important;height:66px!important}.v2-pricing__tags img{width:56px!important;height:56px!important}}
@media(max-width:560px){.v2-pricing__heading{margin-bottom:36px!important}.v2-pricing__card{padding:20px 18px 0!important}.v2-pricing__label{font-size:11px!important}.v2-pricing__value strong{font-size:64px!important}.v2-pricing__meta{font-size:15px!important}.v2-pricing__cta{min-height:52px!important;font-size:16px!important}.v2-pricing__list{font-size:14px!important}.v2-pricing__list li{min-height:58px!important;padding:12px!important}.v2-pricing__benefit-icon{flex-basis:32px!important;width:32px!important;height:32px!important}.v2-pricing__benefit-icon svg{width:16px;height:16px}.v2-pricing__tags>span{font-size:14px!important}.v2-pricing__tags>div{gap:7px!important}.v2-pricing__tags figure{width:54px!important;height:54px!important}.v2-pricing__tags img{width:45px!important;height:45px!important}}
.v2-pricing__card{grid-template-columns:minmax(320px,.82fr) minmax(0,1.18fr)!important;padding:28px 32px 24px!important;border-radius:28px!important}.v2-pricing__summary{padding:10px 36px 22px 50px!important}.v2-pricing__label{font-size:12px!important;padding:8px 14px!important}.v2-pricing__value{margin-top:14px!important}.v2-pricing__value small{margin-bottom:12px!important;font-size:16px!important}.v2-pricing__value strong{font-size:clamp(62px,5.2vw,84px)!important}.v2-pricing__meta{font-size:16px!important}.v2-pricing__cta{min-height:54px!important;padding:0 22px!important;font-size:16px!important}.v2-pricing__list{padding-left:36px!important;gap:8px!important;font-size:16px!important}.v2-pricing__list li{min-height:68px!important;padding:14px 18px!important;border-width:1px!important;border-radius:12px!important}.v2-pricing__benefit-icon{flex-basis:36px!important;width:36px!important;height:36px!important;border-width:1px!important}.v2-pricing__benefit-icon svg{width:18px;height:18px}.v2-pricing__tags{padding-top:38px!important}.v2-pricing__tags>span{font-size:15px!important;padding:0 16px!important}.v2-pricing__tags>div{gap:16px!important}.v2-pricing__tags figure{width:76px!important;height:76px!important;border-radius:12px!important}.v2-pricing__tags img{width:64px!important;height:64px!important}.v2-pricing__footnote{font-size:11px!important}
@media(max-width:1100px){.v2-pricing__card{padding:26px 28px 22px!important}.v2-pricing__summary{padding-left:24px!important;padding-right:26px!important}.v2-pricing__list{padding-left:26px!important;font-size:15px!important}.v2-pricing__list li{min-height:60px!important}.v2-pricing__value strong{font-size:70px!important}.v2-pricing__tags figure{width:68px!important;height:68px!important}.v2-pricing__tags img{width:57px!important;height:57px!important}}
@media(max-width:850px){.v2-pricing__card{padding:22px 20px 0!important;border-radius:24px!important}.v2-pricing__summary{padding:0 0 22px!important}.v2-pricing__list{padding:22px 0!important}.v2-pricing__tags{padding-top:34px!important}}
@media(max-width:560px){.v2-pricing__card{padding:18px 16px 0!important}.v2-pricing__label{font-size:11px!important}.v2-pricing__value strong{font-size:58px!important}.v2-pricing__meta{font-size:15px!important}.v2-pricing__cta{min-height:50px!important;font-size:15px!important}.v2-pricing__list{font-size:13px!important}.v2-pricing__list li{min-height:54px!important;padding:10px!important}.v2-pricing__benefit-icon{flex-basis:30px!important;width:30px!important;height:30px!important}.v2-pricing__benefit-icon svg{width:15px;height:15px}.v2-pricing__tags figure{width:54px!important;height:54px!important}.v2-pricing__tags img{width:45px!important;height:45px!important}}
.v2-pricing__inner{width:min(100%,1440px)!important}
.v2-pricing__card{width:100%!important}
.v2-pricing__summary{justify-items:center!important;padding:8px 24px 20px!important;text-align:center!important}
.v2-pricing__label{font-size:11px!important;padding:7px 13px!important}
.v2-pricing__value{justify-content:center!important;margin-top:8px!important}
.v2-pricing__value small{margin-bottom:10px!important;font-size:14px!important}
.v2-pricing__value strong{font-size:clamp(56px,4.6vw,72px)!important}
.v2-pricing__meta{font-size:14px!important}
.v2-pricing__cta{min-height:48px!important;padding:0 20px!important;font-size:15px!important}
@media(max-width:1100px){.v2-pricing__inner{width:min(100%,960px)!important}.v2-pricing__value strong{font-size:64px!important}}
@media(max-width:850px){.v2-pricing__summary{padding:0 0 22px!important}.v2-pricing__value strong{font-size:62px!important}}
@media(max-width:560px){.v2-pricing__value strong{font-size:56px!important}.v2-pricing__meta{font-size:14px!important}.v2-pricing__cta{min-height:48px!important;font-size:14px!important}}
.v2-pricing__card{position:relative;grid-template-columns:minmax(390px,1fr) minmax(0,1.18fr)!important}
.v2-pricing__card::before{content:'';position:absolute;top:9%;bottom:9%;left:42%;width:1px;background:linear-gradient(180deg,transparent 0%,rgba(190,207,240,.38) 16%,rgba(190,207,240,.38) 84%,transparent 100%);pointer-events:none}
.v2-pricing__summary{border-right:0!important;padding-right:54px!important}
.v2-pricing__list{border-left:0!important;padding-left:54px!important;gap:8px!important}
.v2-pricing__list li{min-height:58px!important;padding:11px 16px!important;border-radius:11px!important;font-size:15px!important}
.v2-pricing__benefit-icon{flex-basis:32px!important;width:32px!important;height:32px!important}
.v2-pricing__benefit-icon svg{width:16px;height:16px}
.v2-pricing__footnote{display:flex;align-items:center;justify-content:center;gap:7px;margin:16px auto 0!important;padding:7px 13px;border:1px solid rgba(255,193,7,.2);border-radius:999px;background:rgba(255,193,7,.06);color:rgba(219,232,255,.72)!important;font-size:11px!important}
.v2-pricing__footnote span{width:16px!important;height:16px!important;color:#f5b72e!important;font-size:10px!important}
@media(max-width:1100px){.v2-pricing__card{grid-template-columns:minmax(330px,1fr) minmax(0,1.12fr)!important}.v2-pricing__card::before{left:43%}.v2-pricing__summary{padding-right:34px!important}.v2-pricing__list{padding-left:34px!important}}
@media(max-width:850px){.v2-pricing__card{grid-template-columns:1fr!important}.v2-pricing__card::before{display:none}.v2-pricing__summary{padding-right:0!important}.v2-pricing__list{padding-left:0!important;border-top:1px solid rgba(255,255,255,.2)!important}}
.v2-pricing__card{grid-template-columns:minmax(460px,1fr) minmax(0,1.12fr)!important}
.v2-pricing__card::before{top:9%;bottom:auto;height:58%;left:44%!important}
.v2-pricing__tags{background:#050A33!important}
.v2-pricing__tags>span{background:#050A33!important}
.v2-pricing__summary{padding-left:34px!important;padding-right:48px!important}
.v2-pricing__value strong{font-size:clamp(64px,5vw,78px)!important}
.v2-pricing__meta{font-size:16px!important}
.v2-pricing__cta{min-height:56px!important;font-size:16px!important}
@media(max-width:1100px){.v2-pricing__card{grid-template-columns:minmax(370px,1fr) minmax(0,1.1fr)!important}.v2-pricing__card::before{left:45%!important}.v2-pricing__summary{padding-left:20px!important;padding-right:32px!important}}
@media(max-width:850px){.v2-pricing__card{grid-template-columns:1fr!important}.v2-pricing__card::before{display:none}.v2-pricing__summary{padding-left:0!important;padding-right:0!important}.v2-pricing__tags{background:#050A33!important}}
.v2-pricing__summary{justify-self:center!important;width:min(100%,390px)!important;padding-left:0!important;padding-right:0!important}
.v2-pricing__list{justify-self:center!important;width:min(100%,760px)!important;padding-left:0!important}
.v2-pricing__tags>span{font-size:12px!important;font-weight:650!important}
.v2-pricing__tags{text-align:center!important}
@media(max-width:850px){.v2-pricing__summary,.v2-pricing__list{width:100%!important}.v2-pricing__list{padding-left:0!important}}
.v2-pricing__card{overflow:hidden!important}
.v2-pricing__tags{padding-bottom:42px!important;border-radius:0 0 27px 27px!important}
@media(max-width:850px){.v2-pricing__tags{padding-bottom:32px!important;border-radius:0 0 23px 23px!important}}
.v2-pricing__card{grid-template-columns:minmax(500px,1.05fr) minmax(0,1fr)!important}.v2-pricing__card::before{left:46%!important}.v2-pricing__list{width:min(100%,680px)!important;justify-self:center!important;padding-left:24px!important;gap:6px!important}.v2-pricing__list li{min-height:52px!important;padding:9px 14px!important;font-size:14px!important}.v2-pricing__benefit-icon{flex-basis:30px!important;width:30px!important;height:30px!important}.v2-pricing__benefit-icon svg{width:15px;height:15px}.v2-pricing__cta{min-height:46px!important;padding:0 18px!important;font-size:14px!important}
@media(max-width:1100px){.v2-pricing__card{grid-template-columns:minmax(400px,1.02fr) minmax(0,1fr)!important}.v2-pricing__card::before{left:47%!important}.v2-pricing__list{width:min(100%,600px)!important;padding-left:20px!important}}
@media(max-width:850px){.v2-pricing__card{grid-template-columns:1fr!important}.v2-pricing__card::before{display:none}.v2-pricing__list{width:100%!important;padding-left:0!important}.v2-pricing__cta{min-height:48px!important}}
.v2-pricing__card{background:#050A33!important}
.v2-pricing__tags{background:#050A33!important;padding-bottom:24px!important}
.v2-pricing__card::before{top:11%!important;height:45%!important;bottom:auto!important}
@media(max-width:850px){.v2-pricing__tags{padding-bottom:24px!important}.v2-pricing__card::before{display:none!important}}
.v2-pricing__card{grid-template-columns:46% 54%!important;padding-left:24px!important;padding-right:24px!important}
.v2-pricing__card::before{left:46%!important}
.v2-pricing__summary{width:360px!important;max-width:100%;padding-left:0!important;padding-right:24px!important}
.v2-pricing__list{width:620px!important;max-width:100%;padding-left:24px!important;justify-self:start!important}
@media(max-width:1100px){.v2-pricing__card{grid-template-columns:46% 54%!important}.v2-pricing__summary{width:320px!important}.v2-pricing__list{width:560px!important;padding-left:18px!important}}
@media(max-width:850px){.v2-pricing__card{grid-template-columns:1fr!important}.v2-pricing__summary,.v2-pricing__list{width:100%!important;max-width:none;padding-left:0!important;padding-right:0!important}.v2-pricing__list{justify-self:stretch!important}}
.v2-pricing__card{padding-bottom:12px!important}.v2-pricing__tags{padding-bottom:12px!important}.v2-pricing__card::before{left:46%!important}.v2-pricing__summary{padding-right:30px!important}.v2-pricing__list{padding-left:30px!important}.v2-pricing__label{font-weight:600!important}
@media(max-width:850px){.v2-pricing__card{padding-bottom:0!important}.v2-pricing__tags{padding-bottom:18px!important}.v2-pricing__card::before{display:none!important}.v2-pricing__summary,.v2-pricing__list{padding-left:0!important;padding-right:0!important}}
.v2-pricing__card::before{position:absolute!important;top:18%!important;left:46%!important;width:1px!important;height:42%!important;transform:translateY(-3px)!important;background:linear-gradient(180deg,transparent 0%,rgba(190,207,240,.38) 18%,rgba(190,207,240,.38) 82%,transparent 100%)!important}
.v2-pricing__tags{padding-top:28px!important}
@media(max-width:850px){.v2-pricing__card::before{display:none!important}}
.v2-pricing__summary{transform:scale(.95)!important;transform-origin:center top}
.v2-pricing__list{transform:scale(.95)!important;transform-origin:center top}
.v2-pricing__tags{padding-top:48px!important}
@media(max-width:850px){.v2-pricing__summary,.v2-pricing__list{transform:none!important}.v2-pricing__tags{padding-top:46px!important}}
.v2-pricing__card{max-width:100%;box-sizing:border-box}
@media(max-width:850px){.v2-pricing__card{width:100%!important}.v2-pricing__list,.v2-pricing__summary{width:100%!important;max-width:100%!important}}
.v2-pricing__list{box-sizing:border-box;min-width:0}
@media(max-width:850px){
  .v2-pricing__card{width:100%!important;max-width:100%!important;overflow:hidden!important}
  .v2-pricing__summary{width:100%!important;min-width:0!important;border-bottom:1px solid rgba(255,255,255,.2)!important}
  .v2-pricing__list{display:grid!important;width:100%!important;min-width:0!important;max-width:100%!important;padding:22px 0!important;border-top:0!important;overflow:hidden!important}
  .v2-pricing__list li{width:100%!important;min-width:0!important;box-sizing:border-box!important}
  .v2-pricing__tags{width:100%!important;min-width:0!important;box-sizing:border-box!important}
  .v2-pricing__tags>div{display:flex!important;flex-wrap:wrap!important;justify-content:center!important;width:100%!important;min-width:0!important;gap:8px!important}
  .v2-pricing__tags figure{flex:0 0 54px!important}
}
.v2-pricing__card::before{transform:translateY(-10px)!important}
@media(max-width:850px){.v2-pricing__card::before{display:none!important}}
</style>
