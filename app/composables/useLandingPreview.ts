import type {
    LandingFaqItem,
    LandingFeaturedTag,
    LandingImpactStat,
    LandingMenuItem,
    LandingProjectPillar,
    LandingStep
} from '../types/landing';

const menuItemsData = [
    { href: '/auth/login', label: 'Minha Conta', icon: 'pi pi-user' },
    { href: '#projeto', label: 'O Projeto', icon: 'pi pi-flag' },
    { href: '#etiquetas', label: 'As Etiquetas', icon: 'pi pi-tag' },
    { href: '#beneficios', label: 'Benefícios', icon: 'pi pi-star' },
    { href: '#preco', label: 'Preço', icon: 'pi pi-wallet' },
    { href: '#como-funciona', label: 'Como Funciona', icon: 'pi pi-compass' },
    { href: '#faq', label: 'FAQ', icon: 'pi pi-question-circle' }
];

const impactStats: LandingImpactStat[] = [
    {
        icon: 'pi pi-car',
        value: '38.256',
        counterTarget: 38256,
        counterFormat: 'dot',
        description: 'mortes em acidentes de trânsito registradas no Brasil entre 2020 e 2024.'
    },
    {
        icon: 'pi pi-globe',
        value: '1,35 mi',
        counterTarget: 1.35,
        counterFormat: 'mi',
        description: 'de vidas perdidas por ano no mundo em ocorrências de trânsito.'
    },
    {
        icon: 'pi pi-users',
        value: '1ª causa de morte',
        counterTarget: 1,
        counterFormat: 'ordinal',
        description: 'acidentes de trânsito lideram as mortes de crianças e adolescentes (0 a 14 anos) no Brasil.'
    }
];

const projectPillars: LandingProjectPillar[] = [
    {
        icon: 'pi pi-id-card',
        title: 'Identificação clara do perfil',
        description: 'A etiqueta comunica rapidamente uma condição ou contexto relevante de condução.',
        tone: 'pillar-card--blue'
    },
    {
        icon: 'pi pi-heart',
        title: 'Mais empatia entre condutores',
        description: 'Ao entender quem está ao volante, o trânsito tende a reagir com mais respeito e cautela.',
        tone: 'pillar-card--rose'
    },
    {
        icon: 'pi pi-moon',
        title: 'Alta visibilidade dia e noite',
        description: 'Material refletivo pensado para continuar legível em cenários de baixa luminosidade.',
        tone: 'pillar-card--emerald'
    }
];

const projectGallery = ['/images/lp/o-projeto/img-01.webp'];

const featuredTags: LandingFeaturedTag[] = [
    {
        title: 'Etiqueta Vermelha',
        description: 'Motoristas com carteira de habilitação temporária.',
        image: '/images/lp/etiquetas/vermelho.svg',
        imageCover: '/images/lp/o-projeto/nova-imagem-etiqueta vermelha.webp',
        tone: 'tag-card--red'
    },
    {
        title: 'Etiqueta Azul',
        description: 'Carros de aplicativos, carros de locadoras, carros de empresas.',
        image: '/images/lp/etiquetas/azul.svg',
        imageCover: '/images/lp/o-projeto/nova-imagem-etiqueta azul.webp',
        tone: 'tag-card--blue'
    },
    {
        title: 'Etiqueta Amarela',
        description: 'Gestantes ou motoristas com recém-nascidos.',
        image: '/images/lp/etiquetas/amarelo.svg',
        imageCover: '/images/lp/o-projeto/nova-imagem-etiqueta amarela.webp',
        tone: 'tag-card--yellow'
    },
    {
        title: 'Etiqueta Branca',
        description: 'Pessoas com mais de 60 anos, PCD e condições não visíveis, como autismo e deficiências ocultas.',
        image: '/images/lp/etiquetas/branco.svg',
        imageCover: '/images/lp/o-projeto/nova-imagem-etiqueta branca.webp',
        tone: 'tag-card--white'
    },
    {
        title: 'Etiqueta Verde',
        description: 'Condutores com carteira de habilitação definitiva.',
        image: '/images/lp/etiquetas/verde.svg',
        imageCover: '/images/lp/o-projeto/nova-imagem-etiqueta verde.webp',
        tone: 'tag-card--green'
    }
];

