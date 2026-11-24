/**
 * Players externos (Spotify, YouTube) só carregam quando a pessoa clica:
 * o site fica mais leve e sem rastreadores de terceiros até lá.
 */
document.addEventListener('click', (evento) => {
  const botao = (evento.target as Element | null)?.closest<HTMLButtonElement>('[data-embed]');
  if (!botao?.dataset.embed) return;

  const alvo = botao.closest<HTMLElement>('[data-embed-alvo]') ?? botao.parentElement;
  if (!alvo) return;

  const iframe = document.createElement('iframe');
  iframe.src = botao.dataset.embed;
  iframe.title = botao.dataset.embedTitulo ?? 'Player';
  iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
  iframe.allowFullscreen = true;
  if (botao.dataset.embedAltura) {
    iframe.height = botao.dataset.embedAltura;
    iframe.style.cssText = 'width:100%;border:0;border-radius:12px;';
  }
  alvo.replaceChildren(iframe);
});
