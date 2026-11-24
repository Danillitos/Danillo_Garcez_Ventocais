/**
 * Agenda completa em formato de calendário: dá para "assinar" no celular
 * e receber os shows novos automaticamente.
 */
import type { APIRoute } from 'astro';
import { calendarioICS, eventoICS } from '../lib/agenda';
import { obterShows } from '../lib/conteudo';
import { site } from '../lib/site';
import { urlAbsoluta } from '../lib/url';

export const GET: APIRoute = async ({ site: endereco }) => {
  const { proximos, realizados } = await obterShows();
  const pagina = urlAbsoluta('/agenda/', endereco);
  const eventos = [...proximos, ...realizados].map((s) => eventoICS(s.id, s.data, `${pagina}#show-${s.id}`));
  return new Response(calendarioICS(`Shows · ${site.nome}`, eventos), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
};
