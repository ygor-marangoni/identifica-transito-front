<script setup lang="ts">
import { ArrowRight } from '@lucide/vue';

const isMenuOpen = ref(false);
const isScrolled = ref(false);
const isBottomNavVisible = ref(false);
const activeSection = ref('top');
let lastScrollY = 0;
let hasBottomNavEntered = false;
let bottomNavRevealScroll = 0;

const links = [
    { label: 'O Projeto', id: 'o-projeto' },
    { label: 'Etiquetas', id: 'etiquetas' },
    { label: 'Plataforma', id: 'plataforma' },
    { label: 'Como funciona', id: 'como-funciona' },
    { label: 'Preço', id: 'preco' }
];

const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    isMenuOpen.value = false;
};

const updateNavigation = () => {
    isScrolled.value = window.scrollY > 16;
    const currentScrollY = window.scrollY;
    const hero = document.querySelector<HTMLElement>('.v2-hero');
    const footer = document.querySelector<HTMLElement>('.v2-footer');
    const crossedFirstFold = hero ? currentScrollY >= hero.offsetTop + hero.offsetHeight - 24 : currentScrollY >= window.innerHeight - 24;
    const isBeforeFooter = footer ? currentScrollY + window.innerHeight < footer.offsetTop : true;
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    const inRange = isDesktop && crossedFirstFold && isBeforeFooter;
    const scrollDelta = currentScrollY - lastScrollY;

    if (!inRange) {
        isBottomNavVisible.value = false;
        if (!crossedFirstFold) hasBottomNavEntered = false;
    } else if (!hasBottomNavEntered) {
        isBottomNavVisible.value = true;
        hasBottomNavEntered = true;
        bottomNavRevealScroll = currentScrollY;
    } else if (scrollDelta > 2 && currentScrollY - bottomNavRevealScroll > 240) {
        isBottomNavVisible.value = false;
    } else if (scrollDelta < -2) {
        isBottomNavVisible.value = true;
    }

    const current = [...links].reverse().find((link) => {
        const element = document.getElementById(link.id);
        return element && currentScrollY >= element.offsetTop - window.innerHeight * .42;
    });
    activeSection.value = current?.id || 'top';
    lastScrollY = currentScrollY;
};

onMounted(() => {
    updateNavigation();
    window.addEventListener('scroll', updateNavigation, { passive: true });
    window.addEventListener('resize', updateNavigation);
    document.body.classList.toggle('landing-menu-open', isMenuOpen.value);
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', updateNavigation);
    window.removeEventListener('resize', updateNavigation);
    document.body.classList.remove('landing-menu-open');
});

watch(isMenuOpen, (open) => document.body.classList.toggle('landing-menu-open', open));
</script>

