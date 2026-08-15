<script setup lang="ts">
const props = withDefaults(defineProps<{
    color?: 'vermelha' | 'azul' | 'amarela' | 'branca' | 'verde';
    size?: 'small' | 'medium' | 'large';
}>(), { color: 'branca', size: 'medium' });

const cells = Array.from({ length: 81 }, (_, index) => index);
const isFilled = (index: number) => (index * 7 + Math.floor(index / 9) * 3) % 5 < 2;
</script>

<template>
    <div class="tag-art" :class="[`tag-art--${props.color}`, `tag-art--${props.size}`]" aria-label="Etiqueta Identifica Trânsito">
        <div class="tag-art__edge"></div>
        <div class="tag-art__brand"><span class="tag-art__dot"></span>identifica</div>
        <div class="tag-art__qr" aria-hidden="true">
            <i v-for="cell in cells" :key="cell" :class="{ 'tag-art__qr-cell--filled': isFilled(cell) }"></i>
        </div>
        <span class="tag-art__caption">CONTEXTO</span>
    </div>
</template>

<style scoped>
.tag-art { --tag-color:#fff; --tag-ink:#101114; position:relative; display:grid; aspect-ratio:1.33; width:min(100%, 350px); padding:8% 8% 7%; border:1px solid rgba(9,20,38,.14); border-radius:7% 7% 13% 7%; background:var(--tag-color); color:var(--tag-ink); box-shadow: 0 28px 64px rgba(3,16,52,.23); transform:rotate(-7deg); }
.tag-art--small { width:86px; }.tag-art--large { width:min(100%, 440px); }
.tag-art--vermelha { --tag-color:#f6494b; --tag-ink:#fff; }.tag-art--azul { --tag-color:#2e69f3; --tag-ink:#fff; }.tag-art--amarela { --tag-color:#ffc842; --tag-ink:#101114; }.tag-art--branca { --tag-color:#f6f6f1; --tag-ink:#101114; }.tag-art--verde { --tag-color:#32ac77; --tag-ink:#fff; }
.tag-art__edge { position:absolute; inset:7px; border:1px solid currentColor; border-radius:5% 5% 11% 5%; opacity:.35; }.tag-art__brand { align-self:start; display:flex; align-items:center; gap:.3em; font-size:clamp(10px, 1.2vw, 16px); font-weight:750; letter-spacing:-.05em; }.tag-art__dot { width:.65em; height:.65em; border-radius:50%; background:currentColor; }.tag-art__qr { align-self:end; justify-self:end; display:grid; grid-template-columns:repeat(9, 1fr); width:37%; aspect-ratio:1; padding:5%; gap:1px; background:#fff; }.tag-art__qr i { display:block; }.tag-art__qr-cell--filled { background:#101114; }.tag-art__caption { align-self:end; font-size:clamp(7px,.8vw,11px); font-weight:700; letter-spacing:.12em; }
@media (max-width: 640px) { .tag-art--large { width:270px; } }
</style>
