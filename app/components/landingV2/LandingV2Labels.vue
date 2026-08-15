<script setup lang="ts">
import { ArrowRight, GripVertical } from '@lucide/vue';
import LandingV2TagArt from './LandingV2TagArt.vue';

type TagColor = 'vermelha' | 'azul' | 'amarela' | 'branca' | 'verde';
const tags: { color: TagColor; title: string; profile: string; description: string; }[] = [
    { color: 'vermelha', title: 'Vermelha', profile: 'CNH temporária', description: 'Para motoristas em período de habilitação provisória.' },
    { color: 'azul', title: 'Azul', profile: 'Uso profissional', description: 'Para veículos de aplicativo, locadora, empresa ou frota.' },
    { color: 'amarela', title: 'Amarela', profile: 'Gestante ou recém-nascido', description: 'Um sinal de atenção para situações que pedem mais cuidado.' },
    { color: 'branca', title: 'Branca', profile: 'Pessoa idosa ou condição não visível', description: 'Contexto para pessoas com mais de 60 anos, PCD ou condições não visíveis.' },
    { color: 'verde', title: 'Verde', profile: 'CNH definitiva', description: 'Para condutores com habilitação definitiva.' }
];
const activeIndex = ref(3);
const comparison = ref(49);
const activeTag = computed(() => tags[activeIndex.value] ?? tags[0]!);
const section = ref<HTMLElement | null>(null);
let motionContext: { revert: () => void } | undefined;

const selectTag = async (index: number) => {
    activeIndex.value = index;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const { default: gsap } = await import('gsap');
    const tagWrap = section.value?.querySelector<HTMLElement>('.v2-labels__tag-wrap');
    if (!tagWrap) return;
    gsap.fromTo(tagWrap, { opacity: .45, rotate: -11, scale: .9 }, { opacity: 1, rotate: 0, scale: 1, duration: .45, ease: 'back.out(1.6)', overwrite: true });
};

