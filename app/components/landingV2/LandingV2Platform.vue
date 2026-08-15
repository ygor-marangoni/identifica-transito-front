<script setup lang="ts">
import { ArrowUpRight, CarFront, Check, ClipboardList, CircleHelp, Headset, LayoutDashboard, PackageCheck, Plus, ShieldCheck, Tag, UserRound } from '@lucide/vue';

const section = ref<HTMLElement | null>(null);
const activeView = ref('Resumo');
const activeProjectSlide = ref(2);
let motionContext: { revert: () => void } | undefined;
let projectDragStartX: number | null = null;

const projectSlides = [
    { image: '/landing-v2/images/platform/post-01.jpg', alt: 'Conteúdo sobre direção segura', title: 'Dirija com mais atenção', description: 'Informação simples para decisões mais conscientes no trânsito.' },
    { image: '/landing-v2/images/platform/post-02.jpg', alt: 'Conteúdo sobre respeito no trânsito', title: 'Respeito mútuo na via', description: 'Mais contexto para construir uma convivência mais humana.' },
    { image: '/landing-v2/images/platform/sobre-it.jpg', alt: 'Identifica Trânsito', title: 'Fomento ao respeito mútuo', description: 'Promove respeito entre motoristas e uma convivência mais harmoniosa no trânsito.' },
    { image: '/landing-v2/images/platform/post-03.jpg', alt: 'Conteúdo sobre segurança no trânsito', title: 'Segurança em cada trajeto', description: 'Sinais claros ajudam a transformar informação em cuidado.' },
    { image: '/landing-v2/images/platform/post-01.jpg', alt: 'Conteúdo sobre direção segura', title: 'Mais clareza para todos', description: 'Uma leitura melhor muda a forma como percebemos cada situação.' }
];

const activeProjectSlideData = computed(() => projectSlides[activeProjectSlide.value]);

const navigation = [
    { label: 'Resumo', icon: LayoutDashboard },
    { label: 'Meus veículos', icon: CarFront },
    { label: 'Etiquetas', icon: Tag },
    { label: 'Perfil', icon: UserRound }
];

const viewCopy = computed(() => {
    if (activeView.value === 'Meus veículos') return { kicker: 'Sua garagem', title: 'Veículos cadastrados', description: 'Acompanhe cada veículo e mantenha suas etiquetas vinculadas.' };
    if (activeView.value === 'Etiquetas') return { kicker: 'Identificação', title: 'Etiquetas ativas', description: 'Consulte os perfis e o status de cada etiqueta.' };
    if (activeView.value === 'Perfil') return { kicker: 'Seus dados', title: 'Perfil de uso', description: 'Mantenha seus dados e preferências sempre atualizados.' };
    return { kicker: 'Dashboard', title: 'Bom dia, Camila', description: 'Tudo o que importa para seus veículos em um só lugar.' };
});

const selectView = (label: string) => {
    activeView.value = label;
};

const selectProjectSlide = (index: number) => {
    activeProjectSlide.value = index;
};

const startProjectDrag = (event: PointerEvent) => {
    projectDragStartX = event.clientX;
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
};

const finishProjectDrag = (event: PointerEvent) => {
    if (projectDragStartX === null) return;
    const distance = event.clientX - projectDragStartX;
    projectDragStartX = null;
    if (Math.abs(distance) < 40) return;
    const next = distance < 0
        ? (activeProjectSlide.value + 1) % projectSlides.length
        : (activeProjectSlide.value - 1 + projectSlides.length) % projectSlides.length;
    selectProjectSlide(next);
};

