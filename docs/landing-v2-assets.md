# Landing Page V2 — Manifesto de assets

Todos os caminhos abaixo pertencem exclusivamente ao namespace `public/landing-v2/`. A primeira implementação usa composições CSS controladas enquanto os itens pendentes não são entregues; por isso nenhum arquivo ausente é requisitado no navegador.

| ID | Caminho esperado | Uso | Status |
| --- | --- | --- | --- |
| V01 | `video/hero-desktop.webm` + `.mp4` | Hero desktop | pending |
| V01m | `video/hero-mobile.webm` + `.mp4` | Hero mobile vertical | pending |
| F01 | `posters/hero.webp` | Poster do hero | pending |
| V02 | `video/context-story.webm` + `.mp4` | Context Story | pending |
| V03 | `video/day.webm` + `.mp4` | Comparador de dia | pending |
| V04 | `video/night.webm` + `.mp4` | Comparador de noite | pending |
| F02 | `day-night/day.webp` | Poster dia | pending |
| F03 | `day-night/night.webp` | Poster noite | pending |
| V05 | `video/platform-demo.webm` + `.mp4` | Demonstração da plataforma | pending |
| V06 | `video/final-cta.webm` + `.mp4` | CTA final | pending |
| F04 | `posters/final-cta.webp` | Poster CTA final | pending |
| F05 | `images/kit.webp` | Kit/embalagem de etiquetas | pending |
| F06 | `images/label-macro.webp` | Macro da etiqueta no vidro | pending |
| F07 | `images/label-reflective.webp` | Etiqueta refletiva noturna | pending |

## Placeholders atuais

- Etiquetas: vetores CSS próprios no componente `LandingV2TagArt.vue`.
- Veículos, cenários e QR: composições CSS/HTML próprias nos componentes da V2.
- Vídeos: `LandingV2Video.vue` já aceita WebM, MP4, poster, preload e object-position. Mantenha `shouldLoad` desativado até o arquivo correspondente existir, evitando requisições 404 e layout shift durante a aprovação visual.

## Requisitos para entrega de mídia

- Preferir WebM com MP4 de fallback, sem áudio obrigatório para os loops automáticos.
- Desktop em 16:9 e hero mobile em 9:16.
- Incluir poster WebP/AVIF para cada vídeo e enquadramento seguro para texto sobreposto.
- Evitar informações pessoais, placas reais ou rostos identificáveis sem autorização.
