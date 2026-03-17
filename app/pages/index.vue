<script setup lang="ts">
const menuItems = [
    { href: '#topo', label: 'Minha Conta', icon: 'pi pi-user' },
    { href: '#projeto', label: 'O Projeto', icon: 'pi pi-flag' },
    { href: '#como-funciona', label: 'Como Funciona', icon: 'pi pi-compass' },
    { href: '#etiquetas', label: 'As Etiquetas', icon: 'pi pi-tag' },
    { href: '#beneficios', label: 'Benefícios', icon: 'pi pi-star' },
    { href: '#preco', label: 'Preço', icon: 'pi pi-wallet' },
    { href: '#faq', label: 'FAQ', icon: 'pi pi-question-circle' }
];

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
};

const impactStats = [
    {
        icon: 'pi pi-car',
        value: '38.256',
        description: 'mortes em acidentes de trânsito registradas no Brasil entre 2020 e 2024.'
    },
    {
        icon: 'pi pi-globe',
        value: '1,35 mi',
        description: 'de vidas perdidas por ano no mundo em ocorrências de trânsito.'
    },
    {
        icon: 'pi pi-users',
        value: '1ª causa',
        description: 'de morte entre jovens e crianças em diversas realidades urbanas.'
    }
];

const projectPillars = [
    {
        icon: 'pi pi-id-card',
        title: 'Identificação clara do perfil',
        description: 'A etiqueta comunica rapidamente uma condição ou contexto relevante de condução.'
    },
    {
        icon: 'pi pi-heart',
        title: 'Mais empatia entre condutores',
        description: 'Ao entender quem está ao volante, o trânsito tende a reagir com mais respeito e cautela.'
    },
    {
        icon: 'pi pi-moon',
        title: 'Alta visibilidade dia e noite',
        description: 'Material reflexivo pensado para continuar legível em cenários de baixa luminosidade.'
    }
];

const featuredTags = [
    {
        icon: 'pi pi-user',
        title: 'Pessoa idosa',
        description: 'Indica um perfil que pode exigir mais tempo e previsibilidade no trânsito.',
        image: '/images/dashboard/etiquetas/azul.svg',
        tone: 'border-blue-100 bg-blue-50 text-blue-700'
    },
    {
        icon: 'pi pi-heart',
        title: 'Gestante',
        description: 'Estimula mais cuidado em situações de aceleração, frenagem e aproximação.',
        image: '/images/dashboard/etiquetas/vermelho.svg',
        tone: 'border-red-100 bg-red-50 text-red-700'
    },
    {
        icon: 'pi pi-heart-fill',
        title: 'Recém-nascido',
        description: 'Sinaliza transporte sensível e reforça a necessidade de direção mais humana ao redor.',
        image: '/images/dashboard/etiquetas/amarelo.svg',
        tone: 'border-amber-100 bg-amber-50 text-amber-700'
    },
    {
        icon: 'pi pi-id-card',
        title: 'CNH temporária',
        description: 'Ajuda outros motoristas a adotarem mais paciência com quem ainda está ganhando experiência.',
        image: '/images/dashboard/etiquetas/verde.svg',
        tone: 'border-emerald-100 bg-emerald-50 text-emerald-700'
    },
    {
        icon: 'pi pi-eye-slash',
        title: 'Deficiências ocultas',
        description: 'Comunica um contexto importante mesmo quando a condição não é perceptível externamente.',
        image: '/images/dashboard/etiquetas/branco.svg',
        tone: 'border-slate-200 bg-slate-50 text-slate-700'
    }
];

const benefits = [
    'Redução de acidentes causados por interpretações erradas no trânsito.',
    'Mais empatia e paciência nas interações entre motoristas.',
    'Identificação mais rápida do perfil em situações críticas e de apoio.',
    'Etiquetas reflexivas com boa leitura à noite e sob chuva.',
    'QR Code integrado para apresentar apenas o perfil do condutor.',
    'Contribuição prática para uma cultura de trânsito mais humana.'
];

const steps = [
    {
        number: '01',
        icon: 'pi pi-user-edit',
        title: 'Cadastre-se',
        description: 'Crie seu perfil na plataforma e informe os dados essenciais do seu veículo.'
    },
    {
        number: '02',
        icon: 'pi pi-tag',
        title: 'Escolha sua etiqueta',
        description: 'Selecione o perfil que melhor representa sua realidade de condução.'
    },
    {
        number: '03',
        icon: 'pi pi-send',
        title: 'Cole no veículo',
        description: 'Receba o kit em casa, aplique no automóvel e participe de um trânsito mais solidário.'
    }
];

