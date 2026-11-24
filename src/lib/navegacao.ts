/** Páginas do menu principal, na ordem em que aparecem. */
export const paginas = [
  { href: '/', rotulo: 'Início' },
  { href: '/sobre/', rotulo: 'Sobre' },
  { href: '/musica/', rotulo: 'Música' },
  { href: '/agenda/', rotulo: 'Agenda' },
  { href: '/videos/', rotulo: 'Vídeos' },
  { href: '/imprensa/', rotulo: 'Imprensa' },
  { href: '/contato/', rotulo: 'Contato' },
] as const;

export const numero = (i: number) => String(i + 1).padStart(2, '0');
