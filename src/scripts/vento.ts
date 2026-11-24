/**
 * O "vento" do topo da página inicial: linhas onduladas, como vento sobre o
 * mar, desenhadas num <canvas>. Elas se abrem em volta do mouse e ganham
 * amplitude quando a prévia da música está tocando.
 */
import { audioEstado } from './audio';

let parar: (() => void) | undefined;

export function pararVento(): void {
  parar?.();
  parar = undefined;
}

type Linha = {
  y: number;
  amplitude: number;
  frequencia: number;
  velocidade: number;
  fase: number;
  alfa: number;
  cor: string;
  espessura: number;
};

const CORES = ['236,230,216', '138,164,255', '201,166,121'];

export function iniciarVento(): void {
  pararVento();

  const canvas = document.querySelector<HTMLCanvasElement>('[data-vento]');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;

  const area = canvas.parentElement ?? canvas;
  const reduzirMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let largura = 0;
  let altura = 0;
  let linhas: Linha[] = [];
  let tempo = 0;
  let ultimoQuadro = performance.now();
  let raf = 0;
  let rodando = false;
  let naTela = true;
  const ponteiro = { x: 0, y: 0, alvoX: 0, alvoY: 0, forca: 0, alvoForca: 0 };

  function montar(): void {
    const caixa = canvas!.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    largura = caixa.width;
    altura = caixa.height;
    canvas!.width = Math.round(largura * dpr);
    canvas!.height = Math.round(altura * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Semente fixa: o desenho não "pula" quando a janela muda de tamanho.
    let semente = 11;
    const aleatorio = () => {
      semente = (semente * 16807) % 2147483647;
      return semente / 2147483647;
    };

    const total = Math.round(Math.min(38, Math.max(18, altura / 22)));
    linhas = Array.from({ length: total }, (_, i) => {
      const p = i / (total - 1);
      return {
        y: altura * (0.28 + p * 0.74),
        amplitude: 5 + p * 20 + aleatorio() * 6,
        frequencia: 0.0018 + aleatorio() * 0.0032,
        velocidade: 0.25 + aleatorio() * 0.45,
        fase: aleatorio() * Math.PI * 2,
        alfa: 0.035 + p * 0.19,
        cor: CORES[i % 7 === 0 ? 1 : i % 5 === 0 ? 2 : 0] ?? CORES[0]!,
        espessura: i % 7 === 0 ? 1.4 : 1,
      };
    });
  }

  function desenhar(): void {
    ctx!.clearRect(0, 0, largura, altura);
    ponteiro.x += (ponteiro.alvoX - ponteiro.x) * 0.09;
    ponteiro.y += (ponteiro.alvoY - ponteiro.y) * 0.09;
    ponteiro.forca += (ponteiro.alvoForca - ponteiro.forca) * 0.06;

    const nivel = audioEstado.nivel;
    const passo = largura < 700 ? 10 : 7;

    for (const l of linhas) {
      ctx!.beginPath();
      for (let x = -passo; x <= largura + passo; x += passo) {
        const onda =
          Math.sin(x * l.frequencia + tempo * l.velocidade + l.fase) * l.amplitude * (1 + nivel * 2.4) +
          Math.sin(x * l.frequencia * 2.7 - tempo * l.velocidade * 0.6 + l.fase) * l.amplitude * 0.3;
        const dx = x - ponteiro.x;
        const dy = l.y - ponteiro.y;
        const influencia = Math.exp(-(dx * dx) / 36000 - (dy * dy) / 14000) * ponteiro.forca;
        const y = l.y + onda + Math.tanh(dy / 40) * influencia * 48;
        if (x === -passo) ctx!.moveTo(x, y);
        else ctx!.lineTo(x, y);
      }
      ctx!.strokeStyle = `rgba(${l.cor},${Math.min(1, l.alfa * (1 + nivel * 1.6))})`;
      ctx!.lineWidth = l.espessura;
      ctx!.stroke();
    }
  }

  function aCadaQuadro(agora: number): void {
    const dt = Math.min(0.05, (agora - ultimoQuadro) / 1000);
    ultimoQuadro = agora;
    tempo += dt * (1 + audioEstado.nivel * 1.5);
    desenhar();
    raf = requestAnimationFrame(aCadaQuadro);
  }

  function ligar(): void {
    if (rodando || reduzirMovimento || !naTela || document.hidden) return;
    rodando = true;
    ultimoQuadro = performance.now();
    raf = requestAnimationFrame(aCadaQuadro);
  }

  function desligar(): void {
    rodando = false;
    cancelAnimationFrame(raf);
  }

  const aoMover = (e: PointerEvent) => {
    const caixa = canvas.getBoundingClientRect();
    ponteiro.alvoX = e.clientX - caixa.left;
    ponteiro.alvoY = e.clientY - caixa.top;
    if (ponteiro.forca < 0.01) {
      ponteiro.x = ponteiro.alvoX;
      ponteiro.y = ponteiro.alvoY;
    }
    ponteiro.alvoForca = 1;
  };
  const aoSair = () => {
    ponteiro.alvoForca = 0;
  };
  const aoMudarVisibilidade = () => (document.hidden ? desligar() : ligar());

  montar();
  desenhar();

  const observadorTamanho = new ResizeObserver(() => {
    montar();
    if (!rodando) desenhar();
  });
  observadorTamanho.observe(canvas);

  const observadorTela = new IntersectionObserver(([entrada]) => {
    naTela = Boolean(entrada?.isIntersecting);
    if (naTela) ligar();
    else desligar();
  });
  observadorTela.observe(canvas);

  document.addEventListener('visibilitychange', aoMudarVisibilidade);
  area.addEventListener('pointermove', aoMover);
  area.addEventListener('pointerleave', aoSair);

  parar = () => {
    desligar();
    observadorTamanho.disconnect();
    observadorTela.disconnect();
    document.removeEventListener('visibilitychange', aoMudarVisibilidade);
    area.removeEventListener('pointermove', aoMover);
    area.removeEventListener('pointerleave', aoSair);
  };
}
