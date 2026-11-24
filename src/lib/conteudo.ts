/**
 * Funções de acesso ao conteúdo (data/*.json), já filtradas e ordenadas.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import arquivoCitacoes from '../../data/citacoes.json';
import arquivoCuriosidades from '../../data/curiosidades.json';
import arquivoEquipe from '../../data/equipe.json';
import arquivoImprensa from '../../data/imprensa.json';
import arquivoIntegrantes from '../../data/integrantes.json';
import arquivoLancamentos from '../../data/lancamentos.json';
import arquivoMarcos from '../../data/marcos.json';
import arquivoPlaylists from '../../data/playlists.json';
import arquivoShows from '../../data/shows.json';
import arquivoVideos from '../../data/videos.json';
import { hojeISO } from './datas';

/** Em `npm run dev` mostramos rascunhos e pendências; no site publicado, não. */
export const MODO_EDICAO = import.meta.env.DEV;

export function visivel<T extends { data: { rascunho?: boolean } }>(item: T): boolean {
  return MODO_EDICAO || !item.data.rascunho;
}

/**
 * O Astro devolve os itens em ordem alfabética do id. Aqui voltamos para a
 * ordem em que estão escritos no arquivo JSON, que é o que se espera ao editar.
 */
function naOrdemDoArquivo<T extends { id: string }>(itens: T[], arquivo: { id: string }[]): T[] {
  const posicao = new Map(arquivo.map((item, i) => [item.id, i]));
  return [...itens].sort((a, b) => (posicao.get(a.id) ?? 1e6) - (posicao.get(b.id) ?? 1e6));
}

export type Show = CollectionEntry<'shows'>;
export type Lancamento = CollectionEntry<'lancamentos'>;

const chaveShow = (s: Show) => `${s.data.data ?? ''}T${s.data.hora ?? '00:00'}`;

export async function obterShows() {
  const todos = naOrdemDoArquivo((await getCollection('shows')).filter(visivel), arquivoShows);
  const hoje = hojeISO();

  const proximos = todos
    .filter((s) => s.data.data && s.data.data >= hoje)
    .sort((a, b) => chaveShow(a).localeCompare(chaveShow(b)));
  // Sem data exata, mas com previsão (ex.: "Jan/2027"): vai pro fim dos próximos.
  const aDefinir = todos.filter((s) => !s.data.data && s.data.dataTexto);
  const realizados = todos
    .filter((s) => s.data.data && s.data.data < hoje)
    .sort((a, b) => chaveShow(b).localeCompare(chaveShow(a)));
  // Já aconteceram, mas falta a data.
  const semData = todos.filter((s) => !s.data.data && !s.data.dataTexto);

  return { todos, proximos, aDefinir, realizados, semData };
}

export async function obterLancamentos() {
  const todos = naOrdemDoArquivo((await getCollection('lancamentos')).filter(visivel), arquivoLancamentos);
  const lancados = todos
    .filter((l) => l.data.data)
    .sort((a, b) => (b.data.data ?? '').localeCompare(a.data.data ?? ''));
  const ineditas = todos.filter((l) => !l.data.data);
  const destaque = lancados.find((l) => l.data.destaque) ?? lancados[0];
  return { todos: [...lancados, ...ineditas], lancados, ineditas, destaque };
}

export async function obterImprensa() {
  const todos = naOrdemDoArquivo((await getCollection('imprensa')).filter(visivel), arquivoImprensa);
  return {
    textos: todos.filter((i) => i.data.tipo !== 'Rádio'),
    radios: todos.filter((i) => i.data.tipo === 'Rádio'),
  };
}

export async function obterCitacoes() {
  return naOrdemDoArquivo((await getCollection('citacoes')).filter(visivel), arquivoCitacoes);
}

export async function obterPlaylists() {
  return naOrdemDoArquivo((await getCollection('playlists')).filter(visivel), arquivoPlaylists);
}

export async function obterIntegrantes() {
  return naOrdemDoArquivo((await getCollection('integrantes')).filter(visivel), arquivoIntegrantes).sort(
    (a, b) => a.data.ordem - b.data.ordem,
  );
}

export async function obterEquipe() {
  return naOrdemDoArquivo((await getCollection('equipe')).filter(visivel), arquivoEquipe);
}

export async function obterMarcos() {
  const todos = naOrdemDoArquivo((await getCollection('marcos')).filter(visivel), arquivoMarcos);
  return {
    origami: todos.filter((m) => m.data.era === 'origami'),
    ventocais: todos
      .filter((m) => m.data.era === 'ventocais')
      .sort((a, b) => (a.data.data ?? '').localeCompare(b.data.data ?? '')),
  };
}

export async function obterCuriosidades() {
  return naOrdemDoArquivo((await getCollection('curiosidades')).filter(visivel), arquivoCuriosidades);
}

export async function obterVideos() {
  const todos = naOrdemDoArquivo((await getCollection('videos')).filter(visivel), arquivoVideos);
  return todos.sort((a, b) => (b.data.data ?? '').localeCompare(a.data.data ?? ''));
}