const benefits = [
    'Redução de acidentes causados por interpretações erradas no trânsito.',
    'Mais empatia e paciência nas interações entre motoristas.',
    'Identificação mais rápida do perfil em situações críticas e de apoio.',
    'Etiquetas refletivas com boa leitura à noite e sob chuva.',
    'Contribuição prática para uma cultura de trânsito mais humana.'
];

const steps: LandingStep[] = [
    {
        number: '01',
        icon: 'pi pi-user-edit',
        title: 'Cadastro do motorista',
        description: 'Faça o cadastro com as informações do motorista na plataforma.'
    },
    {
        number: '02',
        icon: 'pi pi-car',
        title: 'Cadastro do(s) veículo(s)',
        description: 'Cadastre um ou mais veículos que irão receber a etiqueta.'
    },
    {
        number: '03',
        icon: 'pi pi-shopping-cart',
        title: 'Compra da etiqueta',
        description: 'Com base no perfil preenchido, compre a etiqueta para o veículo desejado.'
    },
    {
        number: '04',
        icon: 'pi pi-tag',
        title: 'Colagem no veículo',
        description: 'Receba em casa ou retire em um ponto de coleta e aplique a etiqueta no veículo.'
    }
];

const fallbackFaqItems: LandingFaqItem[] = [
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
        answer: 'Sim. As etiquetas são refletivas, o que amplia sua visibilidade em cenários de menor luminosidade e ajuda na leitura visual em condições adversas.'
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


const formatCounterValue = (value: number, format: string) => {
    if (format === 'dot') {
        return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    if (format === 'mi') {
        return `${value.toFixed(2).replace('.', ',')} mi`;
    }

    if (format === 'ordinal') {
        return `${Math.round(value)}ª causa de morte`;
    }

    return Math.round(value).toString();
};

const prepareWordsForAnimation = (selector: string) => {
    const titles = document.querySelectorAll<HTMLElement>(selector);

    titles.forEach((title) => {
        if (title.dataset.wordsReady === 'true') {
            return;
        }

        const text = title.textContent?.trim() || '';
        const words = text.split(/\s+/).filter(Boolean);
        title.innerHTML = words.map((word) => `<span class="title-word">${word}</span>`).join(' ');
        title.dataset.wordsReady = 'true';
    });
};

type GsapModule = typeof import('gsap');
type ScrollTriggerModule = typeof import('gsap/ScrollTrigger');

const initSmoothScroll = async (gsap: GsapModule['default'], scrollTrigger: ScrollTriggerModule['ScrollTrigger']) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return () => undefined;
    }

    try {
        const { default: Lenis } = await import('lenis');
        const lenis = new Lenis({
            autoRaf: false,
            anchors: true,
            lerp: .16,
            smoothWheel: true,
            syncTouch: false,
            wheelMultiplier: .9,
            autoResize: true
        });
        const updateScrollTrigger = () => scrollTrigger.update();
        const updateLenis = (time: number) => lenis.raf(time * 1000);

        lenis.on('scroll', updateScrollTrigger);
        gsap.ticker.add(updateLenis);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(updateLenis);
            gsap.ticker.lagSmoothing(500, 33);
            lenis.off?.('scroll', updateScrollTrigger);
            lenis.destroy();
        };
    } catch {
        return () => undefined;
    }
};

