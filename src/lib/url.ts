/**
 * Links internos que respeitam o endereço-base do site.
 *
 * No GitHub Pages o site fica em /Danillo_Garcez_Ventocais/, então um link
 * "/agenda/" precisa virar "/Danillo_Garcez_Ventocais/agenda/". Use sempre
 * url('/agenda/') nos componentes, nunca o caminho direto.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

export function url(caminho = '/'): string {
  if (/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(caminho)) return caminho;
  const [semHash = '', hash] = caminho.split('#');
  let p = semHash.startsWith('/') ? semHash : `/${semHash}`;
  // Páginas terminam com "/"; arquivos (com extensão) não.
  if (!/\.[a-z0-9]+$/i.test(p) && !p.endsWith('/')) p += '/';
  return `${BASE}${p}${hash !== undefined ? `#${hash}` : ''}`;
}

export function urlAbsoluta(caminho: string, site: URL | undefined): string {
  const relativo = url(caminho);
  return site ? new URL(relativo, site).toString() : relativo;
}

/** O link aponta para a página atual (ou para uma "filha" dela)? */
export function ehAtual(caminhoAtual: string, href: string): boolean {
  const limpa = (s: string) => s.replace(/\/+$/, '') || '/';
  const atual = limpa(caminhoAtual);
  const alvo = limpa(url(href));
  if (alvo === limpa(url('/'))) return atual === alvo;
  return atual === alvo || atual.startsWith(`${alvo}/`);
}
