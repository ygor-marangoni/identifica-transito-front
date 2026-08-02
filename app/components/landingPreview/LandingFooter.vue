<script setup lang="ts">
defineProps<{
    currentYear: number;
}>();
</script>

<template>
    <footer class="final-footer">
        <div class="section-inner final-footer__inner max-w-310">
            <div class="final-footer__brand">
                <img src="/images/logo-vertical.svg" alt="Identifica Trânsito">
                <p>Mais contexto, empatia e segurança para todos que compartilham o trânsito.</p>
            </div>

            <nav class="final-footer__group" aria-label="Navegação do rodapé">
                <span>Navegação</span>
                <a href="#topo">Início</a>
                <a href="#projeto">O Projeto</a>
                <a href="#etiquetas">As Etiquetas</a>
                <a href="#beneficios">Benefícios</a>
                <a href="#preco">Preço</a>
                <a href="#como-funciona">Como funciona</a>
                <a href="#faq">FAQ</a>
            </nav>

            <nav class="final-footer__group" aria-label="Conta">
                <span>Conta</span>
                <a href="/auth/login">Cadastre-se</a>
                <a href="/auth/login">Login</a>
            </nav>

            <div class="final-footer__contact">
                <span>E-mail para contato</span>
                <form action="mailto:identificatransito@gmail.com" method="get" class="final-footer__contact-form">
                    <label class="sr-only" for="footer-contact-email">Seu e-mail</label>
                    <input id="footer-contact-email" name="body" type="email" placeholder="Seu e-mail" autocomplete="email">
                    <button type="submit">Enviar</button>
                </form>

                <span class="final-footer__social-title">Sociais</span>
                <div class="final-footer__socials" aria-label="Redes sociais">
                    <a href="mailto:identificatransito@gmail.com" aria-label="E-mail"><i class="pi pi-envelope" aria-hidden="true"></i></a>
                    <a href="https://wa.me/5511984971689" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i class="pi pi-whatsapp" aria-hidden="true"></i></a>
                    <a href="https://www.instagram.com/identificatransito/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="pi pi-instagram" aria-hidden="true"></i></a>
                </div>
            </div>

            <div class="final-footer__bottom">
                <p>© {{ currentYear }} Identifica Trânsito. Todos os direitos reservados.</p>
                <a href="/politica-de-privacidade">Política de privacidade</a>
            </div>
        </div>
    </footer>
</template>