const initLandingAnimations = (gsapModule: GsapModule, scrollTriggerModule: ScrollTriggerModule) => {
    const gsap = gsapModule.default;
    const { ScrollTrigger } = scrollTriggerModule;

    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set([
            '.landing-preview-page .hero-kicker',
            '.landing-preview-page .hero-title .hero-word',
            '.landing-preview-page .hero-side-text',
            '.landing-preview-page .hero-actions'
        ], { opacity: 1, y: 0 });
        return;
    }

    prepareWordsForAnimation('.js-word-title');

    const heroTimeline = gsap.timeline();
    heroTimeline.timeScale(.85);
    heroTimeline
        .to('.landing-preview-page .hero-kicker', {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: 'power2.out'
        })
        .to(
            '.landing-preview-page .hero-title .hero-word',
            {
                opacity: 1,
                y: 0,
                duration: 0.55,
                ease: 'power3.out',
                stagger: 0.06
            },
            '-=0.05'
        )
        .to(
            ['.landing-preview-page .hero-side-text', '.landing-preview-page .hero-actions'],
            {
                opacity: 1,
                y: 0,
                duration: 0.55,
                ease: 'power2.out',
                stagger: 0.1
            },
            '-=0.15'
        );

    const revealTargets = document.querySelectorAll('.benefit-visual__panel, .project-visual, .project-visual__privacy');

    revealTargets.forEach((target) => {
        gsap.from(target, {
            opacity: 0,
            y: 28,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: target,
                start: 'top 68%'
            }
        });
    });

    const impactSection = document.querySelector('.landing-preview-page .problem-section');
    if (impactSection) {
        const impactEyebrow = impactSection.querySelector('.impact-intro__eyebrow');
        const impactDescription = impactSection.querySelector('.impact-intro__description');
        const impactCards = impactSection.querySelectorAll('.impact-card');

        const impactTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: impactSection,
                start: 'top 64%',
                once: true
            }
        });

        impactTimeline.timeScale(.82);
        impactTimeline
            .from(impactEyebrow, {
                opacity: 0,
                y: 14,
                duration: 0.4,
                ease: 'power2.out'
            })
            .from(impactDescription, {
                opacity: 0,
                y: 18,
                duration: 0.55,
                ease: 'power2.out'
            }, '-=0.2')
            .from(impactCards, {
                opacity: 0,
                y: 24,
                duration: 0.6,
                ease: 'power3.out',
                stagger: 0.12
            }, '-=0.1');
    }

    const projectSection = document.querySelector('.landing-preview-page .content-section--project');
    if (projectSection) {
        const projectManifest = projectSection.querySelectorAll('.project-editorial__manifest > *');
        const projectStatements = projectSection.querySelectorAll('.project-editorial__statement');
        const projectPillars = projectSection.querySelectorAll('.project-editorial__pillars .pillar-card');

        const projectTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: projectSection,
                start: 'top 64%',
                once: true
            }
        });

        projectTimeline.timeScale(.82);
        projectTimeline
            .from(projectManifest, {
                opacity: 0,
                y: 26,
                duration: 0.65,
                ease: 'power3.out',
                stagger: 0.1
            })
            .from(projectStatements, {
                opacity: 0,
                x: 22,
                duration: 0.55,
                ease: 'power2.out',
                stagger: 0.12
            }, '-=0.35')
            .from(projectPillars, {
                opacity: 0,
                y: 18,
                duration: 0.5,
                ease: 'power2.out',
                stagger: 0.1
            }, '-=0.2');
    }

    const benefitsSection = document.querySelector('.landing-preview-page .benefits-editorial-section');
    if (benefitsSection) {
        const benefitsLead = benefitsSection.querySelectorAll('.benefits-editorial__eyebrow, .benefits-editorial h2, .benefits-editorial__intro');
        const benefitItems = benefitsSection.querySelectorAll('.benefits-editorial__list li');
        const privacyNote = benefitsSection.querySelector('.benefits-editorial__privacy');
        const benefitsVisual = benefitsSection.querySelector('.benefits-editorial__visual');

        const benefitsTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: benefitsSection,
                start: 'top 64%',
                once: true
            }
        });

        benefitsTimeline.timeScale(.82);
        benefitsTimeline
            .from(benefitsLead, {
                opacity: 0,
                y: 24,
                duration: 0.55,
                ease: 'power3.out',
                stagger: 0.09
            })
            .from(benefitItems, {
                opacity: 0,
                x: -18,
                duration: 0.45,
                ease: 'power2.out',
                stagger: 0.08
            }, '-=0.2')
            .from(privacyNote, {
                opacity: 0,
                y: 18,
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.15')
            .from(benefitsVisual, {
                opacity: 0,
                x: 24,
                duration: 0.65,
                ease: 'power3.out'
            }, '-=0.65');
    }

    const tagsSection = document.querySelector('.landing-preview-page .content-section--tags');
    if (tagsSection) {
        const tagsCopy = tagsSection.querySelectorAll('.tags-tabs-eyebrow, .tags-tabs-editorial h2, .tags-tabs-active-copy, .tags-tabs-cta');
        const tagsVisual = tagsSection.querySelector('.tags-tabs-visual');
        const tabs = tagsSection.querySelectorAll('.tags-tabs__shell');

        gsap.timeline({ scrollTrigger: { trigger: tagsSection, start: 'top 64%', once: true } }).timeScale(.82)
            .from(tagsCopy, { opacity: 0, y: 22, duration: 0.55, ease: 'power3.out', stagger: 0.09 })
            .from(tagsVisual, { opacity: 0, x: 28, duration: 0.7, ease: 'power3.out' }, '-=0.45')
            .from(tabs, { opacity: 0, y: 16, duration: 0.42, ease: 'power2.out', stagger: 0.06 }, '-=0.3');
    }

    const pricingSection = document.querySelector('.landing-preview-page .pricing-section');
    if (pricingSection) {
        const pricingHeading = pricingSection.querySelectorAll('.section-heading > *');
        const pricingSummary = pricingSection.querySelectorAll('.pricing-card__summary > *');
        const pricingFeatures = pricingSection.querySelectorAll('.pricing-list li');
        const pricingTags = pricingSection.querySelectorAll('.pricing-tag-chip');

        gsap.timeline({ scrollTrigger: { trigger: pricingSection, start: 'top 64%', once: true } }).timeScale(.82)
            .from(pricingHeading, { opacity: 0, y: 20, duration: 0.5, ease: 'power3.out', stagger: 0.08 })
            .from('.landing-preview-page .pricing-card', { opacity: 0, y: 26, duration: 0.7, ease: 'power3.out' }, '-=0.2')
            .from(pricingSummary, { opacity: 0, y: 14, duration: 0.42, ease: 'power2.out', stagger: 0.07 }, '-=0.42')
            .from(pricingFeatures, { opacity: 0, x: 18, duration: 0.4, ease: 'power2.out', stagger: 0.07 }, '-=0.38')
            .from(pricingTags, { opacity: 0, scale: 0.9, duration: 0.35, ease: 'back.out(1.5)', stagger: 0.06 }, '-=0.25');
    }

    const stepsSection = document.querySelector('.landing-preview-page .steps-editorial-section');
    if (stepsSection) {
        const stepsHeading = stepsSection.querySelectorAll('.steps-editorial__heading > *');
        const stepItems = stepsSection.querySelectorAll('.steps-editorial__item');

        gsap.timeline({ scrollTrigger: { trigger: stepsSection, start: 'top 64%', once: true } }).timeScale(.82)
            .from(stepsHeading, { opacity: 0, y: 20, duration: 0.5, ease: 'power3.out', stagger: 0.08 })
            .from(stepItems, { opacity: 0, y: 24, duration: 0.55, ease: 'power3.out', stagger: 0.1 }, '-=0.18');
    }

    const faqSection = document.querySelector('.landing-preview-page .faq-editorial-section');
    if (faqSection) {
        const faqHeading = faqSection.querySelectorAll('.faq-editorial__heading > *');
        const faqItems = faqSection.querySelectorAll('.faq-editorial__item');
        const faqSupport = faqSection.querySelector('.faq-editorial__support');

        gsap.timeline({ scrollTrigger: { trigger: faqSection, start: 'top 64%', once: true } }).timeScale(.82)
            .from(faqHeading, { opacity: 0, y: 20, duration: 0.5, ease: 'power3.out', stagger: 0.08 })
            .from(faqItems, { opacity: 0, y: 14, duration: 0.42, ease: 'power2.out', stagger: 0.07 }, '-=0.18')
            .from(faqSupport, { opacity: 0, y: 12, duration: 0.4, ease: 'power2.out' }, '-=0.12');
    }

    const finalCta = document.querySelector('.landing-preview-page .final-cta');
    if (finalCta) {
        const ctaCopy = finalCta.querySelectorAll('.final-cta__copy > *');
        const ctaVisual = finalCta.querySelector('.final-cta__visual');

        gsap.timeline({ scrollTrigger: { trigger: finalCta, start: 'top 64%', once: true } }).timeScale(.82)
            .from(ctaCopy, { opacity: 0, y: 22, duration: 0.55, ease: 'power3.out', stagger: 0.09 })
            .from(ctaVisual, { opacity: 0, x: 28, duration: 0.7, ease: 'power3.out' }, '-=0.55');
    }

    const footer = document.querySelector('.landing-preview-page .final-footer');
    if (footer) {
        const footerColumns = footer.querySelectorAll('.final-footer__brand, .final-footer__group, .final-footer__contact');
        const footerBottom = footer.querySelector('.final-footer__bottom');

        gsap.timeline({ scrollTrigger: { trigger: footer, start: 'top 70%', once: true } }).timeScale(.82)
            .from(footerColumns, { opacity: 0, y: 18, duration: 0.5, ease: 'power2.out', stagger: 0.1 })
            .from(footerBottom, { opacity: 0, y: 10, duration: 0.4, ease: 'power2.out' }, '-=0.15');
    }

    const floatingCards = document.querySelectorAll<HTMLElement>('.hero-floating-card');
    const floatingCardOffsets = [
        { x: 165, y: 150 },
        { x: 145, y: 190 },
        { x: -165, y: 160 },
        { x: -145, y: 200 }
    ];

    floatingCards.forEach((card, index) => {
        const offset = floatingCardOffsets[index] ?? { x: 0, y: 120 };

        gsap.fromTo(card, {
            opacity: 0,
            scale: 0.92
        }, {
            opacity: 1,
            scale: 1,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.hero-card',
                start: 'top 78%',
                once: true
            }
        });

        gsap.to(card, {
            x: offset.x,
            y: offset.y,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero-card',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.1
            }
        });
    });

    const counters = document.querySelectorAll<HTMLElement>('.impact-count');
    counters.forEach((counter) => {
        const target = Number(counter.dataset.target || '0');
        const format = counter.dataset.format || 'dot';
        const state = { value: 0 };

        gsap.to(state, {
            value: target,
            duration: 2.4,
            ease: 'power2.out',
            onUpdate: () => {
                counter.textContent = formatCounterValue(state.value, format);
            },
            scrollTrigger: {
                trigger: counter,
                start: 'top 68%',
                once: true
            }
        });
    });

    const sectionWordTitles = document.querySelectorAll<HTMLElement>('.js-word-title');
    sectionWordTitles.forEach((title) => {
        const words = title.querySelectorAll('.title-word');
        gsap.from(words, {
            opacity: 0,
            y: 24,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.05,
            scrollTrigger: {
                trigger: title,
                start: 'top 68%'
            }
        });
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());
};