const faqItems = [
    {
        question: 'O QR Code mostra dados pessoais do motorista?',
        answer: 'Não. O QR Code não expõe documentos, telefone, endereço ou qualquer dado sensível do motorista. Ele foi pensado para apresentar apenas o perfil de condução vinculado à etiqueta.'
    },
    {
        question: 'O QR Code identifica quem é o motorista?',
        answer: 'Não. O sistema não tem como objetivo identificar pessoalmente o motorista. A leitura apenas contextualiza o perfil do veículo, da mesma forma que outras sinalizações de trânsito comunicam condições específicas.'
    },
    {
        question: 'As etiquetas funcionam à noite e em dias de chuva?',
        answer: 'Sim. As etiquetas são reflexivas, o que amplia sua visibilidade em cenários de menor luminosidade e ajuda na leitura visual em condições adversas.'
    },
    {
        question: 'Existe mensalidade para usar a plataforma?',
        answer: 'Não. A proposta comercial informada nesta landing é de pagamento único, sem recorrência mensal.'
    },
    {
        question: 'Posso ter mais de uma etiqueta para veículos diferentes?',
        answer: 'Sim. Cada veículo pode receber seu cadastro e sua etiqueta correspondente dentro da plataforma, conforme o perfil aplicável.'
    },
    {
        question: 'O projeto contempla outros perfis além dos mostrados aqui?',
        answer: 'Sim. A plataforma já trabalha com outros perfis de uso além dos cinco destaques desta página, permitindo ampliar a cobertura de diferentes realidades no trânsito.'
    }
];

const currentYear = new Date().getFullYear();

useSeoMeta({
    title: 'Identifica Trânsito | Etiquetas reflexivas com QR Code para um trânsito mais seguro',
    description: 'Conheça o Identifica Trânsito: etiquetas reflexivas com QR Code que comunicam o perfil de condução, promovem empatia e ajudam a construir um trânsito mais seguro e humano.',
    ogTitle: 'Identifica Trânsito | Etiquetas reflexivas com QR Code',
    ogDescription: 'Etiquetas reflexivas que identificam o perfil de condução e incentivam um trânsito mais seguro, humano e solidário.',
    ogType: 'website',
    ogImage: '/images/logo-it.svg',
    twitterCard: 'summary_large_image'
});

useHead({
    link: [
        {
            rel: 'preconnect',
            href: 'https://fonts.googleapis.com'
        },
        {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            crossorigin: ''
        },
        {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap'
        }
    ],
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Identifica Trânsito',
                description: 'Projeto de identificação de perfis de condução por meio de etiquetas reflexivas com QR Code.',
                logo: '/images/logo-it.svg'
            })
        },
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqItems.map((item) => ({
                    '@type': 'Question',
                    name: item.question,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: item.answer
                    }
                }))
            })
        }
    ]
});
</script>

