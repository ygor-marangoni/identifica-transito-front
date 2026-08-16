<script setup lang="ts">
import { GripVertical } from '@lucide/vue';

type TagColor = 'vermelha' | 'azul' | 'amarela' | 'branca' | 'verde';
const tags: { color: TagColor; title: string; profile: string; description: string; image: string; background: string; }[] = [
    { color: 'vermelha', title: 'Vermelha', profile: 'CNH temporária', description: 'Para motoristas em período de habilitação provisória.', image: '/landing-v2/images/vermelho.webp', background: '/landing-v2/images/nova-imagem-etiqueta vermelha.webp' },
    { color: 'azul', title: 'Azul', profile: 'Uso profissional', description: 'Para veículos de aplicativo, locadora, empresa ou frota.', image: '/landing-v2/images/azul.webp', background: '/landing-v2/images/nova-imagem-etiqueta azul.webp' },
    { color: 'amarela', title: 'Amarela', profile: 'Gestante ou recém-nascido', description: 'Um sinal de atenção para situações que pedem mais cuidado.', image: '/landing-v2/images/amarelo.webp', background: '/landing-v2/images/nova-imagem-etiqueta amarela.webp' },
    { color: 'branca', title: 'Branca', profile: 'Pessoa idosa ou condição não visível', description: 'Perfil para pessoas com mais de 60 anos, PCD ou condições não visíveis.', image: '/landing-v2/images/branco.webp', background: '/landing-v2/images/nova-imagem-etiqueta branca.webp' },
    { color: 'verde', title: 'Verde', profile: 'CNH definitiva', description: 'Para condutores com habilitação definitiva.', image: '/landing-v2/images/verde.webp', background: '/landing-v2/images/nova-imagem-etiqueta verde.webp' }
];
const activeIndex = ref(0);
const comparison = ref(49);
const activeTag = computed(() => tags[activeIndex.value] ?? tags[0]!);
const activeBackgroundStyle = computed(() => ({ backgroundImage: `url("${activeTag.value.background}")` }));
const section = ref<HTMLElement | null>(null);
const daynight = ref<HTMLElement | null>(null);
let motionMedia: { revert: () => void } | undefined;
let daynightAnimation: { kill: () => void } | undefined;

