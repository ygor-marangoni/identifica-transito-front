<script setup lang="ts">
import { CarFront, Check, MapPin, ScanLine, ShieldCheck, UserRound } from '@lucide/vue';

const section = ref<HTMLElement | null>(null);
let motionContext: { revert: () => void } | undefined;

onMounted(async () => {
    if (!section.value) return;

    await waitForLandingV2Ready();
    const { default: gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    motionContext = gsap.context(() => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const intro = section.value!.querySelector('.v2-qr__intro');
        const stage = section.value!.querySelector('.v2-qr__stage');
        const code = section.value!.querySelector('.v2-qr__code');
        const scanner = section.value!.querySelector('.v2-qr__scanner');
        const result = section.value!.querySelector('.v2-qr__result');
        const details = Array.from(section.value!.querySelectorAll<HTMLElement>('.v2-qr__detail'));

        if (!intro || !stage || !code || !scanner || !result) return;

        if (reducedMotion) {
            gsap.set([intro, stage, code, scanner, result, ...details], { clearProps: 'all', autoAlpha: 1 });
            return;
        }

        // Keep the scanner's starting point deterministic on every viewport.
        // This also prevents the mobile cascade from masking the GSAP tween.
        gsap.set(scanner, { top: '7%', opacity: 1 });

        gsap.timeline({
            scrollTrigger: {
                trigger: section.value,
                start: 'top top',
                end: '+=1700',
                pin: section.value,
                pinSpacing: true,
                scrub: 1.15,
                refreshPriority: 2,
                invalidateOnRefresh: true
            }
        })
            .from(intro, { x: -20, duration: .8, ease: 'power3.out' })
            .from(stage, { x: 42, opacity: 0, duration: .8, ease: 'power3.out' }, '<')
            .from(code, { scale: .72, rotation: -8, duration: .9, ease: 'power2.out' }, .22)
            .from(scanner, { scaleX: 0, transformOrigin: 'left center', duration: .5, ease: 'power2.out' }, .72)
            .to(scanner, { top: '63%', duration: 1.35, ease: 'none' }, .72)
            .to(code, { scale: .42, xPercent: -190, yPercent: 42, opacity: 0, rotation: 0, duration: 1.35, ease: 'power2.inOut' }, 1.02)
            .from(result, { y: 72, opacity: 0, scale: .94, duration: .95, ease: 'power2.out' }, 1.62)
            .from(details, { y: 16, opacity: 0, stagger: .12, duration: .38, ease: 'power2.out' }, 1.88)
            .to(scanner, { opacity: 0, duration: .35, ease: 'power2.out' }, 2.08)
            .to(result, { width: '100%', maxWidth: 'none', x: 0, borderRadius: 25, duration: 1.05, ease: 'power2.inOut' }, 2.1);
    }, section.value);

    requestAnimationFrame(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
});

onBeforeUnmount(() => motionContext?.revert());
</script>

<template>
    <section class="v2-qr" ref="section" aria-labelledby="v2-qr-title">
        <div class="v2-qr__intro">
            <p class="v2-qr__eyebrow">{ LEITURA QUE INFORMA }</p>
            <h2 id="v2-qr-title">Um código.<br>Uma leitura.<br><span class="heading-highlight">Mais clareza.</span></h2>
            <p class="v2-qr__lead">O QR Code conecta a etiqueta às informações do veículo, sem expor dados pessoais.</p>
            <a href="#etiquetas" class="v2-qr__link"><span class="v2-qr__link-label">Ver as etiquetas</span><span aria-hidden="true"><i>»</i></span></a>
        </div>

        <div class="v2-qr__stage" aria-label="Demonstração de leitura do QR Code">
            <div class="v2-qr__code" aria-label="Representação de QR Code">
                <img class="v2-qr__label-image" src="/landing-v2/images/etiqueta.webp" alt="Etiqueta azul Identifica Trânsito com QR Code" loading="lazy" decoding="async" width="912" height="912">
            </div>
            <div class="v2-qr__scanner" aria-hidden="true"><i></i><span><ScanLine :size="17" /> lendo contexto</span></div>
            <article class="v2-qr__result" aria-label="Exemplo de informações exibidas após a leitura do QR Code">
                <div class="v2-qr__result-bar"><span>identifica trânsito</span><i></i><small>leitura concluída</small></div>
                <div class="v2-qr__result-main"><div class="v2-qr__vehicle-icon"><CarFront :size="29" /></div><div><span>Veículo cadastrado</span><strong>ABC1D23</strong><small>Automóvel · São Paulo, SP</small></div><Check :size="20" /></div>
                <dl class="v2-qr__result-details"><div class="v2-qr__detail"><dt><UserRound :size="13" />Perfil de uso</dt><dd>Pessoa idosa</dd></div><div class="v2-qr__detail"><dt><ShieldCheck :size="13" />Situação</dt><dd>Etiqueta ativa</dd></div><div class="v2-qr__detail"><dt><MapPin :size="13" />Registro</dt><dd>São Paulo, SP</dd></div></dl>
                <p><ShieldCheck :size="15" /> Contexto do veículo. Dados pessoais preservados.</p>
            </article>
        </div>
    </section>
</template>

<style scoped>
.v2-qr{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);align-items:center;gap:clamp(50px,8vw,140px);min-height:850px;box-sizing:border-box;padding:clamp(110px,13vw,180px) var(--v2-grid-inset);overflow:hidden;background:#eaf2ff;color:#101114;font-family:'Instrument Sans',Arial,sans-serif}.v2-qr__intro,.v2-qr__stage{min-width:0}.v2-qr__intro{max-width:590px}.v2-qr__eyebrow{margin:0 0 24px;color:#145df5;font-size:12px;font-weight:750;letter-spacing:.13em;line-height:1;text-transform:uppercase}.v2-qr__intro h2{margin:0;font-size:clamp(48px,5.4vw,80px);font-weight:700;letter-spacing:-.065em;line-height:.97}.v2-qr__intro h2 span{color:#145df5}.v2-qr__lead{max-width:460px;margin:29px 0 0;color:#626d80;font-size:18px;line-height:1.55}.v2-qr__promise{display:flex;flex-wrap:wrap;gap:9px;margin-top:27px}.v2-qr__promise span{display:inline-flex;align-items:center;gap:7px;padding:9px 11px;border:1px solid rgba(20,93,245,.14);border-radius:999px;background:rgba(255,255,255,.6);color:#315b9d;font-size:11px;font-weight:700}.v2-qr__promise svg{color:#145df5}.v2-qr__link{display:inline-flex;align-items:center;gap:9px;margin-top:32px;color:#101114;font-size:14px;font-weight:750;text-decoration:none}.v2-qr__link svg{color:#145df5;transition:transform .25s ease}.v2-qr__link:hover svg{transform:translateX(4px)}.v2-qr__stage{position:relative;width:100%;max-width:none;min-height:570px}.v2-qr__code{position:absolute;top:3%;left:8%;z-index:2;display:grid;width:clamp(255px,27vw,375px);max-width:375px;aspect-ratio:1;padding:28px;border:1px solid rgba(14,26,48,.08);border-radius:27px;background:#fff;box-shadow:0 28px 62px rgba(18,60,124,.18);will-change:transform}.v2-qr__code-top{display:flex;align-items:center;gap:7px;margin-bottom:18px;color:#145df5;font-size:10px;font-weight:800;letter-spacing:.12em}.v2-qr__code-top i{width:6px;height:6px;margin-left:auto;border-radius:50%;background:#31b779}.v2-qr__modules{display:grid;grid-template-columns:repeat(15,1fr);gap:1px}.v2-qr__modules i{display:block;min-width:0;aspect-ratio:1;border-radius:1px}.v2-qr__modules .is-filled{background:#101114}.v2-qr__code small{align-self:end;color:#7d8796;font-size:9px;font-weight:750;letter-spacing:.12em}.v2-qr__scanner{position:absolute;top:7%;left:4%;z-index:3;width:clamp(280px,31vw,455px);max-width:455px;height:2px;background:#145df5;box-shadow:0 0 19px #2f75ff;will-change:top,transform}.v2-qr__scanner i{position:absolute;top:-7px;left:-7px;width:16px;height:16px;border:2px solid #145df5;border-radius:50%;background:#eaf2ff}.v2-qr__scanner span{position:absolute;right:0;top:12px;display:flex;align-items:center;gap:6px;color:#0b42a8;font-size:11px;font-weight:750;white-space:nowrap}.v2-qr__result{position:absolute;right:0;bottom:1%;z-index:1;width:min(100%,530px);max-width:530px;padding:19px;border:1px solid rgba(11,66,168,.14);border-radius:25px;background:rgba(255,255,255,.96);box-shadow:0 30px 70px rgba(18,60,124,.13);will-change:transform,opacity}.v2-qr__result-bar{display:flex;align-items:center;gap:9px;padding:3px 2px 15px;border-bottom:1px solid #e8edf6;color:#0b42a8;font-size:12px;font-weight:750}.v2-qr__result-bar i{width:6px;height:6px;border-radius:50%;background:#31b779}.v2-qr__result-bar small{margin-left:auto;color:#7c8490;font-size:9px;font-weight:650;letter-spacing:.07em;text-transform:uppercase}.v2-qr__result-main{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:12px;padding:20px 3px}.v2-qr__vehicle-icon{display:grid;place-items:center;width:56px;height:56px;border-radius:15px;background:#eaf2ff;color:#145df5}.v2-qr__result-main span,.v2-qr__result-main small{display:block;color:#717985;font-size:11px}.v2-qr__result-main strong{display:block;margin:2px 0;font-size:21px;letter-spacing:.04em}.v2-qr__result-main>svg{color:#31a66e}.v2-qr__result-details{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:0}.v2-qr__result-details div{padding:11px;border-radius:11px;background:#f5f8fe}.v2-qr__result-details dt{display:flex;align-items:center;gap:4px;color:#687386;font-size:9px}.v2-qr__result-details dt svg{color:#145df5}.v2-qr__result-details dd{margin:5px 0 0;color:#17223a;font-size:11px;font-weight:700}.v2-qr__result>p{display:flex;align-items:center;gap:6px;margin:15px 2px 0;color:#0b42a8;font-size:10px;font-weight:650}.v2-qr__result>p svg{flex:none}
@media(max-width:1000px){.v2-qr{grid-template-columns:1fr;gap:55px}.v2-qr__intro{max-width:700px}.v2-qr__stage{max-width:720px;margin:auto}}
@media(max-width:650px){.v2-qr{min-height:auto;padding-top:90px;padding-bottom:105px;gap:45px}.v2-qr__eyebrow{font-size:11px}.v2-qr__intro h2{font-size:clamp(43px,12vw,58px)}.v2-qr__lead{font-size:16px}.v2-qr__stage{min-height:510px}.v2-qr__code{top:0;left:0;width:64%;padding:19px;border-radius:20px}.v2-qr__code-top{margin-bottom:12px;font-size:8px}.v2-qr__scanner{top:5%;left:-2%;width:70%}.v2-qr__result{right:0;bottom:0;width:88%;padding:14px;border-radius:20px}.v2-qr__result-main{padding:16px 2px}.v2-qr__result-details{grid-template-columns:1fr 1fr}.v2-qr__result-details div:last-child{display:none}.v2-qr__result-main small{font-size:9px}}
@media(prefers-reduced-motion:reduce){.v2-qr__link svg{transition:none}}
</style>

<style scoped>
.v2-qr__eyebrow{display:block!important;width:auto!important;margin:0 0 20px!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;color:#145df5!important;font-size:12px!important;font-weight:700!important;letter-spacing:.13em!important;line-height:1!important;text-transform:uppercase!important}
.v2-qr__promise{display:flex!important;align-items:center!important;flex-wrap:wrap!important;gap:9px!important;margin-top:27px!important}
.v2-qr__promise span{display:inline-flex!important;align-items:center!important;gap:6px!important;min-height:32px!important;padding:8px 11px!important;border:1px solid rgba(20,93,245,.2)!important;border-radius:999px!important;background:#f4f8ff!important;color:#0b42a8!important;font-size:11px!important;font-weight:750!important;line-height:1!important;white-space:nowrap!important}
.v2-qr__promise svg{display:block!important;width:17px!important;height:17px!important;color:#145df5!important}
.v2-qr__link{display:inline-flex!important;align-items:center!important;gap:16px!important;width:max-content!important;min-height:50px!important;margin-top:32px!important;padding:0 8px 0 22px!important;border:0!important;border-radius:.7rem!important;background:#145df5!important;box-shadow:none!important;color:#fff!important;font-size:14px!important;font-weight:700!important;line-height:1!important;text-decoration:none!important;transition:background .22s ease,transform .22s ease!important}
.v2-qr__link:hover{background:#0b42a8!important;box-shadow:none!important;transform:translateY(-2px)!important}
.v2-qr__link span{display:grid!important;width:36px!important;height:36px!important;place-items:center!important;border-radius:.35rem!important;background:#0b42a8!important;color:#fff!important;font-size:22px!important;line-height:1!important}
.v2-qr__link span i{position:relative!important;top:-1px!important;font-style:normal!important}
.v2-qr__link-label{position:relative!important;top:-1px!important;display:block!important;flex:none!important;width:auto!important;height:auto!important;padding:0!important;border-radius:0!important;background:transparent!important;font-size:inherit!important;line-height:inherit!important;white-space:nowrap!important}
.v2-qr__link{width:max-content!important;min-width:0!important;box-sizing:border-box!important;white-space:nowrap!important}
.v2-qr__link > .v2-qr__link-label{display:block!important;position:relative!important;top:-1px!important;width:auto!important;min-width:0!important;height:auto!important;min-height:0!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;color:#fff!important;font-size:inherit!important;font-weight:700!important;line-height:1!important;white-space:nowrap!important}
.v2-qr__link > span:not(.v2-qr__link-label){display:grid!important;flex:0 0 36px!important;width:36px!important;min-width:36px!important;height:36px!important;min-height:36px!important;margin:0!important;padding:0!important;place-items:center!important;border:0!important;border-radius:.35rem!important;background:#0b42a8!important;box-shadow:none!important;color:#fff!important}
.v2-qr__intro h2{font-size:clamp(44px,5vw,74px)!important;font-weight:700!important;letter-spacing:-.045em!important;line-height:1.02!important}
.v2-qr__lead{max-width:400px!important;margin:29px 0 0!important;color:#596170!important;font-size:18px!important;line-height:1.55!important}
.v2-qr__code{display:grid!important;place-items:center!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important}
.v2-qr__label-image{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;filter:drop-shadow(0 22px 25px rgba(8,37,104,.2))!important}
.v2-qr__stage{justify-self:end!important;margin-left:auto!important}
.v2-qr__intro{width:100%!important;max-width:760px!important;margin-left:0!important;margin-right:auto!important}
.v2-qr__result{top:18%!important;bottom:auto!important}
@media(min-width:1001px){.v2-qr__intro{transform:translateY(-58px)!important}}
.v2-qr__scanner{left:4%!important;right:0!important;width:auto!important;max-width:none!important;background:#0b42a8!important;box-shadow:0 0 16px rgba(11,66,168,.5)!important}
.v2-qr__scanner i{border-color:#0b42a8!important;background:#eaf2ff!important}
.v2-qr__scanner span{color:#0b42a8!important}
@media(max-width:1000px){.v2-qr{min-height:100svh;padding-top:78px;padding-bottom:88px}.v2-qr__stage{min-height:min(570px,62svh)}.v2-qr__intro h2{font-size:32px!important;font-weight:500!important;letter-spacing:-.025em!important;line-height:1.04!important}}
@media (min-width:1601px){.v2-qr__intro h2{font-size:56px!important;font-weight:600!important;letter-spacing:-.025em!important;line-height:.98!important}}
@media (min-width:1441px) and (max-width:1600px){.v2-qr__intro h2{font-size:52px!important;font-weight:600!important;letter-spacing:-.025em!important;line-height:.98!important}}
@media (min-width:1200px) and (max-width:1440px){.v2-qr__intro h2{font-size:48px!important;font-weight:600!important;letter-spacing:-.025em!important;line-height:.98!important}}
@media (min-width:1001px) and (max-width:1199px){.v2-qr__intro h2{font-size:44px!important;font-weight:600!important;letter-spacing:-.025em!important;line-height:.98!important}}
@media(max-width:650px){.v2-qr{min-height:100svh}.v2-qr__stage{min-height:510px;width:100%;margin:0!important}.v2-qr__intro{max-width:100%!important}.v2-qr__intro h2{font-size:32px!important}.v2-qr__eyebrow{font-size:11px!important}.v2-qr__scanner{left:-2%!important;right:auto!important;width:70%!important}.v2-qr__result{top:auto!important;bottom:0!important}}
.v2-qr{padding-top:clamp(42px,5vw,76px)!important;padding-bottom:clamp(42px,5vw,76px)!important}
@media(max-width:1000px){.v2-qr{padding-top:42px!important;padding-bottom:52px!important}}
@media(max-width:650px){.v2-qr{padding-top:72px!important;padding-bottom:24px!important}.v2-qr__result{top:auto!important;bottom:0!important}}
.v2-qr__link-label{position:relative!important;top:-1px!important;display:block!important;width:auto!important;height:auto!important;padding:0!important;border-radius:0!important;background:transparent!important;font-size:inherit!important;line-height:inherit!important}
@media(max-width:650px){.v2-qr{display:grid;grid-template-columns:1fr;gap:28px;width:100%;overflow:hidden}.v2-qr__intro{width:100%;max-width:none!important;transform:none!important}.v2-qr__eyebrow{margin-bottom:16px!important;font-size:11px!important;letter-spacing:.11em!important}.v2-qr__intro h2{display:block!important;width:100%!important;max-width:100%!important;margin:0!important;font-size:32px!important;font-weight:600!important;letter-spacing:-.025em!important;line-height:1.04!important}.v2-qr__lead{max-width:34rem!important;margin-top:20px!important;font-size:15px!important;line-height:1.45!important}.v2-qr__link{width:max-content!important;min-width:0!important;min-height:48px!important;margin-top:24px!important;padding-left:18px!important;font-size:13px!important;white-space:nowrap!important}.v2-qr__stage{width:100%!important;min-height:clamp(320px,85vw,420px)!important;margin:64px 0 0!important;overflow:visible}.v2-qr__code{top:0!important;left:50%!important;margin-left:calc(clamp(155px,52vw,245px) / -2)!important;width:clamp(155px,52vw,245px)!important}.v2-qr__scanner{top:7%;left:0;right:0;width:auto}.v2-qr__scanner span{right:0!important;font-size:9px!important}.v2-qr__result{top:0!important;right:0!important;bottom:auto!important;width:94%!important;max-width:100%!important;padding:13px!important;border-radius:18px!important}.v2-qr__result-main{grid-template-columns:auto minmax(0,1fr) auto;gap:8px;padding:14px 1px!important}.v2-qr__vehicle-icon{width:44px!important;height:44px!important}.v2-qr__result-main strong{font-size:17px!important}.v2-qr__result-main span,.v2-qr__result-main small{font-size:9px!important}.v2-qr__result-details{gap:5px!important}.v2-qr__result-details div{padding:8px!important}.v2-qr__result-details dt{font-size:8px!important}.v2-qr__result-details dd{font-size:9px!important}.v2-qr__result>p{margin-top:10px!important;font-size:9px!important;line-height:1.3!important}}
@media(max-width:800px){.v2-qr__intro h2{font-size:32px!important;font-weight:600!important;letter-spacing:-.025em!important;line-height:1.04!important}}
@media(max-width:390px){.v2-qr__intro h2{font-size:30px!important;font-weight:600!important}}
.v2-qr__scanner{background:#31b779!important;box-shadow:0 0 16px rgba(49,183,121,.52)!important}
.v2-qr__scanner i{border-color:#31b779!important}
.v2-qr__scanner span{color:#18794e!important}
</style>