<template>
    <div class="v2-header-shell">
    <header class="v2-nav" :class="{ 'v2-nav--scrolled': isScrolled, 'v2-nav--menu-open': isMenuOpen }">
        <div class="v2-nav__inner">
            <button class="v2-nav__brand" type="button" aria-label="Ir para o topo da página" @click="goTo('top')"><img src="/images/logo-vertical.svg" alt="Identifica Trânsito"></button>
            <nav class="v2-nav__links" aria-label="Navegação principal da Landing V2"><a v-for="link in links" :key="link.id" :href="`#${link.id}`" :class="{ 'v2-nav__link--active': activeSection === link.id }" :aria-current="activeSection === link.id ? 'location' : undefined">{{ link.label }}</a></nav>
            <div class="v2-nav__actions"><NuxtLink to="/auth/Login" class="v2-nav__cta"><span>Acessar plataforma</span><span class="v2-nav__cta-arrow"><ArrowRight :size="15" /></span></NuxtLink><button class="v2-nav__toggle" type="button" :class="{ 'v2-nav__toggle--open': isMenuOpen }" :aria-expanded="isMenuOpen" :aria-label="isMenuOpen ? 'Fechar menu' : 'Abrir menu'" @click="isMenuOpen = !isMenuOpen"><span class="v2-nav__toggle-line"></span><span class="v2-nav__toggle-line"></span><span class="v2-nav__toggle-line"></span></button></div>
        </div>
        <nav v-if="isMenuOpen" class="v2-nav__mobile-links" aria-label="Navegação mobile da Landing V2"><div class="v2-nav__mobile-menu"><a href="#top" @click="isMenuOpen = false">Início</a><a v-for="link in links" :key="`mobile-${link.id}`" :href="`#${link.id}`" @click="isMenuOpen = false">{{ link.label }}</a></div><NuxtLink to="/auth/Login" class="v2-nav__mobile-cta"><span>Acessar plataforma</span><span><ArrowRight :size="22" /></span></NuxtLink></nav>
    </header>
    <nav class="v2-bottom-nav" :class="{ 'v2-bottom-nav--visible': isBottomNavVisible }" aria-label="Navegação rápida da Landing V2"><a href="#top" :class="{ 'is-active': activeSection === 'top' }" :aria-current="activeSection === 'top' ? 'location' : undefined">Início</a><a v-for="link in links" :key="`bottom-${link.id}`" :href="`#${link.id}`" :class="{ 'is-active': activeSection === link.id }" :aria-current="activeSection === link.id ? 'location' : undefined">{{ link.label }}</a><NuxtLink to="/auth/register" class="v2-bottom-nav__cta"><span>Criar minha conta</span><span><ArrowRight :size="15" /></span></NuxtLink></nav>
</div>
</template>