onMounted(async () => {
    if (
        !section.value
        || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return;
    await waitForLandingV2Ready();
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger')
    ]);
    gsap.registerPlugin(ScrollTrigger);
    if (daynight.value) {
        const headerParts = Array.from(daynight.value.querySelectorAll<HTMLElement>('header > *'));
        const compare = daynight.value.querySelector<HTMLElement>('.v2-daynight__compare');
        const scenes = daynight.value.querySelectorAll<HTMLElement>('.v2-daynight__scene > img');
        const controls = daynight.value.querySelectorAll<HTMLElement>('.v2-daynight__needle, .v2-daynight__handle');
        daynightAnimation = gsap.timeline({
            scrollTrigger: { trigger: daynight.value, start: 'top 78%', once: true }
        })
            .from(headerParts, { y: 24, autoAlpha: 0, duration: 1.05, stagger: .12, ease: 'power2.out' })
            .from(compare, { y: 24, autoAlpha: 0, scale: .985, duration: 1.1, ease: 'power2.out' }, '-=.48')
            .from(scenes, { scale: 1.08, duration: 1.05, stagger: .06, ease: 'power2.out' }, '-=.72')
            .from(controls, { autoAlpha: 0, scale: .65, duration: .42, stagger: .08, ease: 'back.out(1.8)' }, '-=.44');
    }
    motionMedia = gsap.matchMedia();
    motionMedia.add('(min-width: 1101px)', () => {
        const context = gsap.context(() => {
            const root = section.value!;
            const cards = Array.from(root.querySelectorAll<HTMLElement>('.v2-labels__stage-card'));
            const progress = root.querySelector<HTMLElement>('.v2-labels__progress-fill');
            const dots = Array.from(root.querySelectorAll<HTMLElement>('.v2-labels__progress-step'));
            const eyebrow = root.querySelector<HTMLElement>('.v2-labels__eyebrow');
            const titleParts = Array.from(root.querySelectorAll<HTMLElement>('.v2-labels__journey-heading span'));
            const intro = root.querySelector<HTMLElement>('.v2-labels__intro');
            if (!cards.length || !progress) return;

            const setProgress = gsap.quickSetter(progress, 'scaleX');
            let visibleStage = -1;
            const syncStage = (nextStage: number) => {
                if (visibleStage === nextStage) return;
                visibleStage = nextStage;
                activeIndex.value = nextStage;
                dots.forEach((dot, index) => dot.classList.toggle('is-active', index <= nextStage));
            };

            syncStage(0);
            gsap.set([eyebrow, ...titleParts, intro], { autoAlpha: 0, y: 28 });
            gsap.set(cards, { autoAlpha: 0, y: 48, scale: .98, force3D: true });
            gsap.set(cards[0], { autoAlpha: 1, y: 0, scale: 1 });

            const stageForProgress = (value: number) => Math.min(tags.length - 1, Math.floor(value * tags.length));
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: root,
                    start: 'top top',
                    end: () => `+=${Math.round(window.innerHeight * 3.5)}`,
                    pin: root,
                    refreshPriority: -2,
                    scrub: .2,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onUpdate: self => {
                        const progressValue = Math.min(.999, self.progress);
                        setProgress(progressValue);
                        syncStage(stageForProgress(progressValue));
                    }
                }
            });

            timeline
                .to(eyebrow, { autoAlpha: 1, y: 0, duration: .1, ease: 'power2.out' }, .02)
                .to(titleParts, { autoAlpha: 1, y: 0, duration: .14, stagger: .04, ease: 'power2.out' }, .08)
                .to(intro, { autoAlpha: 1, y: 0, duration: .12, ease: 'power2.out' }, .16);

            cards.forEach((card, index) => {
                if (index === 0) return;
                const start = .16 + (index - 1) * .18;
                timeline.to(cards[index - 1], { autoAlpha: 0, y: -34, scale: .985, duration: .15, ease: 'power1.inOut' }, start)
                    .to(card, { autoAlpha: 1, y: 0, scale: 1, duration: .15, ease: 'power2.out' }, start + .01);
            });
        }, section.value);

        requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => context.revert();
    });
});
onBeforeUnmount(() => {
    motionMedia?.revert();
    daynightAnimation?.kill();
});
</script>

