<script setup lang="ts">
const section = ref<HTMLElement | null>(null)
const labelTarget = ref<HTMLElement | null>(null)
const materialCard = ref<HTMLElement | null>(null)
defineExpose({ section, labelTarget, materialCard })
</script>

<template>
  <section id="contexto" ref="section" class="v2-section02" aria-labelledby="v2-section02-title">
    <div class="v2-section02__head">
      <p class="v2-section02__eyebrow">POR TRÁS DA ETIQUETA</p>
      <h2 id="v2-section02-title">Pequena no vidro<br>Grande no <span class="heading-highlight">trânsito.</span></h2>
      <p class="v2-section02__copy">A etiqueta combina sinalização visual, material refletivo e acesso rápido às informações do veículo para tornar o contexto mais claro no trânsito.</p>
    </div>

    <div class="v2-section02__stage">
      <div class="v2-section02__column v2-section02__column--left">
        <article ref="materialCard" class="v2-section02__card"><img src="/landing-v2/images/refletivo-icon.webp?v=2" width="116" height="116" loading="lazy" decoding="async" alt=""><div><h3>Material refletivo</h3><p>Mais visibilidade em condições de baixa luminosidade.</p></div></article>
        <article class="v2-section02__card"><img src="/landing-v2/images/dia-noite-icon.webp?v=2" width="116" height="116" loading="lazy" decoding="async" alt=""><div><h3>Leitura dia e noite</h3><p>Pensada para permanecer perceptível em diferentes condições de luz.</p></div></article>
      </div>

      <div class="v2-section02__bento">
        <div ref="labelTarget" class="v2-section02__label-target" aria-label="Etiqueta azul"></div>
        <div class="v2-section02__bento-copy">
          <strong>Mais contexto<br>em cada trajeto.</strong>
        </div>
      </div>

      <div class="v2-section02__column v2-section02__column--right">
        <article class="v2-section02__card"><img src="/landing-v2/images/qr-code-icon.webp?v=2" width="116" height="116" loading="lazy" decoding="async" alt=""><div><h3>QR Code</h3><p>Consulta rápida às informações associadas ao veículo e à etiqueta.</p></div></article>
        <article class="v2-section02__card v2-section02__card--four"><img src="/landing-v2/images/conxtexto-icon.webp?v=2" width="116" height="116" loading="lazy" decoding="async" alt=""><div><h3>Mais contexto</h3><p>Ajuda outros condutores a compreender melhor situações no trânsito.</p></div></article>
      </div>
    </div>
    <a class="v2-section02__cta" href="#etiquetas">Conhecer etiquetas <span aria-hidden="true"><i>»</i></span></a>
  </section>
</template>

