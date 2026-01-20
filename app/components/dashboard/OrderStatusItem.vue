<script setup>
const props = defineProps({
    orderId: { type: String, required: true },
    title: { type: String, required: true },
    status: { type: String, required: true, validator: (value) => ['em-andamento', 'em-rota', 'entregue'].includes(value) }
});

const statusConfig = {
    'em-andamento': {
        label: 'Em andamento',
        color: 'bg-blue-500',
        textColor: 'text-blue-700',
        bgLight: 'bg-blue-50'
    },
    'em-rota': {
        label: 'Em rota de entrega',
        color: 'bg-orange-500',
        textColor: 'text-orange-700',
        bgLight: 'bg-orange-50'
    },
    'entregue': {
        label: 'Entregue',
        color: 'bg-green-500',
        textColor: 'text-green-700',
        bgLight: 'bg-green-50'
    }
};

const currentStatus = statusConfig[props.status];
</script>

<template>
    <div class="space-y-2">
        <div class="flex items-start justify-between gap-2">
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ props.title }}</p>
                <p class="text-xs text-gray-500">ID: {{ props.orderId }}</p>
            </div>
            <span :class="[currentStatus.textColor, currentStatus.bgLight]" class="px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap">
                {{ currentStatus.label }}
            </span>
        </div>
        <div class="h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div :class="currentStatus.color" class="h-full transition-all" :style="{ width: props.status === 'entregue' ? '100%' : props.status === 'em-rota' ? '66%' : '33%' }"></div>
        </div>
    </div>
</template>