onMounted(async () => {
    if (!section.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const { default: gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);
    motionContext = gsap.context(() => {
        const showcase = section.value?.querySelector<HTMLElement>('.v2-labels__showcase');
        if (showcase) gsap.from(showcase, { scrollTrigger: { trigger: section.value, start: 'top 70%' }, y: 52, opacity: 0, duration: .8, ease: 'power3.out' });
    }, section.value);
});
onBeforeUnmount(() => motionContext?.revert());
</script>

<template>
    <section id="etiquetas" ref="section" class="v2-labels" :class="`v2-labels--${activeTag.color}`" aria-labelledby="v2-labels-title">
        <header class="v2-labels__head"><div><p class="v2-pill">As etiquetas</p><h2 id="v2-labels-title">Uma cor.<br>Um contexto.</h2></div><p>Conheça as etiquetas disponíveis e descubra qual delas representa melhor o contexto do seu veículo.</p></header>
        <div class="v2-labels__showcase">
            <div class="v2-labels__art"><div class="v2-labels__tag-wrap"><LandingV2TagArt :color="activeTag.color" size="large" /></div><span class="v2-labels__reflection"></span><small>material refletivo · leitura rápida</small></div>
            <div class="v2-labels__details"><span>Etiqueta {{ activeTag.title }}</span><h3>{{ activeTag.profile }}</h3><p>{{ activeTag.description }}</p><a href="#como-funciona">Ver como escolher <ArrowRight :size="17" /></a></div>
        </div>
        <div class="v2-labels__tabs" role="tablist" aria-label="Tipos de etiquetas"><button v-for="(tag,index) in tags" :key="tag.color" type="button" role="tab" :aria-selected="activeIndex === index" :class="{ 'is-active': activeIndex === index }" @click="selectTag(index)"><i :class="`v2-labels__tab-dot--${tag.color}`"></i>{{ tag.title }}</button></div>
    </section>
    <section class="v2-daynight" aria-labelledby="v2-daynight-title">
        <header><div><p class="v2-daynight__eyebrow">{ LEITURA EM QUALQUER LUZ }</p><h2 id="v2-daynight-title"><span class="v2-daynight__day">De dia</span>, mais visível<br><span class="v2-daynight__night">à noite</span>, mais contexto.</h2></div><p class="v2-daynight__lead">A etiqueta mantém a informação clara durante o dia e ganha força quando a luz diminui.</p></header>
        <div class="v2-daynight__compare">
            <div class="v2-daynight__scene v2-daynight__scene--day"><img :src="'/landing-v2/images/fundo-dia.webp'" alt="Visibilidade da etiqueta durante o dia" loading="lazy" decoding="async" width="1250" height="640"><span>DIA</span></div>
            <div class="v2-daynight__scene v2-daynight__scene--night" :style="{ clipPath: `inset(0 ${100 - comparison}% 0 0)` }"><img :src="'/landing-v2/images/fundo-noite.webp'" alt="Visibilidade da etiqueta durante a noite" loading="lazy" decoding="async" width="1250" height="640"><span>NOITE</span></div>
            <input v-model="comparison" class="v2-daynight__range" type="range" min="0" max="100" aria-label="Comparar visibilidade de dia e à noite"><div class="v2-daynight__needle" :style="{ left: `${comparison}%` }" aria-hidden="true"></div><div class="v2-daynight__handle" :style="{ left: `${comparison}%` }"><GripVertical :size="18" /></div>
        </div>
    </section>
</template>

<style scoped>
.v2-labels { --tone:#e9ecec; --ink:#101114; padding:clamp(115px,14vw,190px) clamp(24px,8vw,130px) 48px; background:var(--tone); color:var(--ink); font-family:'Instrument Sans',Arial,sans-serif; transition:background .45s ease,color .45s ease; }.v2-labels--vermelha{--tone:#fbe7e4}.v2-labels--azul{--tone:#eaf2ff}.v2-labels--amarela{--tone:#fff5d6}.v2-labels--branca{--tone:#eceeea}.v2-labels--verde{--tone:#e4f4ed}.v2-pill { display:inline-flex; margin:0 0 21px; padding:8px 12px; border:1px solid rgba(20,93,245,.2); border-radius:999px; background:rgba(255,255,255,.66); color:#0b42a8; font-size:11px; font-weight:750; letter-spacing:.12em; text-transform:uppercase; }.v2-labels__head { display:grid; grid-template-columns:1fr .65fr; align-items:end; gap:50px; max-width:1250px; margin:auto; }.v2-labels h2,.v2-daynight h2,.v2-privacy h2 { margin:0; font-size:clamp(48px,5.5vw,81px); font-weight:700; letter-spacing:-.065em; line-height:.97; }.v2-labels__head>p { max-width:370px; margin:0 0 8px; color:#626973; font-size:18px; line-height:1.55; }.v2-labels__showcase { display:grid; grid-template-columns:1.1fr .9fr; min-height:550px; max-width:1250px; margin:clamp(62px,8vw,105px) auto 0; border:1px solid rgba(13,30,57,.12); border-radius:32px; overflow:hidden; background:rgba(255,255,255,.47); }.v2-labels__art { position:relative; display:grid; place-items:center; min-height:420px; overflow:hidden; background:linear-gradient(145deg,rgba(255,255,255,.48),rgba(255,255,255,.05)); }.v2-labels__tag-wrap { position:relative; z-index:2; }.v2-labels__reflection { position:absolute; top:-20%; bottom:-20%; left:45%; width:13%; background:rgba(255,255,255,.64); transform:rotate(25deg); filter:blur(12px); }.v2-labels__art small { position:absolute; left:25px; bottom:22px; color:#667084; font-size:10px; font-weight:700; letter-spacing:.11em; text-transform:uppercase; }.v2-labels__details { display:flex; flex-direction:column; align-items:flex-start; justify-content:center; padding:clamp(34px,5vw,76px); border-left:1px solid rgba(13,30,57,.12); }.v2-labels__details>span { color:#145df5; font-size:12px; font-weight:750; letter-spacing:.12em; text-transform:uppercase; }.v2-labels__details h3 { max-width:390px; margin:15px 0; font-size:clamp(35px,4vw,60px); letter-spacing:-.06em; line-height:.98; }.v2-labels__details p { max-width:355px; margin:0; color:#626973; font-size:18px; line-height:1.5; }.v2-labels__details a { display:inline-flex; align-items:center; gap:9px; margin-top:31px; color:inherit; font-size:14px; font-weight:700; text-decoration:none; }.v2-labels__tabs { display:flex; max-width:1250px; margin:15px auto 0; gap:7px; overflow-x:auto; scrollbar-width:none; }.v2-labels__tabs button { display:flex; flex:1 0 126px; align-items:center; justify-content:center; gap:8px; min-height:52px; border:1px solid transparent; border-radius:12px; background:rgba(255,255,255,.35); color:#5a626f; font:650 13px/1 'Instrument Sans',Arial,sans-serif; cursor:pointer; }.v2-labels__tabs button.is-active { border-color:rgba(10,30,68,.18); background:#fff; color:#101114; }.v2-labels__tabs i { width:9px; height:9px; border-radius:50%; }.v2-labels__tab-dot--vermelha{background:#f6494b}.v2-labels__tab-dot--azul{background:#2e69f3}.v2-labels__tab-dot--amarela{background:#ffc842}.v2-labels__tab-dot--branca{border:1px solid #85909e;background:#fff}.v2-labels__tab-dot--verde{background:#32ac77}
.v2-daynight { padding:clamp(120px,14vw,190px) clamp(24px,8vw,130px); background:#061333; color:#fff; font-family:'Instrument Sans',Arial,sans-serif; }.v2-daynight header { display:flex; align-items:end; justify-content:space-between; max-width:1250px; margin:auto; }.v2-daynight .v2-pill { border-color:rgba(255,255,255,.2); background:rgba(255,255,255,.08); color:#dbe8ff; }.v2-daynight__compare { position:relative; height:min(52vw,640px); max-width:1250px; margin:clamp(54px,8vw,95px) auto 0; overflow:hidden; border-radius:30px; background:#1b335e; touch-action:none; }.v2-daynight__scene { position:absolute; inset:0; overflow:hidden; }.v2-daynight__scene :deep(.landing-v2-video){min-width:100%;}.v2-daynight__scene--day :deep(.landing-v2-video__placeholder){background:radial-gradient(circle at 72% 31%,#fff1bc,transparent 16%),linear-gradient(135deg,#aed8ff,#447abb 55%,#18375d)}.v2-daynight__scene--night { z-index:2; border-right:2px solid #fff; }.v2-daynight__scene--night :deep(.landing-v2-video__placeholder){background:radial-gradient(circle at 72% 31%,rgba(255,241,171,.7),transparent 11%),linear-gradient(135deg,#0f2860,#061333 62%,#020919)}.v2-daynight__scene>span { position:absolute; z-index:2; top:22px; left:23px; padding:7px 10px; border-radius:999px; background:rgba(6,19,51,.7); font-size:11px; font-weight:750; letter-spacing:.12em; }.v2-daynight__scene--night :deep(.tag-art){position:absolute;z-index:2;right:28%;bottom:23%;width:18%;filter:brightness(1.55);}.v2-daynight__range { position:absolute; z-index:4; inset:0; width:100%; height:100%; margin:0; opacity:0; cursor:ew-resize; }.v2-daynight__handle { position:absolute; z-index:3; top:50%; display:grid; place-items:center; width:42px; height:42px; margin:-21px 0 0 -21px; border:1px solid rgba(5,21,51,.26); border-radius:50%; background:#fff; color:#061333; pointer-events:none; }.v2-privacy { display:grid; grid-template-columns:.75fr 1.25fr; gap:8vw; align-items:center; padding:clamp(120px,15vw,210px) clamp(24px,10vw,160px); background:#fafaf7; font-family:'Instrument Sans',Arial,sans-serif; }.v2-privacy__words { position:relative; display:grid; place-items:center; width:min(100%,420px); aspect-ratio:1; margin:auto; border:17px solid #101114; background-image:radial-gradient(#101114 1px,transparent 1px); background-size:14px 14px; }.v2-privacy__words:before,.v2-privacy__words:after { content:''; position:absolute; width:23%; aspect-ratio:1; border:12px solid #101114; }.v2-privacy__words:before{left:7%;top:7%}.v2-privacy__words:after{right:7%;bottom:7%}.v2-privacy__words span,.v2-privacy__words b { position:absolute; z-index:2; padding:8px 11px; background:#fafaf7; color:#145df5; font-size:clamp(17px,2vw,27px); font-weight:750; letter-spacing:-.05em; white-space:nowrap; }.v2-privacy__words b { margin-top:63px; color:#101114; }.v2-privacy h2 { max-width:780px; }.v2-privacy>div:last-child>p:last-child { max-width:600px; margin:28px 0 0; color:#69717d; font-size:18px; line-height:1.55; }
@media(max-width:800px){.v2-labels__head,.v2-labels__showcase,.v2-privacy{grid-template-columns:1fr}.v2-labels__showcase{min-height:auto}.v2-labels__details{border-left:0;border-top:1px solid rgba(13,30,57,.12)}.v2-daynight header{display:block}.v2-daynight__compare{height:62vw}.v2-privacy__words{width:min(70vw,400px)}}@media(max-width:560px){.v2-labels,.v2-daynight,.v2-privacy{padding-left:20px;padding-right:20px}.v2-labels h2,.v2-daynight h2,.v2-privacy h2{font-size:49px}.v2-labels__showcase{border-radius:22px}.v2-labels__art{min-height:340px}.v2-labels__details{padding:31px 24px}.v2-labels__details h3{font-size:42px}.v2-daynight__compare{height:88vw;border-radius:20px}.v2-daynight__scene--night :deep(.tag-art){width:33%;right:17%;bottom:17%}.v2-privacy__words{width:78vw}.v2-privacy__words b{margin-top:51px;font-size:18px}}
/* Dia e noite: composição preparada para receber as duas imagens finais. */
.v2-daynight { padding:clamp(92px,10vw,148px) clamp(24px,8vw,130px) clamp(100px,11vw,160px); background:#061333; }
.v2-daynight header { display:grid; grid-template-columns:minmax(0,1fr) minmax(250px,.55fr); align-items:end; gap:clamp(32px,7vw,110px); max-width:1250px; margin:0 auto; }
.v2-daynight__lead { max-width:390px; margin:0 0 5px; color:#b9c8e5; font-size:18px; line-height:1.5; }
.v2-daynight h2 { max-width:780px; font-size:56px; font-weight:600; letter-spacing:-.025em; line-height:.98; }
.v2-daynight__compare { height:min(48vw,600px); margin-top:clamp(42px,6vw,76px); border:1px solid rgba(185,211,255,.22); border-radius:26px; background:#132957; box-shadow:0 24px 70px rgba(0,0,0,.2); }
.v2-daynight__scene > img { position:absolute; inset:0; display:block; width:100%; height:100%; object-fit:cover; object-position:center; }
.v2-daynight__scene--night { border-right:2px solid #7ea9ff; box-shadow:10px 0 24px rgba(20,93,245,.2); }
.v2-daynight__scene > span { top:20px; left:20px; padding:8px 12px; border:1px solid rgba(255,255,255,.22); background:rgba(6,19,51,.72); color:#fff; font-size:10px; font-weight:700; letter-spacing:.14em; }
.v2-daynight__handle { width:44px; height:44px; margin:-22px 0 0 -22px; border:2px solid #145df5; color:#145df5; box-shadow:0 0 0 6px rgba(255,255,255,.2); }
.v2-daynight__range { appearance:none; -webkit-appearance:none; }
@media (min-width:1601px){.v2-daynight h2{font-size:56px}}
@media (min-width:1441px) and (max-width:1600px){.v2-daynight h2{font-size:52px}}
@media (min-width:1200px) and (max-width:1440px){.v2-daynight h2{font-size:48px}}
@media (max-width:1199px){.v2-daynight h2{font-size:44px}}
@media (max-width:800px){
  .v2-daynight { padding-top:82px; padding-bottom:96px; }
  .v2-daynight header { display:block; }
  .v2-daynight__lead { margin-top:26px; font-size:17px; }
  .v2-daynight__compare { height:min(68vw,520px); margin-top:40px; border-radius:22px; }
}
@media (max-width:560px){
  .v2-daynight { padding-top:68px; padding-bottom:76px; }
  .v2-daynight h2 { font-size:32px; line-height:1.04; }
  .v2-daynight__lead { max-width:330px; font-size:16px; }
  .v2-daynight__compare { height:82vw; min-height:270px; margin-top:32px; border-radius:18px; }
  .v2-daynight__scene > span { top:14px; left:14px; padding:7px 9px; font-size:9px; }
  .v2-daynight__handle { width:38px; height:38px; margin:-19px 0 0 -19px; }
}
@media (max-width:390px){.v2-daynight h2{font-size:30px}}
.v2-daynight__eyebrow { display:block; margin:0 0 24px; padding:0; border:0; border-radius:0; background:transparent; color:#dce8ff; font-size:12px; font-weight:700; letter-spacing:.13em; line-height:1.2; text-transform:uppercase; }
.v2-daynight h2 { color:#fff; font-family:'Instrument Sans',Arial,sans-serif; font-weight:600; letter-spacing:-.025em; }
.v2-daynight__day { color:#ffd84d; }
.v2-daynight__night { color:#145df5; }
.v2-daynight__lead { justify-self:end; color:#e3ebfa; text-align:right; }
.v2-daynight__scene--night { width:100%; clip-path:inset(0 51% 0 0); border-right:0; box-shadow:none; transition:clip-path .08s linear; }
.v2-daynight__needle { position:absolute; z-index:3; top:0; bottom:0; width:2px; transform:translateX(-50%); background:linear-gradient(180deg,rgba(20,93,245,.25),#145df5 16%,#145df5 84%,rgba(20,93,245,.25)); box-shadow:0 0 18px rgba(20,93,245,.5); pointer-events:none; }
.v2-daynight__handle { position:absolute; background:#fff; }
.v2-daynight__handle svg { position:relative; z-index:1; }
@media (max-width:800px){.v2-daynight__lead{width:100%;max-width:390px;margin-left:0!important;margin-right:0!important;justify-self:start;text-align:left}.v2-daynight__eyebrow{margin-bottom:22px;font-size:11px}}
@media (max-width:560px){.v2-daynight__eyebrow{font-size:11px;letter-spacing:.1em}.v2-daynight__lead{width:100%;max-width:none;margin-left:0!important;margin-right:0!important;text-align:left}}
</style>
