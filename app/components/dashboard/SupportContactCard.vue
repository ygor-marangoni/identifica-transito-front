<script setup lang="ts">
interface ContactChannel {
    icon: string;
    title: string;
    description: string;
    contact: string;
    action: string;
    href: string;
}

defineProps<{
    channels: ContactChannel[];
}>();
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
            v-for="(channel, index) in channels"
            :key="index"
            class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md hover:border-it-primary transition-all duration-200"
        >
            <!-- Icon -->
            <div class="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                <i :class="[channel.icon, 'text-it-primary text-2xl']"></i>
            </div>

            <!-- Title and Description -->
            <h3 class="text-xl! font-bold text-gray-900 mb-2!">{{ channel.title }}</h3>
            <p class="text-md text-gray-600 mb-4 leading-relaxed">{{ channel.description }}</p>

            <!-- Contact Info -->
            <div class="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
                <p class="text-sm text-gray-500 mb-1">Entre em contato:</p>
                <p class="text-base font-semibold text-gray-900">{{ channel.contact }}</p>
            </div>

            <!-- Action Button -->
            <a
                :href="channel.href"
                target="_blank"
                rel="noopener noreferrer"
                :class="[
                    'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 w-full justify-center',
                    channel.contact === 'Disponível em breve'
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-it-primary text-white hover:bg-blue-600 hover:shadow-md'
                ]"
                :disabled="channel.contact === 'Disponível em breve'"
            >
                <i :class="[channel.icon]"></i>
                {{ channel.action }}
            </a>
        </div>
    </div>
</template>
