/**
 * O disco do topo da página inicial inclina seguindo o mouse e "pulsa"
 * com a música quando a prévia toca.
 */
import { aoNivel } from './audio';

let parar: (() => void) | undefined;

export function pararDisco(): void {
  parar?.();
  parar = undefined;
}

export function iniciarDisco(): void {
  pararDisco();
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const disco = hero?.querySelector<HTMLElement>('[data-disco]');
  if (!hero || !disco) return;

  const reduzirMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ponteiroFino = matchMedia('(pointer: fine)').matches;

  const aoMover = (e: PointerEvent) => {
    const caixa = hero.getBoundingClientRect();
    const px = (e.clientX - caixa.left) / caixa.width - 0.5;
    const py = (e.clientY - caixa.top) / caixa.height - 0.5;
    disco.style.setProperty('--rx', `${(-py * 12).toFixed(2)}deg`);
    disco.style.setProperty('--ry', `${(px * 16).toFixed(2)}deg`);
    disco.style.setProperty('--tx', `${(px * 26).toFixed(1)}px`);
    disco.style.setProperty('--ty', `${(py * 26).toFixed(1)}px`);
  };
  const aoSair = () => {
    for (const prop of ['--rx', '--ry', '--tx', '--ty']) disco.style.removeProperty(prop);
  };

  if (!reduzirMovimento && ponteiroFino) {
    hero.addEventListener('pointermove', aoMover);
    hero.addEventListener('pointerleave', aoSair);
  }

  const cancelar = aoNivel((nivel) => disco.style.setProperty('--nivel', nivel.toFixed(3)));

  parar = () => {
    cancelar();
    hero.removeEventListener('pointermove', aoMover);
    hero.removeEventListener('pointerleave', aoSair);
  };
}