<template>
    <div class="landing-page bg-[#f5f7ff] text-slate-900">
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
                <NuxtLink to="/auth/login" class="mobile-cta">Entrar / Cadastrar</NuxtLink>
                <button
                    type="button"
                    class="mobile-menu-toggle"
                    aria-label="Abrir menu"
                    :aria-expanded="isMobileMenuOpen"
                    @click="toggleMobileMenu"
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
                    @click="closeMobileMenu"
                >
                    <i :class="item.icon"></i>
                    <span>{{ item.label }}</span>
                </a>
            </nav>
        </header>

        <header class="hero-card" aria-labelledby="hero-title">
            <div class="hero-inner w-full max-w-[1240px] mx-auto px-6 lg:px-10">
                <div class="hero-copy">
                    <span class="hero-kicker">
                        <img src="/images/lp/etiqueta-vermelha.png" alt="Selo do projeto" class="hero-kicker__seal">
                        PROJETO DE IDENTIFICAÇÃO NO TRÂNSITO
                    </span>
                    <h1 id="hero-title" class="hero-title">
                        Condução mais
                        <span class="hero-highlight">segura</span>
                        e
                        <span class="hero-highlight">solidária</span>
                        nas estradas do Brasil
                    </h1>
                    <p class="hero-text">
                        Etiquetas reflexivas que identificam o perfil de cada motorista, promovendo empatia, respeito
                        e prevenção de acidentes no trânsito.
                    </p>

                    <div class="hero-actions">
                        <NuxtLink to="/auth/login" class="primary-action">
                            Garantir minhas etiquetas
                        </NuxtLink>
                        <a href="#como-funciona" class="secondary-action">
                            Saiba como funciona
                        </a>
                    </div>
                </div>
            </div>
        </header>

        <main class="lp-shell">
            <section class="problem-section" aria-labelledby="problema-title">
                <div class="section-inner">
                    <div class="section-heading">
                        <span class="eyebrow">Impacto</span>
                        <h2 id="problema-title">O trânsito brasileiro cobra um preço alto</h2>
                        <p>O projeto nasce como resposta a um cenário em que falta contexto, falta empatia e sobram riscos.</p>
                    </div>

                    <div class="impact-grid">
                        <article v-for="stat in impactStats" :key="stat.value" class="impact-card">
                            <i :class="stat.icon"></i>
                            <strong>{{ stat.value }}</strong>
                            <p>{{ stat.description }}</p>
                        </article>
                    </div>
                </div>
            </section>

            <section id="projeto" class="content-section" aria-labelledby="projeto-title">
                <div class="section-inner">
                    <div class="section-grid">
                        <article>
                            <div class="section-heading">
                                <span class="eyebrow">O Projeto</span>
                                <h2 id="projeto-title">O que é o Projeto Identifica Trânsito?</h2>
                            </div>

                            <p class="section-text">
                                O Identifica Trânsito é uma iniciativa que utiliza etiquetas adesivas reflexivas com códigos QR
                                coladas nos veículos, permitindo identificar o perfil de condução e promover uma convivência mais
                                empática e segura no trânsito.
                            </p>

                            <div class="pillar-list">
                                <article v-for="pillar in projectPillars" :key="pillar.title" class="pillar-card">
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
                                <NuxtImg
                                    src="/images/dashboard/sobre-it.jpg"
                                    alt="Foto ilustrativa do projeto Identifica Trânsito aplicada em veículo"
                                    width="720"
                                    height="640"
                                    class="project-visual__image"
                                />
                            </div>
                            <div class="project-visual__privacy">
                                <i class="pi pi-lock"></i>
                                <div>
                                    <strong>Privacidade preservada</strong>
                                    <p>
                                        A leitura do QR Code não revela identidade civil do motorista. Ela contextualiza apenas o
                                        perfil informado, como qualquer outra sinalização voltada à segurança.
                                    </p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <section id="etiquetas" class="content-section content-section--soft" aria-labelledby="etiquetas-title">
                <div class="section-inner">
                    <div class="section-heading section-heading--center">
                        <span class="eyebrow">As Etiquetas</span>
                        <h2 id="etiquetas-title">Conheça 5 perfis em destaque</h2>
                        <p>Cada etiqueta comunica ao trânsito ao redor um contexto importante de quem está ao volante.</p>
                    </div>

                    <div class="tag-grid">
                        <article v-for="tag in featuredTags" :key="tag.title" class="tag-card">
                            <div class="tag-card__media" :class="tag.tone">
                                <img :src="tag.image" :alt="`Etiqueta ${tag.title}`" class="tag-card__image">
                            </div>
                            <div class="tag-card__content">
                                <span class="tag-card__icon">
                                    <i :class="tag.icon"></i>
                                </span>
                                <h3>{{ tag.title }}</h3>
                                <p>{{ tag.description }}</p>
                            </div>
                        </article>
                    </div>

                    <p class="support-note">
                        A plataforma já contempla outros perfis além destes destaques, ampliando as possibilidades de identificação
                        com responsabilidade e utilidade prática.
                    </p>
                </div>
            </section>

            <section id="beneficios" class="content-section" aria-labelledby="beneficios-title">
                <div class="section-inner">
                    <div class="section-grid section-grid--reverse">
                        <article>
                            <div class="section-heading">
                                <span class="eyebrow">Benefícios</span>
                                <h2 id="beneficios-title">Por que usar o Identifica Trânsito?</h2>
                            </div>

                            <ul class="benefit-list">
                                <li v-for="benefit in benefits" :key="benefit">
                                    <i class="pi pi-check-circle"></i>
                                    <span>{{ benefit }}</span>
                                </li>
                            </ul>
                        </article>

                        <aside class="benefit-visual">
                            <div class="benefit-visual__panel">
                                <div class="benefit-visual__badge">
                                    <i class="pi pi-qrcode"></i>
                                    <span>QR Code contextual</span>
                                </div>
                                <h3>Informação útil sem invasão de privacidade</h3>
                                <p>
                                    O foco do sistema é orientar comportamentos mais seguros e humanos no trânsito, nunca expor o
                                    motorista. O QR Code serve para explicar o perfil de condução, não para identificar pessoas.
                                </p>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <section id="preco" class="pricing-section" aria-labelledby="preco-title">
                <div class="section-inner">
                    <div class="section-heading section-heading--center section-heading--light">
                        <span class="eyebrow">Preço</span>
                        <h2 id="preco-title">Preço único, simples e acessível</h2>
                        <p>Sem mensalidades. Sem surpresas. Você escolhe suas etiquetas e paga uma única vez.</p>
                    </div>

                    <article class="pricing-card">
                        <span class="pricing-card__label">Combo Identifica Trânsito</span>
                        <div class="pricing-card__value">
                            <small>R$</small>
                            <strong>XX,90</strong>
                        </div>
                        <p class="pricing-card__meta">Preço único, sem recorrência.</p>

                        <NuxtLink to="/auth/login" class="pricing-card__cta">Quero Pedir Agora</NuxtLink>

                        <ul class="pricing-list">
                            <li><i class="pi pi-check"></i><span>Kit com etiquetas reflexivas</span></li>
                            <li><i class="pi pi-check"></i><span>Cadastro na plataforma</span></li>
                            <li><i class="pi pi-check"></i><span>QR Code personalizado para o perfil</span></li>
                            <li><i class="pi pi-check"></i><span>Suporte via e-mail e WhatsApp</span></li>
                        </ul>
                    </article>
                </div>
            </section>

            <section id="como-funciona" class="content-section content-section--compact" aria-labelledby="como-funciona-title">
                <div class="section-inner">
                    <div class="section-heading section-heading--center">
                        <span class="eyebrow">Como Funciona</span>
                        <h2 id="como-funciona-title">Em 3 passos simples</h2>
                    </div>

                    <div class="steps-grid">
                        <article v-for="step in steps" :key="step.number" class="step-card">
                            <span class="step-number">{{ step.number }}</span>
                            <div class="step-icon">
                                <i :class="step.icon"></i>
                            </div>
                            <h3>{{ step.title }}</h3>
                            <p>{{ step.description }}</p>
                        </article>
                    </div>
                </div>
            </section>

            <section class="content-section content-section--soft" aria-labelledby="depoimentos-title">
                <div class="section-inner">
                    <div class="section-heading section-heading--center">
                        <span class="eyebrow">Depoimentos</span>
                        <h2 id="depoimentos-title">O que os participantes dizem</h2>
                        <p>Espaço reservado para depoimentos reais do projeto assim que estiverem disponíveis.</p>
                    </div>

                    <div class="testimonial-placeholder">
                        <article>
                            <strong>Em breve</strong>
                            <p>Casos reais de participantes que já usam as etiquetas no dia a dia.</p>
                        </article>
                        <article>
                            <strong>Em breve</strong>
                            <p>Experiências de quem percebeu mais empatia e clareza nas interações no trânsito.</p>
                        </article>
                        <article>
                            <strong>Em breve</strong>
                            <p>Relatos sobre segurança, visibilidade e compreensão do perfil de condução.</p>
                        </article>
                    </div>
                </div>
            </section>

            <section id="faq" class="content-section" aria-labelledby="faq-title">
                <div class="section-inner">
                    <div class="section-heading section-heading--center">
                        <span class="eyebrow">FAQ</span>
                        <h2 id="faq-title">Perguntas frequentes</h2>
                        <p>As dúvidas mais comuns sobre privacidade, funcionamento e uso das etiquetas.</p>
                    </div>

                    <div class="faq-list">
                        <details v-for="item in faqItems" :key="item.question" class="faq-item">
                            <summary>
                                <span>{{ item.question }}</span>
                                <i class="pi pi-plus"></i>
                            </summary>
                            <p>{{ item.answer }}</p>
                        </details>
                    </div>
                </div>
            </section>

            <section class="cta-section" aria-labelledby="cta-title">
                <div class="section-inner cta-section__inner">
                    <div>
                        <span class="eyebrow eyebrow--light">Participe</span>
                        <h2 id="cta-title">Faça parte da mudança no trânsito brasileiro</h2>
                        <p>
                            Adquira suas etiquetas, mostre o perfil de condução do seu veículo e ajude a construir um trânsito
                            mais seguro e humano.
                        </p>
                    </div>

                    <NuxtLink to="/auth/login" class="cta-section__button">Quero Participar Agora</NuxtLink>
                </div>
            </section>
        </main>

        <footer class="lp-footer">
            <div class="section-inner lp-footer__inner">
                <div class="lp-footer__brand">
                    <img src="/images/logo-it.svg" alt="Logo Identifica Trânsito" class="h-10">
                    <p>Projeto voltado à empatia, visibilidade e prevenção de acidentes no trânsito brasileiro.</p>
                </div>

                <nav class="lp-footer__links" aria-label="Links rápidos do rodapé">
                    <a href="#projeto">O Projeto</a>
                    <a href="#etiquetas">As Etiquetas</a>
                    <a href="#preco">Preço</a>
                    <a href="#faq">FAQ</a>
                </nav>

                <div class="lp-footer__social">
                    <a href="mailto:suporte@identificatransito.com.br" aria-label="Enviar e-mail para o suporte">
                        <i class="pi pi-envelope"></i>
                    </a>
                    <a href="https://wa.me/5511984971689" target="_blank" rel="noopener noreferrer" aria-label="Falar com o suporte no WhatsApp">
                        <i class="pi pi-whatsapp"></i>
                    </a>
                </div>

                <p class="lp-footer__copyright">© {{ currentYear }} Identifica Trânsito - Todos os direitos reservados</p>
            </div>
        </footer>
    </div>