onMounted(async () => {
    if (!section.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    await waitForLandingV2Ready();
    const { default: gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);
    motionContext = gsap.context(() => {
        const intro = section.value?.querySelector<HTMLElement>('.v2-platform__head');
        const shell = section.value?.querySelector<HTMLElement>('.v2-platform__shell');
        const shellParts = section.value?.querySelectorAll<HTMLElement>('.v2-platform__topbar, .v2-platform__welcome, .v2-platform__quick-head, .v2-platform__quick-grid > article, .v2-platform__dashboard-grid, .v2-platform__register');
        const items = section.value?.querySelectorAll<HTMLElement>('.v2-platform__reveal');
        const timeline = gsap.timeline({ scrollTrigger: { trigger: section.value, start: 'top 72%', once: true } });
        if (intro) timeline.from(intro, { y: 44, autoAlpha: 0, duration: .76, ease: 'power3.out' });
        if (shell) timeline.from(shell, { y: 70, autoAlpha: 0, scale: .96, rotateX: 2, transformPerspective: 1000, duration: .92, ease: 'power3.out' }, '-=.34');
        if (shellParts?.length) timeline.from(shellParts, { y: 28, autoAlpha: 0, scale: .98, stagger: .075, duration: .5, ease: 'power3.out' }, '-=.58');
        if (items?.length) timeline.from(items, { y: 18, autoAlpha: 0, stagger: .07, duration: .42, ease: 'power2.out' }, '-=.42');
    }, section.value);
});

onBeforeUnmount(() => motionContext?.revert());
</script>

<template>
    <section id="plataforma" ref="section" class="v2-platform" aria-labelledby="v2-platform-title">
        <header class="v2-platform__head">
            <div>
                <p class="v2-platform__eyebrow">{ TUDO EM UM SÓ LUGAR }</p>
                <h2 id="v2-platform-title">Uma plataforma.<br>Mais <span class="heading-highlight">controle.</span></h2>
            </div>
            <p class="v2-platform__lead">Cadastre veículos, acompanhe etiquetas e consulte cada informação com clareza, em uma experiência simples de usar.</p>
        </header>

        <div class="v2-platform__shell">
            <div class="v2-platform__topbar">
                <div class="v2-platform__brand"><img src="/landing-v2/images/branding/logo-horizontal.svg" alt="Identifica Trânsito"></div>
                <div class="v2-platform__topbar-actions"><div class="v2-platform__notifications" aria-label="Notificações"><img src="/landing-v2/images/platform/icons/sino.svg" alt=""><span></span></div><div class="v2-platform__profile" aria-label="Perfil de Camila"><img class="v2-platform__avatar" src="/landing-v2/images/platform/avatar.jpg" alt="Camila"><strong>Camila</strong><img class="v2-platform__profile-chevron" src="/landing-v2/images/platform/icons/seta-baixo.svg" alt=""></div></div>
            </div>
            <div class="v2-platform__preview">
                <div class="v2-platform__welcome">
                    <div><small><LayoutDashboard :size="12" /> Bem-vindo(a) de volta</small><h3>Olá, Camila!</h3><p>Acesse rapidamente seus veículos, pedidos e suporte.</p></div>
                    <div class="v2-platform__welcome-stats"><span><b>Veículos ativos</b><strong>2</strong></span><span><b>Etiquetas cadastradas</b><strong>3</strong></span></div>
                </div>
                <div class="v2-platform__quick-head"><h3>Acesso Rápido</h3><span><CircleHelp :size="13" /> Precisa de ajuda?</span></div>
                <div class="v2-platform__quick-grid">
                    <article><i><CarFront :size="17" /></i><b>Meus Veículos</b><small>Gerencie e acompanhe</small><em>2</em></article>
                    <article><i><ClipboardList :size="17" /></i><b>Meus Pedidos</b><small>Status e histórico</small><em>3</em></article>
                    <article><i><UserRound :size="17" /></i><b>Meu Perfil</b><small>Dados e segurança</small></article>
                    <article><i><Headset :size="17" /></i><b>Suporte</b><small>Fale com a gente</small></article>
                </div>
                <div class="v2-platform__dashboard-grid">
                    <article class="v2-platform__project-card" @pointerdown="startProjectDrag" @pointerup="finishProjectDrag"><div class="v2-platform__project-image"><img src="/landing-v2/images/platform/sobre-it.jpg?v=2" alt="Identifica Trânsito" loading="eager" decoding="async"><span><ShieldCheck :size="21" /></span></div><div class="v2-platform__project-copy"><small><ShieldCheck :size="13" /> Dirija com segurança</small><h4>{{ activeProjectSlideData.title }}</h4><p>{{ activeProjectSlideData.description }}</p><div class="v2-platform__dots" aria-label="Slides do projeto"><button v-for="(_, index) in projectSlides" :key="index" type="button" :class="{ 'is-active': activeProjectSlide === index }" :aria-label="`Ir para o slide ${index + 1}`" :aria-current="activeProjectSlide === index ? 'true' : undefined" @click.stop="selectProjectSlide(index)"></button></div><div><button>Saiba mais sobre o projeto</button><button class="is-secondary">Perguntas frequentes</button></div></div></article>
                    <article class="v2-platform__orders"><header><span><i><PackageCheck :size="15" /></i><b>Últimos Pedidos</b></span><a href="#plataforma">Ver todos</a></header><div v-for="order in [{name:'Etiqueta Azul - 1 unidade', id:'#PED-PIX-202607-1001', status:'Em rota de entrega', color:'orange', width:'68%'},{name:'Etiqueta Vermelha - 1 unidade', id:'#PED-MP-202607-1002', status:'Em andamento', color:'blue', width:'33%'},{name:'Etiqueta Amarela - 1 unidade', id:'#PED-BOL-202607-1003', status:'Em andamento', color:'blue', width:'33%'}]" :key="order.id" class="v2-platform__order"><i><PackageCheck :size="14" /></i><div><b>{{ order.name }}</b><small>Pedido {{ order.id }}</small><span :class="order.color">{{ order.status }}</span><em :class="order.color" :style="{ width: order.width }"></em></div></div></article>
                </div>
                <div class="v2-platform__register"><span><i><CarFront :size="18" /></i><small>IDENTIFICAÇÃO VEICULAR</small><b>Cadastre um novo veículo</b></span><button><Plus :size="15" /> Cadastrar veículo</button></div>
            </div>
            <div class="v2-platform__layout v2-platform__legacy-layout">
                <aside class="v2-platform__sidebar" aria-label="Navegação da plataforma">
                    <p>MENU PRINCIPAL</p>
                    <button v-for="item in navigation" :key="item.label" type="button" :class="{ 'is-active': activeView === item.label }" @click="selectView(item.label)"><component :is="item.icon" :size="17" /><span>{{ item.label }}</span></button>
                    <div class="v2-platform__sidebar-help"><span>Precisa de ajuda?</span><a href="#faq">Fale com a gente <ArrowUpRight :size="14" /></a></div>
                </aside>

                <main class="v2-platform__main">
                    <div class="v2-platform__main-head v2-platform__reveal"><div><small>{{ viewCopy.kicker }}</small><h3>{{ viewCopy.title }}</h3><p>{{ viewCopy.description }}</p></div><button class="v2-platform__add" type="button"><Plus :size="16" /> Cadastrar veículo</button></div>
                    <div class="v2-platform__metrics v2-platform__reveal"><div><small>Veículos</small><strong>02</strong><span>+1 este mês</span></div><div><small>Etiquetas ativas</small><strong>02</strong><span class="is-positive"><Check :size="12" /> Tudo certo</span></div><div><small>Pedidos</small><strong>03</strong><span>Em acompanhamento</span></div></div>
                    <div class="v2-platform__content-grid">
                        <article class="v2-platform__vehicle v2-platform__reveal"><div class="v2-platform__article-head"><div><small>VEÍCULO EM DESTAQUE</small><h4>Volkswagen T-Cross</h4></div><button type="button" aria-label="Ver detalhes"><ArrowUpRight :size="17" /></button></div><div class="v2-platform__vehicle-info"><div class="v2-platform__vehicle-icon"><CarFront :size="27" /></div><div><strong>ABC1D23</strong><span>Automóvel · São Paulo, SP</span></div><div class="v2-platform__status"><b></b> Ativo</div></div><div class="v2-platform__vehicle-foot"><span><Tag :size="14" /> Etiqueta branca</span><span><Check :size="14" /> Dados protegidos</span></div></article>
                        <article class="v2-platform__activity v2-platform__reveal"><div class="v2-platform__article-head"><div><small>ATIVIDADE RECENTE</small><h4>Seu trajeto está acompanhado</h4></div><ArrowUpRight :size="17" /></div><div class="v2-platform__activity-line"><i></i><p><strong>Etiqueta vinculada</strong><span>Volkswagen T-Cross · agora</span></p></div><div class="v2-platform__activity-line"><i></i><p><strong>Cadastro atualizado</strong><span>Informações preservadas · ontem</span></p></div></article>
                    </div>
                </main>
            </div>
        </div>
    </section>
</template>

<style scoped>
.v2-platform{padding:clamp(105px,13vw,175px) clamp(24px,8vw,130px);background:#f4f8ff;color:#101114;font-family:'Instrument Sans',Arial,sans-serif}.v2-platform__head{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(260px,.65fr);align-items:end;gap:clamp(35px,7vw,105px);max-width:1250px;margin:0 auto}.v2-platform__eyebrow{margin:0 0 24px;color:#145df5;font-size:12px;font-weight:700;letter-spacing:.13em;line-height:1.2;text-transform:uppercase}.v2-platform h2{margin:0;color:#172b4d;font-size:56px;font-weight:600;letter-spacing:-.025em;line-height:.98}.v2-platform__lead{justify-self:end;max-width:390px;margin:0 0 5px;color:#69778e;font-size:18px;line-height:1.5}.v2-platform__shell{max-width:1250px;margin:clamp(55px,7vw,86px) auto 0;overflow:hidden;border:1px solid #d8e2f1;border-radius:24px;background:#fff;box-shadow:0 22px 60px rgba(23,57,105,.12)}.v2-platform__topbar{display:flex;align-items:center;justify-content:space-between;height:66px;padding:0 clamp(20px,3vw,36px);border-bottom:1px solid #e7edf6}.v2-platform__brand{color:#145df5;font-size:17px;font-weight:800;letter-spacing:-.06em}.v2-platform__brand i{margin-left:4px;color:#70809a;font-size:11px;font-style:normal;font-weight:600;letter-spacing:-.02em}.v2-platform__topbar-actions{display:flex;align-items:center;gap:22px}.v2-platform__online{display:flex;align-items:center;gap:7px;color:#718096;font-size:11px;font-weight:650}.v2-platform__online b{width:7px;height:7px;border-radius:50%;background:#31ad72}.v2-platform__topbar-actions button{display:grid;width:34px;height:34px;place-items:center;border:1px solid #dce5f2;border-radius:50%;background:#f4f8ff;color:#145df5}.v2-platform__layout{display:grid;grid-template-columns:188px minmax(0,1fr);min-height:455px}.v2-platform__sidebar{display:flex;flex-direction:column;padding:27px 15px;border-right:1px solid #e7edf6;background:#fbfdff}.v2-platform__sidebar>p{margin:0 10px 14px;color:#9aa7b9;font-size:9px;font-weight:750;letter-spacing:.12em}.v2-platform__sidebar button{display:flex;align-items:center;gap:10px;width:100%;padding:11px 12px;border:0;border-radius:9px;background:transparent;color:#718096;font:600 12px/1.2 'Instrument Sans',Arial,sans-serif;text-align:left;cursor:pointer;transition:background .2s,color .2s}.v2-platform__sidebar button:hover{background:#eef4ff;color:#145df5}.v2-platform__sidebar button.is-active{background:#eaf2ff;color:#145df5;font-weight:750}.v2-platform__sidebar-help{margin-top:auto;padding:16px 11px;border:1px solid #dfe8f6;border-radius:12px;background:#f4f8ff}.v2-platform__sidebar-help span{display:block;color:#7a8799;font-size:10px}.v2-platform__sidebar-help a{display:flex;align-items:center;gap:3px;margin-top:7px;color:#145df5;font-size:10px;font-weight:750;text-decoration:none}.v2-platform__main{min-width:0;padding:clamp(24px,4vw,45px)}.v2-platform__main-head{display:flex;align-items:flex-start;justify-content:space-between;gap:20px}.v2-platform__main-head small,.v2-platform__article-head small{color:#8996a9;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.v2-platform__main-head h3{margin:5px 0 4px;color:#172b4d;font-size:26px;letter-spacing:-.05em}.v2-platform__main-head p{margin:0;color:#77869c;font-size:13px;line-height:1.4}.v2-platform__add{display:flex;align-items:center;gap:6px;flex:none;padding:11px 13px;border:0;border-radius:8px;background:#145df5;color:#fff;font:700 11px/1 'Instrument Sans',Arial,sans-serif;cursor:pointer}.v2-platform__metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:27px}.v2-platform__metrics>div{padding:14px 15px;border:1px solid #e2eaf5;border-radius:12px;background:#fff}.v2-platform__metrics small{display:block;color:#8996a9;font-size:10px}.v2-platform__metrics strong{display:block;margin-top:5px;color:#172b4d;font-size:25px;letter-spacing:-.05em}.v2-platform__metrics span{display:flex;align-items:center;gap:3px;margin-top:3px;color:#8996a9;font-size:9px}.v2-platform__metrics .is-positive{color:#2caa70}.v2-platform__content-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:10px;margin-top:10px}.v2-platform__vehicle,.v2-platform__activity{min-width:0;padding:17px;border:1px solid #dfe8f4;border-radius:13px;background:#fff}.v2-platform__article-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.v2-platform__article-head h4{margin:5px 0 0;color:#172b4d;font-size:15px;letter-spacing:-.035em}.v2-platform__article-head>button{display:grid;width:28px;height:28px;place-items:center;border:1px solid #dce6f3;border-radius:7px;background:#f5f8fd;color:#145df5}.v2-platform__vehicle-info{display:flex;align-items:center;gap:11px;margin-top:19px;padding:13px;border-radius:10px;background:#f4f8ff}.v2-platform__vehicle-icon{display:grid;width:43px;height:43px;place-items:center;border-radius:10px;background:#e3edff;color:#145df5}.v2-platform__vehicle-info strong,.v2-platform__vehicle-info span{display:block}.v2-platform__vehicle-info strong{color:#172b4d;font-size:14px}.v2-platform__vehicle-info span{margin-top:3px;color:#7b899d;font-size:10px}.v2-platform__status{display:flex;align-items:center;gap:5px;margin-left:auto;color:#2caa70;font-size:10px;font-weight:700}.v2-platform__status b{width:6px;height:6px;border-radius:50%;background:#2caa70}.v2-platform__vehicle-foot{display:flex;flex-wrap:wrap;gap:15px;margin-top:14px;color:#6e7d92;font-size:10px}.v2-platform__vehicle-foot span{display:flex;align-items:center;gap:5px}.v2-platform__vehicle-foot svg{color:#145df5}.v2-platform__activity>.v2-platform__article-head>svg{color:#9aa7b9}.v2-platform__activity-line{display:flex;gap:10px;margin-top:17px}.v2-platform__activity-line i{position:relative;flex:none;width:8px;height:8px;margin-top:4px;border:2px solid #145df5;border-radius:50%;background:#fff}.v2-platform__activity-line:not(:last-child) i:after{content:'';position:absolute;top:6px;left:1px;width:2px;height:27px;background:#dce7f7}.v2-platform__activity-line p{margin:0}.v2-platform__activity-line strong,.v2-platform__activity-line span{display:block}.v2-platform__activity-line strong{color:#344766;font-size:11px}.v2-platform__activity-line span{margin-top:3px;color:#8a97a8;font-size:10px}
@media (min-width:1601px){.v2-platform h2{font-size:56px}}@media (min-width:1441px) and (max-width:1600px){.v2-platform h2{font-size:52px}}@media (min-width:1200px) and (max-width:1440px){.v2-platform h2{font-size:48px}}@media (max-width:1199px){.v2-platform h2{font-size:44px}}@media (max-width:800px){.v2-platform{padding-top:90px;padding-bottom:90px}.v2-platform__head{grid-template-columns:1fr}.v2-platform__lead{justify-self:start;margin-top:25px;text-align:left}.v2-platform__layout{grid-template-columns:155px minmax(0,1fr)}.v2-platform__sidebar-help{display:none}.v2-platform__main-head{display:block}.v2-platform__add{margin-top:18px}.v2-platform__content-grid{grid-template-columns:1fr}}@media (max-width:560px){.v2-platform{padding:72px 20px}.v2-platform__eyebrow{margin-bottom:21px;font-size:11px}.v2-platform h2{font-size:32px;line-height:1.04}.v2-platform__lead{max-width:none;font-size:16px}.v2-platform__shell{margin-top:38px;border-radius:18px}.v2-platform__topbar{height:58px;padding:0 16px}.v2-platform__online{display:none}.v2-platform__layout{display:block;min-height:0}.v2-platform__sidebar{display:flex;flex-direction:row;gap:5px;overflow-x:auto;padding:10px;border-right:0;border-bottom:1px solid #e7edf6}.v2-platform__sidebar>p,.v2-platform__sidebar-help{display:none}.v2-platform__sidebar button{flex:0 0 auto;width:auto;padding:9px 10px;font-size:10px}.v2-platform__sidebar button svg{display:none}.v2-platform__main{padding:20px 14px}.v2-platform__main-head h3{font-size:22px}.v2-platform__add{width:100%;justify-content:center}.v2-platform__metrics{gap:6px;margin-top:22px}.v2-platform__metrics>div{padding:11px 9px}.v2-platform__metrics strong{font-size:21px}.v2-platform__metrics span{font-size:8px}.v2-platform__content-grid{gap:8px}.v2-platform__vehicle,.v2-platform__activity{padding:14px}.v2-platform__vehicle-info{align-items:flex-start}.v2-platform__status{display:none}.v2-platform__vehicle-foot{gap:8px;font-size:9px}}
.v2-platform__shell{width:100%;max-width:none}.v2-platform__legacy-layout{display:none}.v2-platform__preview{padding:clamp(18px,2.5vw,32px);background:#f1f4f8;color:#172b4d}.v2-platform__welcome{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:22px 24px;border-radius:13px;background:linear-gradient(110deg,#222bd3,#347ce8);color:#fff}.v2-platform__welcome small{display:flex;align-items:center;gap:6px;color:rgba(255,255,255,.82);font-size:10px}.v2-platform__welcome h3{margin:8px 0 3px;font-size:22px;letter-spacing:-.04em}.v2-platform__welcome p{margin:0;color:rgba(255,255,255,.85);font-size:11px}.v2-platform__welcome-stats{display:flex;border:1px solid rgba(255,255,255,.22);border-radius:10px;overflow:hidden}.v2-platform__welcome-stats span{min-width:112px;padding:10px 14px;text-align:center}.v2-platform__welcome-stats span+span{border-left:1px solid rgba(255,255,255,.22)}.v2-platform__welcome-stats b{display:block;font-size:9px;font-weight:500}.v2-platform__welcome-stats strong{display:block;margin-top:4px;font-size:18px}.v2-platform__quick-head{display:flex;align-items:center;justify-content:space-between;margin:22px 0 10px}.v2-platform__quick-head h3{margin:0;font-size:18px}.v2-platform__quick-head span{display:flex;align-items:center;gap:4px;color:#2946df;font-size:10px}.v2-platform__quick-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.v2-platform__quick-grid article{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:92px;padding:12px;border:1px solid #dce3ec;border-radius:12px;background:#fff;text-align:center}.v2-platform__quick-grid i{display:grid;width:28px;height:28px;place-items:center;margin-bottom:7px;border-radius:8px;background:#edf1ff;color:#2946df;font-style:normal}.v2-platform__quick-grid b{font-size:11px;color:#101114}.v2-platform__quick-grid small{margin-top:3px;color:#657187;font-size:9px}.v2-platform__quick-grid em{position:absolute;top:7px;right:7px;display:grid;width:19px;height:19px;place-items:center;border-radius:50%;background:#2946df;color:#fff;font-size:9px;font-style:normal}.v2-platform__dashboard-grid{display:grid;grid-template-columns:minmax(0,2fr) minmax(220px,.92fr);gap:12px;margin-top:16px}.v2-platform__project-card,.v2-platform__orders{min-width:0;border:1px solid #dce3ec;border-radius:12px;background:#fff}.v2-platform__project-card{display:grid;grid-template-columns:1fr 1.35fr;align-items:center;gap:26px;padding:16px}.v2-platform__project-image{position:relative;overflow:visible}.v2-platform__project-image img{display:block;width:100%;aspect-ratio:1.2/1;object-fit:cover;border-radius:18px}.v2-platform__project-image span{position:absolute;bottom:-8px;left:-8px;display:grid;width:38px;height:38px;place-items:center;border:3px solid #fff;border-radius:9px;background:#2946df;color:#fff}.v2-platform__project-copy{text-align:center}.v2-platform__project-copy>small{display:inline-flex;align-items:center;gap:5px;padding:7px 10px;border-radius:999px;background:#edf1ff;color:#2946df;font-size:9px;font-weight:700}.v2-platform__project-copy h4{margin:15px 0 7px;font-size:18px;letter-spacing:-.04em}.v2-platform__project-copy p{margin:0;color:#657187;font-size:10px;line-height:1.45}.v2-platform__dots{display:flex;justify-content:center;gap:5px;margin:16px 0}.v2-platform__dots i{width:18px;height:4px;border-radius:99px;background:#dfe3eb}.v2-platform__dots i.is-active{background:#2946df}.v2-platform__project-copy button,.v2-platform__register button{display:inline-flex;align-items:center;gap:5px;padding:9px 11px;border:0;border-radius:6px;background:#2946df;color:#fff;font:700 9px 'Instrument Sans',Arial,sans-serif}.v2-platform__project-copy button.is-secondary{margin-left:5px;border:1px solid #dce3ec;background:#fff;color:#344766}.v2-platform__orders{padding:15px}.v2-platform__orders header{display:flex;align-items:center;justify-content:space-between;padding-bottom:12px;border-bottom:1px solid #e7ebf1}.v2-platform__orders header span{display:flex;align-items:center;gap:7px;font-size:12px}.v2-platform__orders header span>i{display:grid;width:25px;height:25px;place-items:center;border-radius:7px;background:#edf1ff;color:#2946df;font-style:normal}.v2-platform__orders header a{color:#2946df;font-size:9px;text-decoration:none}.v2-platform__order{display:flex;gap:8px;margin-top:9px;padding:9px;border:1px solid #e6ebf2;border-radius:9px;background:#fbfcff}.v2-platform__order>i{display:grid;flex:none;width:24px;height:24px;place-items:center;border-radius:7px;background:#edf1ff;color:#2946df;font-style:normal}.v2-platform__order>div{position:relative;min-width:0;flex:1}.v2-platform__order b,.v2-platform__order small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v2-platform__order b{font-size:9px;color:#172b4d}.v2-platform__order small{margin-top:2px;color:#8290a3;font-size:7px}.v2-platform__order span{position:absolute;top:0;right:0;padding:3px 4px;border-radius:4px;font-size:7px}.v2-platform__order span.orange{background:#fff3e9;color:#f06420}.v2-platform__order span.blue{background:#edf1ff;color:#2946df}.v2-platform__order em{display:block;height:4px;margin-top:7px;border-radius:5px;background:#2946df;font-style:normal}.v2-platform__order em.orange{background:#ff641d}.v2-platform__register{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-top:16px;padding:12px 15px;border:1px solid #dce3ec;border-radius:11px;background:#fff}.v2-platform__register span{display:grid;grid-template-columns:32px 1fr;column-gap:9px;align-items:center}.v2-platform__register span>i{grid-row:span 2;display:grid;width:32px;height:32px;place-items:center;border-radius:8px;background:#edf1ff;color:#2946df;font-style:normal}.v2-platform__register small{color:#2946df;font-size:7px;letter-spacing:.08em}.v2-platform__register b{font-size:11px}.v2-platform__register button{padding:9px 12px}@media(max-width:800px){.v2-platform__welcome{align-items:flex-start}.v2-platform__welcome-stats{display:none}.v2-platform__dashboard-grid{grid-template-columns:1fr}.v2-platform__project-card{grid-template-columns:1fr}.v2-platform__project-image{max-width:300px;margin:auto}.v2-platform__quick-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:560px){.v2-platform__preview{padding:12px}.v2-platform__welcome{padding:17px}.v2-platform__welcome h3{font-size:18px}.v2-platform__quick-head h3{font-size:16px}.v2-platform__register{align-items:flex-start;flex-direction:column}.v2-platform__register button{width:100%;justify-content:center}}
.v2-platform__lead { justify-self: end; text-align: right; }
@media (max-width: 800px) {
    .v2-platform__head {
        gap: 24px;
    }

    .v2-platform__lead {
        justify-self: start !important;
        margin-left: 0 !important;
        margin-top: 0 !important;
        text-align: left !important;
    }
}
.v2-platform__brand img {
    display: block;
    width: 154px;
    height: auto;
}
.v2-platform__topbar-actions {
    padding: 6px 8px 6px 12px;
    border: 1px solid #dce5f2;
    border-radius: 999px;
    background: rgba(244, 248, 255, .9);
    box-shadow: 0 6px 16px rgba(28, 64, 125, .08), inset 0 1px 0 #fff;
}
.v2-platform__topbar-actions button {
    box-shadow: 0 3px 8px rgba(20, 93, 245, .12);
}
.v2-platform__welcome h3 { color: #fff; }
.v2-platform__dots button {
    width: 18px;
    height: 4px;
    padding: 0;
    border: 0;
    border-radius: 99px;
    background: #dfe3eb;
    cursor: pointer;
}
.v2-platform__dots button.is-active { background: #2946df; }
.v2-platform__project-card { cursor: grab; touch-action: pan-y; }
.v2-platform__project-card:active { cursor: grabbing; }
.v2-platform__topbar-actions { gap: 10px; padding: 0; border: 0; background: transparent; box-shadow: none; }
.v2-platform__notifications,
.v2-platform__profile { border: 1px solid #e4e9f2; background: #fff; color: #172b4d; }
.v2-platform__notifications { position: relative; display: grid; width: 52px; height: 52px; place-items: center; border-radius: 50%; color: #69778e; }
.v2-platform__notifications img { display: block; width: 21px; height: 24px; margin: 0; opacity: .78; object-fit: contain; }
.v2-platform__notifications span { position: absolute; top: 2px; right: 4px; width: 10px; height: 10px; border: 2px solid #fff; border-radius: 50%; background: #2946df; }
.v2-platform__profile { display: flex; align-items: center; gap: 9px; min-height: 44px; padding: 4px 12px 4px 6px; border-radius: 999px; }
.v2-platform__profile strong { color: #172b4d; font-size: 13px; font-weight: 650; }
.v2-platform__profile-chevron { width: 13px; height: 13px; opacity: .68; }
.v2-platform__avatar { display: block; width: 39px; height: 39px; object-fit: cover; border-radius: 50%; background: #d8dbe0; }
@media(max-width:560px) { .v2-platform__profile strong { display: none; } .v2-platform__profile { padding-right: 6px; } }
@media(max-width:560px) {
    .v2-platform__notifications { box-sizing: border-box; width: 42px; height: 42px; }
    .v2-platform__profile { box-sizing: border-box; height: 42px; min-height: 42px; padding-top: 3px; padding-bottom: 3px; }
    .v2-platform__profile .v2-platform__avatar { width: 34px; height: 34px; }
    .v2-platform__profile .v2-platform__profile-chevron { width: 10px; height: 10px; }
}
</style>
