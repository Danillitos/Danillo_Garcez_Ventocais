/**
 * Informações gerais da banda (data/site.json), validadas no build.
 */
import { z } from 'astro/zod';
import bruto from '../../data/site.json';

const link = z.object({
  url: z.string(),
  pendente: z.string().optional(),
});

const esquema = z.object({
  nome: z.string(),
  nomeCurto: z.string(),
  cidade: z.string(),
  uf: z.string(),
  estreia: z.string(),
  /** Opcional: se existir, aparece no topo da página inicial, na Sobre e em /links/. */
  slogan: z.string().optional(),
  descricao: z.string(),
  generos: z.array(z.string()),
  bioCurta: z.string(),
  bioLonga: z.array(z.string()),
  origemDoNome: z.string(),
  formatoAcustico: z.string(),
  formacaoPendente: z.string().optional(),
  /** Aviso sob as polaroids da formação (página Sobre). */
  avisoFormacao: z.string().optional(),
  influencias: z.array(
    z.object({ grupo: z.string(), nomes: z.array(z.string()), nota: z.string().optional() }),
  ),
  contato: z.object({
    whatsapp: z.string(),
    whatsappExibicao: z.string(),
    email: z.string(),
    /** E-mail pessoal do Danillo (opcional), mostrado junto do da banda. */
    emailDanillo: z.string().optional(),
    pendente: z.string().optional(),
  }),
  redes: z.array(link.extend({ rede: z.string(), usuario: z.string() })),
  plataformas: z.array(link.extend({ nome: z.string() })),
  numeros: z.array(
    z.object({
      valor: z.number(),
      prefixo: z.string().optional(),
      sufixo: z.string().optional(),
      rotulo: z.string(),
    }),
  ),
  distribuidora: z.string(),
  associacao: z.string(),
  creditos: z.object({
    capa: z.string(),
    fotos: z.string(),
    pendente: z.string().optional(),
  }),
});

const resultado = esquema.safeParse(bruto);
if (!resultado.success) {
  throw new Error(`data/site.json tem algum campo inválido:\n${z.prettifyError(resultado.error)}`);
}

export const site = resultado.data;

/** Link do WhatsApp com mensagem opcional já escrita. */
export function linkWhatsApp(mensagem?: string): string {
  const base = `https://wa.me/${site.contato.whatsapp}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}