</template>

<style scoped>
:global(html) {
    scroll-behavior: smooth;
}

:global(body) {
    background: #f5f7ff;
    font-family: 'Lato', sans-serif;
}

.landing-page {
    min-height: 100vh;
    font-family: 'Lato', sans-serif;
    background:
        radial-gradient(circle at top right, rgba(25, 37, 226, 0.18), transparent 32%),
        linear-gradient(180deg, #f7f9ff 0%, #edf2ff 48%, #f8fbff 100%);
}

.lp-shell {
    width: 100%;
    padding: 0 0 4rem;
}

.section-inner {
    width: 100%;
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 1.5rem;
}

.fixed-nav {
    position: fixed;
    top: 100px;
    left: 0;
    z-index: 40;
    width: 100px;
    min-width: 100px;
    padding: 0.85rem 0.5rem;
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: 0 0.8rem 0.8rem 0;
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12);
    align-items: center;
    flex-direction: column;
    gap: 0.9rem;
}

.brand-mark {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding-bottom: 0.6rem;
    border-bottom: 1px solid rgba(148, 163, 184, 0.2);
    text-align: center;
}

.brand-logo {
    width: 3.15rem;
    height: auto;
}

.fixed-nav__menu {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    width: 100%;
}

.fixed-nav__link {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.4rem 0.15rem;
    color: #0f172a;
    font-family: 'Lato', sans-serif;
    font-size: 13px;
    font-weight: 400;
    line-height: 1.15;
    text-align: center;
    border-radius: 0.6rem;
    transition: transform 0.2s ease, color 0.2s ease, background 0.2s ease;
}

