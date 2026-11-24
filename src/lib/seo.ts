/**
 * Dados estruturados (JSON-LD, schema.org) para o Google entender a banda,
 * os shows e os lançamentos.
 */
import type { CollectionEntry } from 'astro:content';
import type { Lancamento, Show } from './conteudo';
import { duracaoISO, inicioISO } from './datas';
import { site } from './site';

type Objeto = Record<string, unknown>;

const semVazios = (obj: Objeto): Objeto =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)),
  );

export function idBanda(siteUrl: string): string {
  return `${siteUrl}#banda`;
}

export function musicGroup(
  siteUrl: string,
  imagem: string,
  integrantes: CollectionEntry<'integrantes'>[],
): Objeto {
  const mesmosQue = [
    ...site.redes.map((r) => r.url),
    ...site.plataformas.map((p) => p.url),
  ].filter(Boolean);

  return semVazios({
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    '@id': idBanda(siteUrl),
    name: site.nome,
    alternateName: [site.nomeCurto],
    url: siteUrl,
    image: imagem,
    description: site.bioCurta,
    genre: site.generos,
    foundingDate: site.estreia.slice(0, 4),
    foundingLocation: {
      '@type': 'Place',
      name: `${site.cidade}, ${site.uf}, Brasil`,
    },
    location: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: site.cidade,
        addressRegion: site.uf,
        addressCountry: 'BR',
      },
    },
    member: integrantes.map((i) => ({
      '@type': 'OrganizationRole',
      member: { '@type': 'Person', name: i.data.nome },
      roleName: i.data.funcao,
    })),
    sameAs: mesmosQue,
  });
}

export function musicEvent(show: Show, siteUrl: string, paginaUrl: string, imagem: string): Objeto | undefined {
  const s = show.data;
  if (!s.data) return undefined;
  const status = {
    confirmado: 'https://schema.org/EventScheduled',
    adiado: 'https://schema.org/EventPostponed',
    cancelado: 'https://schema.org/EventCancelled',
  }[s.status];

  return semVazios({
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: s.evento.includes('Ventocais') ? s.evento : `${site.nome}: ${s.evento}`,
    startDate: inicioISO(s.data, s.hora),
    eventStatus: status,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url: `${paginaUrl}#show-${show.id}`,
    image: imagem,
    location: semVazios({
      '@type': 'Place',
      name: s.local.nome ?? s.local.cidade,
      address: semVazios({
        '@type': 'PostalAddress',
        streetAddress: s.local.endereco,
        addressLocality: s.local.cidade,
        addressRegion: s.local.uf,
        addressCountry: 'BR',
      }),
    }),
    performer: [
      { '@type': 'MusicGroup', '@id': idBanda(siteUrl), name: site.nome },
      ...s.lineup.map((nome) => ({ '@type': 'PerformingGroup', name: nome })),
    ],
    offers:
      s.preco !== undefined
        ? semVazios({
            '@type': 'Offer',
            price: s.preco.toFixed(2),
            priceCurrency: 'BRL',
            url: s.ingressos ?? `${paginaUrl}#show-${show.id}`,
            availability: 'https://schema.org/InStock',
          })
        : undefined,
  });
}

export function musicRelease(lanc: Lancamento, siteUrl: string, paginaUrl: string, imagem?: string): Objeto {
  const l = lanc.data;
  const ehAlbum = l.tipo === 'EP' || l.tipo === 'Álbum';
  const links = Object.values(l.links).filter((v): v is string => Boolean(v));

  return semVazios({
    '@context': 'https://schema.org',
    '@type': ehAlbum ? 'MusicAlbum' : 'MusicRecording',
    name: l.titulo,
    url: paginaUrl,
    image: imagem,
    datePublished: l.data ?? undefined,
    duration: l.duracao ? duracaoISO(l.duracao) : undefined,
    isrcCode: l.isrc,
    albumReleaseType: l.tipo === 'EP' ? 'https://schema.org/EPRelease' : undefined,
    numTracks: ehAlbum && l.faixas.length ? l.faixas.length : undefined,
    byArtist: { '@type': 'MusicGroup', '@id': idBanda(siteUrl), name: l.artista ?? site.nome },
    sameAs: links,
  });
}
