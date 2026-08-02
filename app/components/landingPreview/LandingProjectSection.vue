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
            <div class="project-editorial">
                <div class="project-editorial__manifest">
                    <span class="project-editorial__eyebrow">O Projeto</span>
                    <h2 id="projeto-title">
                        Mais contexto&nbsp;<span class="project-title-icon project-title-icon--context" aria-hidden="true"><i class="pi pi-id-card"></i></span>
                        <span class="project-title-lock">Mais empatia&nbsp;<span class="project-title-icon project-title-icon--empathy" aria-hidden="true"><i class="pi pi-heart-fill"></i></span></span>
                        Mais segurança no trânsito&nbsp;<span class="project-title-icon project-title-icon--safety" aria-hidden="true"><i class="pi pi-shield"></i></span>
                    </h2>
                    <p class="project-editorial__intro">Etiquetas refletivas com QR Code sinalizam o perfil de condução com segurança, sem expor a identidade civil do motorista.</p>
                </div>

                <div class="project-editorial__content">
                    <article class="project-editorial__statement">
                        <span class="project-editorial__eyebrow">Nossa missão</span>
                        <p>Tornar visíveis os contextos de condução que pedem mais cuidado, para que cada encontro no trânsito seja guiado por respeito e atenção.</p>
                    </article>

                    <article class="project-editorial__statement">
                        <span class="project-editorial__eyebrow">Nossa visão</span>
                        <p>Construir um trânsito em que a informação favoreça escolhas conscientes, convivência mais humana e trajetos mais seguros para todos.</p>
                    </article>

                    <div class="project-editorial__pillars">
                        <article v-for="pillar in projectPillars" :key="pillar.title" class="pillar-card" :class="pillar.tone">
                            <div class="pillar-icon"><i :class="pillar.icon"></i></div>
                            <h3>{{ pillar.title }}</h3>
                        </article>
                    </div>
                </div>
            </div>
        </div>
        <svg class="project-divider" viewBox="0 0 1440 82" preserveAspectRatio="none" aria-hidden="true"><rect class="project-divider__base" width="1440" height="82" /><path d="M0 82V70H485C522 70 533 24 573 24H867C907 24 918 70 955 70H1440V82H0Z" /></svg>
    </section>
</template>
