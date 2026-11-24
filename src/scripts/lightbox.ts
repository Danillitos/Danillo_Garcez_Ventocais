/**
 * Visualizador de imagens. Qualquer elemento com data-lightbox="grupo" e
 * data-src="..." abre aqui; setas (ou arrastar no celular) passam entre as
 * imagens do mesmo grupo.
 */
let grupo: HTMLElement[] = [];
let indice = 0;
let toqueInicioX: number | undefined;

const dialogo = () => document.querySelector<HTMLDialogElement>('[data-lightbox-dialogo]');

function mostrar(): void {
  const d = dialogo();
  const item = grupo[indice];
  if (!d || !item) return;
  const img = d.querySelector<HTMLImageElement>('[data-lightbox-img]');
  const legenda = d.querySelector<HTMLElement>('[data-lightbox-legenda]');
  const contador = d.querySelector<HTMLElement>('[data-lightbox-contador]');
  if (img) {
    img.src = item.dataset.src ?? '';
    img.alt = item.dataset.alt ?? item.dataset.legenda ?? '';
  }
  if (legenda) legenda.textContent = item.dataset.legenda ?? '';
  if (contador) contador.textContent = grupo.length > 1 ? `${indice + 1} / ${grupo.length}` : '';
  d.querySelectorAll<HTMLElement>('[data-lightbox-ant], [data-lightbox-prox]').forEach((b) => {
    b.hidden = grupo.length < 2;
  });
}

function andar(passo: number): void {
  if (grupo.length < 2) return;
  indice = (indice + passo + grupo.length) % grupo.length;
  mostrar();
}

document.addEventListener('click', (evento) => {
  const alvo = evento.target as Element | null;
  if (!alvo) return;

  const gatilho = alvo.closest<HTMLElement>('[data-lightbox]');
  if (gatilho) {
    const nome = gatilho.dataset.lightbox ?? '';
    grupo = [...document.querySelectorAll<HTMLElement>(`[data-lightbox="${nome}"]`)].filter(
      (el) => !el.closest('[hidden]'),
    );
    indice = Math.max(0, grupo.indexOf(gatilho));
    mostrar();
    dialogo()?.showModal();
    return;
  }

  const d = dialogo();
  if (!d?.open) return;
  if (alvo.closest('[data-lightbox-fechar]')) d.close();
  else if (alvo.closest('[data-lightbox-ant]')) andar(-1);
  else if (alvo.closest('[data-lightbox-prox]')) andar(1);
  else if (!alvo.closest('img, figcaption')) d.close();
});

document.addEventListener('keydown', (evento) => {
  if (!dialogo()?.open) return;
  if (evento.key === 'ArrowRight') andar(1);
  if (evento.key === 'ArrowLeft') andar(-1);
});

document.addEventListener(
  'touchstart',
  (evento) => {
    if (dialogo()?.open) toqueInicioX = evento.touches[0]?.clientX;
  },
  { passive: true },
);

document.addEventListener('touchend', (evento) => {
  if (toqueInicioX === undefined || !dialogo()?.open) return;
  const dx = (evento.changedTouches[0]?.clientX ?? toqueInicioX) - toqueInicioX;
  if (Math.abs(dx) > 60) andar(dx < 0 ? 1 : -1);
  toqueInicioX = undefined;
});
