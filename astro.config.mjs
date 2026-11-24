// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Endereço público do site.
 *
 * Hoje (GitHub Pages):  https://danillitos.github.io/Danillo_Garcez_Ventocais/
 *   - BASE_PATH precisa ser igual ao nome do repositório no GitHub.
 *
 * Com domínio próprio (ex.: ventocais.com.br):
 *   - SITE_URL = 'https://ventocais.com.br'
 *   - BASE_PATH = '/'
 */
const SITE_URL = process.env.SITE_URL ?? 'https://danillitos.github.io';
const BASE_PATH = process.env.BASE_PATH ?? '/Danillo_Garcez_Ventocais';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  integrations: [sitemap()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
});
