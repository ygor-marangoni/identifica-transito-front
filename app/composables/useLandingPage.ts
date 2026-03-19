import type {
    LandingFaqItem,
    LandingFeaturedTag,
    LandingImpactStat,
    LandingMenuItem,
    LandingProjectPillar,
    LandingStep
} from '../types/landing';

const menuItems: LandingMenuItem[] = [
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
        value: '1ª causa',
        counterTarget: 1,
        counterFormat: 'ordinal',
        description: 'de morte entre jovens e crianças em diversas realidades urbanas.'
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
        description: 'Material reflexivo pensado para continuar legível em cenários de baixa luminosidade.',
        tone: 'pillar-card--emerald'
    }
];

const projectGallery = ['/images/lp/o-projeto/img-01.webp'];

const featuredTags: LandingFeaturedTag[] = [
    {
        title: 'Etiqueta Vermelha',
        description: 'Motoristas com carteira de habilitação temporária.',
        image: '/images/lp/etiquetas/vermelho.svg',
        imageCover: '/images/lp/etiquetas/img-vermelho.webp',
        tone: 'tag-card--red'
    },
    {
        title: 'Etiqueta Azul',
        description: 'Carros de aplicativos, carros de locadoras, carros de empresas.',
        image: '/images/lp/etiquetas/azul.svg',
        imageCover: '/images/lp/etiquetas/img-azul.webp',
        tone: 'tag-card--blue'
    },
    {
        title: 'Etiqueta Amarela',
        description: 'Gestantes ou motoristas com recém-nascidos.',
        image: '/images/lp/etiquetas/amarelo.svg',
        imageCover: '/images/lp/etiquetas/img-amarelo.webp',
        tone: 'tag-card--yellow'
    },
    {
        title: 'Etiqueta Branca',
        description: 'Pessoas com mais de 60 anos, PCD e condições não visíveis, como autismo e deficiências ocultas.',
        image: '/images/lp/etiquetas/branco.svg',
        imageCover: '/images/lp/etiquetas/img-branco.webp',
        tone: 'tag-card--white'
    },
    {
        title: 'Etiqueta Verde',
        description: 'Condutores com carteira de habilitação definitiva.',
        image: '/images/lp/etiquetas/verde.svg',
        imageCover: '/images/lp/etiquetas/img-verde.webp',
        tone: 'tag-card--green'
    }
];

const benefits = [
    'Redução de acidentes causados por interpretações erradas no trânsito.',
    'Mais empatia e paciência nas interações entre motoristas.',
    'Identificação mais rápida do perfil em situações críticas e de apoio.',
    'Etiquetas reflexivas com boa leitura à noite e sob chuva.',
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
        icon: 'pi pi-send',
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


const formatCounterValue = (value: number, format: string) => {
    if (format === 'dot') {
        return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    if (format === 'mi') {
        return `${value.toFixed(2).replace('.', ',')} mi`;
    }

    if (format === 'ordinal') {
        return `${Math.round(value)}ª causa`;
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

const initLandingAnimations = (gsapModule: GsapModule, scrollTriggerModule: ScrollTriggerModule) => {
    const gsap = gsapModule.default;
    const { ScrollTrigger } = scrollTriggerModule;

    gsap.registerPlugin(ScrollTrigger);

    prepareWordsForAnimation('.js-word-title');

    const heroTimeline = gsap.timeline();
    heroTimeline
        .from('.hero-kicker', {
            opacity: 0,
            y: 18,
            duration: 0.45,
            ease: 'power2.out'
        })
        .from(
            '.hero-title .hero-word',
            {
                opacity: 0,
                y: 36,
                duration: 0.55,
                ease: 'power3.out',
                stagger: 0.06
            },
            '-=0.05'
        )
        .from(
            ['.hero-text', '.hero-actions'],
            {
                opacity: 0,
                y: 24,
                duration: 0.55,
                ease: 'power2.out',
                stagger: 0.1
            },
            '-=0.15'
        );

    const revealTargets = document.querySelectorAll(
        '.impact-card, .pillar-card, .tag-card, .benefit-visual__panel, .step-card, .faq-item, .pricing-card, .cta-section__inner > div, .cta-section__button, .project-visual, .project-visual__privacy'
    );

    revealTargets.forEach((target) => {
        gsap.from(target, {
            opacity: 0,
            y: 28,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: target,
                start: 'top 84%'
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
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
                counter.textContent = formatCounterValue(state.value, format);
            },
            scrollTrigger: {
                trigger: counter,
                start: 'top 86%',
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
            duration: 0.55,
            ease: 'power3.out',
            stagger: 0.05,
            scrollTrigger: {
                trigger: title,
                start: 'top 84%'
            }
        });
    });
};

export const useLandingPage = () => {
    const { $api } = useNuxtApp();
    const pricingTagImages = featuredTags.map((tag) => ({
        src: tag.image,
        alt: tag.title
    }));

    const isMobileMenuOpen = ref(false);
    const activeProjectImage = ref(0);
    const activeTagIndex = ref(0);
    const currentYear = new Date().getFullYear();
    const faqItems = ref<LandingFaqItem[]>([...fallbackFaqItems]);
    let scrollTriggerModule: ScrollTriggerModule | null = null;

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

        tagCarouselTimer = setInterval(() => {
            activeTagIndex.value = (activeTagIndex.value + 1) % featuredTags.length;
        }, 4000);
    };

    const selectTag = (index: number) => {
        activeTagIndex.value = index;
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
        } catch (error) {
            console.error('Erro ao carregar FAQs da landing:', error);
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

        projectCarouselTimer = setInterval(() => {
            activeProjectImage.value = (activeProjectImage.value + 1) % projectGallery.length;
        }, 4200);

        await fetchLandingFaqs();

        restartTagCarousel();
    });

    onBeforeUnmount(() => {
        scrollTriggerModule?.ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

        if (projectCarouselTimer) {
            clearInterval(projectCarouselTimer);
        }

        if (tagCarouselTimer) {
            clearInterval(tagCarouselTimer);
        }
    });

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
            },
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
                    description: 'Projeto de identificação de perfis de condução por meio de etiquetas reflexivas com QR Code.',
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
        featuredTags,
        impactStats,
        isMobileMenuOpen,
        menuItems,
        pricingTagImages,
        projectGallery,
        projectPillars,
        selectTag,
        steps,
        toggleMobileMenu
    };
};