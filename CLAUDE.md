# Site Danillo Garcez & Ventocais

Site estático em Astro 7 publicado no GitHub Pages. Sem framework de UI: componentes `.astro`, CSS próprio e TypeScript puro nos scripts.

## Comandos

- `npm run dev`: modo de edição (mostra `rascunho` e `pendente`).
- `npm run build`: precisa terminar sem avisos.
- `npm run preview`: serve o `dist/`. No Astro 7, `dev` e `preview` rodam como processo de fundo; pare com `npx astro dev stop` / `npx astro preview stop`.

## Convenções

- **Português** em nomes de arquivos, variáveis, funções e classes CSS (BEM simplificado: `bloco__elemento--variacao`).
- **Conteúdo** só em `data/*.json`. Esquemas em `src/content.config.ts` (zod de `astro/zod`). `data/site.json` é validado em `src/lib/site.ts`.
- **Ordem:** `getCollection` devolve por id. `src/lib/conteudo.ts` restaura a ordem do arquivo. Sempre use as funções `obterX()` de lá.
- **Links internos:** sempre `url('/caminho/')` de `src/lib/url.ts`. O site roda sob o base `/Danillo_Garcez_Ventocais`.
- **Imagens:** `imagem('pasta/arquivo.jpg')` de `src/lib/imagens.ts` procura em `src/assets`. Use com `<Image>`/`getImage` do `astro:assets`.
- **Pendências:** `<Pendente texto rascunho />` só renderiza em dev. Itens com `rascunho: true` são filtrados no build por `visivel()`.
- **Scripts:** tudo entra por `src/scripts/principal.ts`. Por causa do `<ClientRouter />`, cada módulo expõe `iniciarX()` (chamado em `astro:page-load`). Quem tem animação, intervalo ou listener global também expõe `pararX()` (chamado em `astro:before-swap`). Cliques genéricos usam delegação no `document`.
- **Design:** tokens em `src/styles/global.css`: cores da capa de "Promessas de Orfeu", fontes Fraunces / Instrument Sans / Caveat, utilitários `.papel`, `.rasgado`, `.fita`, `.anotacao`. Respeitar `prefers-reduced-motion`.

## Restrições

- Node local é 22.22.2. Por isso o Astro está fixo em **7.4.1**: a 7.4.2+ recusa rodar com Node < 22.23.4.
- **Quem faz os commits é o usuário.** Não commitar nem dar push.