.fixed-nav__link i {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    color: #64748b;
    font-size: 1.15rem;
}

.fixed-nav__link:hover,
.fixed-nav__link:focus-visible {
    background: rgba(37, 99, 235, 0.08);
    color: #0f172a;
}

.mobile-bar {
    position: sticky;
    top: 0;
    z-index: 40;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid rgba(148, 163, 184, 0.18);
    background: rgba(248, 250, 255, 0.9);
    backdrop-filter: blur(16px);
}

.mobile-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #0f172a;
    font-weight: 700;
}

.mobile-actions {
    display: flex;
    align-items: center;
    gap: 0.65rem;
}

.mobile-cta {
    padding: 0.8rem 1rem;
    border-radius: 999px;
    background: #1925e2;
    color: #fff;
    font-weight: 700;
    white-space: nowrap;
}

.mobile-menu-toggle {
    width: 2.85rem;
    height: 2.85rem;
    border: 1px solid rgba(100, 116, 139, 0.35);
    border-radius: 999px;
    background: #fff;
    color: #0f172a;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
}

.mobile-nav-dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 1rem;
    right: 1rem;
    z-index: 45;
    display: grid;
    gap: 0.35rem;
    padding: 0.75rem;
    border: 1px solid rgba(148, 163, 184, 0.25);
    border-radius: 0.95rem;
    background: #fff;
    box-shadow: 0 16px 28px rgba(15, 23, 42, 0.14);
}

