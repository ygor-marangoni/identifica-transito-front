<script setup lang="ts">
import { ArrowRight, Mail } from '@lucide/vue';

const section = ref<HTMLElement | null>(null);
let animation: { kill: () => void } | undefined;

onMounted(async () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    await waitForLandingV2Ready();
    const { gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);
    if (!section.value) return;
    const copy = section.value.querySelectorAll<HTMLElement>('.v2-closing__copy > *');
    const visual = section.value.querySelector<HTMLElement>('.v2-closing__visual');
    const visualImage = visual?.querySelector('img');
    const compact = window.matchMedia('(max-width: 900px)').matches;
    animation = gsap.timeline({ scrollTrigger: { trigger: section.value, start: 'top 82%', once: true } })
        .from(copy, { y: 22, autoAlpha: 0, duration: 1.0, stagger: .1, ease: 'power2.out' })
        .from(visual, { x: 0, y: 24, autoAlpha: 0, scale: .985, duration: 1.1, ease: 'power2.out' }, '-=.48')
        .from(visualImage, { scale: 1.06, duration: 1.05, ease: 'power2.out' }, '-=.78');
});

onBeforeUnmount(() => animation?.kill());
</script>

<template>
    <div ref="section" class="v2-closing">
        <section class="v2-closing__cta" aria-labelledby="v2-closing-title">
            <img class="v2-closing__divider" src="/landing-v2/images/closing/final-cta-divider.svg?v=2" alt="" aria-hidden="true" width="1440" height="100" decoding="async">
            <div class="v2-closing__cta-inner">
                <div class="v2-closing__copy">
                    <h2 id="v2-closing-title">Uma escolha simples para um trânsito mais atento.</h2>
                    <p>Cadastre seu veículo, escolha a etiqueta ideal e ajude a tornar cada encontro no trânsito mais seguro e respeitoso.</p>
                    <NuxtLink to="/auth/register" class="v2-closing__button">Criar minha conta <ArrowRight :size="17" /></NuxtLink>
                </div>
                <aside class="v2-closing__visual">
                    <img src="/landing-v2/images/cta-footer.webp" alt="Veículo, etiqueta Identifica Trânsito e tela da plataforma" width="1440" height="1050" loading="lazy">
                </aside>
            </div>
        </section>

        <footer class="v2-closing__footer">
            <div class="v2-closing__footer-inner">
                <div class="v2-closing__footer-brand">
                    <img src="/landing-v2/images/closing/logo-vertical.svg" alt="Identifica Trânsito" width="168" height="50" loading="lazy" decoding="async">
                    <p>Mais contexto, empatia e segurança para todos que compartilham o trânsito.</p>
                </div>
                <nav class="v2-closing__group" aria-label="Navegação do rodapé">
                    <span>Navegação</span><a href="#top">Início</a><a href="#projeto">O Projeto</a><a href="#etiquetas">As Etiquetas</a><a href="#plataforma">Benefícios</a><a href="#preco">Preço</a><a href="#como-funciona">Como funciona</a><a href="#faq">FAQ</a>
                </nav>
                <nav class="v2-closing__group" aria-label="Conta">
                    <span>Conta</span><NuxtLink to="/auth/register">Cadastre-se</NuxtLink><NuxtLink to="/auth/login">Login</NuxtLink>
                </nav>
                <div class="v2-closing__contact">
                    <span>E-mail para contato</span>
                    <form action="mailto:identificatransito@gmail.com" method="get">
                        <label class="v2-closing__sr-only" for="v2-footer-contact-email">Seu e-mail</label><input id="v2-footer-contact-email" name="body" type="email" placeholder="Seu e-mail" autocomplete="email"><button type="submit">Enviar</button>
                    </form>
                    <span class="v2-closing__social-title">Sociais</span>
                    <div class="v2-closing__socials" aria-label="Redes sociais">
                        <a href="mailto:identificatransito@gmail.com" aria-label="E-mail"><Mail :size="17" /></a>
                        <a href="https://wa.me/5511984971689" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.6 4.1 1.6 5.8L.2 24l6.6-1.7a11.8 11.8 0 0 0 5.3 1.3h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.3-6.1-3.5-8.3Zm-8.4 18.1h-.1a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.9 1 1-3.8-.3-.4a9.8 9.8 0 1 1 8.7 4.8Zm5.4-7.4c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-.9 1.2-.3.2-.6.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.7-2.1c-.2-.4 0-.5.2-.7l.4-.5.3-.5c.1-.2 0-.4 0-.6l-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.8.4a3.3 3.3 0 0 0-1 2.4c0 1.4 1 2.8 1.1 3s2 3.1 5 4.4c.7.3 1.3.5 1.8.7.8.2 1.5.2 2 .1.6-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4-.1 0-.3-.1-.5-.2Z"/></svg></a>
                        <a href="https://www.instagram.com/identificatransito/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" class="v2-closing__instagram-dot"/></svg></a>
                    </div>
                </div>
                <div class="v2-closing__bottom"><p>© {{ new Date().getFullYear() }} Identifica Trânsito. Todos os direitos reservados.</p><NuxtLink to="/politica-de-privacidade">Política de privacidade</NuxtLink></div>
            </div>
        </footer>
    </div>
