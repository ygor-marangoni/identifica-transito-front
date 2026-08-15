<script setup lang="ts">
import { ArrowDown, CarFront, CircleCheck, CircleUserRound, HeartHandshake, Info, MessageCircle, QrCode, ScanLine, ShoppingBag, Tag, UsersRound } from '@lucide/vue';
import LandingV2TagArt from './LandingV2TagArt.vue';
import LandingProjectNetwork from './LandingProjectNetwork.vue';

const story = ref<HTMLElement | null>(null);
const manifesto = ref<HTMLElement | null>(null);
const manifestoViewport = ref<HTMLElement | null>(null);
const productFlow = ref<HTMLElement | null>(null);
const signalFlow = ref<HTMLElement | null>(null);
const flowProgress = ref<HTMLElement | null>(null);
const flowItems = ref<HTMLElement[]>([]);
const activeScene = ref(0);
const activeCard = ref(-1);
const section03Progress = ref(0);
let motionContext: { revert: () => void } | undefined;
let section03Media: { revert: () => void } | undefined;
const scenes = [
    { title: 'Você vê um carro.', body: 'E, em segundos, interpreta o que está acontecendo.' },
    { title: 'Mas existe algo que você ainda não vê.', body: 'Nem toda situação no trânsito cabe em uma primeira impressão.' },
    { title: 'Agora existe contexto.', body: 'A etiqueta chama atenção e convida para uma leitura mais consciente.' },
    { title: 'Antes de reagir, entenda.', body: 'Um pequeno sinal pode mudar a forma como interpretamos o que acontece ao nosso redor.' }
];
const section03Cards = [
    { title: 'Situações que pedem cuidado', body: 'Nem todo comportamento no trânsito revela descuido. Às vezes, ele comunica uma necessidade.', icon: '/landing-v2/images/resistencia.webp' },
    { title: 'Contexto visível em segundos', body: 'A etiqueta ajuda outras pessoas a entender o cenário com uma leitura rápida e direta.', icon: '/landing-v2/images/visao.webp' },
    { title: 'Mais empatia na via', body: 'Quando o contexto fica claro, a reação tende a ser mais humana, atenta e segura.', icon: '/landing-v2/images/compaixao.webp' }
];
const flowSteps = [
    { title: 'Crie sua conta', description: 'Entre na plataforma e faça seu cadastro para começar.', icon: CircleUserRound },
    { title: 'Cadastre seu veículo', description: 'Adicione os dados do veículo que receberá a etiqueta.', icon: CarFront },
    { title: 'Escolha sua etiqueta', description: 'Selecione a identificação adequada ao perfil de uso.', icon: Tag },
    { title: 'Receba e aplique', description: 'Receba em casa ou retire em um ponto de coleta e aplique no vidro.', icon: ShoppingBag }
];

onMounted(async () => {
    if (!manifesto.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    await waitForLandingV2Ready();
    const { default: gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);
    motionContext = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>('.v2-section03__card', manifesto.value!);
        const setCardState = (progress: number) => {
            const current = progress <= 0 ? -1 : Math.min(2, Math.floor(progress * 3));
            activeCard.value = current;
            section03Progress.value = progress;
            cards.forEach((card, index) => {
                if (index === current) gsap.set(card, { autoAlpha: 1, y: 0, scale: 1, filter: 'saturate(1)' });
                else if (index < current) gsap.set(card, { autoAlpha: .68, y: 4, scale: .985, filter: 'saturate(.78)' });
                else gsap.set(card, { autoAlpha: .24, y: 22, scale: .98, filter: 'saturate(.4)' });
            });
        };
        section03Media = gsap.matchMedia();
        section03Media.add('(min-width: 801px)', () => {
            if (!manifestoViewport.value) return undefined;
            const trigger = ScrollTrigger.create({
                trigger: manifesto.value,
                start: 'top top',
                end: () => `+=${Math.max(window.innerHeight * 2, manifesto.value!.offsetHeight - window.innerHeight)}`,
                pin: manifestoViewport.value,
                pinSpacing: false,
                scrub: .7,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: self => setCardState(self.progress)
            });
            setCardState(0);
            return () => trigger.kill();
        });
        section03Media.add('(max-width: 800px)', () => {
            const trigger = ScrollTrigger.create({
                trigger: manifesto.value,
                start: 'top 72%',
                end: 'bottom 38%',
                scrub: .7,
                invalidateOnRefresh: true,
                onUpdate: self => setCardState(self.progress)
            });
            setCardState(0);
            return () => trigger.kill();
        });
        if (story.value) {
            gsap.to({}, { scrollTrigger: { trigger: story.value, start: 'top top', end: '+=250%', pin: '.v2-story__viewport', scrub: .7, onUpdate: self => { activeScene.value = Math.min(3, Math.floor(self.progress * 4)); } } });
        }
        const flowSteps = flowItems.value;
        if (productFlow.value && flowProgress.value && flowSteps.length) {
            const setFlowState = (value: number) => {
                const current = value <= .08 ? -1 : Math.min(flowSteps.length - 1, Math.floor((value - .08) / .23));
                gsap.set(flowProgress.value, { scaleY: value });
                flowSteps.forEach((step, index) => {
                    step.classList.toggle('is-active', index <= current);
                    step.classList.toggle('is-current', index === current);
                });
            };
            const flowTrigger = ScrollTrigger.create({
                trigger: productFlow.value,
                start: 'top 72%',
                end: () => `+=${Math.max(window.innerHeight * 2.25, productFlow.value!.offsetHeight * .8)}`,
                scrub: .7,
                invalidateOnRefresh: true,
                onUpdate: self => setFlowState(self.progress)
            });
            setFlowState(0);
            flowSteps.forEach((step, index) => {
                gsap.fromTo(step, { opacity: .28, x: index % 2 ? -34 : 34, y: 14, scale: .98 }, {
                    opacity: 1, x: 0, y: 0, scale: 1, duration: .55, ease: 'power3.out',
                    scrollTrigger: { trigger: step, start: 'top 82%', end: 'top 58%', scrub: .6, invalidateOnRefresh: true }
                });
            });
            flowTrigger.refresh();
        }
        if (signalFlow.value) {
            const introParts = signalFlow.value.querySelectorAll<HTMLElement>('.v2-product-flow__intro > *');
            const steps = signalFlow.value.querySelectorAll<HTMLElement>('.v2-product-flow__step');
            const arrows = signalFlow.value.querySelectorAll<HTMLElement>('.v2-product-flow__arrow');
            const timeline = gsap.timeline({
                scrollTrigger: { trigger: signalFlow.value, start: 'top 78%', once: true }
            });

            if (introParts.length) timeline.from(introParts, { y: 38, autoAlpha: 0, duration: .72, stagger: .12, ease: 'power3.out' });
            if (steps.length) timeline.from(steps, { y: 56, autoAlpha: 0, scale: .94, rotateX: 5, transformPerspective: 900, duration: .72, stagger: .11, ease: 'power3.out' }, '-=.28');
            if (arrows.length) timeline.from(arrows, { autoAlpha: 0, scale: .55, rotate: -70, duration: .42, stagger: .07, ease: 'back.out(1.6)' }, '-=.5');
        }
    }, manifesto.value);
});
onBeforeUnmount(() => {
    section03Media?.revert();
    motionContext?.revert();
});
</script>