.mobile-nav-link {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.7rem 0.75rem;
    border-radius: 0.7rem;
    color: #0f172a;
    font-size: 0.95rem;
    font-weight: 700;
}

.mobile-nav-link i {
    color: #475569;
}

.mobile-nav-link:hover {
    background: rgba(37, 99, 235, 0.08);
}

.hero-card,
.content-section,
.problem-section,
.pricing-section,
.cta-section {
    scroll-margin-top: 6rem;
}

.hero-card {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 600px;
    padding: 0;
    border-radius: 0;
    background:
        linear-gradient(90deg, rgba(8, 15, 78, 0.95) 0%, rgba(8, 15, 78, 0.82) 40%, rgba(8, 15, 78, 0.36) 70%, rgba(8, 15, 78, 0.28) 100%),
        url('/images/lp/bg-hero.webp');
    background-size: cover;
    background-position: center;
}

.hero-copy {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1.25rem;
    max-width: 42rem;
    color: #fff;
}

.hero-kicker {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    width: fit-content;
    font-size: 0.95rem;
    font-weight: 400;
    color: rgba(219, 228, 255, 0.86);
    text-transform: uppercase;
}

.hero-kicker__seal {
    width: 1rem;
    height: 1rem;
    border-radius: 999px;
}

.eyebrow {
    display: inline-flex;
    align-items: center;
    width: fit-content;
    padding: 0.55rem 0.9rem;
    border: 1px solid rgba(25, 37, 226, 0.14);
    border-radius: 999px;
    background: rgba(25, 37, 226, 0.08);
    color: #1925e2;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: uppercase;
}

.section-heading--light .eyebrow,
.eyebrow--light {
    border-color: rgba(255, 255, 255, 0.18);
    background: rgba(255, 255, 255, 0.1);
    color: #dbe4ff;
}

.hero-title {
    margin: 0;
    font-size: clamp(2.75rem, 4.1vw, 4.2rem);
    font-weight: 900;
    color: #fff;
    line-height: 1.05;
    letter-spacing: -0.03em;
}

.hero-highlight {
    display: inline-block;
    margin: 0 0.15rem;
    padding: 0.1rem 0.6rem 0.14rem;
    border-radius: 0.45rem;
    background: #eef2ff;
    color: #1d36da;
}

.hero-text,
.section-text,
.section-heading p,
.impact-card p,
.pillar-card p,
.tag-card p,
.step-card p,
.faq-item p,
.lp-footer p,
.testimonial-placeholder p,
.benefit-visual__panel p,
.project-visual__privacy p,
.cta-section p {
    margin: 0;
    font-size: 1.02rem;
    line-height: 1.7;
}

.hero-text {
    max-width: 40rem;
    font-size: 18px;
    color: rgba(219, 228, 255, 0.86);
    font-weight: 300;
}

.hero-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.primary-action,
.secondary-action,
.pricing-card__cta,
.cta-section__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 3.4rem;
    padding: 0.95rem 1.35rem;
    border-radius: 999px;
    font-weight: 700;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.primary-action,
.pricing-card__cta,
.cta-section__button {
    background: #fff;
    color: #1925e2;
    font-weight: 900;
    box-shadow: 0 20px 34px rgba(10, 18, 48, 0.22);
}

.secondary-action {
    border: 1px solid rgba(255, 255, 255, 0.25);
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    font-weight: 700;
}

.primary-action:hover,
.secondary-action:hover,
.pricing-card__cta:hover,
.cta-section__button:hover {
    transform: translateY(-2px);
}

.problem-section {
    margin-top: 1.5rem;
    padding: 0;
    background: transparent;
    color: #0f172a;
}

.section-heading {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    margin-bottom: 2rem;
}

.section-heading--center {
    align-items: center;
    text-align: center;
}

.section-heading h2,
.cta-section h2 {
    margin: 0;
    font-size: clamp(2rem, 3vw, 3.2rem);
    line-height: 1.02;
    letter-spacing: -0.04em;
}

.section-heading p {
    max-width: 46rem;
    color: #475569;
}

.section-heading--light p,
.cta-section p {
    color: rgba(255, 255, 255, 0.78);
}

.impact-grid,
.tag-grid,
.steps-grid,
.testimonial-placeholder {
    display: grid;
    gap: 1.25rem;
}

.impact-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
}

.impact-card {
    padding: 1.45rem;
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: 1.5rem;
    background: rgba(255, 255, 255, 0.7);
}

