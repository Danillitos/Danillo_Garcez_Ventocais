/**
 * Encontra imagens de src/assets pelo caminho escrito nos JSON
 * (ex.: "capas/promessas-de-orfeu.jpg"), para o Astro otimizá-las.
 */
import type { ImageMetadata } from 'astro';

const arquivos = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/**/*.{jpg,jpeg,png,webp,avif,gif}',
  { eager: true },
);

export function imagem(caminho?: string | null): ImageMetadata | undefined {
  if (!caminho) return undefined;
  const limpo = caminho.replace(/^\/?(src\/)?(assets\/)?/, '');
  const modulo = arquivos[`/src/assets/${limpo}`];
  if (!modulo) {
    console.warn(`[imagens] Não encontrei "src/assets/${limpo}". Confira o nome do arquivo.`);
    return undefined;
  }
  return modulo.default;
}

/** Todas as imagens de uma pasta de src/assets, em ordem de nome. */
export function imagensDaPasta(pasta?: string | null): ImageMetadata[] {
  if (!pasta) return [];
  const prefixo = `/src/assets/${pasta.replace(/^\/?(src\/)?(assets\/)?/, '').replace(/\/+$/, '')}/`;
  return Object.keys(arquivos)
    .filter((chave) => chave.startsWith(prefixo) && !chave.slice(prefixo.length).includes('/'))
    .sort()
    .map((chave) => arquivos[chave]!.default);
}

/** Atalho para imagens que o código usa diretamente. */
export function imagemObrigatoria(caminho: string): ImageMetadata {
  const img = imagem(caminho);
  if (!img) throw new Error(`Imagem obrigatória ausente: src/assets/${caminho}`);
  return img;
}
