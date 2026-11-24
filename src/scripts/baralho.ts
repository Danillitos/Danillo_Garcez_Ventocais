/**
 * Baralho de curiosidades: clique no cartão de cima (ou arraste para o lado)
 * para passar; "Embaralhar" muda a ordem.
 */
export function iniciarBaralhos(): void {
  document.querySelectorAll<HTMLElement>('[data-baralho]').forEach((baralho) => {
    const pilha = baralho.querySelector<HTMLElement>('[data-baralho-pilha]');
    if (!pilha) return;

    let ordem = [...pilha.querySelectorAll<HTMLElement>('[data-carta]')];
    const aviso = baralho.querySelector<HTMLElement>('[data-baralho-aviso]');
    const reduzirMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ocupado = false;

    const aplicar = () => {
      ordem.forEach((carta, i) => {
        carta.style.setProperty('--i', String(i));
        carta.classList.toggle('carta--longe', i > 3);
        carta.classList.toggle('carta--topo', i === 0);
        if (i === 0) carta.removeAttribute('aria-hidden');
        else carta.setAttribute('aria-hidden', 'true');
      });
    };

    const anunciar = () => {
      const titulo = ordem[0]?.querySelector('h3')?.textContent;
      if (aviso && titulo) aviso.textContent = `Curiosidade: ${titulo}`;
    };

    const proxima = () => {
      const topo = ordem[0];
      if (ocupado || !topo || ordem.length < 2) return;
      ocupado = true;
      const terminar = () => {
        topo.classList.remove('carta--saindo');
        ordem = [...ordem.slice(1), topo];
        aplicar();
        anunciar();
        ocupado = false;
      };
      if (reduzirMovimento) {
        terminar();
        return;
      }
      topo.classList.add('carta--saindo');
      topo.addEventListener('animationend', terminar, { once: true });
    };

    const embaralhar = () => {
      for (let i = ordem.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ordem[i], ordem[j]] = [ordem[j]!, ordem[i]!];
      }
      aplicar();
      anunciar();
    };

    baralho.querySelector('[data-baralho-proxima]')?.addEventListener('click', proxima);
    baralho.querySelector('[data-baralho-embaralhar]')?.addEventListener('click', embaralhar);

    // Arrastar (ou só clicar) o cartão de cima.
    let inicioX = 0;
    let arrastando = false;
    let moveu = false;

    pilha.addEventListener('pointerdown', (e) => {
      const topo = ordem[0];
      if (!topo || ocupado || !topo.contains(e.target as Node)) return;
      arrastando = true;
      moveu = false;
      inicioX = e.clientX;
      topo.classList.add('carta--arrastando');
      topo.setPointerCapture(e.pointerId);
    });

    pilha.addEventListener('pointermove', (e) => {
      const topo = ordem[0];
      if (!arrastando || !topo) return;
      const dx = e.clientX - inicioX;
      if (Math.abs(dx) > 4) moveu = true;
      topo.style.transform = `translate(${dx}px, 0) rotate(${dx / 18}deg)`;
    });

    const soltar = (e: PointerEvent, cancelado = false) => {
      const topo = ordem[0];
      if (!arrastando || !topo) return;
      arrastando = false;
      topo.classList.remove('carta--arrastando');
      topo.style.transform = '';
      const dx = e.clientX - inicioX;
      if (!cancelado && (Math.abs(dx) > 90 || !moveu)) proxima();
    };

    pilha.addEventListener('pointerup', (e) => soltar(e));
    pilha.addEventListener('pointercancel', (e) => soltar(e, true));

    aplicar();
  });
}
