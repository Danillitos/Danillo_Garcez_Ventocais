/**
 * Datas em português, sempre no fuso de Aracaju (UTC−3, sem horário de verão).
 * As datas do conteúdo são texto "AAAA-MM-DD", então evitamos `new Date()`
 * sempre que possível para não cair em armadilhas de fuso.
 */
export const FUSO = 'America/Maceio';
export const OFFSET = '-03:00';

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];
const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

export function partes(iso: string) {
  const [ano = 0, mes = 0, dia = 0] = iso.split('-').map(Number);
  return { ano, mes, dia };
}

const doisDigitos = (n: number) => String(n).padStart(2, '0');

/** "12 de janeiro de 2024" · "dezembro de 2026" · "2026" */
export function dataLonga(iso: string): string {
  const { ano, mes, dia } = partes(iso);
  if (!mes) return String(ano);
  if (!dia) return `${MESES[mes - 1]} de ${ano}`;
  return `${dia} de ${MESES[mes - 1]} de ${ano}`;
}

/** "12/01/2024" */
export function dataCurta(iso: string): string {
  const { ano, mes, dia } = partes(iso);
  return `${doisDigitos(dia)}/${doisDigitos(mes)}/${ano}`;
}

/** "12.01" */
export function diaPontoMes(iso: string): string {
  const { mes, dia } = partes(iso);
  return `${doisDigitos(dia)}.${doisDigitos(mes)}`;
}

/** "dez" */
export function mesCurto(iso: string): string {
  return MESES[partes(iso).mes - 1]?.slice(0, 3) ?? '';
}

/** "dezembro" */
export function mesLongo(iso: string): string {
  return MESES[partes(iso).mes - 1] ?? '';
}

/** "sábado" */
export function diaDaSemana(iso: string): string {
  const { ano, mes, dia } = partes(iso);
  return DIAS[new Date(Date.UTC(ano, mes - 1, dia)).getUTCDay()] ?? '';
}

/** Data de hoje em Aracaju, no formato AAAA-MM-DD. */
export function hojeISO(agora = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: FUSO,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(agora);
}

/** "2026-12-10T21:00:00-03:00" (ou só a data, se não houver hora). */
export function inicioISO(data: string, hora?: string): string {
  return hora ? `${data}T${hora}:00${OFFSET}` : data;
}

/** "3:34" → "PT3M34S" */
export function duracaoISO(mmss: string): string {
  const [m = 0, s = 0] = mmss.split(':').map(Number);
  return `PT${m}M${s}S`;
}

/** 15 → "R$ 15" · 22.5 → "R$ 22,50" · 0 → "Gratuito" */
export function formatarPreco(valor?: number): string | undefined {
  if (valor === undefined) return undefined;
  if (valor === 0) return 'Gratuito';
  const inteiro = Number.isInteger(valor);
  return `R$ ${valor.toLocaleString('pt-BR', {
    minimumFractionDigits: inteiro ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

/** ["A", "B", "C"] → "A, B e C" */
export function listaNatural(itens: string[]): string {
  if (itens.length <= 1) return itens.join('');
  return `${itens.slice(0, -1).join(', ')} e ${itens.at(-1)}`;
}
