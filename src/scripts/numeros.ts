/** Números que "contam" do zero até o valor quando aparecem na tela. */
export function iniciarNumeros(): void {
  const elementos = document.querySelectorAll<HTMLElement>('[data-contar]');
  if (!elementos.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observador = new IntersectionObserver(
    (entradas, obs) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        obs.unobserve(entrada.target);
        animar(entrada.target as HTMLElement);
      }
    },
    { threshold: 0.6 },
  );

  elementos.forEach((el) => {
    el.textContent = '0';
    observador.observe(el);
  });
}

function animar(el: HTMLElement): void {
  const final = Number(el.dataset.contar ?? 0);
  const duracao = 1600;
  const inicio = performance.now();
  const passo = (agora: number) => {
    const p = Math.min(1, (agora - inicio) / duracao);
    const suave = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(final * suave).toLocaleString('pt-BR');
    if (p < 1) requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
}
