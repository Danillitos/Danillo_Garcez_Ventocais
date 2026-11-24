/** Botões "Copiar" (bio, release, letra, contatos). */
async function copiarTexto(texto: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(texto);
  } catch {
    // Plano B para navegadores sem acesso à área de transferência.
    const area = document.createElement('textarea');
    area.value = texto;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }
}

document.addEventListener('click', async (evento) => {
  const botao = (evento.target as Element | null)?.closest<HTMLButtonElement>('[data-copiar], [data-copiar-alvo]');
  if (!botao) return;

  let texto = botao.dataset.copiar ?? '';
  if (!texto && botao.dataset.copiarAlvo) {
    texto = document.querySelector<HTMLElement>(botao.dataset.copiarAlvo)?.innerText.trim() ?? '';
  }
  if (!texto) return;

  await copiarTexto(texto);
  const rotulo = botao.querySelector<HTMLElement>('[data-copiar-texto]');
  botao.classList.add('copiado');
  if (rotulo) rotulo.textContent = 'Copiado!';
  window.setTimeout(() => {
    botao.classList.remove('copiado');
    if (rotulo) rotulo.textContent = botao.dataset.copiarRotulo ?? 'Copiar';
  }, 2000);
});
