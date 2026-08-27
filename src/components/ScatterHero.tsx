import { useEffect, useRef } from "react";

/**
 * Animated scatter plot: points pop in, a fitted logistic curve draws
 * itself, and one deliberate outlier — very curious, learned even more
 * than the plateau allows — pulses in the accent color. Colors are read
 * live from the CSS custom properties, so the chart follows the
 * light/dark theme automatically.
 */

type Pt = { x: number; y: number };

// Deterministic pseudo-random so the chart is identical on every visit.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const sigmoid = (v: number) => 1 / (1 + Math.exp(-v));

// Learning follows a logistic curve: slow start, steep middle, plateau.
// The curve lives between FLOOR and FLOOR + SPAN so the plateau sits
// below the top of the plot — leaving room for the outlier above it.
const FLOOR = 0.06;
const SPAN = 0.78;

// 41 points on the sigmoid + 1 deliberate outlier = n = 42.
function makeData(n = 41): { pts: Pt[]; hero: Pt } {
  const rand = mulberry32(20260827);
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const x = rand();
    const noise = (rand() - 0.5) * 0.26;
    const y = Math.min(1, Math.max(0.01, FLOOR + SPAN * sigmoid(8 * (x - 0.5)) + noise));
    pts.push({ x, y });
  }
  // The outlier: very curious, and it learned more than the plateau
  // says is possible. Sits clearly above the fitted curve.
  return { pts, hero: { x: 0.93, y: 0.98 } };
}

// Logistic fit via the logit transform: z = logit((y - FLOOR) / SPAN)
// is linear in x, so ordinary least squares on (x, z) recovers the
// sigmoid's slope and midpoint.
function fitLogistic(pts: Pt[]): { m: number; b: number } {
  let sx = 0, sz = 0, sxz = 0, sxx = 0;
  const n = pts.length;
  for (const p of pts) {
    const u = Math.min(0.97, Math.max(0.03, (p.y - FLOOR) / SPAN));
    const z = Math.log(u / (1 - u));
    sx += p.x; sz += z; sxz += p.x * z; sxx += p.x * p.x;
  }
  const m = (n * sxz - sx * sz) / (n * sxx - sx * sx);
  return { m, b: (sz - m * sx) / n };
}

// The fitted curve, in data space.
const curveY = (m: number, b: number, x: number) => FLOOR + SPAN * sigmoid(m * x + b);

