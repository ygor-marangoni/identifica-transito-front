<script setup lang="ts">
import { Mail, MessageCircle, MessagesSquare } from '@lucide/vue';

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

const channelIcons = {
    mail: Mail,
    whatsapp: MessageCircle,
    chat: MessagesSquare
};
</script>

<template>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        <div
            v-for="(channel, index) in channels"
            :key="index"
            class="flex min-h-full flex-col rounded-xl border border-slate-200 bg-white p-5 sm:p-6"
        >
            <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#eaf0ff] text-[#1f46ee]">
                <component :is="channelIcons[channel.icon as keyof typeof channelIcons]" :size="20" :stroke-width="1.9" aria-hidden="true" />
            </div>

            <h3 class="relative top-0.5 text-xl! font-semibold text-[#172b4d] mb-2!">{{ channel.title }}</h3>
            <p class="text-[0.9375rem] leading-6 text-slate-600 mb-3!">{{ channel.description }}</p>

            <div class="mb-4 rounded-lg border border-slate-200 bg-[#fafafa] px-3.5 py-3">
                <p class="mb-1 text-sm font-medium text-slate-500">Canal de atendimento</p>
                <p class="truncate text-base font-semibold text-[#172b4d] mb-0!">{{ channel.contact }}</p>
            </div>

            <a
                :href="channel.href"
                target="_blank"
                rel="noopener noreferrer"
                :class="[
                    'mt-auto inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-base font-semibold transition-colors',
                    channel.contact === 'Disponível em breve'
                        ? 'pointer-events-none bg-slate-100 text-slate-500'
                        : 'bg-[#1f46ee] text-white hover:bg-[#1739d4]'
                ]"
                :aria-disabled="channel.contact === 'Disponível em breve'"
            >
                <component :is="channelIcons[channel.icon as keyof typeof channelIcons]" :size="16" :stroke-width="2" aria-hidden="true" />
                {{ channel.action }}
            </a>
        </div>
    </div>
</template>