</template>

<style scoped>
.v2-closing{font-family:'Instrument Sans',Arial,sans-serif}.v2-closing__cta,.v2-closing__footer{background:#020617;color:#fff}.v2-closing__cta{position:relative;overflow:hidden;padding:clamp(8rem,12vw,11rem) var(--v2-grid-inset) clamp(5rem,8vw,8rem)}.v2-closing__divider{position:absolute;z-index:2;top:-1px;right:0;left:0;display:block;width:100%;height:clamp(4.5rem,7vw,7rem);pointer-events:none}.v2-closing__cta-inner,.v2-closing__footer-inner{position:relative;z-index:1;width:100%;max-width:var(--v2-grid-max);margin:0 auto}.v2-closing__cta-inner{display:grid;grid-template-columns:minmax(0,1fr) minmax(20rem,34rem);gap:clamp(3rem,9vw,10rem);align-items:center}.v2-closing__copy{max-width:39rem}.v2-closing__brand{display:block;width:10.5rem;height:auto;margin-bottom:1.5rem;filter:brightness(0) invert(1)}.v2-closing h2{max-width:38rem;margin:0;color:#fff;font-size:clamp(44px,5.4vw,78px);font-weight:600;letter-spacing:-.025em;line-height:.98}.v2-closing__copy>p{max-width:34rem;margin:1.5rem 0 0;color:rgba(255,255,255,.78);font-size:18px;line-height:1.5}.v2-closing__button{display:inline-flex;align-items:center;gap:.7rem;min-height:3.35rem;margin-top:2rem;padding:.85rem 1.2rem;border-radius:.45rem;background:#fff;color:#0f172a;font-size:1rem;font-weight:700;text-decoration:none}.v2-closing__visual{position:relative;overflow:hidden;aspect-ratio:1.25/1;border:1px solid rgba(255,255,255,.18);border-radius:.9rem;background:#0f172a}.v2-closing__visual>img{display:block;width:100%;height:100%;object-fit:cover}.v2-closing__visual>span{position:absolute;right:.85rem;bottom:.85rem;padding:.55rem .75rem;border:1px solid rgba(255,255,255,.2);border-radius:.4rem;background:rgba(2,6,23,.72);color:#fff;font-size:.78rem;font-weight:500}.v2-closing__footer{padding:clamp(3.5rem,6vw,5rem) var(--v2-grid-inset) 1.5rem}.v2-closing__footer-inner{display:grid;grid-template-columns:minmax(18rem,1.4fr) minmax(9rem,.65fr) minmax(9rem,.65fr) minmax(16rem,1.1fr);gap:2rem}.v2-closing__footer-brand>img{width:10.5rem;height:auto;filter:brightness(0) invert(1)}.v2-closing__footer-brand p{max-width:19.5rem;margin:1.45rem 0 0;color:rgba(255,255,255,.62);font-size:16px;line-height:1.55}.v2-closing__footer-brand p:before{display:block;width:3.25rem;height:1px;margin-bottom:1.1rem;content:'';background:linear-gradient(90deg,rgba(255,255,255,.72),rgba(255,255,255,.08))}.v2-closing__group,.v2-closing__contact{display:grid;align-content:start;gap:.65rem}.v2-closing__group>span,.v2-closing__contact>span{margin-bottom:.5rem;color:rgba(255,255,255,.5);font-size:.78rem;font-weight:700;letter-spacing:.13em;text-transform:uppercase}.v2-closing__group a{width:max-content;color:rgba(255,255,255,.84);font-size:16px;text-decoration:none}.v2-closing__contact form{display:flex;min-height:3.65rem;overflow:hidden;border:1px solid rgba(255,255,255,.2);border-radius:.8rem;background:rgba(255,255,255,.04)}.v2-closing__contact input{min-width:0;flex:1;border:0;outline:0;background:transparent;padding:0 1rem;color:#fff;font:inherit;font-size:14px}.v2-closing__contact input::placeholder{color:rgba(255,255,255,.5)}.v2-closing__contact button{margin:.45rem;border:0;border-radius:.55rem;padding:0 1rem;background:#fff;color:#020617;font:inherit;font-size:.72rem;font-weight:700;letter-spacing:.04em;cursor:pointer;text-transform:uppercase}.v2-closing__social-title{margin-top:1.1rem}.v2-closing__socials{display:flex;gap:.6rem}.v2-closing__socials a{display:grid;width:2.65rem;height:2.65rem;place-items:center;border:1px solid rgba(255,255,255,.2);border-radius:.6rem;color:rgba(255,255,255,.88)}.v2-closing__bottom{display:flex;grid-column:1/-1;justify-content:space-between;gap:1rem;margin-top:3rem;padding-top:1.25rem;border-top:1px solid rgba(255,255,255,.13);color:rgba(255,255,255,.6);font-size:12px}.v2-closing__bottom p{margin:0}.v2-closing__bottom a{color:inherit;text-decoration:none}.v2-closing__group a:hover,.v2-closing__bottom a:hover{text-decoration:underline;text-underline-offset:.18em}.v2-closing__sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
@media(max-width:900px){.v2-closing__cta-inner{grid-template-columns:1fr;gap:3rem;max-width:38rem}.v2-closing__visual{width:100%}.v2-closing__footer-inner{grid-template-columns:1fr 1fr}.v2-closing__footer-brand,.v2-closing__contact{grid-column:1/-1}}
@media(max-width:560px){.v2-closing__cta{padding:6rem 20px 4rem}.v2-closing__brand{width:9rem}.v2-closing h2{font-size:clamp(34px,10vw,46px)}.v2-closing__copy>p{font-size:16px}.v2-closing__button{margin-top:1.5rem}.v2-closing__visual{aspect-ratio:1.1/1}.v2-closing__footer{padding:3.5rem 20px 1.25rem}.v2-closing__footer-inner{grid-template-columns:1fr;gap:2rem}.v2-closing__footer-brand,.v2-closing__contact{grid-column:auto}.v2-closing__footer-brand p{font-size:15px}.v2-closing__group a{font-size:15px}.v2-closing__bottom{grid-column:auto;flex-direction:column;gap:.7rem;margin-top:1rem}.v2-closing__contact form{min-height:3.35rem}}
.v2-closing__cta,.v2-closing__footer{background:#0b42a8!important}.v2-closing h2{max-width:900px!important;font-size:clamp(36px,3.6vw,56px)!important}.v2-closing__socials svg{display:block;width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.v2-closing__socials svg path{fill:currentColor;stroke:none}.v2-closing__socials svg .v2-closing__instagram-dot{fill:currentColor;stroke:none}
.v2-closing__cta,.v2-closing__footer{background:#0b42a8!important}
.v2-closing h2{max-width:760px!important;font-size:clamp(34px,3.1vw,48px)!important}
@media(max-width:560px){.v2-closing h2{font-size:30px!important}}
.v2-closing__visual{isolation:isolate;overflow:hidden;aspect-ratio:1.37/1;border:0;background:transparent}
.v2-closing__cta-inner{grid-template-columns:minmax(0,1fr) minmax(36rem,43rem);gap:clamp(2rem,4vw,5rem)}
.v2-closing__visual::before{position:absolute;z-index:-1;inset:8% 4%;border-radius:50%;content:'';background:radial-gradient(circle,rgba(36,116,255,.68),rgba(11,66,168,0) 68%);filter:blur(22px)}
.v2-closing__visual::after{position:absolute;z-index:-1;right:0;bottom:0;width:100%;height:70%;border:0;border-radius:50% 50% 0 0 / 28% 28% 0 0;content:'';background:radial-gradient(ellipse at 58% 100%,rgba(2,22,80,.42),rgba(5,41,128,.24) 58%,rgba(8,52,151,0) 100%)}
.v2-closing__visual>img{width:100%;height:100%;margin:0;object-fit:contain;filter:drop-shadow(0 28px 26px rgba(0,18,70,.3))}
@media(max-width:900px){.v2-closing__cta-inner{grid-template-columns:1fr;gap:3rem}}
@media(min-width:901px){.v2-closing__copy{transform:translateY(calc(40px - clamp(1.5rem,2.5vw,3rem)))}}
@media(min-width:901px){.v2-closing__cta{padding-top:clamp(5.5rem,7vw,7.5rem);padding-bottom:clamp(3.5rem,5vw,5.5rem)}.v2-closing__visual{top:0}}
@media(max-width:560px){.v2-closing__visual{aspect-ratio:1.37/1}}
@media(prefers-reduced-motion:reduce){.v2-closing__button,.v2-closing__socials a{transition:none}}
</style>
