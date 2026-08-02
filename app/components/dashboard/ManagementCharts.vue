<script setup lang="ts">
import { Activity, ChartPie } from '@lucide/vue';

interface DashboardOrder {
    created_at?: string | null;
    tag_name?: string | null;
    tag_slug?: string | null;
    qty?: number | string | null;
    price_total?: number | string | null;
    mp_payment_status?: string | null;
    status?: number | null;
}

interface TagSale {
    label?: string | null;
    name?: string | null;
    tag_name?: string | null;
    slug?: string | null;
    tag_slug?: string | null;
    quantity?: number | string | null;
    qty?: number | string | null;
}

interface BalancePoint {
    date?: string | null;
    value?: number | string | null;
    balance?: number | string | null;
}

const props = defineProps<{
    latestOrders?: DashboardOrder[];
    tagSales?: TagSale[];
    balanceHistory?: BalancePoint[];
    dateFrom?: string;
    dateTo?: string;
    loading?: boolean;
}>();

const tagDefinitions = [
    { slug: 'verde', label: 'Verde', color: '#16a34a' },
    { slug: 'azul', label: 'Azul', color: '#1f46ee' },
    { slug: 'amarelo', label: 'Amarela', color: '#eab308' },
    { slug: 'branco', label: 'Branca', color: '#94a3b8' },
    { slug: 'vermelho', label: 'Vermelha', color: '#dc2626' }
];

const normalizeDate = (value?: string | null) => {
    if (!value) return null;
    const brDate = value.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
    if (brDate) return `${brDate[3]}-${brDate[2]}-${brDate[1]}`;
    const isoDate = value.match(/^(\d{4}-\d{2}-\d{2})/);
    return isoDate?.[1] ?? null;
};

const formatShortDate = (value: string) => {
    const [, month, day] = value.split('-');
    return `${day}/${month}`;
};

const isWithinSelectedPeriod = (date: string) =>
    (!props.dateFrom || date >= props.dateFrom) && (!props.dateTo || date <= props.dateTo);

const getTagSlug = (order: DashboardOrder | TagSale) => {
    const item = order as DashboardOrder & TagSale;
    const raw = item.tag_slug || item.slug || item.tag_name || item.name || item.label || '';
    return raw.toLowerCase().replace('etiqueta', '').trim();
};

const filteredOrders = computed(() => (props.latestOrders ?? []).filter((order) => {
    const date = normalizeDate(order.created_at);
    return Boolean(date && isWithinSelectedPeriod(date));
}));

const tagSales = computed(() => {
    const quantities = new Map(tagDefinitions.map((tag) => [tag.slug, 0]));
    const source = props.tagSales?.length ? props.tagSales : filteredOrders.value;

    for (const item of source) {
        const slug = getTagSlug(item);
        const sale = item as DashboardOrder & TagSale;
        if (!quantities.has(slug)) continue;
        quantities.set(slug, (quantities.get(slug) ?? 0) + Number(sale.quantity ?? sale.qty ?? 0));
    }

    return tagDefinitions.map((tag) => ({ ...tag, quantity: quantities.get(tag.slug) ?? 0 }));
});

const balanceSeries = computed(() => {
    if (props.balanceHistory?.length) {
        return props.balanceHistory
            .map((point) => ({ date: normalizeDate(point.date), value: Number(point.balance ?? point.value ?? 0) }))
            .filter((point): point is { date: string; value: number } => Boolean(point.date && isWithinSelectedPeriod(point.date)))
            .sort((a, b) => a.date.localeCompare(b.date));
    }

    const dailyValues = new Map<string, number>();
    for (const order of filteredOrders.value) {
        const date = normalizeDate(order.created_at);
        const isApproved = order.mp_payment_status === 'approved' || order.status === 1;
        if (!date || !isApproved) continue;
        dailyValues.set(date, (dailyValues.get(date) ?? 0) + Number(order.price_total ?? 0));
    }

    let runningBalance = 0;
    return [...dailyValues.entries()]
        .sort(([first], [second]) => first.localeCompare(second))
        .map(([date, value]) => ({ date, value: (runningBalance += value) }));
});

