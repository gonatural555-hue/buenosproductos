"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

type Point = { x: number; y: number };
type Edge = { a: Point; b: Point };

const HEX_RADIUS = 28;
const GAP_SCALE = 0.9;
const GLOW_RADIUS = 130;
const GLOW_RADIUS_EXPANDED = 400;
const MOUSE_LERP = 0.38;
const BASE_BG = "#0B0F14";
const HEX_FILL = "#121820";
const HEX_HIGHLIGHT = "#1a2430";

function distToSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function edgeKey(a: Point, b: Point): string {
  const ax = a.x.toFixed(1);
  const ay = a.y.toFixed(1);
  const bx = b.x.toFixed(1);
  const by = b.y.toFixed(1);
  return ax < bx || (ax === bx && ay <= by)
    ? `${ax},${ay}|${bx},${by}`
    : `${bx},${by}|${ax},${ay}`;
}

function hexVertex(cx: number, cy: number, index: number, radius: number): Point {
  const angle = (Math.PI / 180) * (60 * index - 30);
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

function buildHexGrid(width: number, height: number): { hexes: Point[]; edges: Edge[] } {
  const r = HEX_RADIUS;
  const colStep = Math.sqrt(3) * r;
  const rowStep = r * 1.5;
  const hexes: Point[] = [];
  const edgeMap = new Map<string, Edge>();

  const cols = Math.ceil(width / colStep) + 3;
  const rows = Math.ceil(height / rowStep) + 3;

  for (let row = -2; row < rows; row++) {
    for (let col = -2; col < cols; col++) {
      const cx = col * colStep + (row & 1 ? colStep / 2 : 0) - colStep;
      const cy = row * rowStep - rowStep;
      hexes.push({ x: cx, y: cy });

      for (let i = 0; i < 6; i++) {
        const a = hexVertex(cx, cy, i, r);
        const b = hexVertex(cx, cy, (i + 1) % 6, r);
        const key = edgeKey(a, b);
        if (!edgeMap.has(key)) edgeMap.set(key, { a, b });
      }
    }
  }

  return { hexes, edges: [...edgeMap.values()] };
}

function traceHexagon(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) {
  for (let i = 0; i < 6; i++) {
    const { x, y } = hexVertex(cx, cy, i, radius);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  grid: { hexes: Point[]; edges: Edge[] },
  mx: number,
  my: number,
  animateGlow: boolean,
  glowRadius: number
) {
  ctx.fillStyle = BASE_BG;
  ctx.fillRect(0, 0, width, height);

  const fillRadius = HEX_RADIUS * GAP_SCALE;

  for (const hex of grid.hexes) {
    ctx.beginPath();
    traceHexagon(ctx, hex.x, hex.y, fillRadius);
    ctx.fillStyle = HEX_FILL;
    ctx.fill();

    ctx.beginPath();
    traceHexagon(ctx, hex.x, hex.y, fillRadius * 0.92);
    const shade = ctx.createRadialGradient(
      hex.x,
      hex.y - fillRadius * 0.15,
      0,
      hex.x,
      hex.y,
      fillRadius
    );
    shade.addColorStop(0, HEX_HIGHLIGHT);
    shade.addColorStop(1, "rgba(18, 24, 32, 0)");
    ctx.fillStyle = shade;
    ctx.fill();
  }

  ctx.beginPath();
  for (const edge of grid.edges) {
    ctx.moveTo(edge.a.x, edge.a.y);
    ctx.lineTo(edge.b.x, edge.b.y);
  }
  ctx.strokeStyle = "rgba(28, 42, 58, 0.55)";
  ctx.lineWidth = 1;
  ctx.stroke();

  if (animateGlow) {
    for (const edge of grid.edges) {
      const d = distToSegment(mx, my, edge.a.x, edge.a.y, edge.b.x, edge.b.y);
      const glow = Math.max(0, 1 - d / glowRadius);
      if (glow < 0.04) continue;

      const eased = glow * glow;
      ctx.beginPath();
      ctx.moveTo(edge.a.x, edge.a.y);
      ctx.lineTo(edge.b.x, edge.b.y);
      ctx.strokeStyle = `rgba(${Math.round(40 + eased * 20)}, ${Math.round(120 + eased * 100)}, ${Math.round(180 + eased * 75)}, ${0.35 + eased * 0.65})`;
      ctx.lineWidth = 1 + eased * 2.5;
      ctx.shadowBlur = eased * 18;
      ctx.shadowColor = `rgba(0, 196, 255, ${eased * 0.85})`;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  const vignette = ctx.createRadialGradient(
    width * 0.5,
    height * 0.45,
    0,
    width * 0.5,
    height * 0.45,
    Math.max(width, height) * 0.72
  );
  vignette.addColorStop(0, "rgba(11, 15, 20, 0)");
  vignette.addColorStop(0.55, "rgba(11, 15, 20, 0.15)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.5)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

export default function HexGridInteractiveBackground({
  glowExpanded = false,
}: {
  glowExpanded?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const targetMouseRef = useRef({ x: -9999, y: -9999 });
  const currentMouseRef = useRef({ x: -9999, y: -9999 });
  const targetGlowRadiusRef = useRef(GLOW_RADIUS);
  const currentGlowRadiusRef = useRef(GLOW_RADIUS);
  const glowExpandedRef = useRef(glowExpanded);
  const gridRef = useRef<{ hexes: Point[]; edges: Edge[] } | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    glowExpandedRef.current = glowExpanded;
  }, [glowExpanded]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const animateGlow = !reduceMotion;
    let alive = true;
    let rafId = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = container.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gridRef.current = buildHexGrid(width, height);

      if (!animateGlow && gridRef.current) {
        drawFrame(ctx, width, height, gridRef.current, -9999, -9999, false, GLOW_RADIUS);
      }
    };

    const updateMouseTarget = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const inside =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

      targetMouseRef.current = inside
        ? { x: clientX - rect.left, y: clientY - rect.top }
        : { x: -9999, y: -9999 };
    };

    const onMouseMove = (e: MouseEvent) => updateMouseTarget(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) updateMouseTarget(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    if (!animateGlow) {
      return () => {
        alive = false;
        ro.disconnect();
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("touchmove", onTouchMove);
      };
    }

    const loop = () => {
      if (!alive) return;

      const { width, height } = container.getBoundingClientRect();
      const grid = gridRef.current;
      if (grid && width > 0 && height > 0) {
        currentMouseRef.current.x +=
          (targetMouseRef.current.x - currentMouseRef.current.x) * MOUSE_LERP;
        currentMouseRef.current.y +=
          (targetMouseRef.current.y - currentMouseRef.current.y) * MOUSE_LERP;

        targetGlowRadiusRef.current = glowExpandedRef.current
          ? GLOW_RADIUS_EXPANDED
          : GLOW_RADIUS;
        currentGlowRadiusRef.current +=
          (targetGlowRadiusRef.current - currentGlowRadiusRef.current) * MOUSE_LERP;

        drawFrame(
          ctx,
          width,
          height,
          grid,
          currentMouseRef.current.x,
          currentMouseRef.current.y,
          true,
          currentGlowRadiusRef.current
        );
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [reduceMotion]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
