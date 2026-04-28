<script setup lang="ts">
defineProps<{
    currentYear: number;
}>();
</script>

<template>
    <footer class="lp-footer">
        <div class="section-inner lp-footer__inner max-w-310">
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
                <a href="mailto:identificatransito@gmail.com" aria-label="Enviar e-mail para o suporte">
                    <i class="pi pi-envelope"></i>
                </a>
                <a href="https://wa.me/5511984971689" target="_blank" rel="noopener noreferrer" aria-label="Falar com o suporte no WhatsApp">
                    <i class="pi pi-whatsapp"></i>
                </a>
                <a href="https://www.instagram.com/identificatransito/" target="_blank" rel="noopener noreferrer" aria-label="Acessar Instagram do Identifica Trânsito">
                    <i class="pi pi-instagram"></i>
                </a>
            </div>

            <p class="lp-footer__copyright">© {{ currentYear }} Identifica Trânsito - Todos os direitos reservados</p>
        </div>
    </footer>
</template>