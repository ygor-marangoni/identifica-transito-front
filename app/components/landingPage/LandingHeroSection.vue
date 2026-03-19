<template>
    <header class="hero-card" aria-labelledby="hero-title">
        <div class="hero-media" aria-hidden="true">
            <video
                class="hero-video"
                autoplay
                muted
                loop
                playsinline
                preload="metadata"
            >
                <source src="/images/lp/video-hero.mp4" type="video/mp4">
            </video>
            <div class="hero-media-overlay"></div>
            <div class="hero-textura"></div>
        </div>

        <div class="hero-inner w-full max-w-310 mx-auto px-6 lg:px-10">
            <div class="hero-copy">
                <span class="hero-kicker">
                    <img src="/images/lp/etiqueta-vermelha.png" alt="Selo do projeto" class="hero-kicker__seal">
                    PROJETO DE IDENTIFICAÇÃO NO TRÂNSITO
                </span>
                <h1 id="hero-title" class="hero-title">
                    <span class="hero-word">Condução</span>
                    <span class="hero-word">mais</span>
                    <span class="hero-word hero-highlight">segura</span>
                    <span class="hero-word">e</span>
                    <span class="hero-word hero-highlight">solidária</span>
                    <span class="hero-word">nas</span>
                    <span class="hero-word">estradas</span>
                    <span class="hero-word">de</span>
                    <span class="hero-word">todo</span>
                    <span class="hero-word">o</span>
                    <span class="hero-word">Brasil</span>
                </h1>
                <p class="hero-text">
                    Etiquetas reflexivas que identificam o perfil de cada motorista, promovendo empatia, respeito
                    e prevenção de acidentes no trânsito.
                </p>

                <div class="hero-actions">
                    <NuxtLink to="/auth/login" class="primary-action">
                        Garantir minhas etiquetas
                    </NuxtLink>
                    <a href="#projeto" class="secondary-action">
                        Conheça o projeto
                    </a>
                </div>
            </div>
        </div>
    </header>
</template>