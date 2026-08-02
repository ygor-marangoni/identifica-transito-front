<script setup lang="ts">
import type { LandingMenuItem } from '../../types/landing';
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
const props = defineProps<{ menuItems: LandingMenuItem[]; isMobileMenuOpen: boolean; loginUrl: string }>();
const emit = defineEmits<{ (event: 'toggle-menu'): void; (event: 'close-menu'): void }>();
const activeSection = ref('');
const isScrolled = ref(false);
const isBottomNavVisible = ref(false);
let lastScrollY = 0;
let hasBottomNavEntered = false;
let bottomNavRevealScroll = 0;
const navigationItems = computed(() => props.menuItems.filter((item) => ['#projeto', '#etiquetas', '#preco', '#como-funciona'].includes(item.href)));
const bottomNavigationItems = computed(() => [
    { href: '#topo', label: 'Início' },
    { href: '#projeto', label: 'O Projeto' },
    { href: '#etiquetas', label: 'Etiquetas' },
    { href: '#beneficios', label: 'Benefícios' },
    { href: '#preco', label: 'Preço' },
    { href: '#como-funciona', label: 'Como funciona' }
]);
const mobileNavigationItems = computed(() => [
    { href: '#topo', label: 'Início', icon: 'pi pi-home' },
    ...props.menuItems.filter((item) => ['#projeto', '#etiquetas', '#beneficios', '#preco', '#como-funciona', '#faq'].includes(item.href))
]);
let observer: IntersectionObserver | null = null;
const updateScrollState = () => {
    isScrolled.value = window.scrollY > 16;

    const currentScrollY = window.scrollY;
    const hero = document.querySelector<HTMLElement>('.hero-card');
    const footer = document.querySelector<HTMLElement>('.final-footer');
    const crossedFirstFold = hero
        ? currentScrollY >= hero.offsetTop + hero.offsetHeight - 24
        : currentScrollY >= window.innerHeight - 24;
    const isBeforeFooter = footer ? window.scrollY + window.innerHeight < footer.offsetTop : true;
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    const isWithinBottomNavRange = isDesktop && crossedFirstFold && isBeforeFooter;
    const scrollDelta = currentScrollY - lastScrollY;

    if (!isWithinBottomNavRange) {
        isBottomNavVisible.value = false;

        if (!crossedFirstFold) {
            hasBottomNavEntered = false;
        }
    } else if (!hasBottomNavEntered) {
        isBottomNavVisible.value = true;
        hasBottomNavEntered = true;
        bottomNavRevealScroll = currentScrollY;
    } else if (scrollDelta > 2 && currentScrollY - bottomNavRevealScroll > 240) {
        isBottomNavVisible.value = false;
    } else if (scrollDelta < -2) {
        isBottomNavVisible.value = true;
    }

    lastScrollY = currentScrollY;
};
onMounted(() => {
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) activeSection.value = `#${entry.target.id}`; }), { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
    document.querySelectorAll('section[id]').forEach((element) => observer?.observe(element));
});
onUnmounted(() => {
    observer?.disconnect();
    window.removeEventListener('scroll', updateScrollState);
    window.removeEventListener('resize', updateScrollState);
});
watch(() => props.isMobileMenuOpen, (isOpen) => {
    document.body.classList.toggle('landing-menu-open', isOpen);
});
onUnmounted(() => document.body.classList.remove('landing-menu-open'));
const isActive = (href: string) => href === activeSection.value;
const handleToggle = () => emit('toggle-menu');
</script>
<template>
    <header id="topo" class="landing-nav" :class="{ 'landing-nav--menu-open': isMobileMenuOpen, 'landing-nav--scrolled': isScrolled }">
        <div class="landing-nav__inner">
            <a href="#topo" class="landing-nav__brand" aria-label="Ir para o topo da página"><img src="/images/logo-vertical.svg" alt="Identifica Trânsito"></a>
            <nav class="landing-nav__links" aria-label="Navegação principal da landing page"><a v-for="item in navigationItems" :key="item.href" :href="item.href" :class="{ 'landing-nav__link--active': isActive(item.href) }"><i :class="item.icon"></i>{{ item.label }}</a></nav>
            <div class="landing-nav__actions">
                <a :href="loginUrl" class="landing-nav__cta"><span>Acessar plataforma</span><span class="landing-nav__cta-arrow"><i class="pi pi-arrow-right"></i></span></a>
                <button type="button" class="landing-nav__toggle" :class="{ 'landing-nav__toggle--open': isMobileMenuOpen }" aria-label="Abrir menu" :aria-expanded="isMobileMenuOpen" @click="handleToggle"><span></span><span></span><span></span></button>
            </div>
        </div>
        <nav v-show="isMobileMenuOpen" class="landing-nav__mobile-links" aria-label="Navegação mobile"><div class="landing-nav__mobile-menu"><a v-for="item in mobileNavigationItems" :key="`mobile-${item.href}`" :href="item.href" @click="$emit('close-menu')">{{ item.label }}</a></div><a :href="loginUrl" class="landing-nav__mobile-cta"><span>Acessar plataforma</span><span class="landing-nav__mobile-cta-arrow"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg></span></a></nav>
    </header>

    <nav class="landing-bottom-nav" :class="{ 'landing-bottom-nav--visible': isBottomNavVisible }" aria-label="Navegação rápida">
        <a v-for="item in bottomNavigationItems" :key="`bottom-${item.href}`" :href="item.href" :class="{ 'landing-bottom-nav__link--active': isActive(item.href) }">{{ item.label }}</a>
        <a href="/auth/register" class="landing-bottom-nav__cta"><span>Criar minha conta</span><span class="landing-bottom-nav__cta-arrow"><i class="pi pi-arrow-right" aria-hidden="true"></i></span></a>
    </nav>
</template>
