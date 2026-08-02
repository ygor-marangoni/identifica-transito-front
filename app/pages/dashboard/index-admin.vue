<script setup>
    import HeroSection from '~/components/dashboard/HeroSection.vue';

    definePageMeta({
        layout: 'dashboard',
        title: 'Dashboard Admin - Identifica Trânsito',
        meta: []
    });
</script>

<template>
    <main class="admin-page space-y-6 md:space-y-7">
        <HeroSection
            title="Dashboard Administrativo"
            subtitle="Acompanhe os indicadores e as movimentações mais relevantes da operação."
            greeting="Visão geral"
            :showButton="false"
        />

        <section class="grid grid-cols-12 gap-6">
            <DashboardStatsWidget />

            <div class="col-span-12 space-y-6 xl:col-span-6">
                <DashboardRecentSalesWidget />
                <DashboardBestSellingWidget />
            </div>
            <div class="col-span-12 space-y-6 xl:col-span-6">
                <DashboardRevenueStreamWidget />
                <DashboardNotificationsWidget />
            </div>
        </section>
    </main>
</template>