<style scoped>
.v2-header-shell{display:contents}
.v2-nav{position:absolute;top:0;left:0;z-index:50;width:100%;padding:1.35rem 24px;color:#fff;font-family:'Instrument Sans',Arial,sans-serif}.v2-nav__inner{display:grid;grid-template-columns:minmax(9rem,12rem) 1fr minmax(13rem,auto);align-items:center;gap:2rem;max-width:1648px;margin:auto}.v2-nav__brand{display:inline-flex;align-items:center;width:10.2rem;padding:0;border:0;background:transparent;cursor:pointer}.v2-nav__brand img{display:block;width:100%;height:auto;filter:brightness(0) invert(1)}.v2-nav__links{display:flex;align-items:center;justify-content:center;gap:clamp(1rem,2.2vw,2.3rem)}.v2-nav__links button{display:inline-flex;align-items:center;padding:0;border:0;background:transparent;color:rgba(255,255,255,.86);font:400 1rem/1 'Instrument Sans',Arial,sans-serif;white-space:nowrap;cursor:pointer;transition:color .2s}.v2-nav__links button:hover,.v2-nav__links button:focus-visible,.v2-nav__link--active{color:#fff!important}.v2-nav__actions{display:flex;align-items:center;justify-content:flex-end;gap:1.35rem}.v2-nav__cta,.v2-bottom-nav__cta{position:relative;display:inline-flex;align-items:center;justify-content:space-between;min-width:15.25rem;min-height:3.25rem;padding:.25rem .3rem .25rem 1.2rem;overflow:hidden;border:1px solid #f1f3f6;border-radius:.7rem;background:#f1f3f6;color:#060c28;font-size:.9rem;font-weight:600;letter-spacing:.025em;text-decoration:none;text-transform:uppercase;white-space:nowrap}.v2-nav__cta>span:first-child,.v2-bottom-nav__cta>span:first-child{position:relative;z-index:2;transition:opacity 260ms ease}.v2-nav__cta-arrow,.v2-bottom-nav__cta>span:last-child{position:absolute;z-index:3;top:.25rem;right:.3rem;display:grid;width:2.15rem;height:calc(100% - .5rem);place-items:center;border-radius:.48rem;background:#060c28;color:#fff;transition:width 420ms cubic-bezier(.22,1,.36,1)}.v2-nav__cta:hover .v2-nav__cta-arrow,.v2-nav__cta:focus-visible .v2-nav__cta-arrow,.v2-bottom-nav__cta:hover>span:last-child,.v2-bottom-nav__cta:focus-visible>span:last-child{width:calc(100% - .6rem)}.v2-nav__cta:hover>span:first-child,.v2-nav__cta:focus-visible>span:first-child,.v2-bottom-nav__cta:hover>span:first-child,.v2-bottom-nav__cta:focus-visible>span:first-child{opacity:0}.v2-nav__toggle,.v2-nav__mobile-links{display:none}.v2-bottom-nav{position:fixed;z-index:60;bottom:1.5rem;left:50%;display:flex;align-items:center;gap:.25rem;width:max-content;max-width:calc(100vw - 48px);padding:.45rem;border:1px solid rgba(219,229,255,.14);border-radius:.9rem;background:rgba(6,12,40,.94);backdrop-filter:blur(16px);opacity:0;pointer-events:none;transform:translate(-50%,calc(100% + 2rem));transition:opacity 260ms ease,transform 440ms cubic-bezier(.22,1,.36,1)}.v2-bottom-nav--visible{opacity:1;pointer-events:auto;transform:translate(-50%,0)}.v2-bottom-nav>button{display:inline-flex;align-items:center;justify-content:center;min-height:3rem;padding:0 .9rem;border:0;border-radius:.6rem;background:transparent;color:rgba(255,255,255,.74);font:400 1rem/1 'Instrument Sans',Arial,sans-serif;white-space:nowrap;cursor:pointer}.v2-bottom-nav>button:hover,.v2-bottom-nav>button:focus-visible,.v2-bottom-nav>button.is-active{background:rgba(255,255,255,.12);color:#fff}.v2-bottom-nav__cta{min-width:14.25rem;min-height:2.95rem;padding:.25rem .3rem .25rem 1rem;font-size:.92rem}
@media(max-width:1023px){.v2-nav{position:absolute;padding:0 24px;background:rgba(15,23,42,0);backdrop-filter:blur(0);transition:background 220ms ease}.v2-nav--scrolled{background:rgba(2,6,23,.86);backdrop-filter:blur(16px)}.v2-nav__inner{grid-template-columns:1fr auto;gap:1rem}.v2-nav__brand{width:8.5rem;padding:1.1rem 0}.v2-nav__links,.v2-nav__cta,.v2-bottom-nav{display:none}.v2-nav__actions{gap:0}.v2-nav__toggle{position:relative;z-index:53;display:grid;place-items:center;width:3rem;height:3rem;padding:0;border:0;background:transparent;color:#fff;cursor:pointer}.v2-nav--menu-open{z-index:60;background:#f7f8fa}.v2-nav--menu-open .v2-nav__brand img{filter:brightness(0) saturate(100%) invert(7%) sepia(23%) saturate(2316%) hue-rotate(190deg) brightness(94%) contrast(97%)}.v2-nav--menu-open .v2-nav__toggle{color:#060c28}.v2-nav__mobile-links{position:fixed;z-index:52;top:0;left:0;display:flex;flex-direction:column;width:100%;height:100dvh;padding:6.75rem 24px 1.5rem;overflow-y:auto;background:#f7f8fa;animation:v2-menu-in 280ms both}.v2-nav__mobile-menu{display:flex;flex:1;flex-direction:column;align-items:center;justify-content:center;gap:1.65rem;padding-bottom:3.5rem}.v2-nav__mobile-menu button{padding:0;border:0;background:transparent;color:#060c28;font:400 32px/1.1 'Instrument Sans',Arial,sans-serif;letter-spacing:-.045em;cursor:pointer}.v2-nav__mobile-cta{display:inline-flex;align-items:center;justify-content:space-between;width:100%;min-height:52px;padding:.25rem .3rem .25rem 1.2rem;border:1px solid #060c28;border-radius:.7rem;background:#060c28;color:#fff;font-size:1rem;font-weight:600;letter-spacing:.025em;text-decoration:none;text-transform:uppercase}.v2-nav__mobile-cta>span:last-child{display:grid;width:2.45rem;height:calc(100% - .5rem);place-items:center;border-radius:.48rem;background:#fff;color:#060c28}@keyframes v2-menu-in{from{opacity:0}to{opacity:1}}}@media(max-width:520px){.v2-nav{padding:0 20px}.v2-nav__mobile-links{padding-left:20px;padding-right:20px}}
</style>

<style scoped>
.v2-nav__links a { display:inline-flex; align-items:center; padding:0; border:0; background:transparent; color:rgba(255,255,255,.86); font:400 1rem/1 'Instrument Sans',Arial,sans-serif; text-decoration:none; white-space:nowrap; cursor:pointer; transition:color .2s; }
.v2-nav__links a:hover,.v2-nav__links a:focus-visible,.v2-nav__links a.v2-nav__link--active { color:#fff; }
.v2-nav__mobile-menu a { padding:0; border:0; background:transparent; color:#060c28; font:400 32px/1.1 'Instrument Sans',Arial,sans-serif; letter-spacing:-.045em; text-decoration:none; cursor:pointer; }
.v2-bottom-nav>a:not(.v2-bottom-nav__cta) { display:inline-flex; align-items:center; justify-content:center; min-height:3rem; padding:0 .9rem; border-radius:.6rem; color:rgba(255,255,255,.74); font:400 1rem/1 'Instrument Sans',Arial,sans-serif; text-decoration:none; white-space:nowrap; }
.v2-bottom-nav>a:not(.v2-bottom-nav__cta):hover,.v2-bottom-nav>a:not(.v2-bottom-nav__cta):focus-visible,.v2-bottom-nav>a:not(.v2-bottom-nav__cta).is-active { background:rgba(255,255,255,.12); color:#fff; }
</style>

<style scoped>
@media (max-width: 1023px) {
    .v2-nav {
        position: fixed;
        left: 0;
        right: 0;
        width: 100%!important;
        min-width: 100%;
        max-width: 100vw;
        box-sizing: border-box;
        padding: 0 24px;
    }
    .v2-nav__inner { min-height: 64px; }
    .v2-nav__brand { width: 9rem; }
    .v2-nav__brand { position: relative; z-index: 64; }
    .v2-nav__toggle { z-index: 64; width: 44px; height: 44px; border: 1px solid rgba(255,255,255,.11); border-radius: 12px; background: rgba(0,0,0,.12); box-shadow: 0 5px 16px rgba(0,0,0,.12); }
    .v2-nav--menu-open .v2-nav__toggle { border-color: rgba(6,12,40,.1); background: rgba(6,12,40,.04); box-shadow: none; }
    .v2-nav__toggle-line { position: absolute; left: 50%; display: block; width: 18px; height: 2px; margin: 0 !important; border-radius: 999px; background: currentColor; transform-origin: center; transition: transform 320ms cubic-bezier(.22, 1, .36, 1), opacity 180ms ease; }
    .v2-nav__toggle-line:first-child { top: 15.5px; transform: translateX(-50%); }
    .v2-nav__toggle-line:nth-child(2) { display: none; }
    .v2-nav__toggle-line:last-child { top: 24.5px; transform: translateX(-50%); }
    .v2-nav__toggle--open .v2-nav__toggle-line:first-child { transform: translateX(-50%) translateY(4.5px) rotate(45deg); }
    .v2-nav__toggle--open .v2-nav__toggle-line:last-child { transform: translateX(-50%) translateY(-4.5px) rotate(-45deg); }
    .v2-nav__toggle svg { display: none !important; }
}
.v2-nav__brand { padding: 0; background: transparent; }
.v2-nav__brand img { filter: brightness(0) invert(1); }
@media (min-width: 1024px) {
    .v2-nav__cta-arrow { background: #145df5; color: #fff; }
    .v2-nav__cta:hover .v2-nav__cta-arrow, .v2-nav__cta:focus-visible .v2-nav__cta-arrow { background: #0b42a8; }
}
@media (max-width: 1023px) {
    .v2-nav__brand { padding: 7px 0; background: transparent; }
    .v2-nav__brand img { filter: brightness(0) invert(1); }
    .v2-nav--menu-open .v2-nav__brand img { filter: none; }
}
@media (max-width: 520px) {
    .v2-nav { padding-left: 20px; padding-right: 20px; }
}
</style>
