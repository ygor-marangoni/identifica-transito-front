<script setup lang="ts">
import { ArrowRight, MoveDown } from '@lucide/vue'

const hero = ref<HTMLElement | null>(null)
const heroLabel = ref<HTMLImageElement | null>(null)
const labelTarget = ref<HTMLElement | null>(null)
const heroVideo = ref<HTMLVideoElement | null>(null)
const heroVideoMobile = ref<HTMLVideoElement | null>(null)
const isMobile = ref(false)
let motionContext: { revert: () => void } | undefined
let heroMediaQuery: MediaQueryList | undefined

const playMobileVideo = () => {
  const video = heroVideoMobile.value
  if (!video) return

  video.muted = true
  video.defaultMuted = true
  video.playsInline = true
  void video.play().catch(() => {
    // Mobile browsers may defer autoplay until the media has buffered enough.
  })
}

const ensureMobileVideoPlaying = () => {
  const video = heroVideoMobile.value
  if (!video) return

  video.muted = true
  video.defaultMuted = true
  video.playsInline = true
  // A carga explícita acontece somente na inicialização. Recarregar dentro de
  // loadeddata/canplay interrompe o próprio autoplay em alguns navegadores.
  video.load()
  playMobileVideo()
}

const syncHeroVideoWithViewport = async () => {
  if (!heroMediaQuery) return

  const nextIsMobile = heroMediaQuery.matches
  if (isMobile.value === nextIsMobile) {
    if (nextIsMobile) {
      await nextTick()
      ensureMobileVideoPlaying()
    }
    return
  }

  isMobile.value = nextIsMobile
  await nextTick()

  if (nextIsMobile) {
    bindMobileVideoEvents()
    ensureMobileVideoPlaying()
    return
  }

  unbindMobileVideoEvents()
  const video = heroVideo.value
  if (!video) return

  video.muted = true
  video.defaultMuted = true
  video.playsInline = true
  video.load()
  void video.play().catch(() => {
    // O navegador pode aguardar uma interação para iniciar o autoplay.
  })
}

const handleHeroViewportChange = () => {
  void syncHeroVideoWithViewport()
}

const bindMobileVideoEvents = () => {
  const video = heroVideoMobile.value
  video?.addEventListener('loadeddata', playMobileVideo)
  video?.addEventListener('canplay', playMobileVideo)
  window.addEventListener('pageshow', playMobileVideo)
  document.addEventListener('visibilitychange', playMobileVideo)
}

const unbindMobileVideoEvents = () => {
  const video = heroVideoMobile.value
  video?.removeEventListener('loadeddata', playMobileVideo)
  video?.removeEventListener('canplay', playMobileVideo)
  window.removeEventListener('pageshow', playMobileVideo)
  document.removeEventListener('visibilitychange', playMobileVideo)
}

defineExpose({ hero, heroLabel, labelTarget, heroVideo, heroVideoMobile })