<template>
    <div>
        <section id="projeto" ref="manifesto" class="v2-section03" aria-labelledby="v2-manifesto-title">
            <div ref="manifestoViewport" class="v2-section03__viewport">
                <div class="v2-section03__copy">
                    <p class="v2-pill v2-section03__eyebrow">{ POR QUE EXISTE }</p>
                    <h2 id="v2-manifesto-title">Quando falta<br><span class="heading-highlight">contexto,</span><br>sobra interpretação.</h2>
                    <p class="v2-section03__supporting">No trânsito, uma situação pode parecer pressa, descuido ou risco. O projeto nasce para tornar sinais importantes visíveis e gerar mais atenção entre motoristas.</p>
                    <div class="v2-section03__chips"><span><MessageCircle :size="14" />Mais contexto</span><span><HeartHandshake :size="14" />Mais empatia</span><span><UsersRound :size="14" />Mais atenção</span></div>
                </div>
                <div class="v2-section03__cards" aria-label="Por que a etiqueta existe">
                    <article v-for="(card, index) in section03Cards" :key="card.title" class="v2-section03__card" :class="{ 'is-active': activeCard === index, 'is-past': activeCard > index }">
                        <div class="v2-section03__card-icon"><img :src="card.icon" :alt="`Ícone de ${card.title}`" loading="lazy" decoding="async" width="180" height="180" /></div>
                        <h3>{{ card.title }}</h3><i class="v2-section03__divider"></i><p>{{ card.body }}</p>
                    </article>
                    <div class="v2-section03__progress" :style="{ '--section-progress': section03Progress }" aria-hidden="true"><span></span><i v-for="(_, index) in section03Cards" :key="index" :class="{ 'is-active': activeCard >= index }"></i></div>
                </div>
            </div>
        </section>
        <!-- legacy manifesto content intentionally replaced by the V2 storytelling layout -->
        <section v-if="false" class="v2-manifesto" aria-hidden="true">
            <p class="v2-pill">Por que existe</p>
            <h2 id="v2-manifesto-title">A gente reage ao que vê.<br>Mas nem sempre vê o <span>contexto inteiro.</span></h2>
            <p>Uma situação inesperada pode parecer descuido, pressa ou indecisão. Às vezes existe um contexto que quem está ao redor simplesmente não conhece.</p>
        </section>
        <section v-if="false" ref="story" class="v2-story" aria-labelledby="v2-story-title">
            <div class="v2-story__viewport">
                <div class="v2-story__visual" :class="`v2-story__visual--scene-${activeScene}`" aria-hidden="true">
                    <div class="v2-story__street"></div><div class="v2-story__car"><span></span><span></span><LandingV2TagArt color="branca" size="medium" /></div>
                    <div class="v2-story__scan"><ScanLine :size="22" /><i></i></div>
                    <div class="v2-story__context-card"><CircleCheck :size="18" /><span>Perfil de uso<br><b>Pessoa idosa</b></span></div>
                </div>
                <div class="v2-story__copy">
                    <p class="v2-pill v2-pill--light">Antes de reagir</p>
                    <h2 id="v2-story-title">{{ scenes[activeScene]?.title }}</h2>
                    <p>{{ scenes[activeScene]?.body }}</p>
                    <div class="v2-story__dots"><i v-for="(_, index) in scenes" :key="index" :class="{ 'is-active': index === activeScene }"></i></div>
                </div>
            </div>
        </section>
        <section v-if="false" ref="productFlow" class="v2-product-flow v2-product-flow--vertical" aria-labelledby="v2-flow-title">
            <header class="v2-product-flow__intro">
                <p class="v2-pill">Comece em poucos passos</p>
                <h2 id="v2-flow-title">Da escolha ao vidro.</h2>
                <p class="v2-product-flow__lead">Do cadastro à aplicação, tudo acontece em poucos passos.</p>
            </header>
            <div class="v2-product-flow__timeline" aria-hidden="true"><span class="v2-product-flow__track"></span><span ref="flowProgress" class="v2-product-flow__progress"></span></div>
            <ol class="v2-product-flow__path">
                <li v-for="(step, index) in flowSteps" :key="step.title" ref="flowItems" class="v2-product-flow__step">
                    <span class="v2-product-flow__milestone" aria-hidden="true"></span>
                    <article>
                        <small>Etapa {{ String(index + 1).padStart(2, '0') }} / 04</small>
                        <i aria-hidden="true"><component :is="step.icon" :size="22" /></i>
                        <h3>{{ step.title }}</h3>
                        <p>{{ step.description }}</p>
                    </article>
                </li>
            </ol>
        </section>
        <LandingProjectNetwork />
        <section v-if="false" ref="productFlow" class="v2-product-flow v2-product-flow--vertical" aria-labelledby="v2-flow-title">
            <header class="v2-product-flow__intro">
                <p class="v2-pill">Comece em poucos passos</p>
                <h2 id="v2-flow-title">Da escolha ao vidro.</h2>
                <p class="v2-product-flow__lead">Do cadastro à aplicação, tudo acontece em poucos passos.</p>
            </header>
            <div class="v2-product-flow__timeline" aria-hidden="true"><span class="v2-product-flow__track"></span><span ref="flowProgress" class="v2-product-flow__progress"></span></div>
            <ol class="v2-product-flow__path">
                <li v-for="(step, index) in flowSteps" :key="step.title" ref="flowItems" class="v2-product-flow__step">
                    <span class="v2-product-flow__milestone" aria-hidden="true"></span>
                    <article>
                        <small>Etapa {{ String(index + 1).padStart(2, '0') }} / 04</small>
                        <i aria-hidden="true"><component :is="step.icon" :size="22" /></i>
                        <h3>{{ step.title }}</h3>
                        <p>{{ step.description }}</p>
                    </article>
                </li>
            </ol>
        </section>
        <section ref="signalFlow" class="v2-product-flow" aria-labelledby="v2-flow-title">
            <div class="v2-product-flow__intro">
                <div>
                    <p class="v2-pill">Na prática</p>
                    <h2 id="v2-flow-title">Do sinal à <span class="heading-highlight">compreensão.</span></h2>
                </div>
                <p class="v2-product-flow__lead">A etiqueta transforma um gesto simples em uma sequência de informação: do veículo à leitura, do sinal à compreensão.</p>
            </div>
            <div class="v2-product-flow__path">
                <article class="v2-product-flow__step"><i aria-hidden="true"><img src="/landing-v2/images/carro-it.webp?v=2" width="48" height="48" loading="lazy" decoding="async" alt=""></i><span>Veículo</span><small>O contexto começa onde tudo acontece.</small></article><ArrowDown class="v2-product-flow__arrow" :size="20" />
                <article class="v2-product-flow__step"><i aria-hidden="true"><img src="/landing-v2/images/etiqueta-it.webp?v=2" width="48" height="48" loading="lazy" decoding="async" alt=""></i><span>Etiqueta</span><small>Uma cor torna o sinal visível.</small></article><ArrowDown class="v2-product-flow__arrow" :size="20" />
                <article class="v2-product-flow__step"><i aria-hidden="true"><img src="/landing-v2/images/qr-code-it.webp?v=2" width="48" height="48" loading="lazy" decoding="async" alt=""></i><span>QR Code</span><small>Uma leitura amplia a informação.</small></article><ArrowDown class="v2-product-flow__arrow" :size="20" />
                <article class="v2-product-flow__step"><i aria-hidden="true"><img src="/landing-v2/images/infos-it.webp?v=2" width="48" height="48" loading="lazy" decoding="async" alt=""></i><span>Informação</span><small>Contexto, sem expor identidade.</small></article>
            </div>
        </section>
    </div>
</template>

