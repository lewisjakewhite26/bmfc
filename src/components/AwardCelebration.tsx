import { useEffect, useRef } from 'react';
import { usePerformanceProfile } from '../hooks/usePerformanceProfile';

/** Club palette — paper confetti, not rainbow */
const CONFETTI_COLORS = [
  '#c9a84c',
  '#e8c96a',
  '#f0dfa8',
  '#eef2ff',
  '#ffffff',
  '#b8923a',
  '#d4c4a8',
] as const;

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  color: string;
  rotation: number;
  spin: number;
  flutterPhase: number;
  opacity: number;
  wobble: number;
}

function spawnConfetti(width: number, height: number, count: number): ConfettiParticle[] {
  return Array.from({ length: count }, (_, i) => {
    const wide = Math.random() > 0.35;
    const w = wide ? 5 + Math.random() * 4 : 3 + Math.random() * 2.5;
    const h = wide ? w * (1.8 + Math.random() * 0.8) : w * (2.2 + Math.random() * 1);

    return {
      x: Math.random() * width,
      y: -(8 + Math.random() * height * 0.55),
      vx: (Math.random() - 0.5) * 1.8,
      vy: 0.8 + Math.random() * 2.2,
      width: w,
      height: h,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length]!,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.14,
      flutterPhase: Math.random() * Math.PI * 2,
      opacity: 0.82 + Math.random() * 0.18,
      wobble: 0.35 + Math.random() * 0.45,
    };
  });
}

function drawParticle(ctx: CanvasRenderingContext2D, p: ConfettiParticle, time: number) {
  const flutter = Math.sin(time * 0.004 + p.flutterPhase) * p.wobble;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation + flutter * 0.08);
  ctx.globalAlpha = p.opacity;
  ctx.fillStyle = p.color;
  ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
  ctx.restore();
}

export function AwardCelebration() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const perfLite = usePerformanceProfile();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let width = 0;
    let height = 0;
    let particles: ConfettiParticle[] = [];
    let frameId = 0;
    let startTime = 0;
    let running = true;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const count = perfLite ? 55 : 130;
    resize();
    particles = spawnConfetti(width, height, count);

    const observer = new ResizeObserver(() => {
      resize();
    });
    observer.observe(canvas.parentElement!);

    const tick = (time: number) => {
      if (!running) return;
      if (!startTime) startTime = time;
      const elapsed = time - startTime;

      ctx.clearRect(0, 0, width, height);

      let alive = 0;
      for (const p of particles) {
        p.vy += 0.045;
        p.vx += Math.sin(time * 0.003 + p.flutterPhase) * 0.018;
        p.vx *= 0.992;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.spin;

        if (p.y > height * 0.72) {
          p.opacity -= 0.014;
        }

        if (p.opacity > 0.02 && p.y < height + 40) {
          alive += 1;
          drawParticle(ctx, p, time);
        }
      }

      if (alive > 0 && elapsed < 6000) {
        frameId = requestAnimationFrame(tick);
      } else {
        running = false;
        ctx.clearRect(0, 0, width, height);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [perfLite]);

  return (
    <div className="award-celebration" aria-hidden>
      <div className="award-celebration__wash" />
      <canvas ref={canvasRef} className="award-celebration__canvas" />
    </div>
  );
}
