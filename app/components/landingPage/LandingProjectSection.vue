<script setup lang="ts">
import type { LandingProjectPillar } from '../../types/landing';

defineProps<{
    activeProjectImage: number;
    projectGallery: string[];
    projectPillars: LandingProjectPillar[];
}>();
</script>

<template>
    <section id="projeto" class="content-section content-section--project" aria-labelledby="projeto-title">
        <div class="section-inner max-w-310">
            <div class="section-grid">
                <article>
                    <div class="section-heading">
                        <span class="eyebrow">O Projeto</span>
                        <h2 id="projeto-title" class="js-word-title">O que é o Projeto Identifica Trânsito?</h2>
                    </div>

                    <p class="section-text">
                        O Identifica Trânsito é uma iniciativa que utiliza etiquetas adesivas reflexivas com códigos QR
                        coladas nos veículos, permitindo identificar o perfil de condução e promover uma convivência mais
                        empática e segura no trânsito.
                    </p>

                    <div class="pillar-list pillar-list--spaced">
                        <article v-for="pillar in projectPillars" :key="pillar.title" class="pillar-card" :class="pillar.tone">
                            <div class="pillar-icon">
                                <i :class="pillar.icon"></i>
                            </div>
                            <div>
                                <h3>{{ pillar.title }}</h3>
                                <p>{{ pillar.description }}</p>
                            </div>
                        </article>
                    </div>
                </article>

                <aside class="project-visual">
                    <div class="project-visual__frame">
                        <Transition name="project-image-fade" mode="out-in">
                            <NuxtImg
                                :key="activeProjectImage"
                                :src="projectGallery[activeProjectImage]"
                                alt="Foto ilustrativa do projeto Identifica Trânsito aplicada em veículo"
                                width="1036"
                                height="1296"
                                class="project-visual__image"
                            />
                        </Transition>
                    </div>
                    <div class="project-visual__privacy">
                        <p>
                            A leitura do QR Code não revela identidade civil do motorista. Ela contextualiza apenas o
                            perfil informado, como qualquer outra sinalização voltada à segurança.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    </section>
</template>