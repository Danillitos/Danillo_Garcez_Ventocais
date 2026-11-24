/**
 * Esquemas do conteúdo do site.
 *
 * Todo o conteúdo mora em /data/*.json. Se algum campo estiver no formato
 * errado, o `npm run dev` / `npm run build` avisa exatamente onde.
 */
import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

const dataISO = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato AAAA-MM-DD (ex.: 2026-12-10)');

/** Campos de controle que qualquer item pode ter. */
const controle = {
  /** true = aparece só no modo de edição (npm run dev) e some do site publicado. */
  rascunho: z.boolean().default(false),
  /** Lembrete do que falta confirmar. Aparece só no modo de edição. */
  pendente: z.string().optional(),
};

const shows = defineCollection({
  loader: file('data/shows.json'),
  schema: z.object({
    data: dataISO.nullable(),
    /** Texto exibido quando ainda não há data exata (ex.: "Jan/2027"). */
    dataTexto: z.string().optional(),
    hora: z.string().regex(/^\d{2}:\d{2}$/, 'Use o formato HH:MM (ex.: 21:00)').optional(),
    evento: z.string(),
    turne: z.string().optional(),
    local: z.object({
      nome: z.string().optional(),
      endereco: z.string().optional(),
      bairro: z.string().optional(),
      cidade: z.string(),
      uf: z.string().length(2, 'Use a sigla do estado (ex.: SE)'),
    }),
    lineup: z.array(z.string()).default([]),
    formato: z.string().optional(),
    preco: z.number().optional(),
    precoTexto: z.string().optional(),
    ingressos: z.string().optional(),
    destaque: z.string().optional(),
    notas: z.string().optional(),
    /** Caminho dentro de src/assets (ex.: "cartazes/2024-01-12-estreia.jpg"). */
    cartaz: z.string().optional(),
    status: z.enum(['confirmado', 'adiado', 'cancelado']).default('confirmado'),
    ...controle,
  }),
});

const links = z
  .object({
    /** Link único com todas as plataformas (ex.: https://ditto.fm/...). Vira o botão principal. */
    smartlink: z.string().optional(),
    spotify: z.string().optional(),
    appleMusic: z.string().optional(),
    deezer: z.string().optional(),
    youtube: z.string().optional(),
    youtubeMusic: z.string().optional(),
    amazonMusic: z.string().optional(),
    tidal: z.string().optional(),
    outro: z.string().optional(),
  })
  .default({});

const lancamentos = defineCollection({
  loader: file('data/lancamentos.json'),
  schema: z.object({
    titulo: z.string(),
    tipo: z.enum(['Single', 'EP', 'Álbum', 'Live session', 'Inédita']),
    data: dataISO.nullable(),
    artista: z.string().optional(),
    duracao: z.string().regex(/^\d{1,2}:\d{2}$/, 'Use o formato M:SS (ex.: 3:34)').optional(),
    isrc: z.string().optional(),
    capa: z.string().optional(),
    /** Cor de destaque da página do lançamento (ex.: "#8aa4ff"). */
    cor: z.string().optional(),
    resumo: z.string(),
    texto: z.array(z.string()).default([]),
    /** Uma estrofe por item; use \n para quebrar linha. */
    letra: z.array(z.string()).default([]),
    /** Créditos. `link` (opcional) transforma o nome em link, ex.: Instagram de quem fez a capa. */
    ficha: z
      .array(z.object({ funcao: z.string(), nome: z.string(), link: z.string().optional() }))
      .default([]),
    faixas: z.array(z.object({ titulo: z.string(), duracao: z.string().optional() })).default([]),
    referencias: z.array(z.string()).default([]),
    links,
    /** Caminho dentro de /public (ex.: "audio/minha-previa.mp3"). */
    previa: z.string().optional(),
    destaque: z.boolean().default(false),
    ...controle,
  }),
});

const imprensa = defineCollection({
  loader: file('data/imprensa.json'),
  schema: z.object({
    veiculo: z.string(),
    tipo: z.enum(['Matéria', 'Resenha', 'Blog', 'Agenda', 'Rádio', 'Vídeo', 'Entrevista']).default('Matéria'),
    autor: z.string().optional(),
    titulo: z.string().optional(),
    resumo: z.string().optional(),
    data: dataISO.optional(),
    link: z.string().optional(),
    ...controle,
  }),
});

const citacoes = defineCollection({
  loader: file('data/citacoes.json'),
  schema: z.object({
    texto: z.string(),
    autor: z.string(),
    fonte: z.string().optional(),
    link: z.string().optional(),
    ...controle,
  }),
});

const playlists = defineCollection({
  loader: file('data/playlists.json'),
  schema: z.object({
    nome: z.string(),
    curador: z.string().optional(),
    faixa: z.string().optional(),
    nota: z.string().optional(),
    link: z.string().optional(),
    ...controle,
  }),
});

const integrantes = defineCollection({
  loader: file('data/integrantes.json'),
  schema: z.object({
    nome: z.string(),
    nomeCompleto: z.string().optional(),
    funcao: z.string(),
    foto: z.string().optional(),
    instagram: z.string().optional(),
    ordem: z.number().default(99),
    ...controle,
  }),
});

const equipe = defineCollection({
  loader: file('data/equipe.json'),
  schema: z.object({
    nome: z.string(),
    papel: z.string(),
    detalhes: z.string().optional(),
    link: z.string().optional(),
    ...controle,
  }),
});

const marcos = defineCollection({
  loader: file('data/marcos.json'),
  schema: z.object({
    era: z.enum(['origami', 'ventocais']).default('ventocais'),
    data: z
      .string()
      .regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, 'Use AAAA, AAAA-MM ou AAAA-MM-DD')
      .optional(),
    dataTexto: z.string().optional(),
    titulo: z.string(),
    texto: z.string().optional(),
    link: z.string().optional(),
    ...controle,
  }),
});

const curiosidades = defineCollection({
  loader: file('data/curiosidades.json'),
  schema: z.object({
    tag: z.string().optional(),
    titulo: z.string(),
    texto: z.string(),
    ...controle,
  }),
});

const videos = defineCollection({
  loader: file('data/videos.json'),
  schema: z.object({
    titulo: z.string(),
    tipo: z.string().default('Vídeo'),
    data: dataISO.nullable().optional(),
    /** O código do vídeo: em youtube.com/watch?v=ABC123, é "ABC123". */
    youtubeId: z.string().optional(),
    link: z.string().optional(),
    descricao: z.string().optional(),
    capa: z.string().optional(),
    destaque: z.boolean().default(false),
    ...controle,
  }),
});

export const collections = {
  shows,
  lancamentos,
  imprensa,
  citacoes,
  playlists,
  integrantes,
  equipe,
  marcos,
  curiosidades,
  videos,
};
