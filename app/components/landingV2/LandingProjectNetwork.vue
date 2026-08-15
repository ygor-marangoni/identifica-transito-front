<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Eye, Handshake, HeartHandshake, LockKeyhole, Network, ShieldCheck, UsersRound } from '@lucide/vue';
import { Pause, Play } from '@lucide/vue';

const section = ref<HTMLElement | null>(null);
const intro = ref<HTMLElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const panelContent = ref<HTMLElement | null>(null);
const progress = ref<HTMLElement | null>(null);
const activeTab = ref(0);
const isPaused = ref(false);
const isVisible = ref(true);

const tabs = [
    {
        title: 'Motorista', image: '/landing-v2/images/motorista.webp', alt: 'Motorista ao lado de um carro',
        body: 'Escolhe o contexto adequado ao seu veículo e contribui para uma condução mais clara e segura para todos.',
        footer: 'Sem dados pessoais. Apenas informações associadas ao contexto do veículo.',
        highlights: [{ title: 'Privacidade', body: 'Sem identificação pessoal.', icon: LockKeyhole }, { title: 'Mais clareza', body: 'Contexto certo, menos ruído.', icon: Eye }, { title: 'Responsabilidade', body: 'Todos colaboram por uma via melhor.', icon: ShieldCheck }]
    },
    {
        title: 'Rede de parceiros', image: '/landing-v2/images/rede-parceiros.webp', alt: 'Instituição representando uma rede de parceiros',
        body: 'Prefeituras, pontos de distribuição e parceiros ajudam a aproximar o projeto das cidades e da população.',
        footer: 'Uma rede preparada para ampliar o acesso ao projeto.',
        highlights: [{ title: 'Mais alcance', body: 'Identificação mais acessível.', icon: Network }, { title: 'Distribuição', body: 'Aproxima as etiquetas dos motoristas.', icon: Handshake }, { title: 'Colaboração', body: 'Projeto construído com diferentes agentes.', icon: UsersRound }]
    },
    {
        title: 'Mais atenção na via', image: '/landing-v2/images/pessoas.webp', alt: 'Grupo de pessoas representando a comunidade',
        body: 'Com sinais mais claros, outros condutores conseguem compreender melhor determinadas situações e reagir com mais atenção.',
        footer: 'Mais clareza para tornar a convivência no trânsito mais humana.',
        highlights: [{ title: 'Mais segurança', body: 'Decisões com mais informação.', icon: ShieldCheck }, { title: 'Mais empatia', body: 'Compreensão antes do julgamento.', icon: HeartHandshake }, { title: 'Mais atenção', body: 'Sinais simples para situações importantes.', icon: Eye }]
    }
];

const current = computed(() => tabs[activeTab.value]);
let motionContext: { revert: () => void } | undefined;
let autoplay: ReturnType<typeof setTimeout> | undefined;
let stopTabWatch: (() => void) | undefined;
let progressStart = 0;
let elapsed = 0;
const duration = 9000;

