<script setup lang="ts">

const root = ref<HTMLElement | null>(null);
const progress = ref<HTMLElement | null>(null);
const items = ref<HTMLElement[]>([]);
let animationContext: { revert: () => void } | undefined;
let progressCleanup: (() => void) | undefined;
const steps = [
    { title: 'Crie sua conta', description: 'Entre na plataforma e faça seu cadastro para começar.', image: '/landing-v2/images/passo-1.webp' },
    { title: 'Cadastre seu veículo', description: 'Adicione os dados do veículo que receberá a etiqueta.', image: '/landing-v2/images/passo-2.webp' },
    { title: 'Escolha sua etiqueta', description: 'Selecione a identificação adequada ao perfil de uso.', image: '/landing-v2/images/passo-3.webp' },
    { title: 'Receba e aplique', description: 'Receba em casa ou retire em um ponto de coleta e aplique no vidro.', image: '/landing-v2/images/passo-4.webp' }
];

onMounted(async () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !root.value || !progress.value) return;
    const journey = root.value.querySelector<HTMLElement>('.v2-how-steps__journey');
    if (!journey) return;
    await waitForLandingV2Ready();
    const { default: gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);
    animationContext = gsap.context(() => {
        const intro = root.value!.querySelector<HTMLElement>('.v2-how-steps__intro');
        const introParts = intro ? Array.from(intro.children) as HTMLElement[] : [];
        if (introParts.length) {
            gsap.fromTo(introParts,
                { opacity: 0, y: 24 },
                {
                    opacity: 1,
                    y: 0,
                    duration: .7,
                    stagger: .1,
                    ease: 'power3.out',
                    immediateRender: false,
                    scrollTrigger: {
                        trigger: root.value,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }
        progress.value.style.setProperty('--how-steps-progress', '0');
        const syncProgress = () => {
            const journeyRect = journey.getBoundingClientRect();
            const anchor = window.innerHeight * (window.innerWidth <= 600 ? .65 : .8);
            const distance = journey.offsetHeight + window.innerHeight * .3;
            const value = Math.max(0, Math.min(1, (anchor - journeyRect.top) / Math.max(1, distance)));
            progress.value.style.setProperty('--how-steps-progress', String(value));
        };
        progressCleanup = () => {
            window.removeEventListener('scroll', syncProgress);
            window.removeEventListener('resize', syncProgress);
        };
        window.addEventListener('scroll', syncProgress, { passive: true });
        window.addEventListener('resize', syncProgress);
        syncProgress();
        const trigger = ScrollTrigger.create({
            trigger: journey,
            start: () => window.innerWidth <= 600 ? 'top 65%' : 'top 80%',
            end: () => `+=${journey.offsetHeight + window.innerHeight * .3}`,
            scrub: .7,
            invalidateOnRefresh: true,
            onUpdate: self => {
                const journeyHeight = journey.offsetHeight || 1;
                const journeyProgress = self.progress;
                syncProgress();
                items.value.forEach(item => {
                    const dotPosition = item.offsetTop + item.offsetHeight / 2;
                    const dotProgress = dotPosition / journeyHeight;
                    item.classList.toggle('is-active', journeyProgress >= dotProgress);
                });
            }
        });
        const compact = window.matchMedia('(max-width: 800px)').matches;
        items.value.forEach((item, index) => {
            const offset = compact ? (index % 2 ? -22 : 22) : (index % 2 ? -112 : 112);
            gsap.fromTo(item,
                { autoAlpha: 0, x: offset, y: compact ? 40 : 34, scale: compact ? .975 : .94, rotateY: compact ? 0 : (index % 2 ? 3 : -3), transformPerspective: 900 },
                {
                    autoAlpha: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                    rotateY: 0,
                    duration: .8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: item,
                        start: compact ? 'top 88%' : 'top 90%',
                        end: compact ? 'top 49%' : 'top 48%',
                        scrub: compact ? .55 : .72,
                        invalidateOnRefresh: true
                    }
                }
            );
        });
        trigger.refresh();
        requestAnimationFrame(() => ScrollTrigger.refresh());
    }, root.value);
});

onBeforeUnmount(() => {
    progressCleanup?.();
    animationContext?.revert();
});
</script>

