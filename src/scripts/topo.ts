/**
 * Cabeçalho: ganha fundo ao rolar e se esconde ao descer (volta ao subir).
 */
let ultimoY = 0;
let agendado = false;
let ligado = false;

function atualizar(): void {
  agendado = false;
  const topo = document.querySelector<HTMLElement>('[data-topo]');
  if (!topo) return;

  const y = window.scrollY;
  topo.toggleAttribute('data-rolou', y > 24);

  const menuAberto = document.querySelector('dialog[data-menu][open]');
  if (!menuAberto && y > 360 && y > ultimoY + 6) {
    topo.setAttribute('data-escondido', '');
  } else if (y < ultimoY - 6 || y <= 360) {
    topo.removeAttribute('data-escondido');
  }
  ultimoY = y;
}

export function iniciarTopo(): void {
  ultimoY = window.scrollY;
  atualizar();
  if (ligado) return;
  ligado = true;

  window.addEventListener(
    'scroll',
    () => {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(atualizar);
    },
    { passive: true },
  );

  // Quem navega pelo teclado sempre vê o cabeçalho.
  document.addEventListener('focusin', (evento) => {
    const alvo = evento.target as Element | null;
    if (alvo?.closest?.('[data-topo]')) {
      document.querySelector('[data-topo]')?.removeAttribute('data-escondido');
    }
  });
}
