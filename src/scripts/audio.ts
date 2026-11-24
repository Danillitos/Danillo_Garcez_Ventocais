/**
 * "Barramento" de áudio: quando uma prévia toca, mede o volume em tempo real
 * e avisa quem estiver ouvindo (o vento e o disco da página inicial reagem
 * à música).
 */
type Ouvinte = (nivel: number) => void;

export const audioEstado = { tocando: false, nivel: 0 };

const ouvintes = new Set<Ouvinte>();
const conectados = new WeakSet<HTMLMediaElement>();
let contexto: AudioContext | undefined;
let analisador: AnalyserNode | undefined;
let amostras = new Uint8Array(0);
let quadro = 0;

/** Recebe o nível (0 a 1) a cada quadro enquanto algo toca. Devolve a função para cancelar. */
export function aoNivel(fn: Ouvinte): () => void {
  ouvintes.add(fn);
  return () => {
    ouvintes.delete(fn);
  };
}

function avisar(nivel: number): void {
  ouvintes.forEach((fn) => fn(nivel));
}

function garantirContexto(): AudioContext | undefined {
  if (contexto) return contexto;
  const Contexto =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Contexto) return undefined;
  contexto = new Contexto();
  analisador = contexto.createAnalyser();
  analisador.fftSize = 1024;
  analisador.smoothingTimeConstant = 0.82;
  analisador.connect(contexto.destination);
  amostras = new Uint8Array(analisador.fftSize);
  return contexto;
}

/** Deve ser chamado no clique (o navegador só libera áudio após um gesto). */
export async function prepararAudio(elemento: HTMLMediaElement): Promise<void> {
  const ctx = garantirContexto();
  if (!ctx || !analisador) return;
  if (!conectados.has(elemento)) {
    try {
      ctx.createMediaElementSource(elemento).connect(analisador);
      conectados.add(elemento);
    } catch (erro) {
      console.warn('[audio] não deu para analisar o áudio:', erro);
    }
  }
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch {
      /* segue sem análise */
    }
  }
}

function medir(): void {
  if (analisador) {
    analisador.getByteTimeDomainData(amostras);
    let soma = 0;
    for (let i = 0; i < amostras.length; i++) {
      const v = ((amostras[i] ?? 128) - 128) / 128;
      soma += v * v;
    }
    const alvo = Math.min(1, Math.sqrt(soma / Math.max(1, amostras.length)) * 3.4);
    audioEstado.nivel += (alvo - audioEstado.nivel) * 0.3;
  }
  avisar(audioEstado.nivel);
  quadro = requestAnimationFrame(medir);
}

/** Recalcula se há alguma prévia tocando na página. */
export function atualizarEstadoAudio(): void {
  const tocando = [...document.querySelectorAll<HTMLAudioElement>('audio[data-player-audio]')].some(
    (a) => !a.paused && !a.ended,
  );
  if (tocando === audioEstado.tocando) return;
  audioEstado.tocando = tocando;
  document.documentElement.classList.toggle('audio-tocando', tocando);
  cancelAnimationFrame(quadro);
  if (tocando) {
    quadro = requestAnimationFrame(medir);
  } else {
    audioEstado.nivel = 0;
    avisar(0);
  }
}

export function pararAudio(): void {
  document.querySelectorAll<HTMLAudioElement>('audio[data-player-audio]').forEach((a) => a.pause());
  cancelAnimationFrame(quadro);
  audioEstado.tocando = false;
  audioEstado.nivel = 0;
  document.documentElement.classList.remove('audio-tocando');
}
