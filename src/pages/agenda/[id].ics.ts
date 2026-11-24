/**
 * Um arquivo .ics por show (botão "Salvar na agenda → Apple / Outlook").
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { calendarioICS, eventoICS } from '../../lib/agenda';
import { visivel, type Show } from '../../lib/conteudo';
import { urlAbsoluta } from '../../lib/url';

export const getStaticPaths = (async () => {
  const shows = (await getCollection('shows')).filter(visivel).filter((s) => s.data.data);
  return shows.map((show) => ({ params: { id: show.id }, props: { show } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props, site }) => {
  const { show } = props as { show: Show };
  const pagina = `${urlAbsoluta('/agenda/', site)}#show-${show.id}`;
  const corpo = calendarioICS(show.data.evento, [eventoICS(show.id, show.data, pagina)]);
  return new Response(corpo, {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
};
