/**
 * Ícones em SVG (traço de 1,8px, grade de 24×24).
 * Para adicionar um, inclua o conteúdo do <svg> aqui e use <Icone nome="..." />.
 */
export const icones = {
  seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  'seta-diagonal': '<path d="M7 17 17 7M8 7h9v9"/>',
  'seta-baixo': '<path d="M12 5v14M6 13l6 6 6-6"/>',
  'seta-cima': '<path d="M12 19V5M6 11l6-6 6 6"/>',
  'seta-esquerda': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',
  pause:
    '<rect x="6.5" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/><rect x="13.5" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/>',
  calendario: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  mapa: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  ingresso:
    '<path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z"/><path d="M14.5 6.5v11" stroke-dasharray="1.5 2"/>',
  relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  copiar:
    '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  baixar: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  imprimir:
    '<path d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><rect x="7" y="14" width="10" height="7" rx="1"/>',
  menu: '<path d="M4 9h16M4 15h16"/>',
  fechar: '<path d="M6 6l12 12M18 6 6 18"/>',
  embaralhar: '<path d="M4 7h3l10 10h3M4 17h3l3-3M14 10l3-3h3M18 4l3 3-3 3M18 14l3 3-3 3"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  som: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/>',
  disco: '<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r=".6" fill="currentColor"/>',
  nota: '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
  ondas: '<path d="M4 10v4M8 6v12M12 9v6M16 4v16M20 10v4"/>',
  estrela: '<path d="M12 3.5l2.6 5.6 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6L3.4 9.8l6-.7z"/>',
  email: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>',
  instagram:
    '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/>',
  youtube:
    '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" stroke="none"/>',
  spotify:
    '<circle cx="12" cy="12" r="9.5"/><path d="M7 9.6c3.5-1 7.5-.6 10.4 1.1M7.6 12.7c2.9-.8 6-.4 8.4 1M8.3 15.6c2.3-.6 4.6-.3 6.5.8"/>',
  whatsapp:
    '<path d="M4 20l1.3-4.3A8.2 8.2 0 1 1 8.5 19z"/><path d="M9.2 8.6c-.6.4-.9 1-.8 1.7.4 2.3 2.4 4.4 4.9 5 .7.1 1.3-.2 1.7-.8l-1.7-1.1-.9.7a5 5 0 0 1-2.4-2.4l.7-.9z" fill="currentColor" stroke="none"/>',
} as const;

export type NomeIcone = keyof typeof icones;
