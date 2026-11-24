/** A linha da trajetória vai se preenchendo conforme a página rola. */
let ligado = false;
let agendado = false;

function atualizar(): void {
  agendado = false;
  const linha = document.querySelector<HTMLElement>('[data-linha-tempo]');
  if (!linha) return;
  const caixa = linha.getBoundingClientRect();
  const referencia = window.innerHeight * 0.6;
  const progresso = Math.min(1, Math.max(0, (referencia - caixa.top) / caixa.height));
  linha.style.setProperty('--progresso', progresso.toFixed(4));
}

export function iniciarLinhaDoTempo(): void {
  atualizar();
  if (ligado) return;
  ligado = true;
  const agendar = () => {
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(atualizar);
  };
  window.addEventListener('scroll', agendar, { passive: true });
  window.addEventListener('resize', agendar);
}
