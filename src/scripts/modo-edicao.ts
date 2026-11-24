/**
 * Só em `npm run dev`: o botão amarelo no canto mostra quantas pendências
 * há na página e leva até cada uma.
 */
export function iniciarModoEdicao(): void {
  const botao = document.querySelector<HTMLButtonElement>('[data-modo-edicao]');
  if (!botao) return;

  const itens = [...document.querySelectorAll<HTMLElement>('[data-pendente]')];
  const texto = botao.querySelector<HTMLElement>('[data-modo-edicao-texto]');
  botao.hidden = itens.length === 0;
  if (texto) texto.textContent = `${itens.length} ${itens.length === 1 ? 'pendência' : 'pendências'} nesta página`;

  let atual = 0;
  botao.onclick = () => {
    const alvo = itens[atual % itens.length];
    atual++;
    if (!alvo) return;
    alvo.scrollIntoView({ behavior: 'smooth', block: 'center' });
    alvo.classList.remove('pendente--foco');
    void alvo.offsetWidth;
    alvo.classList.add('pendente--foco');
  };
}