onMounted(async () => {
  heroMediaQuery = window.matchMedia('(max-width: 1000px)')
  isMobile.value = heroMediaQuery.matches

  if (isMobile.value) {
    await nextTick()
    bindMobileVideoEvents()
    ensureMobileVideoPlaying()
  }

  heroMediaQuery.addEventListener('change', handleHeroViewportChange)

  if (!hero.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const { default: gsap } = await import('gsap')
  motionContext = gsap.context(() => {
    const select = <T extends Element>(selector: string) => hero.value?.querySelector<T>(selector) ?? null
    const selectAll = <T extends Element>(selector: string) => Array.from(hero.value?.querySelectorAll<T>(selector) ?? [])
    const timeline = gsap.timeline()
    const eyebrow = select('.v2-hero__eyebrow')
    const titleLines = selectAll('.v2-hero__title-line')
    const sticker = select('.v2-hero__sticker')
    const body = select('.v2-hero__body')
    const actions = select('.v2-hero__actions')
    if (eyebrow) timeline.from(eyebrow, { y: 14, opacity: 0, duration: .45 })
    if (titleLines.length) timeline.from(titleLines, { yPercent: 100, opacity: 0, duration: .65, stagger: .08, ease: 'power3.out' }, '-=.12')
    if (sticker) timeline.from(sticker, { scale: .82, rotation: -12, opacity: 0, duration: .45, ease: 'back.out(1.7)' }, '-=.3')
    const copyTargets = [body, actions].filter((element): element is HTMLElement => Boolean(element))
    if (copyTargets.length) timeline.from(copyTargets, { y: 16, opacity: 0, duration: .45, stagger: .08 }, '-=.18')
  }, hero.value)
})

onBeforeUnmount(() => {
  unbindMobileVideoEvents()
  heroMediaQuery?.removeEventListener('change', handleHeroViewportChange)
  heroMediaQuery = undefined
  motionContext?.revert()
})
</script>

<template>
  <section id="top" ref="hero" class="v2-hero" aria-labelledby="v2-hero-title">
    <video v-if="!isMobile" ref="heroVideo" class="v2-hero__video v2-hero__video--desktop" src="/landing-v2/video/hero-bg-desktop-id.mp4" autoplay muted playsinline webkit-playsinline loop preload="metadata" aria-hidden="true">
    </video>
    <video v-else ref="heroVideoMobile" class="v2-hero__video v2-hero__video--mobile" src="/landing-v2/video/hero-bg-mobile-id.mp4" autoplay muted playsinline webkit-playsinline loop preload="auto" aria-hidden="true">
    </video>
    <div class="v2-hero__overlay" aria-hidden="true"></div>
    <div class="v2-hero__content">
      <p class="v2-hero__eyebrow">PROJETO DE IDENTIFICAÇÃO NO TRÂNSITO</p>
      <h1 id="v2-hero-title" class="v2-hero__title">
        <span class="v2-hero__title-line">No trânsito,</span>
        <span class="v2-hero__title-line">um pouco de</span>
        <span class="v2-hero__title-line"><em class="v2-hero__sticker">contexto</em> muda tudo.</span>
      </h1>
      <p class="v2-hero__body">Etiquetas refletivas com QR Code que ajudam a tornar visíveis situações que pedem mais atenção, sem expor a identidade civil do motorista.</p>
      <div class="v2-hero__actions">
        <a href="#etiquetas" class="v2-hero__primary">Conhecer etiquetas <ArrowRight :size="17" /></a>
        <a href="#como-funciona" class="v2-hero__secondary">Como funciona <MoveDown :size="17" /></a>
      </div>
      <div class="v2-hero__proof" aria-label="Comunidade Identifica Trânsito">
        <div class="v2-hero__proof-tags" aria-hidden="true"><img src="/images/lp/etiquetas/vermelho.svg" alt="" width="36" height="36" decoding="async"><img src="/images/lp/etiquetas/azul.svg" alt="" width="36" height="36" decoding="async"><img src="/images/lp/etiquetas/amarelo.svg" alt="" width="36" height="36" decoding="async"><img src="/images/lp/etiquetas/branco.svg" alt="" width="36" height="36" decoding="async"><img src="/images/lp/etiquetas/verde.svg" alt="" width="36" height="36" decoding="async"></div>
        <span>Etiquetas para diferentes perfis, contextos e formas de dirigir.</span>
      </div>
    </div>
    <img ref="heroLabel" class="v2-hero__label" src="/images/lp/etiquetas/azul.svg" alt="" aria-hidden="true" width="132" height="132" decoding="async">
    <span ref="labelTarget" class="v2-hero__label-target" aria-hidden="true"></span>
  </section>
</template>

<style scoped>
.v2-hero{position:relative;isolation:isolate;display:flex;min-height:100svh;align-items:center;overflow:hidden;padding:150px var(--v2-grid-inset) 80px;background:#061333;color:#fff;font-family:'Instrument Sans',Arial,sans-serif}.v2-hero__video{position:absolute;z-index:-3;inset:0;width:100%;height:100%;object-fit:cover}.v2-hero__video--mobile{display:none}.v2-hero__overlay{position:absolute;z-index:-2;inset:0;background:linear-gradient(90deg,rgba(3,15,45,.97) 0%,rgba(3,15,45,.86) 27%,rgba(3,15,45,.43) 57%,rgba(3,15,45,.08) 82%),linear-gradient(180deg,rgba(3,15,45,.68),transparent 42%,rgba(3,15,45,.42)),radial-gradient(circle at 22% 38%,rgba(20,93,245,.2),transparent 42%)}.v2-hero__content{position:relative;z-index:3;width:min(650px,100%)}.v2-hero__eyebrow{margin:0 0 24px;color:#dce8ff;font-size:12px;font-weight:700;letter-spacing:.13em;text-transform:uppercase}.v2-hero__title{margin:0;font-size:56px;font-weight:700;letter-spacing:-.055em;line-height:.98}.v2-hero__title-line{display:block;overflow:visible}.v2-hero__sticker{display:inline-block;padding:.03em .18em .1em;border:1px solid rgba(255,255,255,.55);border-radius:.16em;background:#fff;color:#145df5;font-style:normal;letter-spacing:-.045em;transform:rotate(-4deg);box-shadow:4px 5px 0 #2f75ff}.v2-hero__body{max-width:580px;margin:30px 0 0;color:#e3ebfa;font-size:18px;line-height:1.5}.v2-hero__actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}.v2-hero__primary,.v2-hero__secondary{display:inline-flex;align-items:center;gap:10px;min-height:50px;padding:0 19px;border-radius:999px;font-size:15px;font-weight:700;text-decoration:none;transition:transform .25s,background .25s}.v2-hero__primary{background:#fff;color:#081a46}.v2-hero__secondary{border:1px solid rgba(255,255,255,.4);color:#fff;background:rgba(6,19,51,.2)}.v2-hero__primary:hover,.v2-hero__secondary:hover{transform:translateY(-2px)}.v2-hero__label{position:absolute;z-index:80;right:21.5%;bottom:31%;width:clamp(78px,8vw,132px);pointer-events:none;transform:rotate(-6deg) perspective(500px) rotateY(7deg);filter:drop-shadow(0 14px 14px rgba(0,0,0,.3))}.v2-hero__label.is-docked{position:static;width:100%;transform:none;filter:drop-shadow(0 16px 20px rgba(8,26,70,.2))}.v2-hero__label.is-travelling{will-change:transform}.v2-hero__label-slot{position:relative}.v2-hero__label-slot :deep(img){display:block}
@media (min-width:1441px) and (max-width:1600px){.v2-hero__title{font-size:52px}}@media (min-width:1200px) and (max-width:1440px){.v2-hero__title{font-size:48px}}@media (min-width:1001px) and (max-width:1199px){.v2-hero__title{font-size:44px}}@media (max-width:1000px){.v2-hero{min-height:920px;align-items:flex-start;padding-top:145px}.v2-hero__video--desktop{display:none}.v2-hero__video--mobile{display:block}.v2-hero__overlay{background:linear-gradient(180deg,#031333 0%,rgba(3,19,51,.98) 30%,rgba(3,19,51,.75) 53%,rgba(3,19,51,.2) 76%,rgba(3,19,51,0) 90%),radial-gradient(circle at 50% 65%,rgba(20,93,245,.16),transparent 48%)}.v2-hero__title{font-size:32px;line-height:1.04}.v2-hero__body{max-width:620px;font-size:16px}.v2-hero__label{right:18%;bottom:18%;width:92px}}@media (max-width:560px){.v2-hero{min-height:900px;padding-top:130px;padding-bottom:90px}.v2-hero__content{width:100%}.v2-hero__eyebrow{max-width:270px;font-size:11px;line-height:1.4}.v2-hero__body{margin-top:24px;font-size:16px}.v2-hero__actions{display:grid}.v2-hero__primary,.v2-hero__secondary{justify-content:center}.v2-hero__label{right:17%;bottom:16%;width:76px}}
@media (max-width: 800px) {
  .v2-hero { min-height: 900px; padding-top: 126px; padding-bottom: 96px; }
  .v2-hero__content { width: min(620px, 100%); }
  .v2-hero__title { color: #fff; font-size: clamp(32px, 5vw, 48px); line-height: 1.04; }
  .v2-hero__eyebrow { margin-bottom: 22px; font-size: 11px; letter-spacing: .1em; }
  .v2-hero__body { color: rgba(227,235,250,.8); }
  .v2-hero__actions { display: flex; flex-direction: row; flex-wrap: wrap; margin-top: 26px; }
  .v2-hero__primary, .v2-hero__secondary { min-height: 50px; }
  .v2-hero__label { right: 15%; bottom: 48%; width: 62px; }
}
@media (max-width: 560px) {
  .v2-hero { min-height: 820px; padding: 112px 20px 78px; }
  .v2-hero__title { font-size: clamp(30px, 9vw, 38px); line-height: 1.02; letter-spacing: -.045em; }
  .v2-hero__body { margin-top: 22px; font-size: 15px; line-height: 1.45; }
  .v2-hero__actions { flex-wrap: nowrap; gap: 6px; margin-top: 24px; }
  .v2-hero__primary, .v2-hero__secondary { justify-content: center; min-height: 50px; font-size: 12px; white-space: nowrap; }
  .v2-hero__primary { min-width: 0; flex: 1 1 auto; padding-left: 10px; padding-right: 5px; gap: 5px; }
  .v2-hero__primary::after { display: none; }
  .v2-hero__secondary { flex: 0 0 auto; padding-left: 7px; padding-right: 7px; }
  .v2-hero__label { right: 14%; bottom: 47%; width: 56px; }
}
@media (max-width: 380px) {
  .v2-hero { min-height: 790px; padding-top: 104px; }
  .v2-hero__title { font-size: 29px; }
  .v2-hero__body { font-size: 14px; }
  .v2-hero__label { right: 13%; bottom: 46%; width: 52px; }
}
@media (max-width: 1000px) {
  .v2-hero__title { color: #fff !important; font-weight: 600; letter-spacing: -.025em; }
  .v2-hero__title-line { display: inline; }
  .v2-hero__title-line:not(:last-child) { margin-right: .22em; }
  .v2-hero__sticker { font-weight: 800; }
  .v2-hero__body { color: rgba(227,235,250,.8); font-size: 0; max-width: 610px; }
  .v2-hero__body::after { content: 'Etiquetas refletivas com QR Code para comunicar situações que pedem mais atenção no trânsito.'; display: block; font-size: 16px; line-height: 1.5; }
}

@media (min-width: 801px) {
  .v2-hero { z-index: 2; }
  .v2-hero__title { color: #fff; }
  .v2-hero__label { right: 13%; bottom: 51%; width: clamp(34px, 2.7vw, 48px); z-index: 80; }
  .v2-hero__label { transform-origin: center; transform: rotate(-6deg) skewX(-5deg) scaleX(.92); filter: drop-shadow(0 4px 3px rgba(0,0,0,.15)) drop-shadow(0 11px 12px rgba(0,0,0,.15)); }
  .v2-hero__label.is-docked { transform: rotate(20deg); filter: drop-shadow(0 3px 2px rgba(3,15,45,.15)) drop-shadow(0 12px 18px rgba(8,26,70,.15)); }
  .v2-hero__label-target { display: block; position: absolute; top: 57%; right: 9%; width: 104px; height: 104px; pointer-events: none; }
}
@media (max-width: 800px) { .v2-hero__label { right: 13%; bottom: 29%; z-index: 80; width: 54px; } }
@media (max-width: 560px) { .v2-hero__label { right: 12%; bottom: 27%; width: 46px; } }
@media (max-width: 800px) { .v2-hero__label { transform: none; } }
@media (max-width: 800px) { .v2-hero__label.is-docked { transform: none !important; } }
.v2-hero__label.is-docked { transform: none !important; }
@media (max-width: 800px) { .v2-hero__label-target { display: block; position: absolute; right: 14%; bottom: 16%; width: 72px; height: 72px; pointer-events: none; } }
@media (max-width: 1000px) { .v2-hero__proof { display: flex; } }
@media (min-width: 1001px) {
  .v2-hero__eyebrow { margin-bottom: 22px; color: rgba(220,232,255,.78); font-size: 11px; font-weight: 550; letter-spacing: .12em; }
  .v2-hero__eyebrow { font-size: 0; }
  .v2-hero__eyebrow::after { content: '{ Projeto de identificação no trânsito }'; font-size: 12px; }
  .v2-hero__title { max-width: 650px; font-weight: 600; letter-spacing: -.025em; }
  .v2-hero__title-line { display: inline; }
  .v2-hero__sticker { font-weight: 800; }
  .v2-hero__body { color: rgba(227,235,250,.8); font-size: 0; }
  .v2-hero__body::after { content: 'Etiquetas refletivas com QR Code para comunicar situações que pedem mais atenção no trânsito.'; display: block; font-size: 18px; line-height: 1.5; }
  .v2-hero__actions { gap: 14px; margin-top: 30px; }
  .v2-hero__primary, .v2-hero__secondary { min-height: 54px; padding: 5px 8px 5px 20px; border-radius: .7rem; font-size: 14px; font-weight: 600; letter-spacing: -.01em; transition: border-color .28s ease, background .28s ease, box-shadow .28s ease; }
  .v2-hero__primary { border: 1px solid rgba(255,255,255,.72); background: linear-gradient(110deg,#fff,#eaf2ff); color: #081a46; box-shadow: 0 10px 24px rgba(3,15,45,.18), inset 0 1px 0 rgba(255,255,255,.9); }
  .v2-hero__primary { font-weight: 750; }
  .v2-hero__primary svg { width: 34px; height: 34px; padding: 9px; border-radius: .35rem; background: #145df5; color: #fff; transition: background .28s ease; }
  .v2-hero__secondary { border: 1px solid transparent; padding-right: 16px; background: rgba(6,19,51,.26); color: #fff; }
  .v2-hero__secondary svg { display: none; }
  .v2-hero__secondary::after { content: '»'; display: inline-block; margin-left: 6px; color: currentColor; font-size: 20px; font-weight: 500; line-height: 1; transform: translateX(0); transition: transform .28s ease; }
  .v2-hero__primary:hover, .v2-hero__secondary:hover { transform: none; }
  .v2-hero__primary:hover { border-color: #fff; box-shadow: 0 14px 30px rgba(3,15,45,.24), inset 0 1px 0 #fff; }
  .v2-hero__primary:hover svg { background: #0b42a8; }
  .v2-hero__secondary:hover { border-color: rgba(255,255,255,.36); background: rgba(20,93,245,.16); }
  .v2-hero__secondary:hover::after { transform: translateX(3px); }
  .v2-hero__title-line:not(:last-child) { margin-right: .22em; }
  .v2-hero__primary svg { display: none; }
  .v2-hero__primary::after { content: '»'; display: inline-block; width: 34px; height: 34px; margin-left: 8px; border-radius: .35rem; background: #145df5; color: #fff; font-size: 21px; font-weight: 500; line-height: 31px; text-align: center; transition: background .28s ease; }
  .v2-hero__primary:hover::after { background: #0b42a8; }
  .v2-hero__secondary::after { display: none; }
  .v2-hero__primary { font-size: 15px; }
  .v2-hero__primary::after { width: 40px; height: 40px; margin-left: 10px; font-size: 24px; line-height: 37px; }
  .v2-hero__eyebrow { margin-bottom: 30px; }
  .v2-hero__body { margin-top: 34px; max-width: 610px; }
  .v2-hero__body::after { max-width: 610px; }
  .v2-hero__actions { margin-top: 34px; }
  .v2-hero__proof { display: flex; flex-direction: row; align-items: center; gap: 16px; margin-top: 58px; color: rgba(227,235,250,.68); font-size: 12px; line-height: 1.4; }
  .v2-hero__proof-tags { display: flex; flex: 0 0 auto; align-items: center; padding-left: 6px; }
  .v2-hero__proof-tags img { display: block; width: 36px; height: 36px; margin-left: -8px; border: 2px solid #061333; border-radius: 50%; object-fit: cover; object-position: center; filter: drop-shadow(0 3px 5px rgba(0,0,0,.2)); }
  .v2-hero__proof-tags img:first-child { margin-left: 0; }
  .v2-hero__proof-tags img:nth-child(2), .v2-hero__proof-tags img:nth-child(4) { transform: translateY(-2px) rotate(-3deg); }
  .v2-hero__proof-tags img:nth-child(3), .v2-hero__proof-tags img:nth-child(5) { transform: translateY(2px) rotate(3deg); }
  .v2-hero__proof > span { max-width: 220px; letter-spacing: -.01em; }
}
@media (max-width: 800px) {
  .v2-hero__eyebrow { margin-bottom: 22px; color: rgba(220,232,255,.78); font-size: 0; font-weight: 550; letter-spacing: .12em; }
  .v2-hero__eyebrow::after { content: '{ Projeto de identificação no trânsito }'; font-size: 12px; }
  .v2-hero__title { font-size: 32px; font-weight: 500; }
  .v2-hero__secondary { justify-content: center; gap: 0; text-align: center; }
  .v2-hero__secondary svg { display: none; }
  .v2-hero__proof { flex-direction: row; align-items: center; gap: 12px; margin-top: 38px; color: rgba(227,235,250,.68); font-size: 11px; line-height: 1.35; }
  .v2-hero__proof-tags { display: flex; flex: 0 0 auto; align-items: center; padding-left: 4px; }
  .v2-hero__proof-tags img { display: block; width: 30px; height: 30px; margin-left: -7px; border: 2px solid #061333; border-radius: 50%; object-fit: cover; filter: drop-shadow(0 3px 5px rgba(0,0,0,.2)); }
  .v2-hero__proof-tags img:first-child { margin-left: 0; }
  .v2-hero__proof > span { max-width: 190px; font-size: 13px; }
  .v2-hero__primary, .v2-hero__secondary { min-height: 54px; padding: 5px 8px 5px 20px; border-radius: .7rem; font-size: 14px; font-weight: 600; letter-spacing: -.01em; transition: border-color .28s ease, background .28s ease, box-shadow .28s ease; }
  .v2-hero__primary { border: 1px solid rgba(255,255,255,.72); background: linear-gradient(110deg,#fff,#eaf2ff); color: #081a46; box-shadow: 0 10px 24px rgba(3,15,45,.18), inset 0 1px 0 rgba(255,255,255,.9); font-weight: 750; }
  .v2-hero__primary svg { display: none; }
  .v2-hero__primary::after { content: '»'; display: inline-block; width: 40px; height: 40px; margin-left: 10px; border-radius: .35rem; background: #145df5; color: #fff; font-size: 24px; font-weight: 500; line-height: 37px; text-align: center; }
  .v2-hero__secondary { border: 1px solid transparent; padding-right: 16px; background: rgba(6,19,51,.26); color: #fff; }
  .v2-hero__secondary svg { display: none; }
  .v2-hero__secondary::after { display: none; }
}
@media (max-width: 560px) {
  .v2-hero__eyebrow::after { font-size: 11px; }
  .v2-hero__proof { margin-top: 34px; }
  .v2-hero__secondary { align-self: center; }
}
@media (max-width: 800px) {
  .v2-hero { z-index: 2; }
  .v2-hero__label { z-index: 80; }
  .v2-hero__primary::after { display: none !important; content: none !important; }
}
@media (max-width: 560px) {
  .v2-hero__primary { justify-content: center; padding-left: 0; padding-right: 0; gap: 0; }
}
@media (max-width: 390px) {
  .v2-hero__title { font-size: 30px; }
}
@media(prefers-reduced-motion:reduce){.v2-hero__label{transition:none}.v2-hero__video{animation:none}}
</style>

<style scoped>
/* Mantém o vídeo dentro da camada visível da seção isolada. */
.v2-hero__video { z-index: 0 !important; }
.v2-hero__overlay { z-index: 1 !important; }

/* No mobile, mantém o cenário do vídeo perceptível atrás do conteúdo. */
@media (max-width: 1000px) {
  .v2-hero__video--mobile {
    display: block !important;
    opacity: 1 !important;
    visibility: visible !important;
  }

  .v2-hero__overlay {
    background:
      linear-gradient(180deg, rgba(3, 19, 51, .78) 0%, rgba(3, 19, 51, .58) 30%, rgba(3, 19, 51, .28) 58%, rgba(3, 19, 51, .08) 78%, rgba(3, 19, 51, 0) 94%),
      radial-gradient(circle at 50% 65%, rgba(20, 93, 245, .12), transparent 48%) !important;
  }
}
</style>
