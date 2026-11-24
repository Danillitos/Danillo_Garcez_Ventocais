import type { APIRoute } from 'astro';
import { urlAbsoluta } from '../lib/url';

export const GET: APIRoute = ({ site }) => {
  const sitemap = urlAbsoluta('/sitemap-index.xml', site);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
