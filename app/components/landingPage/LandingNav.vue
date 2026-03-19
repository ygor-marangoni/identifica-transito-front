<script setup lang="ts">
import type { LandingMenuItem } from '../../types/landing';

defineProps<{
    menuItems: LandingMenuItem[];
    isMobileMenuOpen: boolean;
}>();

defineEmits<{
    (event: 'toggle-menu'): void;
    (event: 'close-menu'): void;
}>();
</script>

<template>
    <aside class="fixed-nav hidden lg:flex" aria-label="Navegação principal da landing page">
        <a href="#topo" class="brand-mark" aria-label="Ir para o topo da página">
            <img src="/images/lp/logo-menu.png" alt="Logo do Projeto Identifica Trânsito" class="brand-logo">
        </a>

        <nav class="fixed-nav__menu">
            <a v-for="item in menuItems" :key="item.href" :href="item.href" class="fixed-nav__link">
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
            <NuxtLink to="/auth/login" class="mobile-cta" aria-label="Entrar ou cadastrar">
                <i class="pi pi-user"></i>
                <span>Entrar / Cadastrar</span>
            </NuxtLink>
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