<template>
    <section id="etiquetas" ref="section" class="v2-labels" :class="`v2-labels--${activeTag.color}`" aria-labelledby="v2-labels-title">
        <div class="v2-labels__pin">
            <Transition name="v2-labels-bg">
                <div :key="activeTag.color" class="v2-labels__background" :style="activeBackgroundStyle" aria-hidden="true"></div>
            </Transition>
            <div class="v2-labels__journey">
                <p class="v2-labels__eyebrow">{ AS ETIQUETAS }</p>
                <h2 id="v2-labels-title" class="v2-labels__journey-heading" aria-label="Uma cor, um perfil.">
                    <span>Uma cor</span>
                    <span>um <strong class="heading-highlight">perfil.</strong></span>
                </h2>
                <p class="v2-labels__intro">Cada cor comunica um perfil diferente e ajuda a tornar a convivência no trânsito mais humana.</p>
                <div class="v2-labels__stage" aria-live="polite">
                    <article v-for="(tag, index) in tags" :key="tag.color" class="v2-labels__stage-card" :class="[`v2-labels__stage-card--${tag.color}`, { 'is-active': activeIndex === index }]" :aria-current="activeIndex === index ? 'step' : undefined">
                        <div class="v2-labels__stage-art"><img :src="tag.image" :alt="`Etiqueta ${tag.title}`" width="150" height="150" loading="lazy" decoding="async"></div>
                        <p class="v2-labels__stage-kicker">Perfil {{ tag.title }}</p>
                        <h3>{{ tag.profile }}</h3>
                        <p class="v2-labels__stage-description">{{ tag.description }}</p>
                    </article>
                </div>
            </div>
            <div class="v2-labels__progress" :aria-label="`Etiqueta ${activeIndex + 1} de ${tags.length}`">
                <span class="v2-labels__progress-track"><i ref="progress" class="v2-labels__progress-fill"></i></span>
                <span v-for="(tag, index) in tags" :key="tag.color" class="v2-labels__progress-step" :class="[`v2-labels__progress-step--${tag.color}`, { 'is-active': activeIndex >= index }]" :aria-label="tag.title"><i></i></span>
            </div>
        </div>
    </section>
    <section ref="daynight" class="v2-daynight" aria-labelledby="v2-daynight-title"><div class="v2-daynight__reveal-shell">
        <header><div><p class="v2-daynight__eyebrow">{ LEITURA EM QUALQUER LUZ }</p><h2 id="v2-daynight-title"><span class="v2-daynight__day">De dia</span>, mais visível<br><span class="v2-daynight__night heading-highlight">à noite</span>, mais contexto.</h2></div><p class="v2-daynight__lead">A etiqueta mantém a informação clara durante o dia e ganha força quando a luz diminui.</p></header>
        <div class="v2-daynight__compare">
            <div class="v2-daynight__scene v2-daynight__scene--day"><img :src="'/landing-v2/images/fundo-dia.webp'" alt="Visibilidade da etiqueta durante o dia" loading="lazy" decoding="async" width="1250" height="640"><span>DIA</span></div>
            <div class="v2-daynight__scene v2-daynight__scene--night" :style="{ clipPath: `inset(0 ${100 - comparison}% 0 0)` }"><img :src="'/landing-v2/images/fundo-noite.webp'" alt="Visibilidade da etiqueta durante a noite" loading="lazy" decoding="async" width="1250" height="640"><span>NOITE</span></div>
            <input v-model="comparison" class="v2-daynight__range" type="range" min="0" max="100" aria-label="Comparar visibilidade de dia e à noite"><div class="v2-daynight__needle" :style="{ left: `${comparison}%` }" aria-hidden="true"></div><div class="v2-daynight__handle" :style="{ left: `${comparison}%` }"><GripVertical :size="18" /></div>
        </div>
    </div></section>
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
.v2-daynight__scene--night { width:100%; clip-path:inset(0 51% 0 0); border-right:0; box-shadow:none; }
.v2-daynight__needle { position:absolute; z-index:3; top:0; bottom:0; width:2px; transform:translateX(-50%); background:linear-gradient(180deg,rgba(20,93,245,.25),#145df5 16%,#145df5 84%,rgba(20,93,245,.25)); box-shadow:0 0 18px rgba(20,93,245,.5); pointer-events:none; }
.v2-daynight__handle { position:absolute; background:#fff; }
.v2-daynight__handle svg { position:relative; z-index:1; }
@media (max-width:800px){.v2-daynight__lead{width:100%;max-width:390px;margin-left:0!important;margin-right:0!important;justify-self:start;text-align:left}.v2-daynight__eyebrow{margin-bottom:22px;font-size:11px}}
@media (max-width:560px){.v2-daynight__eyebrow{font-size:11px;letter-spacing:.1em}.v2-daynight__lead{width:100%;max-width:none;margin-left:0!important;margin-right:0!important;text-align:left}}
</style>

<style scoped>
/* Jornada editorial das etiquetas: composição inspirada na referência Bellatrix. */
.v2-labels {
    --labels-bg: #090d12;
    --labels-glow: rgba(20, 93, 245, .28);
    --card-bg: rgba(20, 35, 52, .72);
    --eyebrow-color: #8fa0b0;
    position: relative;
    z-index: 0;
    min-height: 100dvh;
    width: 100vw;
    margin-right: calc(50% - 50vw);
    margin-left: calc(50% - 50vw);
    padding: 0;
    overflow: clip;
    background: var(--labels-bg);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: scroll;
    color: #fff;
    transition: background .65s ease;
}

.v2-labels::before {
    position: absolute;
    z-index: 0;
    inset: 0;
    content: '';
    background:
        linear-gradient(0deg, color-mix(in srgb, var(--card-bg) 88%, #02070a 12%) 0%, color-mix(in srgb, var(--card-bg) 56%, transparent) 34%, transparent 68%),
        radial-gradient(circle at 50% 46%, var(--labels-glow), transparent 48%),
        linear-gradient(180deg, rgba(2, 7, 10, .46), rgba(2, 7, 10, .18) 43%, rgba(2, 7, 10, .72));
    backdrop-filter: blur(3px) saturate(84%);
    pointer-events: none;
}

.v2-labels--vermelha { --labels-bg: #120d11; --labels-glow: rgba(246, 73, 75, .14); --card-bg: rgba(105, 25, 32, .96); --eyebrow-color: #ff9ca3; }
.v2-labels--azul { --labels-bg: #0b1015; --labels-glow: rgba(20, 93, 245, .16); --card-bg: rgba(20, 57, 125, .96); --eyebrow-color: #a9c7ff; }
.v2-labels--amarela { --labels-bg: #15130d; --labels-glow: rgba(255, 200, 66, .13); --card-bg: rgba(117, 82, 11, .96); --eyebrow-color: #ffe198; }
.v2-labels--branca { --labels-bg: #121416; --labels-glow: rgba(190, 204, 225, .12); --card-bg: rgba(95, 108, 125, .96); --eyebrow-color: #f5f8ff; }
.v2-labels--verde { --labels-bg: #0b1512; --labels-glow: rgba(50, 172, 119, .14); --card-bg: rgba(10, 95, 65, .96); --eyebrow-color: #91ebc5; }

.v2-labels__pin {
    position: relative;
    width: 100%;
    height: 100dvh;
    min-height: 100dvh;
    margin: 0;
    overflow: hidden;
    isolation: isolate;
}

.v2-labels__pin::before {
    position: absolute;
    z-index: 1;
    inset: 0;
    content: '';
    background:
        linear-gradient(0deg, color-mix(in srgb, var(--card-bg) 88%, #02070a 12%) 0%, color-mix(in srgb, var(--card-bg) 56%, transparent) 34%, transparent 68%),
        radial-gradient(circle at 50% 46%, var(--labels-glow), transparent 48%),
        linear-gradient(180deg, rgba(2, 7, 10, .46), rgba(2, 7, 10, .18) 43%, rgba(2, 7, 10, .72));
    backdrop-filter: blur(3px) saturate(84%);
    pointer-events: none;
}

/* Mantém a fotografia legível, sem o brilho excessivo da camada anterior. */
.v2-labels::before,
.v2-labels__pin::before {
    background:
        linear-gradient(0deg, color-mix(in srgb, var(--card-bg) 64%, #02070a 36%) 0%, color-mix(in srgb, var(--card-bg) 34%, transparent) 36%, transparent 72%),
        radial-gradient(circle at 50% 46%, var(--labels-glow), transparent 52%),
        linear-gradient(180deg, rgba(2, 7, 10, .62), rgba(2, 7, 10, .34) 44%, rgba(2, 7, 10, .84));
    backdrop-filter: none;
}

.v2-labels__background {
    position: absolute;
    z-index: 0;
    inset: 0;
    width: 100%;
    height: 100%;
    min-width: 100%;
    min-height: 100%;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    filter: saturate(.9) contrast(1.04) brightness(.82);
    will-change: opacity;
    transform: translateZ(0);
}

.v2-labels-bg-enter-active,
.v2-labels-bg-leave-active { transition: opacity .35s ease; }
.v2-labels-bg-enter-from,
.v2-labels-bg-leave-to { opacity: 0; }

.v2-labels__journey {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(380px, .9fr) minmax(0, 1fr);
    grid-template-rows: auto 1fr auto;
    height: 100dvh;
    padding: clamp(28px, 5vh, 52px) clamp(24px, 5vw, 80px) clamp(76px, 9vh, 112px);
}

.v2-labels__eyebrow {
    grid-column: 1 / -1;
    margin: 0;
    color: #cfe0ff;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .13em;
    line-height: 1.2;
    text-align: center;
    text-transform: uppercase;
}

.v2-labels__journey-heading {
    position: absolute;
    inset: 0 clamp(24px, 5vw, 80px);
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(380px, .9fr) minmax(0, 1fr);
    align-items: center;
    margin: 0;
    pointer-events: none;
}

.v2-labels__journey-heading span {
    max-width: 360px;
    color: rgba(255, 255, 255, .96);
    font-size: clamp(44px, 5vw, 74px);
    font-weight: 500;
    letter-spacing: -.025em;
    line-height: 1.02;
}

.v2-labels__journey-heading span:first-child { grid-column: 1; justify-self: start; }
.v2-labels__journey-heading span:last-child { grid-column: 3; justify-self: end; text-align: right; }
.v2-labels__journey-heading span:last-child strong {
    color: #f8f6ff;
    font: inherit;
}

.v2-labels__intro {
    position: absolute;
    top: calc(50% + 150px);
    left: 50%;
    width: min(350px, 25vw);
    margin: 0;
    color: rgba(207, 224, 255, .62);
    font-size: 15px;
    line-height: 1.5;
    text-align: center;
    transform: translate(-50%, -50%);
}

.v2-labels__stage {
    position: relative;
    z-index: 2;
    grid-column: 2;
    grid-row: 2;
    align-self: center;
    justify-self: center;
    width: min(100%, 460px);
    height: 430px;
    transform: translateY(0);
}

.v2-labels__stage-card {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding: 34px clamp(28px, 3.2vw, 44px) 32px;
    overflow: hidden;
    border: 1px solid rgba(185, 211, 255, .28);
    border-radius: 24px;
    background: var(--card-bg);
    box-shadow: 0 20px 54px rgba(0, 0, 0, .18), inset 0 1px 0 rgba(255, 255, 255, .09);
    backdrop-filter: none;
    will-change: transform, opacity;
}

.v2-labels__stage-card::before {
    position: absolute;
    inset: 0;
    content: '';
    border-radius: inherit;
    background: linear-gradient(116deg, rgba(255, 255, 255, .055), transparent 28%, transparent 72%, var(--card-accent, var(--labels-glow)));
    pointer-events: none;
}

.v2-labels__stage-card > * { position: relative; z-index: 1; }
.v2-labels__stage-card:nth-child(1) { z-index: 1; }
.v2-labels__stage-card:nth-child(2) { z-index: 2; }
.v2-labels__stage-card:nth-child(3) { z-index: 3; }
.v2-labels__stage-card:nth-child(4) { z-index: 4; }
.v2-labels__stage-card:nth-child(5) { z-index: 5; }
.v2-labels__stage-card--vermelha { --card-mobile-bg: linear-gradient(145deg, rgba(190, 34, 55, .96), rgba(112, 14, 36, .92)); --card-label-color: #ffabb4; --card-accent: rgba(246, 73, 75, .14); }
.v2-labels__stage-card--azul { --card-mobile-bg: linear-gradient(145deg, rgba(37, 105, 232, .96), rgba(15, 52, 132, .92)); --card-label-color: #a9c7ff; --card-accent: rgba(90, 151, 255, .14); }
.v2-labels__stage-card--amarela { --card-mobile-bg: linear-gradient(145deg, rgba(198, 145, 18, .96), rgba(111, 76, 6, .92)); --card-label-color: #ffe29a; --card-accent: rgba(255, 208, 75, .13); }
.v2-labels__stage-card--branca { --card-mobile-bg: linear-gradient(145deg, rgba(123, 142, 164, .96), rgba(58, 74, 95, .92)); --card-label-color: #e8eff9; --card-accent: rgba(221, 234, 249, .12); }
.v2-labels__stage-card--verde { --card-mobile-bg: linear-gradient(145deg, rgba(15, 141, 96, .96), rgba(5, 79, 55, .92)); --card-label-color: #98efcb; --card-accent: rgba(70, 208, 143, .14); }

.v2-labels__stage-art { position: absolute; top: 34px; right: 50%; transform: translateX(50%); opacity: .16; pointer-events: none; }
.v2-labels__stage-art img { display: block; width: 176px; height: 176px; object-fit: contain; filter: drop-shadow(0 22px 24px rgba(0, 0, 0, .3)); }
.v2-labels__stage-card.is-active .v2-labels__stage-art { opacity: .92; }
.v2-labels__stage-kicker { margin: 218px 0 0; color: var(--card-label-color, var(--eyebrow-color)); font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
.v2-labels__stage-card h3 { max-width: 365px; margin: 12px 0 0; color: #f8f6ff; font-size: clamp(24px, 2vw, 31px); font-weight: 500; letter-spacing: -.02em; line-height: 1.06; }
.v2-labels__stage-description { max-width: 370px; margin: 12px 0 0; color: #b9b1ca; font-size: 15px; line-height: 1.52; }

.v2-labels__progress { position: absolute; z-index: 20; right: 0; bottom: clamp(30px, 5vh, 58px); left: 0; display: flex; align-items: flex-start; justify-content: space-between; width: min(640px, 54vw); margin: 0 auto; padding: 0; transform: none; }
.v2-labels__progress-track { position: absolute; z-index: 0; top: 5px; right: 6px; left: 6px; height: 2px; overflow: hidden; border-radius: 999px; background: rgba(255, 255, 255, .3); }
.v2-labels__progress-fill { position: absolute; z-index: 1; inset: 0 auto 0 0; width: 100%; border-radius: inherit; background: linear-gradient(90deg, #145df5, #8fb8ff); transform: scaleX(0); transform-origin: left; will-change: transform; }
.v2-labels__progress-step { position: relative; display: flex; flex-direction: column; align-items: center; gap: 8px; color: rgba(207, 224, 255, .65); font-size: 10px; font-weight: 700; letter-spacing: .08em; }
.v2-labels__progress-step { z-index: 2; }
.v2-labels__progress-step i { display: block; width: 12px; height: 12px; border: 2px solid rgba(255, 255, 255, .84); border-radius: 4px; background: #101722; box-shadow: 0 0 0 2px rgba(8, 14, 22, .18); opacity: 1; transition: background .2s ease, border-color .2s ease, transform .2s ease; }
.v2-labels__progress-step.is-active { color: var(--step-color); }
.v2-labels__progress-step.is-active i { border-color: var(--step-color); background: var(--step-color); box-shadow: 0 0 0 3px color-mix(in srgb, var(--step-color), transparent 78%); transform: scale(1.08); }
.v2-labels__progress-step--vermelha { --step-color: #ff4e58; }
.v2-labels__progress-step--azul { --step-color: #3c82ff; }
.v2-labels__progress-step--amarela { --step-color: #ffc83d; }
.v2-labels__progress-step--branca { --step-color: #dce8f6; }
.v2-labels__progress-step--verde { --step-color: #39c58a; }

@media (max-width: 1100px) {
    .v2-labels { min-height: 0; padding: 0; }
    .v2-labels__pin { height: auto; min-height: 0; }
    .v2-labels__journey { display: block; height: auto; padding: 86px 20px 78px; }
    .v2-labels__eyebrow { text-align: left; }
    .v2-labels__journey-heading { position: relative; inset: auto; display: block; margin-top: 28px; }
    .v2-labels__journey-heading span { display: block; max-width: none; font-size: clamp(38px, 10vw, 58px); }
    .v2-labels__journey-heading span:last-child { margin-top: 3px; text-align: left; }
    .v2-labels__intro { position: relative; top: auto; left: auto; width: 100%; margin-top: 26px; transform: none; text-align: left; }
    .v2-labels__stage { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; width: 100%; height: auto; margin-top: 42px; transform: none; }
    .v2-labels__stage-card { position: relative; min-height: 340px; padding: 28px; opacity: 1 !important; transform: none !important; filter: none !important; }
    .v2-labels__stage-card h3 { margin-top: 18px; font-size: 26px; }
    .v2-labels__stage-description { font-size: 14px; }
    .v2-labels__stage-art { top: 28px; right: 50%; transform: translateX(50%); }
    .v2-labels__stage-art img { width: 150px; height: 150px; }
    .v2-labels__stage-kicker { margin-top: 184px; }
    .v2-labels__progress { position: relative; bottom: auto; left: auto; width: 100%; margin-top: 32px; transform: none; }
}

@media (max-width: 560px) {
    .v2-labels__journey { padding: 72px 20px 70px; }
    .v2-labels__stage { grid-template-columns: 1fr; gap: 12px; margin-top: 36px; }
    .v2-labels__stage-card { min-height: 315px; padding: 24px 21px; border-radius: 20px; }
    .v2-labels__stage-card h3 { margin-top: 12px; font-size: 24px; }
    .v2-labels__progress { margin-top: 26px; }
}

/* Mesma escala editorial das seções anteriores. */
.v2-labels__journey-heading span { text-wrap: balance; }
@media (min-width: 1601px) {
    .v2-labels__journey-heading span { font-size: 56px; }
}
@media (min-width: 1441px) and (max-width: 1600px) {
    .v2-labels__journey-heading span { font-size: 52px; }
}
@media (min-width: 1200px) and (max-width: 1440px) {
    .v2-labels__journey-heading span { font-size: 48px; }
}
@media (min-width: 1001px) and (max-width: 1199px) {
    .v2-labels__journey-heading span { font-size: 42px; }
}
@media (max-width: 1000px) {
    .v2-labels__journey-heading span { font-size: 32px; line-height: 1.04; }
}
@media (max-width: 390px) {
    .v2-labels__journey-heading span { font-size: 30px; }
}

@media (max-width: 800px) {
    .v2-labels__journey-heading span,
    .v2-labels__journey-heading span:last-child {
        font-size: 32px;
        font-weight: 500;
        line-height: 1.04;
    }
}

@media (max-width: 1100px) {
    .v2-labels {
        background: #061333;
    }

    .v2-labels__background {
        display: none !important;
    }

    .v2-labels__stage-card,
    .v2-labels__progress-fill {
        will-change: auto;
    }

    .v2-labels__pin {
        background:
            linear-gradient(rgba(143, 184, 255, .025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(143, 184, 255, .025) 1px, transparent 1px),
            radial-gradient(circle at 88% 8%, rgba(20, 93, 245, .2), transparent 35%),
            linear-gradient(155deg, #0a1d46, #061333 56%, #040d25);
        background-size: 28px 28px, 28px 28px, auto, auto;
    }

    .v2-labels::before,
    .v2-labels__pin::before {
        background: linear-gradient(180deg, rgba(2, 8, 23, .08), rgba(2, 8, 23, .44));
    }

    .v2-labels__journey-heading {
        max-width: 360px;
        margin-top: 0;
    }

    .v2-labels__journey-heading span,
    .v2-labels__journey-heading span:last-child {
        display: inline;
        margin: 0;
        font-size: clamp(30px, 8.5vw, 38px);
        line-height: 1.05;
        text-align: left;
    }

    .v2-labels__eyebrow,
    .v2-labels__journey-heading span,
    .v2-labels__intro {
        visibility: visible !important;
        opacity: 1 !important;
        transform: none !important;
    }

    .v2-labels__journey-heading span:first-child::after {
        content: ' ';
        white-space: pre;
    }

    .v2-labels__stage-card {
        border-color: rgba(233, 243, 255, .34);
        background: var(--card-mobile-bg, var(--card-bg)) !important;
        box-shadow: 0 18px 44px rgba(0, 0, 0, .2), inset 0 1px 0 rgba(255, 255, 255, .2);
    }

    .v2-labels__eyebrow {
        margin-bottom: 16px;
    }

    .v2-labels__intro {
        margin-top: 20px;
    }

    .v2-labels__stage-card h3 {
        margin-top: 10px;
        font-size: 24px;
        line-height: 1.1;
    }

    .v2-labels__stage-card .v2-labels__stage-art {
        opacity: .92;
    }

    .v2-labels__progress {
        display: none;
    }
}

@media (prefers-reduced-motion: reduce) {
    .v2-labels__stage-card { opacity: 1 !important; transform: none !important; filter: none !important; }
}
</style>

<style scoped>
@media (max-width: 800px) {
    .v2-labels__journey-heading span,
    .v2-labels__journey-heading span:last-child {
        font-size: 32px !important;
        font-weight: 500 !important;
        line-height: 1.04 !important;
    }
}

@media (max-width: 390px) {
    .v2-labels__journey-heading span,
    .v2-labels__journey-heading span:last-child {
        font-size: 30px !important;
    }
}
</style>