<style scoped>
.v2-section02{position:relative;z-index:1;min-height:900px;padding:clamp(110px,13vw,180px) var(--v2-grid-inset);background:#f4f8ff;color:#101114}.v2-section02__head{width:min(700px,100%);margin:0 auto;text-align:center}.v2-section02__eyebrow{margin:0 0 20px;color:#145df5;font-size:12px;font-weight:700;letter-spacing:.13em}.v2-section02 h2{margin:0;font-size:clamp(44px,5vw,74px);font-weight:700;letter-spacing:-.045em;line-height:1.02}.v2-section02 h2 span{color:#145df5}.v2-section02__copy{max-width:590px;margin:24px auto 0;color:#70747c;font-size:18px;line-height:1.5}.v2-section02__stage{display:grid;grid-template-columns:minmax(260px,1fr) minmax(260px,330px) minmax(260px,1fr);align-items:stretch;gap:clamp(34px,6vw,100px);width:min(1280px,100%);margin:72px auto 0}.v2-section02__column{display:grid;gap:26px}.v2-section02__column--right{margin-top:0}.v2-section02__card{display:flex;align-items:center;min-height:164px;padding:14px 22px 14px 12px;border:1px solid #dfe8f8;border-radius:22px;background:rgba(255,255,255,.96);box-shadow:0 12px 35px rgba(8,26,70,.06)}.v2-section02__card img{flex:0 0 116px;width:116px;height:116px;object-fit:contain}.v2-section02__card h3{margin:0;color:#081a46;font-size:20px;font-weight:600;letter-spacing:-.02em}.v2-section02__card p{margin:9px 0 0;color:#70747c;font-size:14px;line-height:1.45}.v2-section02__bento{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:354px;padding:20px 18px;border:1px solid #dfe8f8;border-radius:24px;background:#fff;box-shadow:0 12px 35px rgba(8,26,70,.06)}.v2-section02__label-target{display:grid;place-items:center;width:100%;min-width:0;min-height:240px}.v2-section02__label-target :deep(img){display:block;width:100%;max-width:280px}.v2-section02__label-target :deep(img.v2-hero__label.is-docked){width:clamp(132px,12vw,170px)!important;max-width:170px!important}.v2-section02__bento-copy{display:grid;gap:6px;width:100%;padding:0 12px 8px;text-align:center}.v2-section02__bento-copy strong{color:#081a46;font-size:20px;font-weight:600;line-height:1.05;letter-spacing:-.03em}.v2-section02__cta{display:flex;width:max-content;align-items:center;gap:16px;margin:34px auto 0;padding:0 8px 0 22px;min-height:50px;border-radius:.7rem;background:#145df5;color:#fff;font-size:14px;font-weight:700;text-decoration:none;box-shadow:0 12px 24px rgba(20,93,245,.2)}.v2-section02__cta span{position:relative;top:-1px;display:grid;width:36px;height:36px;place-items:center;border-radius:.35rem;background:#0b42a8;font-size:22px;line-height:1}
@media(max-width:1100px){.v2-section02__stage{grid-template-columns:minmax(230px,1fr) minmax(170px,220px) minmax(230px,1fr);gap:28px}.v2-section02__card{padding-right:14px}.v2-section02__card img{flex-basis:88px;width:88px;height:88px}.v2-section02__card h3{font-size:17px}.v2-section02__card p{font-size:13px}}
@media(max-width:800px){.v2-section02{min-height:auto;padding:100px 24px 110px}.v2-section02 h2{font-size:42px}.v2-section02__copy{font-size:16px}.v2-section02__stage{grid-template-columns:1fr;margin-top:54px;gap:18px}.v2-section02__bento{order:-1;min-height:300px}.v2-section02__label-target{min-height:210px}.v2-section02__label-target :deep(img){max-width:170px}.v2-section02__column,.v2-section02__column--right{grid-template-columns:repeat(2,minmax(0,1fr));margin-top:0;gap:14px}.v2-section02__card{display:block;min-height:190px;padding:12px 16px 18px;border-radius:18px}.v2-section02__card img{width:92px;height:92px}.v2-section02__card h3{font-size:16px}.v2-section02__card p{font-size:13px}}
@media(max-width:560px){.v2-section02{padding:72px 20px 88px}.v2-section02__eyebrow{font-size:11px}.v2-section02 h2{font-size:clamp(34px,10vw,42px)}.v2-section02__copy{margin-top:18px;font-size:15px;line-height:1.45}.v2-section02__stage{margin-top:36px}.v2-section02__bento{min-height:270px}.v2-section02__label-target{min-height:180px}.v2-section02__label-target :deep(img){max-width:145px}.v2-section02__column,.v2-section02__column--right{grid-template-columns:1fr;gap:12px}.v2-section02__card{display:flex;align-items:center;min-height:140px;padding:10px 16px 10px 8px}.v2-section02__card img{flex:0 0 88px;width:88px;height:88px}.v2-section02__card h3{font-size:18px}.v2-section02__card p{font-size:13px}.v2-section02__cta{margin-top:26px}}
@media(max-width:430px){.v2-section02{padding-left:18px;padding-right:18px}.v2-section02 h2{font-size:36px}.v2-section02__label-target{min-height:170px}.v2-section02__card img{flex-basis:78px;width:78px;height:78px}.v2-section02__card h3{font-size:16px}.v2-section02__card p{font-size:12px}}
@media (min-width: 1601px){.v2-section02 h2{font-size:56px;font-weight:600;letter-spacing:-.025em;line-height:.98}.v2-section02__label-target{position:relative;left:-10px;top:12px}}
@media (min-width: 1441px) and (max-width:1600px){.v2-section02 h2{font-size:52px;font-weight:600;letter-spacing:-.025em;line-height:.98}.v2-section02__label-target{position:relative;left:-10px;top:12px}}
@media (min-width: 1200px) and (max-width:1440px){.v2-section02 h2{font-size:48px;font-weight:600;letter-spacing:-.025em;line-height:.98}.v2-section02__label-target{position:relative;left:-10px;top:12px}}
@media (min-width: 1001px) and (max-width:1199px){.v2-section02 h2{font-size:44px;font-weight:600;letter-spacing:-.025em;line-height:.98}.v2-section02__label-target{position:relative;left:-10px;top:12px}}
@media (min-width: 801px) and (max-width:1000px){.v2-section02 h2{font-size:32px;font-weight:500;letter-spacing:-.025em;line-height:1.04}.v2-section02__label-target{position:relative;left:-10px;top:12px}}
@media (max-width:800px){.v2-section02 h2{font-size:32px;font-weight:500;letter-spacing:-.025em;line-height:1.04}.v2-section02__label-target{position:relative;left:-10px;top:12px}}
@media (max-width:390px){.v2-section02 h2{font-size:30px}}
</style>

<style scoped>
.v2-section02__cta span {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: .35rem;
  background: #0b42a8;
}
.v2-section02__cta span i {
  position: relative;
  top: -1px;
  font-style: normal;
  line-height: 1;
}
</style>

<style scoped>
.v2-section02{padding-top:clamp(88px,10vw,132px);padding-bottom:clamp(88px,10vw,132px)}
.v2-section02__card{padding-left:18px}
.v2-section02__card{gap:12px}
.v2-section02__bento{position:relative;justify-content:initial;overflow:hidden}
.v2-section02__label-target{position:absolute;inset:0;width:100%;height:100%;min-height:0}
.v2-section02__label-target :deep(img.v2-hero__label.is-docked){width:clamp(132px,12vw,170px)!important;max-width:170px!important}
.v2-section02__bento-copy{position:absolute;right:0;bottom:24px;left:0;z-index:1;padding:0 12px}
@media (max-width:800px){
  .v2-section02__label-target :deep(img.v2-hero__label.is-docked){width:84px!important;max-width:84px!important}
  .v2-section02__bento :deep(img.v2-hero__label.is-docked){position:absolute;left:50%;top:50%;width:84px!important;max-width:84px!important;transform:translate(-50%,-50%)!important;z-index:2}
  .v2-section02__bento-copy{bottom:20px}
}
</style>

<style scoped>
.v2-section02__eyebrow{font-size:0}
.v2-section02__eyebrow::after{content:'{ POR TRÁS DA ETIQUETA }';font-size:12px}
.v2-section02__card--four p{max-width:205px}
.v2-section02__cta{margin-left:auto;margin-right:auto}
@media(max-width:800px){.v2-section02{padding-top:78px;padding-bottom:88px}.v2-section02__eyebrow::after{font-size:11px}}
@media(max-width:560px){.v2-section02{padding-top:62px;padding-bottom:72px}.v2-section02__card--four p{max-width:none}}
.v2-section02__cta{transition:background .22s ease,box-shadow .22s ease,transform .22s ease}.v2-section02__cta:hover{background:#0b42a8;box-shadow:0 16px 30px rgba(20,93,245,.28);transform:translateY(-2px)}.v2-section02__cta span{position:relative;top:0}
@media(max-width:800px){.v2-section02__bento :deep(img.v2-hero__label.is-docked){width:clamp(104px,30vw,132px)!important;max-width:132px!important}}
@media(max-width:800px){
  .v2-section02__bento :deep(img.v2-hero__label.is-docked){
    transform:translate(-50%,calc(-50% - 25px))!important;
  }
  .v2-section02__bento-copy{bottom:35px!important}
}
</style>