const distributionData = computed(() => ({
    labels: tagSales.value.map((tag) => tag.label),
    datasets: [{
        data: tagSales.value.map((tag) => tag.quantity),
        backgroundColor: tagSales.value.map((tag) => tag.color),
        borderColor: '#ffffff',
        borderWidth: 4,
        hoverOffset: 3
    }]
}));

const distributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
        legend: {
            position: 'bottom' as const,
            labels: { color: '#52667f', usePointStyle: true, pointStyle: 'circle', padding: 18, font: { family: 'Figtree', size: 12, weight: 600 } }
        },
        tooltip: {
            backgroundColor: '#172b4d',
            titleFont: { family: 'Figtree', weight: 700 },
            bodyFont: { family: 'Figtree' },
            padding: 11,
            cornerRadius: 9,
            displayColors: true
        }
    }
};

const balanceData = computed(() => ({
    labels: balanceSeries.value.map((point) => formatShortDate(point.date)),
    datasets: [{
        label: 'Saldo acumulado',
        data: balanceSeries.value.map((point) => point.value),
        borderColor: '#1f46ee',
        backgroundColor: 'rgba(31, 70, 238, 0.1)',
        pointBackgroundColor: '#1f46ee',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 5,
        borderWidth: 2.5,
        tension: 0.38,
        fill: true
    }]
}));

const balanceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    scales: {
        x: { grid: { display: false }, border: { display: false }, ticks: { color: '#64748b', font: { family: 'Figtree', size: 11 } } },
        y: {
            beginAtZero: true,
            ticks: {
                color: '#64748b',
                callback: (value: string | number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(Number(value)),
                font: { family: 'Figtree', size: 11 }
            },
            grid: { color: '#edf1f6' },
            border: { display: false }
        }
    },
    plugins: {
        legend: {
            position: 'bottom' as const,
            align: 'start' as const,
            labels: { color: '#52667f', usePointStyle: true, pointStyle: 'circle', padding: 18, font: { family: 'Figtree', size: 12, weight: 600 } }
        },
        tooltip: {
            backgroundColor: '#172b4d',
            titleFont: { family: 'Figtree', weight: 700 },
            bodyFont: { family: 'Figtree' },
            padding: 11,
            cornerRadius: 9
        }
    }
};

const hasTagSales = computed(() => tagSales.value.some((tag) => tag.quantity > 0));
const hasBalance = computed(() => balanceSeries.value.length > 0);
</script>

<template>
    <section class="management-analytics-grid" aria-label="Análises visuais">
        <article class="management-chart-card">
            <header>
                <span><ChartPie :size="20" :stroke-width="1.9" /></span>
                <div>
                    <h2>Etiquetas vendidas</h2>
                    <p>Quantidade vendida por tipo de etiqueta no período.</p>
                </div>
            </header>
            <Skeleton v-if="loading" height="18rem" class="rounded-xl!" />
            <div v-else-if="hasTagSales" class="management-chart-canvas management-chart-canvas--doughnut">
                <Chart class="management-chart" type="doughnut" :height="272" :data="distributionData" :options="distributionOptions" />
            </div>
            <div v-else class="management-chart-empty">
                <ChartPie :size="28" :stroke-width="1.7" />
                <strong>Sem etiquetas vendidas</strong>
                <p>As vendas por etiqueta aparecerão quando houver pedidos no período.</p>
            </div>
        </article>

        <article class="management-chart-card management-chart-card--wide">
            <header>
                <span><Activity :size="20" :stroke-width="1.9" /></span>
                <div>
                    <h2>Evolução do saldo</h2>
                    <p>Saldo acumulado a partir dos pedidos aprovados no período.</p>
                </div>
            </header>
            <Skeleton v-if="loading" height="18rem" class="rounded-xl!" />
            <div v-else-if="hasBalance" class="management-chart-canvas">
                <Chart class="management-chart" type="line" :height="272" :data="balanceData" :options="balanceOptions" />
            </div>
            <div v-else class="management-chart-empty">
                <Activity :size="28" :stroke-width="1.7" />
                <strong>Sem saldo no período</strong>
                <p>O saldo será exibido quando houver pedidos aprovados no período.</p>
            </div>
        </article>
    </section>
</template>
