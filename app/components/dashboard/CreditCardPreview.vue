<script setup lang="ts">
interface Props {
    numero?: string;
    nome?: string;
    validade?: string;
    cvc?: string;
}

const props = withDefaults(defineProps<Props>(), {
    numero: '',
    nome: '',
    validade: '',
    cvc: ''
});
</script>

<template>
    <div class="w-[80%] xl:w-[65%] h-76 bg-red-100 rounded-xl relative text-white shadow-2xl transition-transform transform hover:scale-105">
        <img class="relative object-cover w-full h-full rounded-xl" src="https://i.imgur.com/kGkSg1v.png" alt="Cartão de Crédito">
        
        <div class="w-full px-8 absolute top-18">
            <div class="flex justify-between">
                <div>
                    <p class="font-light text-xs">
                        Nome
                    </p>
                    <p class="font-medium tracking-widest">
                        {{ nome || 'SEU NOME' }}
                    </p>
                </div>
                <img class="w-14 h-14" src="https://i.imgur.com/bbPHJVe.png" alt="Logo do Cartão"/>
            </div>
            <div class="pt-1">
                <p class="font-light text-xs">
                    Número do Cartão
                </p>
                <p class="font-medium tracking-more-wider">
                    {{ numero || '0000 0000 0000 0000' }}
                </p>
            </div>
            <div class="pt-6 pr-6">
                <div class="flex justify-between">
                    <div>
                        <p class="font-light text-xs">
                            Validade
                        </p>
                        <p class="font-medium tracking-wider text-sm">
                            {{ validade || 'MM/AA' }}
                        </p>
                    </div>
                    <div>
                        <p class="font-light text-xs">
                            CVV
                        </p>
                        <p class="font-bold tracking-more-wider text-sm">
                            {{ cvc || '•••' }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.tracking-more-wider {
    letter-spacing: 0.2em;
}
</style>