.impact-card i,
.pillar-icon,
.step-icon,
.tag-card__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.impact-card i {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
    border-radius: 1rem;
    background: rgba(71, 85, 255, 0.18);
    color: #1d36da;
    font-size: 1.2rem;
}

.impact-card strong {
    display: block;
    margin-bottom: 0.55rem;
    font-size: clamp(2rem, 3vw, 3.3rem);
    line-height: 1;
    letter-spacing: -0.05em;
}

.content-section,
.pricing-section,
.cta-section {
    margin-top: 1.5rem;
    padding: 2.75rem 0;
}

.content-section {
    border-top: 1px solid rgba(148, 163, 184, 0.12);
}

.content-section--soft {
    background: linear-gradient(180deg, rgba(234, 240, 255, 0.65), rgba(255, 255, 255, 0.55));
}

.content-section--compact {
    padding-top: 2.4rem;
    padding-bottom: 2.4rem;
}

.section-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2rem;
    align-items: center;
}

.section-grid--reverse {
    grid-template-columns: 1.05fr 0.95fr;
}

.pillar-list,
.benefit-list,
.pricing-list,
.faq-list {
    display: grid;
    gap: 1rem;
}

.pillar-card,
.project-visual__privacy,
.benefit-visual__panel,
.step-card,
.testimonial-placeholder article,
.faq-item {
    border: 1px solid rgba(148, 163, 184, 0.14);
    border-radius: 1.4rem;
    background: rgba(255, 255, 255, 0.86);
}

.pillar-card {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;
    padding: 1.15rem;
}

.pillar-icon,
.step-icon,
.tag-card__icon {
    width: 3rem;
    height: 3rem;
    border-radius: 1rem;
    background: rgba(25, 37, 226, 0.1);
    color: #1925e2;
    font-size: 1.2rem;
}

.pillar-card h3,
.tag-card h3,
.step-card h3,
.benefit-visual__panel h3 {
    margin: 0 0 0.35rem;
    font-size: 1.18rem;
}

.project-visual {
    display: grid;
    gap: 1rem;
}

.project-visual__frame {
    overflow: hidden;
    border-radius: 1.7rem;
    background: linear-gradient(180deg, rgba(25, 37, 226, 0.12), rgba(25, 37, 226, 0.03));
}

.project-visual__image {
    width: 100%;
    aspect-ratio: 1 / 0.82;
    object-fit: cover;
}

.project-visual__privacy {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;
    padding: 1.15rem;
}

.project-visual__privacy i {
    width: 2.9rem;
    height: 2.9rem;
    border-radius: 1rem;
    background: rgba(15, 23, 42, 0.08);
    color: #0f172a;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.tag-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
}

.tag-card {
    overflow: hidden;
    border: 1px solid rgba(148, 163, 184, 0.15);
    border-radius: 1.5rem;
    background: rgba(255, 255, 255, 0.92);
}

.tag-card__media {
    display: flex;
    justify-content: center;
    padding: 1.25rem 1rem 0.85rem;
    border-bottom: 1px solid rgba(148, 163, 184, 0.12);
}

.tag-card__image {
    width: 7.75rem;
    max-width: 100%;
}

.tag-card__content {
    display: grid;
    gap: 0.8rem;
    padding: 1.15rem;
}

.support-note {
    margin: 1.25rem auto 0;
    max-width: 56rem;
    color: #475569;
    text-align: center;
}

.benefit-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.benefit-list li,
.pricing-list li {
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
    padding: 1rem 1.05rem;
    border-radius: 1.15rem;
    background: rgba(248, 250, 252, 0.9);
}

.benefit-list i,
.pricing-list i {
    color: #1925e2;
    margin-top: 0.1rem;
}

