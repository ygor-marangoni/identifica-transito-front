<script setup lang="ts">
import type { LandingFeaturedTag } from '../../types/landing';

defineProps<{
    activeTagIndex: number;
    featuredTags: LandingFeaturedTag[];
    isPaused: boolean;
}>();

defineEmits<{
    (event: 'select-tag', index: number): void;
    (event: 'toggle-carousel'): void;
}>();
</script>

<template>
    <section id="etiquetas" class="content-section content-section--tags" aria-labelledby="etiquetas-title">
        <div class="section-inner max-w-310">
            <div v-if="featuredTags[activeTagIndex]" class="tags-tabs-layout">
                <div class="tags-tabs-editorial">
                    <span class="tags-tabs-eyebrow">As Etiquetas</span>
                    <h2 id="etiquetas-title">Contexto que se vê. Cuidado que se sente.</h2>

                    <div class="tags-tabs-active-copy" :key="activeTagIndex">
                        <h3>{{ featuredTags[activeTagIndex]!.title }}</h3>
                        <p>{{ featuredTags[activeTagIndex]!.description }}</p>
                        <ul>
                            <li><i class="pi pi-check" aria-hidden="true"></i>Material refletivo, visível dia e noite.</li>
                            <li><i class="pi pi-check" aria-hidden="true"></i>QR Code com informações seguras.</li>
                            <li><i class="pi pi-check" aria-hidden="true"></i>Sem exposição de dados pessoais.</li>
                        </ul>
                    </div>

                    <a href="#preco" class="tags-tabs-cta">Quero me identificar <i class="pi pi-arrow-right" aria-hidden="true"></i></a>
                </div>

                <div class="tags-tabs-visual" role="tabpanel" :aria-label="featuredTags[activeTagIndex]!.title">
                    <Transition name="tag-image-fade" mode="out-in">
                        <img
                            :key="activeTagIndex"
                            :src="featuredTags[activeTagIndex]!.imageCover"
                            :alt="`Imagem representativa de ${featuredTags[activeTagIndex]!.title}`"
                            width="900"
                            height="720"
                            loading="lazy"
                            decoding="async"
                        />
                    </Transition>
                    <img :src="featuredTags[activeTagIndex]!.image" :alt="`Etiqueta ${featuredTags[activeTagIndex]!.title}`" width="72" height="72" loading="lazy" decoding="async" class="tags-tabs-visual__tag" />
                </div>
            </div>

            <div class="tags-tabs" role="tablist" aria-label="Tipos de etiquetas">
                <div v-for="(tag, index) in featuredTags" :key="tag.title" class="tags-tabs__shell" role="presentation">
                    <button
                        :id="`tag-tab-${index}`"
                        type="button"
                        role="tab"
                        :aria-selected="activeTagIndex === index"
                        :tabindex="activeTagIndex === index ? 0 : -1"
                        class="tags-tabs__tab"
                        :class="{ 'tags-tabs__tab--active': activeTagIndex === index }"
                        @click="$emit('select-tag', index)"
                    >
                        <span class="tags-tabs__heading"><img :src="tag.image" alt="" width="32" height="32" aria-hidden="true" /><span>{{ tag.title }}</span></span>
                        <span class="tags-tabs__description">{{ tag.description }}</span>
                        <span class="tags-tabs__line" aria-hidden="true"><span v-if="activeTagIndex === index" :key="activeTagIndex" class="tags-tabs__progress" :class="{ 'tags-tabs__progress--paused': isPaused }"></span></span>
                    </button>
                    <button v-if="activeTagIndex === index" type="button" class="tags-tabs__pause" :aria-label="isPaused ? 'Retomar troca automática de etiquetas' : 'Pausar troca automática de etiquetas'" @click="$emit('toggle-carousel')"><i :class="isPaused ? 'pi pi-play' : 'pi pi-pause'" aria-hidden="true"></i></button>
                </div>
            </div>
        </div>
    </section>
</template>
