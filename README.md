# Danillo Garcez & Ventocais — site oficial

Site da banda: lançamentos com prévia em áudio, agenda e portfólio de shows,
curiosidades, vídeos, kit de imprensa (EPK) e contato direto pelo WhatsApp.

Feito com [Astro](https://astro.build), gera um site estático publicado no
GitHub Pages. Todo o conteúdo fica em arquivos JSON na pasta `data/`: dá para
atualizar a agenda ou trocar um texto sem mexer no layout.

---

## Rodar no computador

```bash
npm install     # só na primeira vez
npm run dev     # modo de edição
```

Abra **http://localhost:4321/Danillo_Garcez_Ventocais/**. A página atualiza
sozinha quando você salva um arquivo.

No modo de edição aparecem coisas que **não vão para o site publicado**:

- selos amarelos ⚑ com o que falta confirmar (campo `pendente`);
- itens marcados como `"rascunho": true`, com a etiqueta RASCUNHO;
- um botão amarelo no canto, "N pendências nesta página", que leva de uma a uma.

Para ver exatamente como o site vai ficar publicado:

```bash
npm run build && npm run preview
```

---

## Onde editar cada coisa

| O quê | Arquivo |
| --- | --- |
| Bio curta e longa, gêneros, influências, contato, redes, números e um slogan opcional (`"slogan"`) | `data/site.json` |
| Shows (próximos e portfólio) | `data/shows.json` |
| Lançamentos: singles, EP, letra, ficha técnica, links, prévia | `data/lancamentos.json` |
| Curiosidades (o baralho "Você sabia?") | `data/curiosidades.json` |
| Formação | `data/integrantes.json` |
| Equipe e parceiros | `data/equipe.json` |
| Trajetória (linha do tempo) | `data/marcos.json` |
| Matérias e rádios | `data/imprensa.json` |
| Frases de imprensa/curadoria | `data/citacoes.json` |
| Playlists | `data/playlists.json` |
| Vídeos | `data/videos.json` |
| Logo do cabeçalho (cadeira + "VENTOCAIS", fundo transparente) | `src/assets/logo/ventocais-logo.png` |
| Fotos, capas, cartazes | `src/assets/` |
| Prévias de áudio, imagem de compartilhamento, ícones | `public/` |

Se algum campo estiver no formato errado, o `npm run dev` avisa qual arquivo e
qual campo.

### Regras gerais

- **Ordem:** a ordem no arquivo é a ordem no site. A exceção são shows e
  lançamentos, que são ordenados por data automaticamente.
- **Datas:** sempre `AAAA-MM-DD` (ex.: `2026-12-10`). Horas: `HH:MM` (ex.: `21:00`).
- **`"rascunho": true`:** o item só aparece no modo de edição. **Atenção:** o
  repositório é público, então o que está escrito nos arquivos pode ser lido no
  GitHub. Assunto confidencial (negociação, valores) não vai aqui.
- **`"pendente": "..."`:** um lembrete do que falta. Só aparece no modo de edição.
- **`id`:** cada item precisa de um `id` único, sem espaços e sem acento
  (ex.: `"2026-12-10-turne-onca-aracaju"`). Ele também vira endereço: o
  lançamento `rosa-afim` fica em `/musica/rosa-afim/`.

### Shows (`data/shows.json`)

- Data de hoje em diante → aparece em **Próximos shows**, com contagem
  regressiva e botões "Salvar na agenda" e "Ver no mapa".
- Data no passado → vai sozinho para o **portfólio**.
- Show futuro ainda sem data: `"data": null` + `"dataTexto": "Jan/2027"`.
- Show que já aconteceu mas sem data conhecida: `"data": null`, sem `dataTexto`.
- `preco`: número (`15`, `22.5`). Para textos como "Gratuito", use `precoTexto`.
- `ingressos`: link do Sympla (ou outro). Aparece o botão "Ingressos".
- `cartaz`: imagem em `src/assets/cartazes/`. Aparece no portfólio e abre grande.

### Lançamentos (`data/lancamentos.json`)

- `links.smartlink`: o link único com todas as plataformas (ex.: `https://ditto.fm/promessas-de-orfeu`).
  Vira o botão principal "Ouvir em todas as plataformas" e, no lançamento em destaque,
  o primeiro botão da página `/links/`.
- `links.spotify`: cole o link da faixa ou do álbum (`https://open.spotify.com/track/...`).
  Isso adiciona o botão "Spotify" e um player do Spotify que só carrega no clique.
  O mesmo vale para `appleMusic`, `deezer`, `youtube`, `youtubeMusic` etc.
- `previa`: arquivo de áudio em `public/` (ex.: `"audio/promessas-de-orfeu-previa.mp3"`).
  Enquanto toca, o vinil gira e as linhas do topo da página inicial dançam com a música.
- `letra`: uma estrofe por item. Use `\n` para quebrar linha.
- `cor`: cor de destaque da página do lançamento (ex.: `"#8aa4ff"`).
- `"destaque": true`: o lançamento que aparece na página inicial.

### Vídeos (`data/videos.json`)

- `youtubeId`: em `youtube.com/watch?v=ABC123`, o ID é `ABC123`. Sem ID, aparece
  a capa com "vídeo em breve".

### Imagens

- Coloque as fotos em `src/assets/fotos/`, as capas em `src/assets/capas/` e os
  cartazes em `src/assets/cartazes/`. Nos JSON, escreva o caminho a partir de
  `src/assets` (ex.: `"capas/rosa-afim.jpg"`).
- O site redimensiona e converte as imagens sozinho. Pode usar a foto original.
- A imagem que aparece ao compartilhar o link (WhatsApp, Instagram) é
  `public/og/og-padrao.jpg` (1200×630). As páginas de lançamento usam a capa.

---

## Publicar no GitHub Pages

1. Crie o repositório no GitHub com o nome **`Danillo_Garcez_Ventocais`**. Ele
   precisa bater com o `BASE_PATH` em `astro.config.mjs`.
2. No GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Faça push para a branch `main`. O workflow `.github/workflows/publicar.yml`
   gera e publica o site em
   **https://danillitos.github.io/Danillo_Garcez_Ventocais/** (em breve: ventocais.com.br).

O workflow também roda **todo dia às 6h** (horário de Aracaju) para tirar dos
"Próximos" os shows que já passaram. Dá para rodar na mão em **Actions →
Publicar no GitHub Pages → Run workflow**.

### Domínio próprio (ex.: ventocais.com.br)

1. Em `astro.config.mjs`: `SITE_URL = 'https://ventocais.com.br'` e `BASE_PATH = '/'`.
2. Crie `public/CNAME` contendo só `ventocais.com.br`.
3. No registro do domínio, aponte o DNS para o GitHub Pages e configure o
   domínio em **Settings → Pages → Custom domain**.

---

## Páginas

| Endereço | Conteúdo |
| --- | --- |
| `/` | Início: disco da capa + "vento" interativo, lançamento com prévia, próximos shows, curiosidades, a banda, citações |
| `/sobre/` | Bio, origem do nome, formação, trajetória, influências, curiosidades, equipe, fotos |
| `/musica/` e `/musica/<id>/` | Discografia e uma página por lançamento (letra, ficha técnica, prévia) |
| `/agenda/` | Próximos shows e portfólio com filtros e cartazes |
| `/videos/` | Live session e bastidores |
| `/imprensa/` | Kit de imprensa: bios para copiar, release, ficha, frases, matérias, fotos em alta, "Salvar como PDF" |
| `/contato/` | Formulário que monta a mensagem e abre o WhatsApp da banda |
| `/links/` | Página "link na bio" para o Instagram |
| `/agenda.ics` | Agenda completa para assinar no celular |

---

## Versões (Node e Astro)

O Astro está fixo na **7.4.1** porque o Node instalado aqui (22.22.2) é mais
antigo que o exigido pelas versões seguintes (≥ 22.23.4). No GitHub Actions o
build usa Node 24.

Para atualizar:

```bash
sudo dnf upgrade nodejs   # Fedora
npm install astro@latest
```

O `npm audit` aponta dois alertas moderados da 7.4.1. Nenhum se aplica a este
site: um envolve tags HTML montadas a partir de dados de visitantes, e o outro,
o adaptador de servidor Node, que o site não usa.

---

## Pendências

Do dossiê, mais o que apareceu montando o site. Todas estão marcadas no modo de edição.

- [x] **Formação:** quinteto (com aviso de formações reduzidas na Sobre).
- [x] **Fotos dos integrantes:** confirmadas.
- [x] **Links:** Spotify (Danillo Garcez e Ventocais), YouTube, live sessions e smartlinks.
- [x] **Links das matérias:** Disconecta, Divergent Beats, Mangue Jornalismo, Be Guimarães e o reel da Canastra Records (confirmar).
- [x] **E-mail:** ventocaisbanda@gmail.com (banda) e danillo.garcez@live.com.
- [ ] **Créditos das fotos.** (A capa de "Promessas de Orfeu" já está creditada: Rodrigowod.)
- [x] **Lançamentos:** capas, datas e smartlinks de "Tudo é Mar", "Sensação do Mundo" e do EP Rosa Afim ("Rosa Afim" + "Incendiar").
- [x] **Letras:** todas as músicas lançadas têm letra no site.
- [x] **Nome:** Vico Fontes (confirmado pelo cartaz).
- [x] **Datas:** todos os shows do portfólio têm data.
- [ ] **Turnê:** horários, preços e links de ingresso (Arapiraca: Pub Treze). Line-up das noites quando estiver certo.
- [x] **Prévia de áudio:** trecho de 1:39 a 2:09 de "Promessas de Orfeu".
- [x] **"Parar pra Ver":** saiu do site até o lançamento.
- [x] **Rider técnico:** página /rider/ e PDF (dados em data/rider.json).
- [ ] **Domínio próprio:** ventocais.com.br comprado; falta configurar o DNS no registro.br e trocar o endereço no astro.config.mjs.

---

## De onde veio o material

- Textos: *Dossiê para o site* e o Zine da banda.
- Fotos, polaroids e cartazes: *Portfólio Ventocais.pdf*.
- Capa: `VENTOCAIS_PROMESSAS-DE-ORFEU_CAPA-1X1`. O disco do topo foi recortado dela.
- Prévia: trecho do master de "Promessas de Orfeu" (320 kbps).
