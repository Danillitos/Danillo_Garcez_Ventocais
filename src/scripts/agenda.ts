/**
 * Agenda: contagem regressiva, filtros do portfólio e aviso nos shows que
 * já passaram (caso o site ainda não tenha sido reconstruído).
 */
let intervalo: number | undefined;

export function pararAgenda(): void {
  if (intervalo !== undefined) window.clearInterval(intervalo);
  intervalo = undefined;
}

export function iniciarAgenda(): void {
  pararAgenda();
  marcarShowsQueJaPassaram();
  iniciarContagens();
  iniciarFiltros();
}

/** "2026-12-10" (sem hora) conta como 20h em Aracaju. */
function instante(iso: string): number {
  return iso.length === 10 ? Date.parse(`${iso}T20:00:00-03:00`) : Date.parse(iso);
}

function marcarShowsQueJaPassaram(): void {
  const agora = Date.now();
  document.querySelectorAll<HTMLElement>('[data-show-inicio]').forEach((show) => {
    const inicio = show.dataset.showInicio;
    if (!inicio || agora < instante(inicio) + 6 * 3600e3) return;
    show.classList.add('ingresso--passou');
    show.querySelector<HTMLElement>('.ingresso__passou')?.removeAttribute('hidden');
  });
}

function iniciarContagens(): void {
  const contagens = [...document.querySelectorAll<HTMLElement>('[data-contagem]')];
  if (!contagens.length) return;

  const escrever = (el: HTMLElement, chave: string, valor: number) => {
    const alvo = el.querySelector(`[data-c="${chave}"]`);
    if (alvo) alvo.textContent = String(valor).padStart(2, '0');
  };

  const atualizar = () => {
    const agora = Date.now();
    for (const el of contagens) {
      const alvo = instante(el.dataset.contagem ?? '');
      const comHora = el.dataset.contagemComHora === 'sim';
      let resto = Math.max(0, alvo - agora);
      const dias = Math.floor(resto / 864e5);
      resto -= dias * 864e5;
      const horas = Math.floor(resto / 36e5);
      resto -= horas * 36e5;
      const minutos = Math.floor(resto / 6e4);
      resto -= minutos * 6e4;
      const segundos = Math.floor(resto / 1e3);

      escrever(el, 'dias', dias);
      escrever(el, 'horas', horas);
      escrever(el, 'min', minutos);
      escrever(el, 'seg', segundos);
      el.querySelectorAll<HTMLElement>('[data-c-hora]').forEach((parte) => {
        parte.hidden = !comHora;
      });
    }
  };

  atualizar();
  intervalo = window.setInterval(atualizar, 1000);
}

function iniciarFiltros(): void {
  const caixa = document.querySelector<HTMLElement>('[data-filtros]');
  const lista = document.querySelector<HTMLElement>('[data-portfolio]');
  if (!caixa || !lista) return;

  const estado: Record<string, string> = { ano: 'todos', cidade: 'todos' };
  const contagem = caixa.querySelector<HTMLElement>('[data-filtros-contagem]');
  const vazio = document.querySelector<HTMLElement>('[data-filtros-vazio]');

  const aplicar = () => {
    let visiveis = 0;
    lista.querySelectorAll<HTMLElement>('[data-filtro-ano]').forEach((item) => {
      const passa =
        (estado.ano === 'todos' || item.dataset.filtroAno === estado.ano) &&
        (estado.cidade === 'todos' || item.dataset.filtroCidade === estado.cidade);
      item.hidden = !passa;
      if (passa) {
        visiveis++;
        item.classList.add('visivel');
      }
    });
    if (contagem) contagem.textContent = `${visiveis} ${visiveis === 1 ? 'show' : 'shows'}`;
    if (vazio) vazio.hidden = visiveis > 0;
  };

  caixa.querySelectorAll<HTMLButtonElement>('[data-filtro]').forEach((botao) => {
    botao.addEventListener('click', () => {
      const tipo = botao.dataset.filtro ?? 'ano';
      estado[tipo] = botao.dataset.valor ?? 'todos';
      caixa.querySelectorAll<HTMLButtonElement>(`[data-filtro="${tipo}"]`).forEach((outro) => {
        outro.setAttribute('aria-pressed', String(outro === botao));
      });
      aplicar();
    });
  });
}