<style scoped>
.v2-manifesto { max-width:1140px; margin:auto; padding:clamp(110px,15vw,210px) 28px clamp(100px,13vw,170px); font-family:'Instrument Sans',Arial,sans-serif; }.v2-pill { display:inline-flex; margin:0 0 21px; padding:8px 12px; border:1px solid rgba(20,93,245,.2); border-radius:999px; background:#f4f8ff; color:#0b42a8; font-size:11px; font-weight:750; letter-spacing:.12em; text-transform:uppercase; }.v2-manifesto h2,.v2-product-flow h2 { max-width:960px; margin:0; font-size:clamp(44px,5.4vw,78px); font-weight:700; letter-spacing:-.058em; line-height:1.01; }.v2-manifesto h2 span { color:#145df5; }.v2-manifesto>p:last-child { max-width:530px; margin:32px 0 0 auto; color:#70747c; font-size:clamp(17px,1.45vw,21px); line-height:1.55; }.v2-ribbon { display:flex; overflow:hidden; padding:18px 0; transform:rotate(-2.2deg) scale(1.03); background:#145df5; color:#fff; font:700 clamp(18px,2.1vw,30px)/1 'Instrument Sans',Arial,sans-serif; letter-spacing:-.04em; white-space:nowrap; }.v2-ribbon div { display:flex; animation:v2-ribbon 28s linear infinite; }.v2-ribbon b { margin:0 22px; color:#f7c35d; }@keyframes v2-ribbon{to{transform:translateX(-50%)}}
.v2-story { height:350vh; margin-top:clamp(72px,10vw,130px); background:#061333; color:#fff; }.v2-story__viewport { position:relative; display:grid; min-height:100vh; grid-template-columns:1.08fr .92fr; align-items:center; gap:5vw; padding:120px clamp(24px,7vw,104px) 60px; overflow:hidden; }.v2-story__visual { position:relative; aspect-ratio:1.1; overflow:hidden; border:1px solid rgba(185,211,255,.25); border-radius:32px; background:radial-gradient(circle at 67% 20%,#255cc0,transparent 22%),linear-gradient(155deg,#0e357b,#061333 65%); transition:transform .75s ease,filter .75s ease; }.v2-story__street { position:absolute; left:-11%; right:-11%; bottom:-25%; height:68%; background:repeating-linear-gradient(90deg,transparent 0 12%,rgba(255,255,255,.8) 12% 18%,transparent 18% 32%),linear-gradient(#31496f,#071226); transform:perspective(350px) rotateX(57deg); }.v2-story__car { position:absolute; left:24%; bottom:25%; width:54%; height:33%; border:1px solid #a9c8ff; border-radius:40% 48% 13% 13%; background:linear-gradient(160deg,#c8ddff,#2456a2 25%,#0b1d3d 72%); box-shadow:0 25px 30px rgba(0,0,0,.3); transition:transform .8s ease; }.v2-story__car::before { content:''; position:absolute; top:11%; left:27%; width:45%; height:45%; border:1px solid #c8deff; border-radius:42% 42% 6% 6%; background:rgba(208,229,255,.28); }.v2-story__car>span { position:absolute; bottom:-16%; width:18%; aspect-ratio:1; border:7px solid #071226; border-radius:50%; background:#69768e; }.v2-story__car>span:first-child{left:17%}.v2-story__car>span:nth-child(2){right:14%}.v2-story__car :deep(.tag-art) { position:absolute; z-index:2; right:13%; bottom:13%; width:24%; transform:rotate(-6deg); opacity:.2; transition:opacity .55s ease,transform .55s ease; }.v2-story__scan { position:absolute; top:27%; right:15%; display:grid; place-items:center; width:62px; height:62px; border:1px solid #8bb2ff; border-radius:50%; color:#fff; opacity:0; transform:scale(.5); transition:.55s ease; }.v2-story__scan i { position:absolute; left:-50%; right:-50%; top:50%; height:1px; background:#8bb2ff; }.v2-story__context-card { position:absolute; right:8%; bottom:14%; display:flex; align-items:center; gap:10px; padding:14px 16px; border:1px solid rgba(255,255,255,.2); border-radius:13px; background:rgba(255,255,255,.94); color:#091a3c; font-size:12px; opacity:0; transform:translateY(20px); transition:.6s ease; }.v2-story__context-card svg{color:#145df5}.v2-story__copy { max-width:520px; }.v2-pill--light { border-color:rgba(255,255,255,.22); background:rgba(255,255,255,.09); color:#d6e4ff; }.v2-story__copy h2 { margin:0; font-size:clamp(44px,5.3vw,75px); letter-spacing:-.06em; line-height:.99; }.v2-story__copy>p:not(.v2-pill) { max-width:390px; margin:28px 0 0; color:#cbd8f0; font-size:18px; line-height:1.55; }.v2-story__dots{display:flex;gap:7px;margin-top:36px}.v2-story__dots i{width:8px;height:8px;border:1px solid #8bb2ff;border-radius:50%;transition:.3s}.v2-story__dots .is-active{width:29px;border-radius:9px;background:#8bb2ff}.v2-story__visual--scene-1 .v2-story__car{transform:scale(1.16) translate(-4%,8%)}.v2-story__visual--scene-1{filter:brightness(.86)}.v2-story__visual--scene-2 .v2-story__car :deep(.tag-art),.v2-story__visual--scene-3 .v2-story__car :deep(.tag-art){opacity:1;transform:rotate(-6deg) scale(1.3)}.v2-story__visual--scene-2 .v2-story__scan,.v2-story__visual--scene-3 .v2-story__scan{opacity:1;transform:scale(1)}.v2-story__visual--scene-3 .v2-story__context-card{opacity:1;transform:none}
 .v2-product-flow { padding:clamp(105px,12vw,170px) var(--v2-grid-inset); background:#fafaf7; font-family:'Instrument Sans',Arial,sans-serif; }.v2-product-flow__intro { display:grid; grid-template-columns:minmax(0,1.15fr) minmax(280px,.7fr); align-items:end; gap:clamp(48px,9vw,150px); width:100%; max-width:var(--v2-grid-max); margin:0 auto; }.v2-product-flow__intro .v2-pill { width:max-content; }.v2-product-flow h2 { max-width:780px; margin:0; color:#29374d; font-size:clamp(48px,5.4vw,78px); font-weight:700; letter-spacing:-.065em; line-height:.98; }.v2-product-flow h2 span { color:#145df5; }.v2-product-flow__lead { max-width:390px; margin:0 0 8px; color:#69717d; font-size:18px; line-height:1.55; }.v2-product-flow__path { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:14px; width:100%; max-width:var(--v2-grid-max); margin:clamp(66px,8vw,108px) auto 0; }.v2-product-flow__step { position:relative; min-height:180px; padding:24px 24px 22px; border:1px solid #dbe2ee; border-radius:18px; background:rgba(255,255,255,.76); box-shadow:0 12px 30px rgba(20,45,90,.035); transition:transform .3s ease,border-color .3s ease,box-shadow .3s ease; }.v2-product-flow__step::after { content:'→'; position:absolute; top:50%; right:-20px; z-index:2; display:grid; width:38px; height:38px; place-items:center; border:1px solid #c8d8f6; border-radius:50%; background:#fafaf7; color:#145df5; font-size:20px; transform:translateY(-50%); }.v2-product-flow__step:nth-of-type(4)::after { display:none; }.v2-product-flow__step:hover { border-color:#9ebcf2; box-shadow:0 18px 38px rgba(20,65,145,.09); transform:translateY(-4px); }.v2-product-flow__step i { display:block; margin-bottom:42px; color:#145df5; font-size:12px; font-style:normal; font-weight:750; letter-spacing:.06em; }.v2-product-flow__step i img { display:block; box-sizing:border-box; width:64px; height:64px; padding:10px; object-fit:contain; }.v2-product-flow__step span { display:block; color:#101114; font-size:clamp(21px,2.2vw,31px); font-weight:700; letter-spacing:-.045em; }.v2-product-flow__step small { display:block; max-width:170px; margin-top:9px; color:#70747c; font-size:13px; line-height:1.4; }.v2-product-flow__arrow { display:none; }
@media(max-width:800px){.v2-story{height:auto}.v2-story__viewport{grid-template-columns:1fr;min-height:auto;padding:100px 24px}.v2-story__visual{max-width:660px;width:100%;margin:auto}.v2-story__copy{max-width:660px;margin:auto}.v2-story__visual :deep(.tag-art){opacity:1;transform:rotate(-6deg) scale(1.2)}.v2-story__scan,.v2-story__context-card{opacity:1;transform:none}.v2-product-flow__intro{display:block}.v2-product-flow__path{grid-template-columns:1fr;gap:0;max-width:550px}.v2-product-flow__arrow{justify-self:start;margin:-4px 0}.v2-product-flow__step{min-height:auto;padding:22px 0}.v2-product-flow__step i{margin-bottom:11px}}
@media (min-width:801px) and (max-height:760px){.v2-story__viewport{min-height:calc(100vh + 72px);padding-top:170px;padding-bottom:90px}}
@media(max-width:560px){.v2-manifesto{padding-left:20px;padding-right:20px}.v2-manifesto h2,.v2-product-flow h2{font-size:45px}.v2-manifesto>p:last-child{margin-left:0}.v2-story__copy h2{font-size:48px}.v2-story__viewport{padding-left:20px;padding-right:20px}.v2-product-flow{padding-left:20px;padding-right:20px}.v2-product-flow__lead{font-size:16px}.v2-product-flow__path{gap:12px}.v2-product-flow__step{min-height:150px;padding:20px}.v2-product-flow__step::after{top:auto;right:auto;bottom:-25px;left:50%;content:'↓';width:36px;height:36px;transform:translateX(-50%)}.v2-product-flow__step:nth-of-type(4)::after{display:none}.v2-product-flow__step i{margin-bottom:24px}.v2-ribbon div{animation-duration:35s}}@media(prefers-reduced-motion:reduce){.v2-ribbon div{animation:none}}
</style>

<style scoped>
/* Override definitivo do detalhe azul dos cards desktop. */
@media (min-width: 801px) {
    .v2-product-flow__step::before,
    .v2-product-flow__step::after {
        left: 25px !important;
        width: 48px !important;
    }
}

@media (max-width: 800px) {
    .v2-product-flow__lead {
        margin-top: 22px !important;
    }
}
</style>

<style scoped>
.v2-product-flow__step i img {
    width: 48px;
    height: 48px;
    padding: 0;
    box-sizing: content-box;
}
</style>

<style scoped>
/* Vertical scroll journey for the isolated Como Funciona section. */
.v2-product-flow--vertical {
    position: relative;
    padding: clamp(100px, 11vw, 160px) var(--v2-grid-inset) clamp(120px, 14vw, 190px);
    background: #f4f8ff;
    overflow: clip;
}
.v2-product-flow--vertical .v2-product-flow__intro {
    display: block;
    max-width: 860px;
    text-align: center;
}
.v2-product-flow--vertical .v2-product-flow__intro .v2-pill { margin-inline: auto; }
.v2-product-flow--vertical h2 {
    max-width: 760px;
    margin: 0 auto;
    color: #29374d;
    font-size: 56px !important;
    font-weight: 600 !important;
    letter-spacing: -.025em !important;
    line-height: .98 !important;
}
.v2-product-flow--vertical .v2-product-flow__lead {
    max-width: 500px;
    margin: 22px auto 0;
    color: #697b99;
    font-size: 17px;
    text-align: center;
}
.v2-product-flow__timeline {
    position: absolute;
    top: 390px;
    bottom: 150px;
    left: 50%;
    width: 4px;
    transform: translateX(-50%);
}
.v2-product-flow__track,
.v2-product-flow__progress { position: absolute; inset: 0; display: block; border-radius: 999px; }
.v2-product-flow__track { background: #dce7f7; }
.v2-product-flow__progress { transform: scaleY(0); transform-origin: top center; background: linear-gradient(#1769ff,#4b7cff); }
.v2-product-flow__path {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(80px, 9vw, 140px) 120px;
    max-width: 1120px;
    margin: clamp(90px, 10vw, 140px) auto 0;
    padding: 0;
    list-style: none;
}
.v2-product-flow--vertical .v2-product-flow__step {
    min-height: 180px;
    padding: 28px 32px;
    border: 1px solid #d6e2f5;
    border-radius: 16px;
    background: rgba(255,255,255,.82);
    box-shadow: 0 12px 30px rgba(32,70,130,.035);
    opacity: .42;
    transition: opacity .35s ease, border-color .35s ease, background .35s ease, transform .35s ease;
}
.v2-product-flow--vertical .v2-product-flow__step:nth-child(odd) { grid-column: 2; }
.v2-product-flow--vertical .v2-product-flow__step:nth-child(even) { grid-column: 1; }
.v2-product-flow--vertical .v2-product-flow__step.is-active { opacity: 1; border-color: #9bbcff; background: linear-gradient(135deg,rgba(23,105,255,.045),#fff); }
.v2-product-flow--vertical .v2-product-flow__step.is-current { transform: translateY(-4px); }
.v2-product-flow__step article { min-width: 0; }
.v2-product-flow__step small { display: block; margin: 0 0 18px; color: #145df5; font-size: 11px; font-weight: 750; letter-spacing: .12em; text-transform: uppercase; }
.v2-product-flow__step i { display: grid; width: 44px; height: 44px; margin: 0 0 20px; place-items: center; border: 1px solid #c4d7f5; border-radius: 10px; background: #edf4ff; color: #145df5; font-style: normal; }
.v2-product-flow__step h3 { margin: 0; color: #0c1b3c; font-size: 25px; font-weight: 600; letter-spacing: -.035em; line-height: 1.1; }
.v2-product-flow__step p { max-width: 330px; margin: 10px 0 0; color: #687b99; font-size: 15px; line-height: 1.5; }
.v2-product-flow__milestone { position: absolute; top: 50%; width: 14px; height: 14px; border: 2px solid #b6cbea; border-radius: 50%; background: #f4f8ff; transform: translateY(-50%); transition: .3s ease; }
.v2-product-flow__step:nth-child(odd) .v2-product-flow__milestone { left: -127px; }
.v2-product-flow__step:nth-child(even) .v2-product-flow__milestone { right: -127px; }
.v2-product-flow__step.is-active .v2-product-flow__milestone { border-color: #1769ff; background: #1769ff; box-shadow: 0 0 0 6px rgba(23,105,255,.12); }
@media (min-width: 1441px) and (max-width: 1600px) { .v2-product-flow--vertical h2 { font-size: 52px !important; } }
@media (min-width: 1200px) and (max-width: 1440px) { .v2-product-flow--vertical h2 { font-size: 48px !important; } }
@media (min-width: 1001px) and (max-width: 1199px) { .v2-product-flow--vertical h2 { font-size: 44px !important; } }
@media (min-width: 801px) and (max-width: 1000px), (max-width: 800px) { .v2-product-flow--vertical h2 { font-size: 32px !important; line-height: 1.04 !important; } }
@media (max-width: 800px) {
    .v2-product-flow--vertical { padding-inline: 24px; }
    .v2-product-flow__timeline { top: 330px; bottom: 110px; left: 28px; width: 3px; transform: none; }
    .v2-product-flow__path { display: grid; grid-template-columns: 1fr; gap: 26px; margin-top: 72px; padding-left: 28px; }
    .v2-product-flow--vertical .v2-product-flow__step,
    .v2-product-flow--vertical .v2-product-flow__step:nth-child(odd),
    .v2-product-flow--vertical .v2-product-flow__step:nth-child(even) { grid-column: 1; min-height: 0; padding: 24px 20px; }
    .v2-product-flow__step:nth-child(odd) .v2-product-flow__milestone,
    .v2-product-flow__step:nth-child(even) .v2-product-flow__milestone { left: -36px; right: auto; }
}
@media (max-width: 390px) { .v2-product-flow--vertical h2 { font-size: 30px !important; } }
@media (prefers-reduced-motion: reduce) { .v2-product-flow--vertical .v2-product-flow__step { transition: none; } }
</style>

<style scoped>
/* Overrides finais da faixa editorial. */
.v2-product-flow h2 { font-size:clamp(44px,5vw,74px)!important; font-weight:600!important; letter-spacing:-.025em!important; line-height:.98!important; }
.v2-product-flow__path { position:relative; }
.v2-product-flow__step > i { display:grid; }
.v2-product-flow__step > i svg { width:19px; height:19px; color:#145df5; stroke-width:2; }
.v2-product-flow__step > i::after { content:none!important; display:none!important; }
.v2-product-flow__icon-row { position:absolute; z-index:3; top:28px; right:0; left:0; display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); pointer-events:none; }
 .v2-product-flow__icon-row span { display:grid; width:42px; height:42px; place-items:center; border:1px solid rgba(20,93,245,.24); border-radius:8px; background:#fff; color:#145df5; box-shadow:0 5px 12px rgba(24,34,50,.06),inset 0 1px 0 #fff; animation:v2-flow-icon-in .65s cubic-bezier(.22,1,.36,1) both; }
 .v2-product-flow__icon-row span:nth-child(2){animation-delay:.08s}.v2-product-flow__icon-row span:nth-child(3){animation-delay:.16s}.v2-product-flow__icon-row span:nth-child(4){animation-delay:.24s}
 @keyframes v2-flow-icon-in { from { opacity:0; transform:translateY(10px) scale(.94); } to { opacity:1; transform:none; } }
.v2-product-flow__icon-row span:nth-child(1) { margin-left:28px; }
.v2-product-flow__icon-row span:nth-child(2),.v2-product-flow__icon-row span:nth-child(3),.v2-product-flow__icon-row span:nth-child(4) { margin-left:28px; }
@media (max-width:800px) { .v2-product-flow h2{font-size:clamp(36px,6vw,52px)!important}.v2-product-flow__icon-row{top:25px}.v2-product-flow__icon-row span{margin-left:18px!important} }
@media (max-width:560px) { .v2-product-flow h2{font-size:clamp(34px,10vw,46px)!important}.v2-product-flow__icon-row{position:static;display:none} }
@media (prefers-reduced-motion:reduce) { .v2-product-flow__icon-row span { animation:none; } }
</style>

<style scoped>
.v2-section03__card-icon {
    width: 92px;
    height: 92px;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
}
.v2-section03__card-icon img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
}
.v2-section03__card.is-active .v2-section03__card-icon {
    border: 0;
    box-shadow: none;
    filter: drop-shadow(0 8px 16px rgba(20,111,245,.2));
}
@media (max-width: 800px) {
    .v2-section03__card-icon { width: 84px; height: 84px; }
}
</style>

<style scoped>
/* Final overrides for the new vertical flow, kept after the legacy flow rules. */
.v2-product-flow--vertical { position: relative; padding: clamp(100px,11vw,160px) var(--v2-grid-inset) clamp(120px,14vw,190px); background: #f4f8ff; overflow: clip; }
.v2-product-flow--vertical .v2-product-flow__intro { display: block; max-width: 860px; margin-inline: auto; text-align: center; }
.v2-product-flow--vertical .v2-product-flow__intro .v2-pill { width: max-content; margin-inline: auto; }
.v2-product-flow--vertical h2 { max-width: 760px; margin: 0 auto; color: #29374d; font-size: 56px!important; font-weight: 600!important; letter-spacing: -.025em!important; line-height: .98!important; }
.v2-product-flow--vertical .v2-product-flow__lead { max-width: 500px; margin: 22px auto 0; color: #697b99; font-size: 17px; line-height: 1.5; text-align: center; }
.v2-product-flow__timeline { position: absolute; top: 390px; bottom: 150px; left: 50%; width: 4px; transform: translateX(-50%); }
.v2-product-flow__track,.v2-product-flow__progress { position: absolute; inset: 0; display: block; border-radius: 999px; }
.v2-product-flow__track { background: #dce7f7; }
.v2-product-flow__progress { transform: scaleY(0); transform-origin: top center; background: linear-gradient(#1769ff,#4b7cff); }
.v2-product-flow--vertical .v2-product-flow__path { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: clamp(80px,9vw,140px) 120px; max-width: 1120px; margin: clamp(90px,10vw,140px) auto 0; padding: 0; list-style: none; }
.v2-product-flow--vertical .v2-product-flow__step { position: relative; min-height: 180px; padding: 28px 32px; border: 1px solid #d6e2f5; border-radius: 16px; background: rgba(255,255,255,.82); box-shadow: 0 12px 30px rgba(32,70,130,.035); opacity: .42; transition: opacity .35s ease,border-color .35s ease,background .35s ease,transform .35s ease; }
.v2-product-flow--vertical .v2-product-flow__step:nth-child(odd) { grid-column: 2; }
.v2-product-flow--vertical .v2-product-flow__step:nth-child(even) { grid-column: 1; }
.v2-product-flow--vertical .v2-product-flow__step.is-active { opacity: 1; border-color: #9bbcff; background: linear-gradient(135deg,rgba(23,105,255,.045),#fff); }
.v2-product-flow--vertical .v2-product-flow__step.is-current { transform: translateY(-4px); }
.v2-product-flow--vertical .v2-product-flow__step article { min-width: 0; }
.v2-product-flow--vertical .v2-product-flow__step small { display: block; margin: 0 0 18px; color: #145df5; font-size: 11px; font-weight: 750; letter-spacing: .12em; text-transform: uppercase; }
.v2-product-flow--vertical .v2-product-flow__step i { display: grid; width: 44px; height: 44px; margin: 0 0 20px; place-items: center; border: 1px solid #c4d7f5; border-radius: 10px; background: #edf4ff; color: #145df5; font-style: normal; }
.v2-product-flow--vertical .v2-product-flow__step h3 { margin: 0; color: #0c1b3c; font-size: 25px; font-weight: 600; letter-spacing: -.035em; line-height: 1.1; }
.v2-product-flow--vertical .v2-product-flow__step p { max-width: 330px; margin: 10px 0 0; color: #687b99; font-size: 15px; line-height: 1.5; }
.v2-product-flow--vertical .v2-product-flow__step::before { content: ''; position: absolute; top: 50%; width: 120px; height: 1px; background: #cbdaf1; }
.v2-product-flow--vertical .v2-product-flow__step:nth-child(odd)::before { left: -120px; }
.v2-product-flow--vertical .v2-product-flow__step:nth-child(even)::before { right: -120px; }
.v2-product-flow--vertical .v2-product-flow__milestone { position: absolute; top: 50%; width: 14px; height: 14px; border: 2px solid #b6cbea; border-radius: 50%; background: #f4f8ff; transform: translateY(-50%); transition: .3s ease; }
.v2-product-flow--vertical .v2-product-flow__step:nth-child(odd) .v2-product-flow__milestone { left: -127px; }
.v2-product-flow--vertical .v2-product-flow__step:nth-child(even) .v2-product-flow__milestone { right: -127px; }
.v2-product-flow--vertical .v2-product-flow__step.is-active .v2-product-flow__milestone { border-color: #1769ff; background: #1769ff; box-shadow: 0 0 0 6px rgba(23,105,255,.12); }
@media (min-width:1441px) and (max-width:1600px) { .v2-product-flow--vertical h2 { font-size:52px!important; } }
@media (min-width:1200px) and (max-width:1440px) { .v2-product-flow--vertical h2 { font-size:48px!important; } }
@media (min-width:1001px) and (max-width:1199px) { .v2-product-flow--vertical h2 { font-size:44px!important; } }
@media (min-width:801px) and (max-width:1000px), (max-width:800px) { .v2-product-flow--vertical h2 { font-size:32px!important; line-height:1.04!important; } }
@media (max-width:800px) {
    .v2-product-flow--vertical { padding-inline:24px; }
    .v2-product-flow__timeline { top:330px; bottom:110px; left:28px; width:3px; transform:none; }
    .v2-product-flow--vertical .v2-product-flow__path { grid-template-columns:1fr; gap:26px; margin-top:72px; padding-left:28px; }
    .v2-product-flow--vertical .v2-product-flow__step,
    .v2-product-flow--vertical .v2-product-flow__step:nth-child(odd),
    .v2-product-flow--vertical .v2-product-flow__step:nth-child(even) { grid-column:1; min-height:0; padding:24px 20px; }
    .v2-product-flow--vertical .v2-product-flow__step::before { left:-28px!important; right:auto!important; width:28px; }
    .v2-product-flow--vertical .v2-product-flow__step:nth-child(odd) .v2-product-flow__milestone,
    .v2-product-flow--vertical .v2-product-flow__step:nth-child(even) .v2-product-flow__milestone { left:-36px; right:auto; }
}
@media (max-width:390px) { .v2-product-flow--vertical h2 { font-size:30px!important; } }
@media (prefers-reduced-motion:reduce) { .v2-product-flow--vertical .v2-product-flow__step { opacity:1; transform:none!important; transition:none; } }
</style>

<style scoped>
/* Linguagem editorial da seção: headline ampla e etapas em uma faixa aberta. */
.v2-product-flow { box-sizing:border-box; width:100%; max-width:100%; overflow-x:clip; padding-top:clamp(68px,8vw,108px); padding-bottom:clamp(62px,7vw,104px); background:#fbfbfa; }
.v2-product-flow__intro { grid-template-columns:minmax(0,1.35fr) minmax(270px,.65fr); align-items:end; gap:clamp(42px,8vw,150px); }
.v2-product-flow__intro > div,.v2-product-flow__lead,.v2-product-flow__step { min-width:0; }
.v2-product-flow__intro .v2-pill { display:block; width:max-content; margin:0 0 21px; padding:0; border:0; border-radius:0; background:transparent; color:#145df5; font-size:12px; font-weight:700; letter-spacing:.13em; line-height:1.2; text-transform:uppercase; }
.v2-product-flow__intro .v2-pill::before { content:'{ '; }
.v2-product-flow__intro .v2-pill::after { content:' }'; }
 .v2-product-flow h2 { max-width:900px; color:#29374d; font-size:56px!important; font-weight:600!important; letter-spacing:-.025em!important; line-height:.98!important; }
.v2-product-flow__lead { max-width:390px; margin:0 0 8px auto; color:#70747c; font-size:18px; line-height:1.5; text-align:right; }
.v2-product-flow__path { grid-template-columns:repeat(4,minmax(0,1fr)); gap:0; margin-top:clamp(48px,6vw,78px); border-top:0; }
 .v2-product-flow__step { min-height:225px; padding:34px 28px 34px; overflow:visible; border:0; border-top:1px solid #d8e0ec; border-left:1px solid #e1e5eb; border-right:0; border-radius:0; background:linear-gradient(180deg,#fff 0%,#fbfbfa 100%); box-shadow:inset 0 1px 0 rgba(255,255,255,.95),0 10px 24px rgba(24,34,50,.025); backdrop-filter:blur(8px); transition:none; }
.v2-product-flow__step:first-of-type { border-left:0; }
@media (min-width:801px) {
  .v2-product-flow__path > .v2-product-flow__step:first-child { border-left:0!important; }
}
.v2-product-flow__step + .v2-product-flow__step { padding-left:28px; }
.v2-product-flow__step:last-child { border-right:0; }
 .v2-product-flow__step::before { content:''; position:absolute; z-index:2; top:-1px; left:28px; width:42px; height:2px; background:#145df5; box-shadow:0 0 0 1px rgba(20,93,245,.08); }
 .v2-product-flow__step::after { content:''; position:absolute; z-index:1; top:0; left:28px; width:42px; height:54px; pointer-events:none; background:linear-gradient(180deg,rgba(20,93,245,.28),rgba(20,93,245,.12) 24%,rgba(20,93,245,0) 100%); filter:blur(9px); opacity:.9; transform:translateY(-1px); }
 .v2-product-flow__step:nth-of-type(4)::after { display:block; }
.v2-product-flow__step:hover { border-color:#d8e0ec; box-shadow:none; transform:none; }
 .v2-product-flow__step i { position:relative; z-index:1; display:grid; width:42px; height:42px; margin-bottom:42px; place-items:center; border:1px solid #cfd8e8; border-radius:8px; background:#fafaf7; color:#172033; font-size:0; font-style:normal; }
 .v2-product-flow__step i::after { color:#172033; font-size:20px; font-weight:500; line-height:1; }
 .v2-product-flow__step:nth-of-type(1) i::after { content:'✓'; }
 .v2-product-flow__step:nth-of-type(2) i::after { content:'◇'; }
 .v2-product-flow__step:nth-of-type(3) i::after { content:'#'; font-size:18px; }
 .v2-product-flow__step:nth-of-type(4) i::after { content:'!'; }
 .v2-product-flow__step span { color:#1d3150; font-size:clamp(20px,1.75vw,27px); font-weight:550; letter-spacing:-.035em; line-height:1.08; }
 .v2-product-flow__step small { max-width:180px; margin-top:14px; color:#718096; font-size:14px; font-weight:500; letter-spacing:normal; line-height:1.48; text-transform:none; }
@media (max-width:1100px) { .v2-product-flow__intro{grid-template-columns:minmax(0,1fr) minmax(230px,.6fr);gap:42px}.v2-product-flow__path{grid-template-columns:repeat(2,minmax(0,1fr))}.v2-product-flow__step{min-width:0}.v2-product-flow__step:nth-child(2){border-right:0}.v2-product-flow__step:nth-child(3),.v2-product-flow__step:nth-child(4){border-top:1px solid #e1e5eb} }
@media (min-width:801px) and (max-width:1100px) { .v2-product-flow__step:nth-child(odd){border-left:0} }
@media (max-width:800px) { .v2-product-flow__intro{grid-template-columns:1fr;gap:26px}.v2-product-flow__lead{margin:0;text-align:left}.v2-product-flow__path{grid-template-columns:1fr 1fr;margin-top:60px}.v2-product-flow__step{min-height:190px;padding:80px 18px 22px;border-bottom:1px solid #d8e0ec}.v2-product-flow__step+.v2-product-flow__step{padding-left:18px}.v2-product-flow__step:nth-child(2){border-right:0}.v2-product-flow__step:nth-child(3),.v2-product-flow__step:nth-child(4){border-bottom:0}.v2-product-flow__step i{margin-bottom:38px}.v2-product-flow__icon-row{top:25px;grid-template-columns:repeat(2,minmax(0,1fr))}.v2-product-flow__icon-row span{margin-left:18px!important} }
@media (max-width:560px) { .v2-product-flow{padding-left:20px;padding-right:20px}.v2-product-flow__intro .v2-pill{font-size:11px}.v2-product-flow h2{font-size:clamp(34px,10vw,46px)!important;font-weight:600!important;letter-spacing:-.025em!important;line-height:1.04!important}.v2-product-flow__lead{width:100%;font-size:16px}.v2-product-flow__path{position:relative;grid-template-columns:1fr;grid-auto-rows:208px;margin-top:48px}.v2-product-flow__step,.v2-product-flow__step+.v2-product-flow__step{box-sizing:border-box;min-height:190px;margin-bottom:18px;padding:78px 0 32px;border-right:0;border-bottom:1px solid #d8e0ec}.v2-product-flow__step:last-child{margin-bottom:0;border-bottom:0}.v2-product-flow__step i{margin-bottom:26px}.v2-product-flow__icon-row{position:absolute;top:0;right:0;bottom:0;left:0;display:grid;grid-template-columns:1fr;grid-template-rows:repeat(4,208px);align-items:start}.v2-product-flow__icon-row span{margin:22px 0 0!important} }
@media (min-width:1441px) and (max-width:1600px) { .v2-product-flow h2 { font-size:52px!important; } }
@media (min-width:1200px) and (max-width:1440px) { .v2-product-flow h2 { font-size:48px!important; } }
@media (min-width:1001px) and (max-width:1199px) { .v2-product-flow h2 { font-size:44px!important; } }
@media (min-width:801px) and (max-width:1000px) { .v2-product-flow h2 { font-size:32px!important; line-height:1.04!important; } }
@media (max-width:800px) { .v2-product-flow h2 { font-size:32px!important; line-height:1.04!important; } }
@media (max-width:390px) { .v2-product-flow h2 { font-size:30px!important; } }

/* Final responsive contract for the flow cards. */
.v2-product-flow { box-sizing:border-box; padding-left:var(--v2-grid-inset)!important; padding-right:var(--v2-grid-inset)!important; }
.v2-product-flow__path { width:100%!important; box-sizing:border-box; padding-left:0!important; padding-right:0!important; }
.v2-product-flow__step { border-radius:0; overflow:visible; }
.v2-product-flow__step > i img {
  width:48px!important;
  height:48px!important;
  padding:0!important;
  box-sizing:content-box!important;
}
@media (min-width:801px) {
  /* Aumenta somente a caixa do ícone, sem alterar o padding do card. */
  .v2-product-flow__step > i {
    box-sizing:border-box;
    width:64px!important;
    height:64px!important;
    padding:7px!important;
  }
  .v2-product-flow__step::before,
  .v2-product-flow__step::after {
    left:25px!important;
    width:45px!important;
  }
}
@media (max-width:800px) {
  .v2-product-flow { padding-left:16px!important; padding-right:16px!important; }
  .v2-product-flow__path { gap:14px!important; margin-top:48px!important; border-top:0!important; }
  .v2-product-flow__step,.v2-product-flow__step+.v2-product-flow__step { min-height:190px!important; margin:0!important; padding:24px 12px 28px!important; border:1px solid #dbe2ee!important; border-radius:18px!important; background:linear-gradient(180deg,#fff 0%,#fbfbfa 100%)!important; box-shadow:0 12px 30px rgba(20,45,90,.035)!important; }
  .v2-product-flow__step:first-of-type { border-left:1px solid #dbe2ee!important; }
  .v2-product-flow__step > i { margin-bottom:24px!important; }
  .v2-product-flow__step > i {
    box-sizing:border-box;
    width:54px!important;
    height:54px!important;
    padding:5px!important;
  }
  .v2-product-flow__step > i img {
    width:42px!important;
    height:42px!important;
  }
  .v2-product-flow__step::before,
  .v2-product-flow__step::after { left:25px!important; }
  .v2-product-flow__step::before,.v2-product-flow__step::after { left:25px!important; }
  .v2-product-flow__step:nth-child(3),.v2-product-flow__step:nth-child(4) { border-top:1px solid #dbe2ee!important; border-bottom:1px solid #dbe2ee!important; }
}
@media (max-width:560px) {
  .v2-product-flow { padding-left:12px!important; padding-right:12px!important; }
  .v2-product-flow__path { display:grid!important; grid-template-columns:1fr!important; gap:14px!important; margin-top:40px!important; }
  .v2-product-flow__step,.v2-product-flow__step+.v2-product-flow__step { min-height:184px!important; padding:24px 18px 28px!important; border-radius:16px!important; }
  .v2-product-flow__icon-row { display:grid!important; position:absolute!important; top:0!important; right:0!important; bottom:auto!important; left:0!important; grid-template-columns:1fr!important; grid-template-rows:repeat(4,198px)!important; }
  .v2-product-flow__icon-row span { margin:20px 0 0 18px!important; }
}
</style>

<style scoped>
.v2-section03{position:relative;z-index:1;isolation:isolate;max-width:none;height:300vh;margin:0;padding:0;overflow:clip;background:#030713;color:#f7f9ff}
.v2-section03__viewport{position:relative;isolation:isolate;display:grid;grid-template-columns:minmax(300px,.78fr) minmax(620px,1.22fr);align-items:center;gap:clamp(36px,5vw,88px);min-height:calc(100svh + clamp(48px,6vw,90px));padding:clamp(82px,9vw,128px) var(--v2-grid-inset) clamp(220px,calc(12vw + 100px),280px);overflow:hidden;background:#030713 url('/landing-v2/images/bg-terceira-secao.webp') center/cover no-repeat}
.v2-section03__viewport::before{content:'';position:absolute;z-index:-2;inset:0;background:linear-gradient(90deg,rgba(2,8,25,.98) 0%,rgba(2,8,25,.9) 30%,rgba(2,8,25,.58) 60%,rgba(2,8,25,.36) 100%),linear-gradient(180deg,rgba(2,8,25,.72),rgba(2,8,25,.12) 48%,rgba(2,8,25,.72)),radial-gradient(circle at 72% 48%,rgba(20,93,245,.14),transparent 42%)}
.v2-section03__viewport::after{content:'';position:absolute;z-index:-1;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,transparent 28%,rgba(1,4,15,.3) 100%)}
.v2-section03__copy{position:relative;z-index:2;max-width:500px}.v2-section03__eyebrow{display:block;margin:0 0 24px;padding:0;border:0;border-radius:0;background:transparent;color:rgba(220,232,255,.78);font-size:11px;font-weight:550;letter-spacing:.12em;line-height:1.2;text-transform:uppercase}.v2-section03__copy h2{max-width:520px;margin:0;color:#f7f9ff;font-size:56px;font-weight:600;letter-spacing:0;line-height:.98}.v2-section03__copy h2 span{color:#2f75ff}.v2-section03__supporting{max-width:420px;margin:30px 0 0;color:rgba(225,233,255,.72);font-size:17px;line-height:1.5}.v2-section03__chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}.v2-section03__chips span{display:inline-flex;align-items:center;gap:7px;padding:8px 11px;border:1px solid rgba(170,190,255,.2);border-radius:9px;background:rgba(4,12,33,.42);color:#86a4ff;font-size:12px}.v2-section03__chips svg{position:relative;top:-1px;color:#86a4ff}
.v2-section03__cards{position:relative;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:stretch;gap:14px;min-width:0;padding-bottom:54px}.v2-section03__card{position:relative;display:flex;min-height:450px;flex-direction:column;padding:30px 26px 28px;border:1px solid rgba(125,174,255,.2);border-radius:21px;background:linear-gradient(145deg,rgba(35,77,157,.28),rgba(7,18,50,.68) 52%,rgba(3,10,29,.78)),radial-gradient(circle at 100% 0,rgba(77,139,255,.2),transparent 42%);box-shadow:inset 0 1px 0 rgba(206,227,255,.08),0 18px 44px rgba(0,0,0,.18);backdrop-filter:blur(12px);opacity:.24;filter:saturate(.4);transform:translateY(22px) scale(.98);transition:opacity .35s ease,filter .35s ease,transform .35s ease,border-color .35s ease,box-shadow .35s ease}.v2-section03__card::before{content:'';position:absolute;inset:1px;border-radius:20px;pointer-events:none;background:linear-gradient(125deg,rgba(255,255,255,.09),transparent 24%,transparent 72%,rgba(78,143,255,.07));mix-blend-mode:screen}.v2-section03__card.is-active{opacity:1;filter:saturate(1);transform:none;border-color:rgba(62,145,255,.82);box-shadow:inset 0 1px 0 rgba(220,237,255,.16),0 0 0 1px rgba(54,108,255,.12),0 24px 58px rgba(0,0,0,.3),0 0 35px rgba(20,93,245,.12)}.v2-section03__card.is-past{opacity:.68;filter:saturate(.78);transform:translateY(4px) scale(.985)}.v2-section03__card-icon{position:relative;z-index:1;display:grid;width:62px;height:62px;place-items:center;margin-bottom:28px;border:1px solid rgba(136,185,255,.34);border-radius:15px;background:linear-gradient(145deg,rgba(52,117,226,.34),rgba(7,23,62,.8));color:#dceeff;box-shadow:inset 0 1px 0 rgba(255,255,255,.1)}.v2-section03__card.is-active .v2-section03__card-icon{border-color:rgba(82,160,255,.72);color:#fff;box-shadow:0 0 24px rgba(20,111,245,.28)}.v2-section03__card h3,.v2-section03__card p,.v2-section03__divider{position:relative;z-index:1}.v2-section03__card h3{max-width:230px;margin:0;color:#f3f6ff;font-size:19px;font-weight:550;letter-spacing:0;line-height:1.15}.v2-section03__divider{display:block;width:24px;height:2px;margin:18px 0;background:linear-gradient(90deg,#287dff,#62b0ff,transparent);transform-origin:left center;transition:transform .35s ease}.v2-section03__card.is-active .v2-section03__divider{transform:scaleX(2)}.v2-section03__card p{max-width:225px;margin:0;color:rgba(220,228,250,.68);font-size:14px;line-height:1.55}
.v2-section03__progress{position:absolute;right:0;bottom:12px;left:0;height:18px}.v2-section03__progress::before{content:'';position:absolute;top:8px;right:0;left:0;height:2px;background:rgba(112,155,230,.26)}.v2-section03__progress span{position:absolute;z-index:1;top:8px;left:0;width:100%;height:2px;transform:scaleX(var(--section-progress,0));transform-origin:left center;background:linear-gradient(90deg,#145df5,#3f8cff,#a8d1ff)}.v2-section03__progress i{position:relative;z-index:2;display:inline-block;width:12px;height:12px;margin:2px calc((100% - 36px)/6);border:1px solid rgba(167,200,255,.5);border-radius:50%;background:#080d21;transition:transform .3s ease,background .3s ease,box-shadow .3s ease}.v2-section03__progress i:first-of-type{margin-left:calc((100% - 36px)/6)}.v2-section03__progress i.is-active{background:#79a5ff;box-shadow:0 0 12px rgba(48,117,255,.8);transform:scale(1.18)}
@media(max-width:1440px) and (min-width:1201px){.v2-section03__copy h2{font-size:48px}}
@media(max-width:1200px) and (min-width:1001px){.v2-section03__copy h2{font-size:44px}}
@media(min-width:1101px){.v2-section03__card{min-height:410px}}
@media(max-width:1100px){.v2-section03__viewport{grid-template-columns:minmax(260px,.7fr) minmax(540px,1.3fr);gap:28px}.v2-section03__card{padding:24px 18px}.v2-section03__card h3{font-size:17px}.v2-section03__card p{font-size:13px}}
@media(max-width:1000px){.v2-section03__copy h2{font-size:32px}}
@media(max-width:800px){.v2-section03{width:100%;height:auto;min-height:0}.v2-section03__viewport{display:block;width:100%;min-height:auto;padding:100px var(--v2-grid-inset) 120px;background-position:58% center}.v2-section03__copy{max-width:620px;margin:0 auto 48px}.v2-section03__copy h2{font-size:32px}.v2-section03__supporting{font-size:16px}.v2-section03__cards{position:relative;display:grid;grid-template-columns:1fr;gap:14px;padding:0}.v2-section03__card{min-height:270px;padding:26px;opacity:1;filter:none;transform:none}.v2-section03__card:not(.is-active){opacity:.72}.v2-section03__card-icon{margin-bottom:22px}.v2-section03__progress{position:absolute;top:0;right:auto;bottom:0;left:-16px;width:2px;height:auto;margin:0}.v2-section03__progress::before{top:0;right:auto;bottom:0;left:0;width:2px;height:auto}.v2-section03__progress span{top:0;left:0;width:2px;height:100%;transform:scaleY(var(--section-progress,0));transform-origin:top center;background:linear-gradient(180deg,#145df5,#3f8cff,#a8d1ff)}.v2-section03__progress i{position:absolute;left:-5px;width:12px;height:12px;margin:0}.v2-section03__progress i:nth-of-type(1){top:0}.v2-section03__progress i:nth-of-type(2){top:calc(50% - 6px)}.v2-section03__progress i:nth-of-type(3){top:calc(100% - 12px)}}
@media(prefers-reduced-motion:reduce){.v2-section03{height:auto}.v2-section03__card,.v2-section03__card.is-active,.v2-section03__card.is-past{opacity:1;filter:none;transform:none}}
.v2-section03__card-icon{width:64px;height:64px;border:0;border-radius:0;background:transparent;box-shadow:none}.v2-section03__card-icon img{display:block;width:100%;height:100%;object-fit:contain}.v2-section03__card.is-active .v2-section03__card-icon{border:0;box-shadow:none;filter:drop-shadow(0 8px 16px rgba(20,111,245,.2))}
@media(max-width:800px){.v2-section03__card-icon{width:58px;height:58px}}
</style>

<style scoped>
.v2-section03,
.v2-section03__viewport,
.v2-section03__copy,
.v2-section03__cards,
.v2-section03__card {
    box-sizing: border-box;
}
.v2-section03__viewport,
.v2-section03__copy,
.v2-section03__cards {
    width: 100%;
}
.v2-section03__card-icon {
    width: 64px;
    height: 64px;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
}
.v2-section03__card-icon img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
}
.v2-section03__card.is-active .v2-section03__card-icon {
    border: 0;
    box-shadow: none;
    filter: drop-shadow(0 8px 16px rgba(20,111,245,.2));
}
@media (max-width: 800px) {
    .v2-section03 {
        width: 100vw;
        margin-left: calc(50% - 50vw);
        margin-right: calc(50% - 50vw);
        background: #030713 url('/landing-v2/images/bg-terceira-secao.webp') center/cover no-repeat;
    }
    .v2-section03__viewport,
    .v2-section03__copy,
    .v2-section03__cards,
    .v2-section03__card {
        width: 100%;
        margin-left: 0;
        margin-right: 0;
    }
    .v2-section03__viewport {
        background: transparent;
        padding-top: 76px;
        padding-left: 20px;
        padding-right: 20px;
    }
    .v2-section03__cards {
        width: calc(100% - 12px);
        margin-left: 12px;
    }
    .v2-section03__card {
        width: 100%;
    }
    .v2-section03__card-icon {
        width: 58px;
        height: 58px;
    }
    .v2-section03__progress {
        left: -12px;
    }
    .v2-section03__progress i,
    .v2-section03__progress i.is-active {
        width: 9px;
        height: 9px;
        transform: translateX(-2px);
    }
}
@media (max-width: 800px) {
    .v2-section03::before {
        z-index: 0;
        top: 100px;
        background: linear-gradient(180deg, rgba(2,8,25,.92), rgba(2,8,25,.42) 45%, rgba(2,8,25,.78)), radial-gradient(circle at 75% 55%, rgba(20,93,245,.14), transparent 48%);
    }
    .v2-section03::after {
        z-index: 0;
        top: 100px;
        background: radial-gradient(ellipse at center, transparent 30%, rgba(1,4,15,.28) 100%);
    }
    .v2-section03__viewport::before,
    .v2-section03__viewport::after {
        display: none;
    }
    .v2-section03__viewport {
        position: relative;
        z-index: 1;
    }
    .v2-section03__progress {
        display: grid;
        grid-template-rows: repeat(3, 1fr);
        justify-items: center;
    }
    .v2-section03__progress i {
        position: relative;
        top: auto !important;
        left: auto !important;
        align-self: start;
        margin: 26px 0 0;
        transform: translateX(-4px);
    }
    .v2-section03__progress i.is-active {
        transform: translateX(-4px) scale(1.14);
    }
    .v2-section03__progress i:nth-of-type(n + 2).is-active {
        transform: translateX(-4px) scale(1.14);
    }
    .v2-section03__progress i:nth-of-type(1) {
        transform: translateX(-1px);
    }
    .v2-section03__progress i:nth-of-type(1).is-active {
        transform: translateX(-1px) scale(1.14);
    }
    .v2-section03__progress i:nth-of-type(2),
    .v2-section03__progress i:nth-of-type(3) {
        transform: translateX(-3px);
    }
    .v2-section03__progress i:nth-of-type(2).is-active,
    .v2-section03__progress i:nth-of-type(3).is-active {
        transform: translateX(-3px) scale(1.14);
    }
}

@media (min-width: 801px) {
    .v2-product-flow__step::before,
    .v2-product-flow__step::after {
        left: 28px !important;
        width: 48px !important;
    }
}
</style>