export const useLandingPreview = () => {
    const { $api } = useNuxtApp();
    const runtimeConfig = useRuntimeConfig();
    const base = runtimeConfig.app.baseURL.replace(/\/$/, '');
    const apiBase = String(runtimeConfig.public.apiBase ?? '').replace(/\/$/, '');
    // A landing possui FAQs locais para a prévia. Evita uma requisição falha
    // quando o backend padrão local não está em execução.
    const hasRemoteFaqApi = Boolean(apiBase) && !/^https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?(?:\/api)?$/i.test(apiBase);
    const withBase = (path: string) => `${base}${path}`;

    const menuItems: LandingMenuItem[] = menuItemsData.map((item) => ({
        ...item,
        href: item.href.startsWith('#') ? item.href : withBase(item.href)
    }));

    const loginUrl = withBase('/auth/login');

    const featuredTagsWithCovers: LandingFeaturedTag[] = featuredTags.map((tag) => ({
        ...tag,
        imageCover: withBase(tag.imageCover)
    }));

    const pricingTagImages = featuredTags.map((tag) => ({
        src: withBase(tag.image),
        alt: tag.title
    }));

    const isMobileMenuOpen = ref(false);
    const activeProjectImage = ref(0);
    const activeTagIndex = ref(0);
    const isTagCarouselPaused = ref(false);
    // Serializa o valor inicial no payload SSR para manter servidor e hidratação idênticos.
    const currentYear = useState('landing-current-year', () => new Date().getFullYear());
    const faqItems = ref<LandingFaqItem[]>([...fallbackFaqItems]);
    let scrollTriggerModule: ScrollTriggerModule | null = null;
    let destroySmoothScroll: (() => void) | null = null;
    let isLandingUnmounted = false;

    let projectCarouselTimer: ReturnType<typeof setInterval> | null = null;
    let tagCarouselTimer: ReturnType<typeof setInterval> | null = null;

    const toggleMobileMenu = () => {
        isMobileMenuOpen.value = !isMobileMenuOpen.value;
    };

    const closeMobileMenu = () => {
        isMobileMenuOpen.value = false;
    };

    const restartTagCarousel = () => {
        if (tagCarouselTimer) {
            clearInterval(tagCarouselTimer);
        }

        if (isTagCarouselPaused.value) {
            return;
        }

        tagCarouselTimer = setInterval(() => {
            activeTagIndex.value = (activeTagIndex.value + 1) % featuredTags.length;
        }, 6500);
    };

    const selectTag = (index: number) => {
        activeTagIndex.value = index;
        restartTagCarousel();
    };

    const toggleTagCarousel = () => {
        isTagCarouselPaused.value = !isTagCarouselPaused.value;
        restartTagCarousel();
    };

    const fetchLandingFaqs = async () => {
        try {
            const res = await $api('/faqs') as any;
            const payload = res?.data ?? res;

            const list = Array.isArray(payload)
                ? payload
                : (Array.isArray(payload?.data) ? payload.data : []);

            const normalizedFaqs = list
                .filter((item: any) => item?.active === undefined || item?.active === true || item?.active === 1)
                .sort((a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0))
                .map((item: any) => ({
                    question: String(item?.question ?? '').trim(),
                    answer: String(item?.answer ?? '').trim()
                }))
                .filter((item: LandingFaqItem) => Boolean(item.question) && Boolean(item.answer));

            if (normalizedFaqs.length > 0) {
                faqItems.value = normalizedFaqs;
            }
        } catch {
            // Mantém as FAQs de fallback da landing caso a API esteja indisponível.
        }
    };

    onMounted(async () => {
        await nextTick();

        const [gsapModule, loadedScrollTriggerModule] = await Promise.all([
            import('gsap'),
            import('gsap/ScrollTrigger')
        ]);

        scrollTriggerModule = loadedScrollTriggerModule;
        initLandingAnimations(gsapModule, loadedScrollTriggerModule);

        void initSmoothScroll(gsapModule.default, loadedScrollTriggerModule.ScrollTrigger).then((cleanup) => {
            if (isLandingUnmounted) {
                cleanup();
                return;
            }

            destroySmoothScroll = cleanup;
        });

        projectCarouselTimer = setInterval(() => {
            activeProjectImage.value = (activeProjectImage.value + 1) % projectGallery.length;
        }, 4200);

        if (hasRemoteFaqApi) {
            await fetchLandingFaqs();
        }

        restartTagCarousel();
    });

    onBeforeUnmount(() => {
        isLandingUnmounted = true;
        destroySmoothScroll?.();
        scrollTriggerModule?.ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

        if (projectCarouselTimer) {
            clearInterval(projectCarouselTimer);
        }

        if (tagCarouselTimer) {
            clearInterval(tagCarouselTimer);
        }
    });

    useSeoMeta({
        title: 'Identifica Trânsito | Etiquetas refletivas com QR Code para um trânsito mais seguro',
        description: 'Conheça o Identifica Trânsito: etiquetas refletivas com QR Code que comunicam o perfil de condução, promovem empatia e ajudam a construir um trânsito mais seguro e humano.',
        ogTitle: 'Identifica Trânsito | Etiquetas refletivas com QR Code',
        ogDescription: 'Etiquetas refletivas que identificam o perfil de condução e incentivam um trânsito mais seguro, humano e solidário.',
        ogType: 'website',
        ogImage: '/images/logo-it.svg',
        twitterCard: 'summary_large_image'
    });

    useHead({
        link: [
            {
                rel: 'preload',
                as: 'image',
                href: '/images/lp/bg-hero.webp',
                media: '(max-width: 1023px)'
            }
        ],
        script: [
            {
                type: 'application/ld+json',
                innerHTML: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'Organization',
                    name: 'Identifica Trânsito',
                    description: 'Projeto de identificação de perfis de condução por meio de etiquetas refletivas com QR Code.',
                    logo: '/images/logo-it.svg'
                })
            },
            {
                type: 'application/ld+json',
                innerHTML: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    mainEntity: fallbackFaqItems.map((item) => ({
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

    return {
        activeProjectImage,
        activeTagIndex,
        benefits,
        closeMobileMenu,
        currentYear,
        faqItems,
        featuredTags: featuredTagsWithCovers,
        impactStats,
        isMobileMenuOpen,
        isTagCarouselPaused,
        loginUrl,
        menuItems,
        pricingTagImages,
        projectGallery,
        projectPillars,
        selectTag,
        toggleTagCarousel,
        steps,
        toggleMobileMenu
    };
};