<template>
    <section id="como-funciona" ref="root" class="v2-how-steps" aria-labelledby="v2-how-steps-title">
        <header class="v2-how-steps__intro">
            <p class="v2-how-steps__eyebrow">Comece em poucos passos</p>
            <h2 id="v2-how-steps-title">Da escolha ao <span class="heading-highlight">vidro.</span></h2>
            <p>Do cadastro à aplicação, tudo acontece em poucos passos.</p>
        </header>
        <div class="v2-how-steps__journey">
            <span class="v2-how-steps__track"></span><span ref="progress" class="v2-how-steps__progress"></span>
            <ol>
                <li v-for="(step, index) in steps" :key="step.title" ref="items" :class="['v2-how-steps__item', { 'v2-how-steps__item--right': index % 2 === 0 }]">
                    <span class="v2-how-steps__dot" aria-hidden="true"></span>
                    <article>
                        <small class="v2-how-steps__step-label" :aria-label="`Etapa ${index + 1} de 4`">
                            <span>ETAPA</span>
                            <b>{{ String(index + 1).padStart(2, '0') }}</b>
                            <em>/ 04</em>
                        </small>
                        <i class="v2-how-steps__icon-frame">
                            <img :src="step.image" :alt="`Ilustração da etapa ${index + 1}`" width="48" height="48" loading="lazy" decoding="async">
                        </i>
                        <h3>{{ step.title }}</h3>
                        <p>{{ step.description }}</p>
                    </article>
                </li>
            </ol>
        </div>
    </section>
</template>

