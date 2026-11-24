/**
 * Ponto de entrada das interações do site.
 *
 * Como o site usa transições entre páginas (ClientRouter do Astro), o HTML
 * de cada página é trocado sem recarregar. Por isso cada módulo tem uma
 * função "iniciar" que roda a cada `astro:page-load` e, quando precisa,
 * uma função "parar" que limpa animações antes da troca (`astro:before-swap`).
 */
import { iniciarAgenda, pararAgenda } from './agenda';
import { pararAudio } from './audio';
import { iniciarBaralhos } from './baralho';
import { iniciarCompositor } from './compositor';
import './copiar';
import { iniciarDisco, pararDisco } from './disco';
import './embed';
import './lightbox';
import { iniciarLinhaDoTempo } from './linha-do-tempo';
import { iniciarMagneticos } from './magnetico';
import { fecharMenu, iniciarMenu } from './menu';
import { iniciarModoEdicao } from './modo-edicao';
import { iniciarNumeros } from './numeros';
import { iniciarPlayers } from './player';
import { iniciarRevelar } from './revelar';
import { iniciarTopo } from './topo';
import { iniciarVento, pararVento } from './vento';

const marcarJs = () => document.documentElement.classList.add('js');

document.addEventListener('astro:page-load', () => {
  marcarJs();
  iniciarTopo();
  iniciarMenu();
  iniciarRevelar();
  iniciarVento();
  iniciarDisco();
  iniciarPlayers();
  iniciarBaralhos();
  iniciarAgenda();
  iniciarNumeros();
  iniciarLinhaDoTempo();
  iniciarCompositor();
  iniciarMagneticos();
  iniciarModoEdicao();
});

document.addEventListener('astro:after-swap', marcarJs);
document.addEventListener('astro:before-preparation', fecharMenu);
document.addEventListener('astro:before-swap', () => {
  pararVento();
  pararDisco();
  pararAgenda();
  pararAudio();
});

/* Botões simples, tratados por delegação (funcionam em qualquer página). */
document.addEventListener('click', (evento) => {
  const alvo = evento.target as Element | null;
  if (alvo?.closest('[data-voltar-topo]')) {
    const suave = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: suave ? 'smooth' : 'auto' });
  }
  if (alvo?.closest('[data-imprimir]')) {
    window.print();
  }
});
