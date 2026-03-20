<script setup lang="ts">
import type { LandingMenuItem } from '../../types/landing';
import { ref, onMounted, onUnmounted } from 'vue';

defineProps<{
    menuItems: LandingMenuItem[];
    isMobileMenuOpen: boolean;
    loginUrl: string;
}>();

defineEmits<{
    (event: 'toggle-menu'): void;
    (event: 'close-menu'): void;
}>();

const activeSection = ref('');
let observer: IntersectionObserver | null = null;

onMounted(() => {
    observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    activeSection.value = `#${entry.target.id}`;
                }
            });
        },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );

    document.querySelectorAll('section[id], header[id]').forEach((el) => observer?.observe(el));
});

onUnmounted(() => observer?.disconnect());

const isActive = (href: string) => href === activeSection.value;
</script>

<template>
    <aside class="fixed-nav hidden lg:flex" aria-label="Navegação principal da landing page">
        <a href="#topo" class="brand-mark" aria-label="Ir para o topo da página">
            <img src="/images/lp/logo-menu.png" alt="Logo do Projeto Identifica Trânsito" class="brand-logo">
        </a>

        <nav class="fixed-nav__menu">
            <a v-for="item in menuItems" :key="item.href" :href="item.href" class="fixed-nav__link" :class="{ 'fixed-nav__link--active': isActive(item.href) }">
                <i :class="item.icon"></i>
                <span>{{ item.label }}</span>
            </a>
        </nav>
    </aside>

    <header id="topo" class="mobile-bar lg:hidden">
        <a href="#topo" class="mobile-brand" aria-label="Ir para o topo da página">
            <img src="/images/logo-it-icon.svg" alt="Ícone Identifica Trânsito" class="h-8 w-8">
            <span>Identifica Trânsito</span>
        </a>

        <div class="mobile-actions">
            <a :href="loginUrl" class="mobile-cta" aria-label="Entrar ou cadastrar">
                <i class="pi pi-user"></i>
                <span>Entrar / Cadastrar</span>
            </a>
            <button
                type="button"
                class="mobile-menu-toggle"
                aria-label="Abrir menu"
                :aria-expanded="isMobileMenuOpen"
                @click="$emit('toggle-menu')"
            >
                <i class="pi" :class="isMobileMenuOpen ? 'pi-times' : 'pi-bars'"></i>
            </button>
        </div>

        <nav v-if="isMobileMenuOpen" class="mobile-nav-dropdown" aria-label="Navegação mobile">
            <a
                v-for="item in menuItems"
                :key="`mobile-${item.href}`"
                :href="item.href"
                class="mobile-nav-link"
                @click="$emit('close-menu')"
            >
                <i :class="item.icon"></i>
                <span>{{ item.label }}</span>
            </a>
        </nav>
    </header>
</template>