<style scoped>
.v2-how-steps{padding:clamp(100px,11vw,160px) var(--v2-grid-inset) clamp(120px,14vw,190px);background:#f4f8ff;color:#29374d;font-family:'Instrument Sans',Arial,sans-serif;overflow:clip}.v2-how-steps__intro{max-width:860px;margin:auto;text-align:center}.v2-how-steps__intro .v2-pill{width:max-content;margin:0 auto 21px}.v2-how-steps h2{margin:0;font-size:56px;font-weight:600;letter-spacing:-.025em;line-height:.98}.v2-how-steps__intro>p:last-child{max-width:500px;margin:22px auto 0;color:#697b99;font-size:17px;line-height:1.5}.v2-how-steps__journey{position:relative;max-width:1120px;margin:clamp(90px,10vw,140px) auto 0}.v2-how-steps__track,.v2-how-steps__progress{position:absolute;top:0;bottom:0;left:50%;width:4px;border-radius:999px;transform:translateX(-50%)}.v2-how-steps__track{background:#dce7f7}.v2-how-steps__progress{transform:translateX(-50%) scaleY(0);transform-origin:top;background:#1769ff}.v2-how-steps ol{display:grid;grid-template-columns:1fr 1fr;gap:clamp(80px,9vw,140px) 120px;margin:0;padding:0;list-style:none}.v2-how-steps li{position:relative}.v2-how-steps li:nth-child(odd){grid-column:2}.v2-how-steps li:nth-child(even){grid-column:1}.v2-how-steps article{min-height:180px;padding:28px 32px;border:1px solid #d6e2f5;border-radius:16px;background:rgba(255,255,255,.86);transition:border-color .3s,background .3s}.v2-how-steps li::before{content:'';position:absolute;top:50%;width:120px;height:1px;background:#cbdaf1}.v2-how-steps li:nth-child(odd)::before{left:-120px}.v2-how-steps li:nth-child(even)::before{right:-120px}.v2-how-steps__dot{position:absolute;top:50%;width:14px;height:14px;border:2px solid #b6cbea;border-radius:50%;background:#f4f8ff;transform:translateY(-50%);transition:.3s}.v2-how-steps li:nth-child(odd) .v2-how-steps__dot{left:-127px}.v2-how-steps li:nth-child(even) .v2-how-steps__dot{right:-127px}.v2-how-steps li.is-active article{border-color:#9bbcff;background:linear-gradient(135deg,rgba(23,105,255,.05),#fff)}.v2-how-steps li.is-active .v2-how-steps__dot{border-color:#1769ff;background:#1769ff;box-shadow:0 0 0 6px rgba(23,105,255,.12)}.v2-how-steps small{display:block;margin-bottom:18px;color:#145df5;font-size:11px;font-weight:750;letter-spacing:.12em;text-transform:uppercase}.v2-how-steps i{display:grid;width:44px;height:44px;margin-bottom:20px;place-items:center;border:1px solid #c4d7f5;border-radius:10px;background:#edf4ff;color:#145df5;font-style:normal}.v2-how-steps h3{margin:0;color:#0c1b3c;font-size:25px;font-weight:600;letter-spacing:-.035em}.v2-how-steps article p{max-width:330px;margin:10px 0 0;color:#687b99;font-size:15px;line-height:1.5}@media(max-width:800px){.v2-how-steps{padding-inline:24px}.v2-how-steps h2{font-size:32px;line-height:1.04}.v2-how-steps__journey{margin-top:72px;padding-left:28px}.v2-how-steps__track,.v2-how-steps__progress{left:0;width:3px;transform:none}.v2-how-steps__progress{transform:scaleY(0)}.v2-how-steps ol{grid-template-columns:1fr;gap:26px}.v2-how-steps li:nth-child(odd),.v2-how-steps li:nth-child(even){grid-column:1}.v2-how-steps li::before{left:-28px!important;right:auto!important;width:28px}.v2-how-steps li:nth-child(odd) .v2-how-steps__dot,.v2-how-steps li:nth-child(even) .v2-how-steps__dot{left:-36px;right:auto}.v2-how-steps article{min-height:0;padding:24px 20px}}@media(max-width:390px){.v2-how-steps h2{font-size:30px}}@media(prefers-reduced-motion:reduce){.v2-how-steps li{opacity:1!important;transform:none!important}}
</style>

<style scoped>
.v2-how-steps h3 {
    font-weight: 500;
}

.v2-how-steps article {
    border-color: rgba(255, 255, 255, .82);
    background: linear-gradient(135deg, rgba(255, 255, 255, .76), rgba(239, 246, 255, .5));
    box-shadow: 0 18px 42px rgba(45, 83, 140, .08), inset 0 1px 0 rgba(255, 255, 255, .92);
    -webkit-backdrop-filter: blur(14px);
    backdrop-filter: blur(14px);
}

.v2-how-steps li.is-active article {
    border-color: rgba(126, 171, 255, .76);
    background: linear-gradient(135deg, rgba(255, 255, 255, .86), rgba(226, 238, 255, .64));
    box-shadow: 0 20px 46px rgba(23, 105, 255, .1), inset 0 1px 0 rgba(255, 255, 255, .96);
}

.v2-how-steps__progress {
    background: linear-gradient(180deg, #8bb8ff 0%, #3e89ff 52%, #1769ff 100%);
    box-shadow: 0 0 12px rgba(23, 105, 255, .2);
}
</style>

<style scoped>
/* Ajustes de composição da jornada desktop. */
@media (min-width: 801px) {
    .v2-how-steps__eyebrow {
        display: block;
        width: max-content;
        margin: 0 auto 21px;
        color: #145df5;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: .13em;
        line-height: 1.2;
        text-transform: uppercase;
    }

    .v2-how-steps__eyebrow::before {
        content: '{ ';
    }

    .v2-how-steps__eyebrow::after {
        content: ' }';
    }

    .v2-how-steps__journey {
        width: calc(100% - 32px);
        max-width: 1120px;
    }

    .v2-how-steps__journey ol {
        grid-template-rows: repeat(4, auto);
    }

    .v2-how-steps__journey li:nth-child(1) {
        grid-column: 2;
        grid-row: 1;
    }

    .v2-how-steps__journey li:nth-child(2) {
        grid-column: 1;
        grid-row: 2;
    }

    .v2-how-steps__journey li:nth-child(3) {
        grid-column: 2;
        grid-row: 3;
    }

    .v2-how-steps__journey li:nth-child(4) {
        grid-column: 1;
        grid-row: 4;
    }

    .v2-how-steps__journey li {
        --connector: 60px;
    }

    .v2-how-steps__journey li::before {
        width: var(--connector);
    }

    .v2-how-steps__journey li:nth-child(odd)::before {
        left: calc(-1 * var(--connector));
    }

    .v2-how-steps__journey li:nth-child(even)::before {
        right: calc(-1 * var(--connector));
    }

    .v2-how-steps__journey li:nth-child(odd) .v2-how-steps__dot {
        left: calc(-1 * var(--connector) - 8px);
        transform: translate(1px, -50%);
    }

    .v2-how-steps__journey li:nth-child(even) .v2-how-steps__dot {
        right: calc(-1 * var(--connector) - 8px);
        transform: translateY(-50%);
    }
}

@media (max-width: 800px) {
    .v2-how-steps__eyebrow {
        display: block;
        width: max-content;
        margin: 0 auto 21px;
        color: #145df5;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: .13em;
        line-height: 1.2;
        text-transform: uppercase;
    }

    .v2-how-steps__eyebrow::before {
        content: '{ ';
    }

    .v2-how-steps__eyebrow::after {
        content: ' }';
    }
}

@media (min-width: 801px) {
    /* Somente as etapas à esquerda avançam 1px para a esquerda. */
    .v2-how-steps__journey li:nth-child(2) .v2-how-steps__dot,
    .v2-how-steps__journey li:nth-child(4) .v2-how-steps__dot {
        transform: translate(-1px, -50%) !important;
    }
}

/* Tratamento visual interno dos cards. */
.v2-how-steps small.v2-how-steps__step-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    width: max-content;
    margin: 0 0 20px;
    padding: 5px 10px 5px 9px;
    border: 1px solid rgba(20, 93, 245, .18);
    border-radius: 999px;
    background: rgba(234, 242, 255, .72);
    color: #145df5;
    font-size: 10px;
    font-style: normal;
    font-weight: 700;
    letter-spacing: .1em;
    line-height: 1;
}

.v2-how-steps__step-label span {
    padding-left: 1px;
    color: #145df5;
    font-size: 9px;
    letter-spacing: .08em;
}

.v2-how-steps__step-label b {
    display: grid;
    width: 24px;
    height: 24px;
    place-items: center;
    border-radius: 50%;
    background: #1769ff;
    color: #fff;
    font-size: 10px;
    letter-spacing: .02em;
}

.v2-how-steps__step-label em {
    color: #7592bd;
    font-size: 10px;
    font-style: normal;
    letter-spacing: .06em;
}

.v2-how-steps i.v2-how-steps__icon-frame {
    display: grid;
    width: 66px;
    height: 66px;
    margin-bottom: 18px;
    place-items: center;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    color: #145df5;
    font-style: normal;
}

.v2-how-steps__icon-frame img {
    display: block;
    width: 58px;
    height: 58px;
    object-fit: contain;
    filter: drop-shadow(0 8px 10px rgba(20, 93, 245, .13));
}

@media (max-width: 800px) {
    .v2-how-steps__progress {
        left: 1px;
    }

    .v2-how-steps__journey {
        box-sizing: border-box;
    }

    .v2-how-steps__journey .v2-how-steps__dot {
        transform: translate(3px, -50%) !important;
    }

    .v2-how-steps small.v2-how-steps__step-label {
        margin-bottom: 16px;
    }

    .v2-how-steps i.v2-how-steps__icon-frame {
        width: 60px;
        height: 60px;
    }

    .v2-how-steps__icon-frame img {
        width: 52px;
        height: 52px;
    }
}

@media (min-width: 801px) {
    .v2-how-steps__progress {
        left: 50% !important;
        width: 3px !important;
        margin-left: -1.5px;
        transform: scaleY(var(--how-steps-progress, 0)) !important;
    }

    .v2-how-steps__progress {
        left: calc(50% + 1px);
        width: 3px;
    }

    .v2-how-steps__journey li:nth-child(odd) .v2-how-steps__dot {
        left: calc(-1 * var(--connector) - 9px);
        transform: translate(1px, -50%);
    }

    .v2-how-steps__journey li:nth-child(1) .v2-how-steps__dot {
        transform: translate(3px, -50%);
    }

    .v2-how-steps__journey li:nth-child(3) .v2-how-steps__dot {
        transform: translate(3px, -50%);
    }

    .v2-how-steps__journey li:nth-child(1) .v2-how-steps__dot {
        transform: translate(3px, -50%);
    }

    .v2-how-steps__journey li:nth-child(even) .v2-how-steps__dot {
        right: calc(-1 * var(--connector) - 9px);
        transform: translate(-1px, -50%) !important;
    }
}

.v2-how-steps__progress {
    transform: translateX(-50%) scaleY(var(--how-steps-progress, 0));
}

.v2-how-steps__journey {
    margin-top: clamp(52px, 6vw, 88px);
}

@media (max-width: 800px) {
    .v2-how-steps__progress {
        transform: scaleY(var(--how-steps-progress, 0));
    }

    .v2-how-steps__journey {
        margin-top: 48px;
    }

    .v2-how-steps__journey li:first-child .v2-how-steps__dot {
        transform: translate(4px, -50%) !important;
    }
}
</style>
