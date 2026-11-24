/** Faz os elementos com [data-revelar] aparecerem quando entram na tela. */
let observador: IntersectionObserver | undefined;

export function iniciarRevelar(): void {
  observador?.disconnect();
  const elementos = document.querySelectorAll<HTMLElement>('[data-revelar]:not(.visivel)');

  if (!('IntersectionObserver' in window)) {
    elementos.forEach((el) => el.classList.add('visivel'));
    return;
  }

  observador = new IntersectionObserver(
    (entradas, obs) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        entrada.target.classList.add('visivel');
        obs.unobserve(entrada.target);
      }
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.08 },
  );

  elementos.forEach((el) => observador?.observe(el));
}
