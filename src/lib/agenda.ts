/**
 * Utilidades de agenda: links de mapa, Google Agenda e arquivos .ics.
 */
import type { Show } from './conteudo';
import { inicioISO, listaNatural, partes } from './datas';
import { site } from './site';

const DURACAO_HORAS = 3;

export function descricaoLocal(s: Show['data']): string {
  const { nome, cidade, uf } = s.local;
  return nome ? `${nome} · ${cidade} (${uf})` : `${cidade} (${uf})`;
}

export function enderecoCompleto(s: Show['data']): string {
  const { nome, endereco, bairro, cidade, uf } = s.local;
  return [nome, endereco, bairro, `${cidade} - ${uf}`].filter(Boolean).join(', ');
}

export function linkMapa(s: Show['data']): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoCompleto(s))}`;
}

export function tituloEvento(s: Show['data']): string {
  return s.evento.includes('Ventocais') ? s.evento : `${site.nome} · ${s.evento}`;
}

function descricaoEvento(s: Show['data'], pagina: string): string {
  const linhas = [
    s.lineup.length ? `Com ${listaNatural(s.lineup)}.` : '',
    s.notas ?? '',
    s.ingressos ? `Ingressos: ${s.ingressos}` : '',
    `Mais informações: ${pagina}`,
  ];
  return linhas.filter(Boolean).join('\n');
}

/** Soma horas a uma data/hora local e devolve "AAAAMMDDTHHMMSS". */
function somarHoras(data: string, hora: string, horas: number): string {
  const { ano, mes, dia } = partes(data);
  const [h = 0, m = 0] = hora.split(':').map(Number);
  const d = new Date(Date.UTC(ano, mes - 1, dia, h + horas, m));
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}T${p(d.getUTCHours())}${p(d.getUTCMinutes())}00`;
}

function diaSeguinte(data: string): string {
  const { ano, mes, dia } = partes(data);
  const d = new Date(Date.UTC(ano, mes - 1, dia + 1));
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}`;
}

export function linkGoogleAgenda(s: Show['data'], pagina: string): string | undefined {
  if (!s.data) return undefined;
  const compacta = s.data.replaceAll('-', '');
  const datas = s.hora
    ? `${somarHoras(s.data, s.hora, 0)}/${somarHoras(s.data, s.hora, DURACAO_HORAS)}`
    : `${compacta}/${diaSeguinte(s.data)}`;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: tituloEvento(s),
    dates: datas,
    details: descricaoEvento(s, pagina),
    location: enderecoCompleto(s),
    ctz: 'America/Maceio',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Escapa texto para o formato iCalendar. */
function esc(texto: string): string {
  return texto.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (c) => `\\${c}`);
}

/** Quebra linhas longas (máx. 75 bytes), como pede a especificação. */
function dobrar(linha: string): string {
  const partesLinha: string[] = [];
  let atual = '';
  for (const ch of linha) {
    if (new TextEncoder().encode(atual + ch).length > 73) {
      partesLinha.push(atual);
      atual = ' ' + ch;
    } else {
      atual += ch;
    }
  }
  partesLinha.push(atual);
  return partesLinha.join('\r\n');
}

export function eventoICS(id: string, s: Show['data'], pagina: string): string[] {
  if (!s.data) return [];
  const agora = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const inicio = s.hora
    ? `DTSTART;TZID=America/Maceio:${somarHoras(s.data, s.hora, 0)}`
    : `DTSTART;VALUE=DATE:${s.data.replaceAll('-', '')}`;
  const fim = s.hora
    ? `DTEND;TZID=America/Maceio:${somarHoras(s.data, s.hora, DURACAO_HORAS)}`
    : `DTEND;VALUE=DATE:${diaSeguinte(s.data)}`;
  return [
    'BEGIN:VEVENT',
    `UID:${id}@ventocais`,
    `DTSTAMP:${agora}`,
    inicio,
    fim,
    `SUMMARY:${esc(tituloEvento(s))}`,
    `LOCATION:${esc(enderecoCompleto(s))}`,
    `DESCRIPTION:${esc(descricaoEvento(s, pagina))}`,
    `URL:${pagina}`,
    s.status === 'cancelado' ? 'STATUS:CANCELLED' : 'STATUS:CONFIRMED',
    'END:VEVENT',
  ];
}

const FUSO_VTIMEZONE = [
  'BEGIN:VTIMEZONE',
  'TZID:America/Maceio',
  'BEGIN:STANDARD',
  'DTSTART:19700101T000000',
  'TZOFFSETFROM:-0300',
  'TZOFFSETTO:-0300',
  'TZNAME:-03',
  'END:STANDARD',
  'END:VTIMEZONE',
];

export function calendarioICS(nome: string, eventos: string[][]): string {
  const linhas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Danillo Garcez & Ventocais//Site//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${esc(nome)}`,
    'X-WR-TIMEZONE:America/Maceio',
    ...FUSO_VTIMEZONE,
    ...eventos.flat(),
    'END:VCALENDAR',
  ];
  return linhas.map(dobrar).join('\r\n') + '\r\n';
}

export { inicioISO };
