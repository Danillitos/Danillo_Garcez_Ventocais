/** Menu de tela cheia do celular (um <dialog>, que já cuida do foco e do Esc). */
export function iniciarMenu(): void {
  const menu = document.querySelector<HTMLDialogElement>('dialog[data-menu]');
  const abrir = document.querySelector<HTMLButtonElement>('[data-menu-abrir]');
  if (!menu || !abrir) return;

  abrir.addEventListener('click', () => {
    menu.showModal();
    abrir.setAttribute('aria-expanded', 'true');
  });
  menu.querySelector('[data-menu-fechar]')?.addEventListener('click', () => menu.close());
  menu.addEventListener('close', () => abrir.setAttribute('aria-expanded', 'false'));
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => menu.close()));
}

export function fecharMenu(): void {
  document.querySelector<HTMLDialogElement>('dialog[data-menu][open]')?.close();
}
