<script setup lang="ts">
import type { LandingFeaturedTag } from '../../types/landing';

defineProps<{
    activeTagIndex: number;
    featuredTags: LandingFeaturedTag[];
}>();

defineEmits<{
    (event: 'select-tag', index: number): void;
}>();
</script>

<template>
    <section id="etiquetas" class="content-section content-section--tags" aria-labelledby="etiquetas-title">
        <div class="section-inner max-w-310">
            <div class="section-heading section-heading--center section-heading--narrow">
                <span class="eyebrow">As Etiquetas</span>
                <h2 id="etiquetas-title" class="js-word-title">Etiquetas refletivas com códigos QR para uma condução segura, visível dia e noite</h2>
                <p>Cada cor representa um perfil específico de condução e melhora a leitura contextual no trânsito.</p>
            </div>

            <div class="tags-layout">
                <div class="tags-visual">
                    <Transition v-if="featuredTags[activeTagIndex]" name="tag-image-fade" mode="out-in">
                        <img
                            :key="activeTagIndex"
                            :src="featuredTags[activeTagIndex]!.imageCover"
                            :alt="`Imagem representativa de ${featuredTags[activeTagIndex]!.title}`"
                            width="540"
                            height="580"
                            class="tags-visual__image"
                        />
                    </Transition>
                </div>

                <div class="tags-carousel">
                    <article
                        v-for="(tag, index) in featuredTags"
                        :key="tag.title"
                        class="tag-carousel-card"
                        :class="[tag.tone, { 'tag-carousel-card--active': activeTagIndex === index }]"
                        :tabindex="0"
                        @click="$emit('select-tag', index)"
                        @mouseenter="$emit('select-tag', index)"
                        @keydown.enter="$emit('select-tag', index)"
                    >
                        <div class="tag-carousel-card__indicator" :class="tag.tone">
                            <NuxtImg :src="tag.image" :alt="`Ícone da ${tag.title}`" class="tag-carousel-card__icon" width="48" height="48" />
                        </div>
                        <div class="tag-carousel-card__content flex items-center gap-4">
                            <div>
                                <h3>{{ tag.title }}</h3>
                                <p>{{ tag.description }}</p>
                            </div>
                        </div>
                    </article>
                </div>
            </div>

            <article class="tag-message">
                <p>
                    <strong>Identifica Trânsito</strong> é mais do que identificação: é uma comunidade que prioriza
                    condução consciente e solidária, fortalecendo o compromisso com estradas mais seguras.
                </p>
            </article>
        </div>
    </section>
</template>