const clearAutoplay = () => { if (autoplay) clearTimeout(autoplay); autoplay = undefined; };
const updateProgress = () => {
    if (!progress.value || isPaused.value || !isVisible.value) return;
    const ratio = Math.min(1, (elapsed + (performance.now() - progressStart)) / duration);
    progress.value.style.transform = `scaleX(${ratio})`;
    if (ratio < 1) requestAnimationFrame(updateProgress);
};
const scheduleAutoplay = () => {
    clearAutoplay();
    if (isPaused.value || !isVisible.value) return;
    progressStart = performance.now();
    requestAnimationFrame(updateProgress);
    autoplay = setTimeout(() => { activeTab.value = (activeTab.value + 1) % tabs.length; elapsed = 0; scheduleAutoplay(); }, duration - elapsed);
};
const selectTab = (index: number, manual = true) => {
    activeTab.value = index;
    elapsed = 0;
    if (manual) scheduleAutoplay();
};
const togglePause = () => {
    if (isPaused.value) { isPaused.value = false; scheduleAutoplay(); }
    else { elapsed += performance.now() - progressStart; isPaused.value = true; clearAutoplay(); }
};
const onKeydown = (event: KeyboardEvent, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault(); selectTab(next); (event.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLElement>('[role=tab]')[next]?.focus();
};
const onVisibility = () => { isVisible.value = document.visibilityState === 'visible'; if (isVisible.value) scheduleAutoplay(); else { elapsed += performance.now() - progressStart; clearAutoplay(); } };

onMounted(async () => {
    if (!section.value) return;
    document.addEventListener('visibilitychange', onVisibility);
    const { default: gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    stopTabWatch = watch(activeTab, () => {
        if (reduced || !panelContent.value) return;
        const pieces = panelContent.value.querySelectorAll<HTMLElement>('.v2-network__state-head, .v2-network__highlights, .v2-network__footer');
        gsap.fromTo(pieces, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .42, stagger: .08, ease: 'power3.out', overwrite: true });
        gsap.fromTo(panelContent.value.querySelector('.v2-network__state-head > img'), { opacity: .45, scale: .92 }, { opacity: 1, scale: 1, duration: .5, ease: 'back.out(1.3)', overwrite: true });
        const qr = section.value?.querySelector<HTMLElement>('.v2-network__qr-stage img');
        const rings = section.value?.querySelectorAll<HTMLElement>('.v2-network__qr-stage i');
        const activeButton = section.value?.querySelector<HTMLElement>('.v2-network__tabs button.is-active');
        if (qr) gsap.fromTo(qr, { scale: .94, rotate: -1.5, opacity: .72 }, { scale: 1, rotate: 0, opacity: 1, duration: .65, ease: 'power3.out', overwrite: true });
        if (rings?.length) gsap.fromTo(rings, { scale: .9, opacity: .18 }, { scale: 1, opacity: .72, duration: .7, stagger: .06, ease: 'power2.out', overwrite: true });
        if (activeButton) {
            gsap.fromTo(activeButton, { backgroundColor: '#ffffff' }, { backgroundColor: '#f7faff', duration: .35, ease: 'power2.out', overwrite: true });
            gsap.fromTo(activeButton.querySelector('img'), { scale: .78, opacity: .45 }, { scale: 1, opacity: 1, duration: .45, ease: 'back.out(1.5)', overwrite: true });
            gsap.fromTo(activeButton.querySelector('span'), { y: 5, opacity: 0 }, { y: 0, opacity: 1, duration: .35, ease: 'power3.out', overwrite: true });
        }
    });
    motionContext = gsap.context(() => {
        if (reduced) { gsap.set([intro.value, panel.value], { clearProps: 'all', autoAlpha: 1 }); }
        else {
            if (intro.value) gsap.from(intro.value, { scrollTrigger: { trigger: section.value, start: 'top 78%', once: true }, y: 22, opacity: 0, duration: .65, ease: 'power3.out' });
            if (panel.value) gsap.from(panel.value, { scrollTrigger: { trigger: section.value, start: 'top 68%', once: true }, y: 28, opacity: 0, scale: .99, duration: .7, ease: 'power3.out' });
        }
    }, section.value);
    scheduleAutoplay();
});
onBeforeUnmount(() => { clearAutoplay(); stopTabWatch?.(); document.removeEventListener('visibilitychange', onVisibility); motionContext?.revert(); });
</script>

<template>
    <section ref="section" id="o-projeto" class="v2-network" aria-labelledby="v2-network-title">
        <div class="v2-network__inner">
            <header ref="intro" class="v2-network__intro">
                <p class="v2-network__eyebrow">{ O PROJETO }</p>
                <h2 id="v2-network-title">Uma rede para tornar a via<br><span>mais clara</span> antes do julgamento.</h2>
                <p>Conectamos motoristas, etiquetas e parceiros para entender melhor cada situação na via, com privacidade e responsabilidade.</p>
            </header>
            <div class="v2-network__tabs" role="tablist" aria-label="Ecossistema Identifica Trânsito">
                <button v-for="(tab, index) in tabs" :id="`network-tab-${index}`" :key="tab.title" type="button" role="tab" :aria-selected="activeTab === index" :aria-controls="'network-panel'" :tabindex="activeTab === index ? 0 : -1" :class="{ 'is-active': activeTab === index }" @click="selectTab(index)" @keydown="onKeydown($event, index)">
                    <img :src="tab.image" :alt="tab.alt" loading="lazy" decoding="async" width="180" height="180"><span>{{ tab.title }}</span>
                </button>
            </div>
            <div id="network-panel" ref="panel" class="v2-network__panel" role="tabpanel" :aria-labelledby="`network-tab-${activeTab}`">
                <div ref="panelContent" class="v2-network__content">
                    <div class="v2-network__state-head"><img :class="{ 'is-raised-asset': activeTab < 2 }" :src="current.image" :alt="current.alt" loading="lazy" decoding="async" width="180" height="180"><div><h3>{{ current.title }}</h3><p>{{ current.body }}</p></div></div>
                    <div class="v2-network__highlights"><div v-for="item in current.highlights" :key="item.title"><component :is="item.icon" :size="18" stroke-width="1.8" /><b>{{ item.title }}</b><span>{{ item.body }}</span></div></div>
                    <p class="v2-network__footer"><LockKeyhole :size="16" stroke-width="1.8" />{{ current.footer }}</p>
                </div>
                <div class="v2-network__qr-stage"><i v-for="n in 3" :key="n"></i><img src="/landing-v2/images/etiqueta.webp" alt="Medalhão azul Identifica Trânsito com QR Code" loading="lazy" decoding="async" width="912" height="912"></div>
            </div>
            <div class="v2-network__progress-row">
                <div class="v2-network__track"><span ref="progress"></span></div>
                <button type="button" class="v2-network__pause" :aria-label="isPaused ? 'Continuar troca automática' : 'Pausar troca automática'" @click="togglePause"><Play v-if="isPaused" :size="15" fill="currentColor" /><Pause v-else :size="15" fill="currentColor" /></button>
            </div>
        </div>
    </section>
</template>

<style scoped>
.v2-network{--blue:#145df5;--navy:#061333;position:relative;width:100%;overflow:hidden;background:radial-gradient(circle at 50% 52%,rgba(20,93,245,.055),transparent 39%),#fff;color:var(--navy);font-family:'Instrument Sans',Arial,sans-serif}.v2-network__inner{width:min(1648px,calc(100% - 48px));margin:auto;padding:clamp(82px,8vw,130px) 0 clamp(90px,9vw,140px)}.v2-network__intro{max-width:1080px;margin:auto;text-align:center}.v2-network__eyebrow{margin:0 0 24px;color:var(--blue);font-size:12px;font-weight:750;letter-spacing:.12em;text-transform:uppercase}.v2-network h2{margin:0;color:var(--navy);font-size:56px;font-weight:600;letter-spacing:-.035em;line-height:1.02}.v2-network h2 span{color:var(--blue)}.v2-network__intro>p:last-child{max-width:760px;margin:20px auto 0;color:#687894;font-size:18px;line-height:1.45}.v2-network__tabs{display:grid;grid-template-columns:repeat(3,1fr);max-width:1100px;margin:38px auto 0;border:1px solid rgba(20,93,245,.14);border-radius:18px 18px 0 0;overflow:hidden;background:#fff}.v2-network__tabs button{display:flex;align-items:center;justify-content:center;gap:12px;min-height:72px;border:0;border-bottom:3px solid transparent;background:#fff;color:#77849a;cursor:pointer;font:600 16px 'Instrument Sans',Arial,sans-serif}.v2-network__tabs button+button{border-left:1px solid rgba(20,93,245,.1)}.v2-network__tabs button.is-active{background:#f7faff;color:var(--blue);border-bottom-color:var(--blue)}.v2-network__tabs img{width:32px;height:32px;object-fit:contain;opacity:.7}.v2-network__tabs .is-active img{opacity:1}.v2-network__progress-row{display:flex;align-items:center;gap:18px;max-width:1100px;margin:auto;padding:12px 18px;border-left:1px solid rgba(20,93,245,.14);border-right:1px solid rgba(20,93,245,.14);background:#fff}.v2-network__track{height:4px;flex:1;overflow:hidden;border-radius:99px;background:#e7edf7}.v2-network__track span{display:block;width:100%;height:100%;transform:scaleX(0);transform-origin:left center;background:linear-gradient(90deg,#1769ff,#4b7cff)}.v2-network__pause{display:grid;width:34px;height:34px;place-items:center;border:1px solid rgba(20,93,245,.18);border-radius:50%;background:#fff;color:var(--blue);cursor:pointer;box-shadow:0 4px 12px rgba(15,55,130,.08)}.v2-network__pause span{font-size:15px;font-weight:800}.v2-network__panel{display:grid;grid-template-columns:1fr 1fr;align-items:center;min-height:390px;max-width:1100px;margin:auto;padding:44px 58px;border:1px solid rgba(20,93,245,.14);border-radius:0 0 26px 26px;background:rgba(255,255,255,.88);box-shadow:0 18px 50px rgba(20,60,130,.06)}.v2-network__state-head{display:grid;grid-template-columns:150px 1fr;align-items:center;gap:28px}.v2-network__state-head>img{width:140px;height:140px;object-fit:contain}.v2-network__state-head h3{margin:0;color:var(--navy);font-size:32px;letter-spacing:-.04em}.v2-network__state-head p{max-width:390px;margin:12px 0 0;color:#667894;font-size:17px;line-height:1.5}.v2-network__highlights{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:32px}.v2-network__highlights div{padding:14px 12px;border:1px solid rgba(20,93,245,.12);border-radius:13px;background:#f8faff}.v2-network__highlights b,.v2-network__highlights span{display:block}.v2-network__highlights b{color:var(--navy);font-size:13px}.v2-network__highlights span{margin-top:5px;color:#718096;font-size:11px;line-height:1.35}.v2-network__footer{margin:22px 0 0;padding:12px 15px;border-radius:12px;background:#f1f6ff;color:#45618f;font-size:13px}.v2-network__qr-stage{position:relative;display:grid;place-items:center;min-height:300px}.v2-network__qr-stage i{position:absolute;width:100px;height:100px;border:1px solid rgba(20,93,245,.1);border-radius:50%}.v2-network__qr-stage i:nth-child(1){width:270px;height:270px}.v2-network__qr-stage i:nth-child(2){width:220px;height:220px}.v2-network__qr-stage i:nth-child(3){width:170px;height:170px}.v2-network__qr-stage img{position:relative;z-index:1;width:min(29vw,330px);max-width:330px;filter:drop-shadow(0 20px 24px rgba(8,37,104,.2))}.v2-network__qr-stage:after{content:'';position:absolute;width:6px;height:6px;top:16%;left:22%;border-radius:50%;background:var(--blue);box-shadow:220px 180px 0 var(--blue)}
@media(max-width:1120px){.v2-network h2{font-size:46px}.v2-network__panel{padding:34px 32px}.v2-network__state-head{grid-template-columns:96px minmax(0,1fr);gap:18px}.v2-network__state-head>img{width:92px;height:92px}.v2-network__state-head h3{font-size:28px}.v2-network__qr-stage img{width:230px}}
@media(max-width:960px){.v2-network__panel{grid-template-columns:1fr;gap:10px;min-height:0}.v2-network__content{min-width:0}.v2-network__qr-stage{order:2;min-height:240px;margin-top:4px}.v2-network__highlights{margin-top:24px}.v2-network__qr-stage img{width:220px}}
@media(max-width:960px){.v2-network__qr-stage{justify-self:center;transform:none}}
@media(max-width:800px){.v2-network__inner{width:calc(100% - 40px);padding:74px 0 90px}.v2-network h2{font-size:36px}.v2-network__intro>p:last-child{font-size:16px}.v2-network__tabs{width:100%;margin-top:28px;overflow-x:auto;overscroll-behavior-x:contain;scrollbar-width:none}.v2-network__tabs::-webkit-scrollbar{display:none}.v2-network__tabs button{flex:0 0 33.333%;min-width:150px;min-height:62px;padding:0 12px;font-size:13px;white-space:nowrap}.v2-network__progress-row{padding:10px 12px}.v2-network__panel{padding:24px 20px}.v2-network__state-head{grid-template-columns:82px minmax(0,1fr)}.v2-network__state-head>img{width:78px;height:78px}.v2-network__state-head h3{font-size:24px}.v2-network__state-head p{font-size:15px}.v2-network__highlights{gap:7px}.v2-network__highlights div{padding:11px 9px 11px 38px}.v2-network__highlights svg{top:11px;left:10px}.v2-network__qr-stage{min-height:230px}.v2-network__qr-stage img{width:210px}.v2-network__qr-stage i:nth-child(1){width:220px;height:220px}.v2-network__qr-stage i:nth-child(2){width:175px;height:175px}.v2-network__qr-stage i:nth-child(3){width:135px;height:135px}}
@media(max-width:560px){.v2-network h2{font-size:32px;line-height:1.04}.v2-network__intro>p:last-child{font-size:15px}.v2-network__tabs button{min-width:138px;padding:0 10px;gap:6px;font-size:11px}.v2-network__tabs img{width:24px;height:24px}.v2-network__panel{padding:22px 16px}.v2-network__state-head{grid-template-columns:70px minmax(0,1fr);gap:12px}.v2-network__state-head>img{width:68px;height:68px}.v2-network__state-head h3{font-size:21px}.v2-network__state-head p{font-size:14px;line-height:1.4}.v2-network__highlights{grid-template-columns:1fr;margin-top:20px}.v2-network__footer{font-size:12px;line-height:1.35}.v2-network__qr-stage{min-height:210px}.v2-network__qr-stage img{width:190px}.v2-network__qr-stage i:nth-child(1){width:200px;height:200px}.v2-network__qr-stage i:nth-child(2){width:160px;height:160px}.v2-network__qr-stage i:nth-child(3){width:125px;height:125px}}
@media(prefers-reduced-motion:reduce){.v2-network__tabs button,.v2-network__pause{transition:none}}

@media(max-width:960px){.v2-network__qr-stage{transform:none}}

/* The tabs, panel and progress form one full-width product module. */
.v2-network__tabs { width: 100%; max-width: none; }
.v2-network__tabs img { filter: grayscale(1); opacity: .58; }
.v2-network__tabs .is-active img { filter: none; opacity: 1; }
.v2-network__panel { max-width: none; margin: 0; border-radius: 0; }
.v2-network__progress-row { width: 100%; max-width: none; margin: 0; border: 1px solid rgba(20,93,245,.14); border-top: 0; border-radius: 0 0 26px 26px; }
.v2-network__medallion { width: clamp(165px, 14vw, 220px); }
.v2-network__state-head>img { width: 100px; height: 100px; }
.v2-network__state-head>div { min-width: 0; }
.v2-network__highlights div { position: relative; padding: 14px 12px 14px 42px; }
.v2-network__highlights svg { position: absolute; top: 14px; left: 13px; color: var(--blue); }
.v2-network__footer { display: flex; align-items: center; gap: 8px; }
.v2-network__footer svg { flex: none; color: var(--blue); }
.v2-network__qr-stage { transform: translateX(clamp(0px, 3vw, 48px)); }
.v2-network__qr-stage { justify-self: end; transform: translateX(clamp(0px, 5vw, 96px)); }
.v2-network__highlights div { border-radius: 12px; padding-top: 16px; padding-bottom: 14px; }
.v2-network__highlights svg { background: #e7f0ff; border-radius: 8px; }
.v2-network__footer { border-radius: 12px; }
.v2-network__qr-stage::after { display: none; }
.v2-network__highlights div { min-height: 82px; padding: 17px 13px 13px 43px; border: 1px solid rgba(20,93,245,.13); border-radius: 16px; background: linear-gradient(145deg,#fbfdff,#f4f8ff); box-shadow: 0 6px 18px rgba(24,68,145,.035); transition: border-color .2s ease, transform .2s ease, box-shadow .2s ease; }
.v2-network__highlights div { min-height: 108px; }
.v2-network__highlights div:hover { border-color: rgba(20,93,245,.32); transform: translateY(-2px); box-shadow: 0 10px 22px rgba(24,68,145,.08); }
.v2-network__highlights svg { top: 15px; left: 13px; width: 22px; height: 22px; padding: 4px; border-radius: 8px; background: #e7f0ff; }
.v2-network__highlights b { font-weight: 700; }
.v2-network__highlights span { margin-top: 6px; }
.v2-network__footer { min-height: 44px; padding: 13px 15px; border: 1px solid rgba(20,93,245,.1); border-radius: 14px; background: linear-gradient(90deg,#f0f6ff,#f8fbff); }

/* Keep the medallion aligned to the panel's inner right gutter. */
.v2-network__qr-stage {
    justify-self: end;
    justify-items: end;
    transform: none;
    padding-right: 0;
}
.v2-network__qr-stage img { margin-right: 0; }

/* Give the active state a cleaner, more deliberate reading rhythm. */
.v2-network__content { max-width: 760px; }
.v2-network__state-head { align-items: center; }
.v2-network__state-head > div { min-width: 0; padding-top: 2px; }
.v2-network__state-head h3 { line-height: 1.05; font-weight: 560; }
.v2-network__state-head p { max-width: 430px; }
.v2-network__highlights { margin-top: 54px; }
.v2-network__footer { margin-top: 12px; }

/* Refined internal cards: softer blue depth, tighter corners and a clearer lock badge. */
.v2-network__highlights div {
    border-radius: 10px;
    border-color: rgba(20, 93, 245, .16);
    background:
        radial-gradient(circle at 100% 0%, rgba(91, 145, 255, .09), transparent 48%),
        linear-gradient(135deg, #f8fbff 0%, #f1f6ff 100%);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, .82), 0 8px 18px rgba(25, 70, 145, .045);
}
.v2-network__footer {
    border-radius: 10px;
    background: linear-gradient(145deg, rgba(255, 255, 255, .98), rgba(247, 250, 255, .98));
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, .95), 0 8px 18px rgba(25, 70, 145, .035);
}
.v2-network__footer svg {
    width: 28px;
    height: 28px;
    padding: 6px;
    border-radius: 8px;
    background: #e2edff;
    color: var(--blue);
}

@media(max-width:960px) {
    .v2-network__qr-stage {
        justify-self: center;
        justify-items: center;
        transform: none;
        padding-right: 0;
    }
}

/* Premium panel finish and a restrained ambient motion for the QR nucleus. */
.v2-network__panel {
    background:
        radial-gradient(circle at 84% 48%, rgba(223, 235, 255, .28), transparent 28%),
        linear-gradient(110deg, rgba(255, 255, 255, .98), rgba(249, 252, 255, .94));
    box-shadow: 0 24px 70px rgba(25, 69, 145, .075), inset 0 1px 0 rgba(255, 255, 255, .95);
}
.v2-network__highlights div {
    background: linear-gradient(145deg, rgba(255, 255, 255, .98), rgba(247, 250, 255, .98));
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, .95), 0 8px 18px rgba(25, 70, 145, .035);
}
.v2-network__highlights div {
    padding-left: 49px;
}
.v2-network__highlights svg {
    top: 13px;
    left: 12px;
    width: 26px;
    height: 26px;
    padding: 5px;
    border-radius: 9px;
}
.v2-network__state-head > img {
    width: 124px;
    height: 124px;
}
@media(min-width:961px) {
    .v2-network__state-head > img.is-raised-asset {
        position: relative;
        top: -2px;
    }
}
.v2-network__tabs button {
    position: relative;
}
.v2-network__tabs button.is-active {
    z-index: 2;
    border-bottom: 3px solid var(--blue);
}
.v2-network__tabs button.is-active::after {
    display: none;
}
.v2-network__qr-stage img {
    transition: filter .35s ease;
    animation: network-qr-float 5.5s ease-in-out infinite;
}
.v2-network__qr-stage::before {
    content: '';
    position: absolute;
    width: min(32vw, 390px);
    aspect-ratio: 1;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(70, 133, 255, .12) 0%, rgba(70, 133, 255, .045) 34%, transparent 70%);
    filter: blur(5px);
    pointer-events: none;
    animation: network-ambient-glow 6s ease-in-out infinite;
}
.v2-network__qr-stage i {
    animation: network-ring-breathe 5.5s ease-in-out infinite;
}
.v2-network__qr-stage i:nth-child(2) { animation-delay: -1.4s; }
.v2-network__qr-stage i:nth-child(3) { animation-delay: -2.8s; }

@keyframes network-qr-float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-5px) rotate(.35deg); }
}
@keyframes network-ring-breathe {
    0%, 100% { opacity: .72; transform: scale(1); }
    50% { opacity: .38; transform: scale(1.025); }
}
@keyframes network-ambient-glow {
    0%, 100% { opacity: .6; transform: scale(.96); }
    50% { opacity: 1; transform: scale(1.04); }
}

@media(prefers-reduced-motion:reduce) {
    .v2-network__qr-stage img,
    .v2-network__qr-stage i,
    .v2-network__qr-stage::before { animation: none; }
}

@media(max-width:800px) {
    .v2-network__highlights div {
        box-sizing: border-box;
        min-height: unset;
        padding: 17px 12px 17px 49px;
    }
    .v2-network__tabs button {
        gap: 0;
        transition: background-color .2s ease, color .2s ease, flex-basis .2s ease;
    }
    .v2-network__tabs button:not(.is-active) span {
        display: none;
    }
    .v2-network__tabs button:not(.is-active) {
        flex-basis: 22%;
        min-width: 64px;
        padding-inline: 8px;
    }
    .v2-network__tabs button.is-active {
        flex-basis: 56%;
        min-width: 150px;
        gap: 8px;
    }
    .v2-network__tabs button.is-active span {
        display: inline;
    }
    .v2-network__state-head {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 14px;
        text-align: center;
    }
    .v2-network__state-head > img {
        width: 104px;
        height: 104px;
    }
    .v2-network__state-head > div {
        width: 100%;
        padding-top: 0;
    }
    .v2-network__state-head p {
        max-width: 480px;
        margin-inline: auto;
    }
}

@media(max-width:960px) {
    .v2-network__state-head {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        text-align: center;
    }
    .v2-network__state-head > img {
        width: 112px;
        height: 112px;
    }
    .v2-network__state-head > div {
        width: min(100%, 620px);
        padding-top: 0;
    }
    .v2-network__state-head p {
        max-width: 560px;
        margin-inline: auto;
    }
}

@media(max-width:560px) {
    .v2-network__highlights div {
        min-height: unset;
        padding: 17px 12px 17px 49px;
    }
}

@media(max-width:380px) {
    .v2-network h2 { font-size: 30px; }
}

@media(min-width:961px) {
    .v2-network__qr-stage {
        isolation: isolate;
        background: radial-gradient(circle at 50% 50%, rgba(67, 127, 255, .12), transparent 46%);
    }
    .v2-network__qr-stage::before {
        width: min(36vw, 440px);
        opacity: .9;
        background: radial-gradient(circle, rgba(61, 124, 255, .18) 0%, rgba(61, 124, 255, .07) 34%, transparent 70%);
        filter: blur(8px);
    }
    .v2-network__qr-stage::after {
        content: '';
        display: block;
        position: absolute;
        width: min(31vw, 360px);
        aspect-ratio: 1;
        border: 1px solid rgba(20, 93, 245, .18);
        border-top-color: rgba(20, 93, 245, .72);
        border-right-color: rgba(20, 93, 245, .38);
        border-radius: 50%;
        box-shadow: 0 0 0 12px rgba(20, 93, 245, .025), 0 0 38px rgba(20, 93, 245, .1);
        pointer-events: none;
        animation: network-orbit 12s linear infinite;
    }
}

@keyframes network-orbit {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@media(prefers-reduced-motion:reduce) {
    .v2-network__qr-stage::after { animation: none; }
}

/* Keep the mobile headline natural and remove the decorative line from the QR stage. */
.v2-network__qr-stage::after { display: none !important; }

@media(max-width:560px) {
    .v2-network h2 {
        max-width: 360px;
        margin-inline: auto;
        font-size: 32px;
        line-height: 1.02;
        letter-spacing: -.045em;
    }
    .v2-network h2 br { display: none; }
    .v2-network h2 span::before { content: ' '; }
}

@media(max-width:380px) {
    .v2-network h2 {
        max-width: 340px;
        font-size: 30px;
    }
}
</style>
