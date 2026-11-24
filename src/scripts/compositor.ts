/**
 * Formulário de contato: monta a mensagem em tempo real (com prévia em
 * balão de WhatsApp) e abre o WhatsApp da banda com o texto pronto.
 */
const MOTIVO_SHOW = 'Contratar um show';

export function iniciarCompositor(): void {
  document.querySelectorAll<HTMLFormElement>('form[data-compositor]').forEach((form) => {
    const previa = form.querySelector<HTMLElement>('[data-compositor-previa]');
    const campoData = form.querySelector<HTMLElement>('[data-campo-show]');

    const montar = (): string => {
      const dados = new FormData(form);
      const valor = (chave: string) => String(dados.get(chave) ?? '').trim();
      const nome = valor('nome');
      const motivo = valor('motivo');
      const cidade = valor('cidade');
      const data = valor('data');
      const mensagem = valor('mensagem');

      if (campoData) campoData.hidden = motivo !== MOTIVO_SHOW;

      const linhas = [`Olá, Ventocais!${nome ? ` Aqui é ${nome}.` : ''}`, `Assunto: ${motivo}`];
      if (cidade) linhas.push(`Cidade: ${cidade}`);
      if (data && motivo === MOTIVO_SHOW) linhas.push(`Data do evento: ${data.split('-').reverse().join('/')}`);
      if (mensagem) linhas.push('', mensagem);
      linhas.push('', '(mensagem enviada pelo site)');
      return linhas.join('\n');
    };

    const atualizar = () => {
      if (previa) previa.textContent = montar();
    };

    form.addEventListener('input', atualizar);
    form.addEventListener('change', atualizar);
    form.addEventListener('submit', (evento) => {
      evento.preventDefault();
      if (!form.reportValidity()) return;
      const link = `https://wa.me/${form.dataset.numero}?text=${encodeURIComponent(montar())}`;
      window.open(link, '_blank', 'noopener');
    });

    atualizar();
  });
}