.benefit-visual__panel {
    padding: 1.5rem;
    background: linear-gradient(180deg, #f8fbff, #eef3ff);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.benefit-visual__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 1rem;
    padding: 0.6rem 0.85rem;
    border-radius: 999px;
    background: rgba(25, 37, 226, 0.08);
    color: #1925e2;
    font-size: 0.86rem;
    font-weight: 700;
}

.pricing-section {
    background: linear-gradient(140deg, #0e1841 0%, #1422e4 100%);
    color: #fff;
}

.pricing-card {
    width: min(100%, 33rem);
    margin: 0 auto;
    padding: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 2rem;
    background: rgba(255, 255, 255, 0.1);
    text-align: center;
    backdrop-filter: blur(16px);
}

.pricing-card__label {
    display: inline-flex;
    padding: 0.5rem 0.85rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.14);
    font-size: 0.82rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

.pricing-card__value {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 0.3rem;
    margin-top: 1.25rem;
}

.pricing-card__value small {
    margin-bottom: 0.85rem;
    font-size: 1rem;
}

.pricing-card__value strong {
    font-size: clamp(3rem, 7vw, 4.7rem);
    line-height: 1;
    letter-spacing: -0.06em;
}

.pricing-card__meta {
    margin: 0.8rem 0 1.35rem;
    color: rgba(255, 255, 255, 0.78);
}

.pricing-card__cta {
    width: 100%;
}

.pricing-list {
    margin-top: 1.25rem;
    text-align: left;
}

.pricing-list li {
    background: rgba(255, 255, 255, 0.08);
}

.pricing-list i {
    color: #dbe4ff;
}

.steps-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
}

.step-card {
    position: relative;
    padding: 1.45rem;
}

.step-number {
    display: inline-block;
    margin-bottom: 1rem;
    color: rgba(25, 37, 226, 0.24);
    font-size: 2.7rem;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.06em;
}

.step-icon {
    margin-bottom: 1rem;
}

.testimonial-placeholder {
    grid-template-columns: repeat(3, minmax(0, 1fr));
}

.testimonial-placeholder article {
    padding: 1.35rem;
}

.testimonial-placeholder strong {
    display: inline-block;
    margin-bottom: 0.65rem;
    color: #1925e2;
}

.faq-list {
    max-width: 56rem;
    margin: 0 auto;
}

.faq-item {
    overflow: hidden;
}

.faq-item summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.2rem 1.3rem;
    cursor: pointer;
    list-style: none;
    font-size: 1.04rem;
    font-weight: 700;
}

.faq-item summary::-webkit-details-marker {
    display: none;
}

.faq-item p {
    padding: 0 1.3rem 1.25rem;
    color: #475569;
}

.faq-item[open] summary {
    color: #1925e2;
}

.faq-item[open] summary i {
    transform: rotate(45deg);
}

.faq-item summary i {
    transition: transform 0.2s ease;
}

.cta-section {
    background: linear-gradient(135deg, #0c1540 0%, #1925e2 100%);
    color: #fff;
}

.cta-section__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
}

.cta-section__inner > div {
    max-width: 46rem;
}

.lp-footer {
    width: 100%;
    padding: 0 0 3rem;
}

.lp-footer__inner {
    display: grid;
    grid-template-columns: 1.1fr auto auto;
    gap: 1.5rem;
    align-items: center;
}

.lp-footer__brand {
    display: grid;
    gap: 0.7rem;
}

.lp-footer__links,
.lp-footer__social {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.lp-footer__links a {
    color: #334155;
    font-weight: 700;
}

.lp-footer__social a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.85rem;
    height: 2.85rem;
    border-radius: 999px;
    background: rgba(25, 37, 226, 0.08);
    color: #1925e2;
    font-size: 1.1rem;
}

.lp-footer__copyright {
    grid-column: 1 / -1;
    color: #64748b;
}

@media (min-width: 1024px) {
    .mobile-bar {
        display: none;
    }

    .section-inner {
        padding: 0 2.5rem;
    }
}

@media (min-width: 1025px) and (max-width: 1470px) {
    .hero-inner {
        width: 70%;
        max-width: none;
    }
}

@media (max-width: 1199px) {
    .tag-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

@media (max-width: 1023px) {
    .mobile-bar {
        display: flex;
    }

    .section-grid,
    .impact-grid,
    .steps-grid,
    .testimonial-placeholder,
    .cta-section__inner,
    .lp-footer__inner {
        grid-template-columns: 1fr;
    }

    .cta-section__inner,
    .lp-footer__inner {
        display: grid;
    }

    .hero-card {
        min-height: 31rem;
        border-radius: 1.25rem;
        margin: 0.5rem;
    }
}

@media (max-width: 767px) {
    .content-section,
    .pricing-section,
    .cta-section {
        padding: 1.2rem 0;
    }

    .hero-title {
        font-size: 2.4rem;
    }

    .tag-grid {
        grid-template-columns: 1fr;
    }

    .mobile-bar {
        flex-direction: column;
        align-items: stretch;
    }

    .mobile-brand,
    .mobile-cta {
        justify-content: center;
    }

    .mobile-actions {
        width: 100%;
        justify-content: center;
    }

    .lp-footer__links,
    .lp-footer__social {
        flex-wrap: wrap;
    }
}
</style>