const easeOutBack = (t: number) => {
  const c = 1.70158;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

export default function ScatterHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { pts, hero } = makeData();
    // Fit over the cloud only — the outlier stays off the curve.
    const { m, b } = fitLogistic(pts);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let start = performance.now();
    let mouse: { x: number; y: number } | null = null;

    const css = () => {
      const s = getComputedStyle(document.documentElement);
      return {
        ink: s.getPropertyValue("--ink-soft").trim(),
        faint: s.getPropertyValue("--ink-faint").trim(),
        rule: s.getPropertyValue("--rule").trim(),
        accent: s.getPropertyValue("--accent").trim(),
        accentDeep: s.getPropertyValue("--accent-deep").trim(),
        accent2: s.getPropertyValue("--accent-2").trim(),
      };
    };

    const draw = (now: number) => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      const c = css();
      const pad = { l: 34, r: 24, t: 20, b: 38 };
      const W = rect.width - pad.l - pad.r;
      const H = rect.height - pad.t - pad.b;
      const X = (v: number) => pad.l + v * W;
      const Y = (v: number) => pad.t + (1 - v) * H;

      const t = reduced ? 10 : (now - start) / 1000;

      // axes
      ctx.strokeStyle = c.rule;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.l, pad.t);
      ctx.lineTo(pad.l, pad.t + H);
      ctx.lineTo(pad.l + W, pad.t + H);
      ctx.stroke();

      // ticks
      for (let i = 1; i <= 4; i++) {
        const fx = X(i / 4), fy = Y(i / 4);
        ctx.beginPath();
        ctx.moveTo(fx, pad.t + H); ctx.lineTo(fx, pad.t + H + 5);
        ctx.moveTo(pad.l, fy); ctx.lineTo(pad.l - 5, fy);
        ctx.stroke();
      }

      // axis labels
      ctx.fillStyle = c.faint;
      ctx.font = "10.5px 'IBM Plex Mono', monospace";
      ctx.textAlign = "right";
      ctx.fillText("curiosity →", pad.l + W, pad.t + H + 26);
      ctx.save();
      ctx.translate(12, pad.t + 4);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("things learned →", 0, 0);
      ctx.restore();

      // "R" laterality marker, like the lead marker on a radiograph
      ctx.fillStyle = c.faint;
      ctx.font = "600 13px 'IBM Plex Mono', monospace";
      ctx.textAlign = "left";
      ctx.fillText("R", pad.l + 10, pad.t + 18);

      // points: staggered pop-in
      pts.forEach((p, i) => {
        const local = clamp01((t - 0.15 - i * 0.035) / 0.45);
        if (local <= 0) return;
        const s = easeOutBack(local);
        ctx.globalAlpha = 0.55 + 0.45 * local;
        ctx.fillStyle = i % 3 === 0 ? c.accent2 : c.ink;
        ctx.beginPath();
        ctx.arc(X(p.x), Y(p.y), Math.max(0.1, 3.4 * s), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // fitted logistic curve draws left → right
      const lineT = easeInOut(clamp01((t - 1.4) / 1.1));
      if (lineT > 0) {
        const x0 = 0.03, x1 = 0.03 + (0.97 - 0.03) * lineT;
        ctx.strokeStyle = c.accent;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 5]);
        ctx.beginPath();
        ctx.moveTo(X(x0), Y(curveY(m, b, x0)));
        for (let x = x0; x < x1; x += 0.015) {
          ctx.lineTo(X(x), Y(curveY(m, b, x)));
        }
        ctx.lineTo(X(x1), Y(curveY(m, b, x1)));
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // the outlier: pops in after the line, pulses in the accent color
      const heroT = clamp01((t - 2.5) / 0.5);
      if (heroT > 0) {
        const hx = X(hero.x), hy = Y(hero.y);
        const s = easeOutBack(heroT);
        // pulse ring
        const pulse = (t * 0.9) % 1;
        ctx.strokeStyle = c.accentDeep;
        ctx.globalAlpha = (1 - pulse) * 0.5 * heroT;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(hx, hy, 6 + pulse * 14, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        ctx.fillStyle = c.accentDeep;
        ctx.beginPath();
        ctx.arc(hx, hy, Math.max(0.1, 5 * s), 0, Math.PI * 2);
        ctx.fill();
      }

      // viewer-style crosshair probe with a live coordinate readout
      if (
        mouse &&
        mouse.x >= pad.l && mouse.x <= pad.l + W &&
        mouse.y >= pad.t && mouse.y <= pad.t + H
      ) {
        ctx.strokeStyle = c.faint;
        ctx.globalAlpha = 0.55;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pad.l, mouse.y);
        ctx.lineTo(pad.l + W, mouse.y);
        ctx.moveTo(mouse.x, pad.t);
        ctx.lineTo(mouse.x, pad.t + H);
        ctx.stroke();
        ctx.globalAlpha = 1;

        const dx = (mouse.x - pad.l) / W;
        const dy = 1 - (mouse.y - pad.t) / H;
        const readout = `x ${dx.toFixed(2)} · y ${dy.toFixed(2)}`;
        ctx.font = "10.5px 'IBM Plex Mono', monospace";
        const flip = mouse.x > pad.l + W - 92;
        ctx.textAlign = flip ? "right" : "left";
        ctx.fillStyle = c.ink;
        ctx.fillText(
          readout,
          flip ? mouse.x - 8 : mouse.x + 8,
          mouse.y > pad.t + H - 24 ? mouse.y - 10 : mouse.y + 18
        );
      }

      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => { mouse = null; };

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block", cursor: "crosshair" }}
      aria-label="Decorative scatter plot with a fitted logistic curve and one highlighted outlier"
      role="img"
    />
  );
}
