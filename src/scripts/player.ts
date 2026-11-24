/**
 * Player das prévias: play/pause, anel de progresso, tempo restante e a
 * classe .tocando (que faz o vinil girar).
 */
import { atualizarEstadoAudio, prepararAudio } from './audio';

const formatar = (segundos: number) => {
  const s = Math.max(0, Math.ceil(segundos));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

export function iniciarPlayers(): void {
  document.querySelectorAll<HTMLElement>('[data-player]').forEach((player) => {
    const audio = player.querySelector<HTMLAudioElement>('[data-player-audio]');
    const botao = player.querySelector<HTMLButtonElement>('[data-player-botao]');
    const tempo = player.querySelector<HTMLElement>('[data-player-tempo]');
    if (!audio || !botao) return;

    const bloco = player.closest<HTMLElement>('[data-lancamento]');

    const mostrarEstado = (tocando: boolean) => {
      player.classList.toggle('tocando', tocando);
      bloco?.classList.toggle('tocando', tocando);
      botao.setAttribute('aria-pressed', String(tocando));
      botao.setAttribute(
        'aria-label',
        (tocando ? botao.dataset.rotuloPausar : botao.dataset.rotuloTocar) ?? (tocando ? 'Pausar' : 'Tocar'),
      );
      atualizarEstadoAudio();
    };

    botao.addEventListener('click', async () => {
      if (!audio.paused) {
        audio.pause();
        return;
      }
      // Só uma prévia toca por vez.
      document.querySelectorAll<HTMLAudioElement>('audio[data-player-audio]').forEach((outro) => {
        if (outro !== audio) outro.pause();
      });
      await prepararAudio(audio);
      try {
        await audio.play();
      } catch (erro) {
        console.warn('[player] não foi possível tocar:', erro);
        mostrarEstado(false);
      }
    });

    audio.addEventListener('play', () => mostrarEstado(true));
    audio.addEventListener('pause', () => mostrarEstado(false));
    audio.addEventListener('ended', () => {
      audio.currentTime = 0;
      player.style.setProperty('--progresso', '0');
      mostrarEstado(false);
    });
    audio.addEventListener('timeupdate', () => {
      const duracao = Number.isFinite(audio.duration) ? audio.duration : 30;
      player.style.setProperty('--progresso', String(audio.currentTime / duracao));
      if (tempo) tempo.textContent = formatar(duracao - audio.currentTime);
    });
  });
}
