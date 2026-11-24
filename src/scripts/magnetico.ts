/** Botões "magnéticos": acompanham levemente o mouse (só com mouse). */
export function iniciarMagneticos(): void {
  if (!matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll<HTMLElement>('[data-magnetico]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const caixa = el.getBoundingClientRect();
      const x = e.clientX - caixa.left - caixa.width / 2;
      const y = e.clientY - caixa.top - caixa.height / 2;
      el.style.transform = `translate(${(x * 0.18).toFixed(1)}px, ${(y * 0.3).toFixed(1)}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}
