"use client";

import { useRef } from "react";
import { useCanvas } from "./useCanvas";

type RGB = [number, number, number];

type P = {
	hx: number; // home orbit center
	hy: number;
	cx: number; // current orbit center
	cy: number;
	r: number;
	rs: number; // orbit radius scale (gravity tightens orbits)
	a: number;
	w: number;
	ox: number; // displacement from shockwaves (springs back)
	oy: number;
	vx: number;
	vy: number;
	heat: number; // 0..1, tints the point and its lines with the accent
	fade: number; // 0..1, spawned points fade in/out
	life: number; // seconds left for spawned points (Infinity = permanent)
};

type Wave = { x: number; y: number; age: number };

export type ClickMode = "none" | "pulse" | "spawn" | "gravity" | "ripple";

const parse = (rgb: string): RGB => rgb.split(",").map(Number) as RGB;
const mix = (a: RGB, b: RGB, t: number): RGB => [
	Math.round(a[0] + (b[0] - a[0]) * t),
	Math.round(a[1] + (b[1] - a[1]) * t),
	Math.round(a[2] + (b[2] - a[2]) * t),
];

/** Orbiting points joined by distance-faded lines (a take on QuarksJS). */
export function QuarkField({
	className,
	color = "0,0,0",
	accent,
	gradient,
	density = 1,
	spacing = 120,
	speed = 1,
	lineAlpha = 0.5,
	click = "none",
	spawnCount = 6,
	hoverHeat = false,
}: {
	className?: string;
	/** "r,g,b" base ink. */
	color?: string;
	/** "r,g,b" accent used for heated (hovered / rippled) lines. */
	accent?: string;
	/** Two "r,g,b" stops; lines are tinted left→right across the field. */
	gradient?: [string, string];
	density?: number;
	spacing?: number;
	speed?: number;
	lineAlpha?: number;
	/** One interaction, or several combined (e.g. ["spawn", "pulse"]). */
	click?: ClickMode | ClickMode[];
	/** Quarks added per click in "spawn" mode. */
	spawnCount?: number;
	/** Points near the cursor glow in the accent color. */
	hoverHeat?: boolean;
}) {
	const ref = useRef<HTMLCanvasElement>(null);
	const pts = useRef<P[]>([]);
	const waves = useRef<Wave[]>([]);
	const size = useRef({ w: 0, h: 0 });
	const BUCKETS = 12;
	const BANDS = gradient ? 6 : 1;

	const makePoint = (
		x: number,
		y: number,
		r: number,
		life = Number.POSITIVE_INFINITY,
	): P => ({
		hx: x,
		hy: y,
		cx: x,
		cy: y,
		r,
		rs: 1,
		a: Math.random() * Math.PI * 2,
		w: (Math.random() < 0.5 ? -1 : 1) * (0.6 + Math.random() * 0.8),
		ox: 0,
		oy: 0,
		vx: 0,
		vy: 0,
		heat: 0,
		fade: Number.isFinite(life) ? 0 : 1,
		life,
	});

	useCanvas(
		ref,
		({ ctx, width, height, dt, pointer }) => {
			let P = pts.current;
			const modes = new Set(Array.isArray(click) ? click : [click]);
			const has = (m: ClickMode) => modes.has(m);

			// --- Input -------------------------------------------------------
			for (const c of pointer.clicks) {
				if (has("pulse") || has("ripple")) {
					waves.current.push({ x: c.x, y: c.y, age: 0 });
				}
				if (has("spawn")) {
					for (let i = 0; i < spawnCount; i++) {
						const ang = Math.random() * Math.PI * 2;
						const dist = Math.random() * 34;
						const p = makePoint(
							c.x + Math.cos(ang) * dist,
							c.y + Math.sin(ang) * dist,
							6 + Math.random() * 34,
							7 + Math.random() * 5,
						);
						p.heat = 1;
						P.push(p);
					}
					// Cap the number of spawned points; oldest go first.
					let spawned = 0;
					for (let i = P.length - 1; i >= 0; i--) {
						if (Number.isFinite(P[i].life) && ++spawned > 60) P[i].life = 0;
					}
				}
			}
			pointer.clicks.length = 0;

			// --- Simulation --------------------------------------------------
			const W = waves.current;
			for (const wv of W) wv.age += dt;
			waves.current = W.filter((wv) => wv.age < 1.6);
			const pullOn = has("gravity") && pointer.down;
			const stiff = 1 - Math.exp(-dt * 2.2);

			for (const p of P) {
				// Orbit centers relax home, or get pulled toward a held press.
				let tx = p.hx;
				let ty = p.hy;
				let trs = 1;
				if (pullOn) {
					const dx = pointer.x - p.hx;
					const dy = pointer.y - p.hy;
					const pull = 0.95 * Math.exp(-Math.sqrt(dx * dx + dy * dy) / 320);
					tx += dx * pull;
					ty += dy * pull;
					trs = 1 - 0.8 * pull;
				}
				const k = pullOn ? 1 - Math.exp(-dt * 3) : stiff;
				p.cx += (tx - p.cx) * k;
				p.cy += (ty - p.cy) * k;
				p.rs += (trs - p.rs) * k;

				// Shockwaves push points outward; a damped spring pulls them back.
				for (const wv of waves.current) {
					if (!has("pulse") && !has("ripple")) break;
					const px = p.cx + Math.cos(p.a) * p.r * p.rs + p.ox;
					const py = p.cy + Math.sin(p.a) * p.r * p.rs + p.oy;
					const dx = px - wv.x;
					const dy = py - wv.y;
					const d = Math.sqrt(dx * dx + dy * dy) || 1;
					const front = wv.age * 520;
					const band = Math.abs(d - front);
					if (band < 36) {
						const s = (1 - band / 36) * (1 - wv.age / 1.6);
						if (has("pulse")) {
							p.vx += (dx / d) * s * 4000 * dt;
							p.vy += (dy / d) * s * 4000 * dt;
						}
						if (has("ripple")) p.heat = Math.max(p.heat, s * 1.4);
					}
				}
				p.vx += (-p.ox * 40 - p.vx * 7) * dt;
				p.vy += (-p.oy * 40 - p.vy * 7) * dt;
				p.ox += p.vx * dt;
				p.oy += p.vy * dt;

				p.a += (p.w * speed * dt * 22) / p.r;
				if (Number.isFinite(p.life)) {
					p.life -= dt;
					p.fade = Math.min(1, p.fade + dt * 2) * Math.min(1, p.life / 1.5);
				}
				// Spawned quarks keep the accent for their whole life.
				if (!Number.isFinite(p.life))
					p.heat *= Math.exp(-dt * (has("ripple") ? 1.1 : 1.8));
			}
			if (has("spawn")) {
				P = pts.current = P.filter((p) => p.life > 0);
			}

			const n = P.length;
			const X = new Float32Array(n);
			const Y = new Float32Array(n);
			for (let i = 0; i < n; i++) {
				const p = P[i];
				X[i] = p.cx + Math.cos(p.a) * p.r * p.rs + p.ox;
				Y[i] = p.cy + Math.sin(p.a) * p.r * p.rs + p.oy;
				if (hoverHeat && pointer.active) {
					const dx = X[i] - pointer.x;
					const dy = Y[i] - pointer.y;
					const h = Math.exp(-(dx * dx + dy * dy) / 16000);
					if (h > p.heat) p.heat = h;
				}
			}

			// --- Draw --------------------------------------------------------
			ctx.clearRect(0, 0, width, height);
			const max2 = spacing * spacing;
			const nb = BUCKETS * BANDS;
			const base: Path2D[] = Array.from({ length: nb }, () => new Path2D());
			const hot: Path2D[] = accent
				? Array.from({ length: BUCKETS }, () => new Path2D())
				: [];
			const usedB = new Uint8Array(nb);
			const usedH = new Uint8Array(BUCKETS);
			const link = (
				x1: number,
				y1: number,
				x2: number,
				y2: number,
				d2: number,
				m2: number,
				heat: number,
			) => {
				const k = 1 - Math.sqrt(d2 / m2);
				const b = Math.min(BUCKETS - 1, Math.floor(k * BUCKETS));
				if (accent && heat > 0.3) {
					hot[b].moveTo(x1, y1);
					hot[b].lineTo(x2, y2);
					usedH[b] = 1;
					return;
				}
				const band =
					BANDS > 1
						? Math.min(
								BANDS - 1,
								Math.max(0, Math.floor(((x1 + x2) / 2 / width) * BANDS)),
							)
						: 0;
				const idx = band * BUCKETS + b;
				base[idx].moveTo(x1, y1);
				base[idx].lineTo(x2, y2);
				usedB[idx] = 1;
			};
			for (let i = 0; i < n; i++) {
				const x = X[i];
				const y = Y[i];
				const fi = P[i].fade;
				for (let j = i + 1; j < n; j++) {
					const dx = X[j] - x;
					const dy = Y[j] - y;
					let d2 = dx * dx + dy * dy;
					if (d2 >= max2) continue;
					const f = fi * P[j].fade;
					if (f < 1) {
						if (f <= 0.01) continue;
						d2 /= f * f; // fading points lose their links gradually
						if (d2 >= max2) continue;
					}
					link(x, y, X[j], Y[j], d2, max2, Math.max(P[i].heat, P[j].heat));
				}
			}
			if (pointer.active && !has("gravity")) {
				const pm = max2 * 2.2;
				for (let i = 0; i < n; i++) {
					const dx = X[i] - pointer.x;
					const dy = Y[i] - pointer.y;
					const d2 = dx * dx + dy * dy;
					if (d2 < pm)
						link(pointer.x, pointer.y, X[i], Y[i], d2, pm, hoverHeat ? 1 : 0);
				}
			}

			const ink = parse(color);
			const g0 = gradient ? parse(gradient[0]) : ink;
			const g1 = gradient ? parse(gradient[1]) : ink;
			ctx.lineWidth = 0.75;
			for (let band = 0; band < BANDS; band++) {
				const rgb = BANDS > 1 ? mix(g0, g1, band / (BANDS - 1)) : ink;
				for (let b = 0; b < BUCKETS; b++) {
					const idx = band * BUCKETS + b;
					if (!usedB[idx]) continue;
					const k = (b + 0.5) / BUCKETS;
					ctx.strokeStyle = `rgba(${rgb},${(k * k * lineAlpha).toFixed(3)})`;
					ctx.stroke(base[idx]);
				}
			}
			if (accent) {
				ctx.lineWidth = 1;
				for (let b = 0; b < BUCKETS; b++) {
					if (!usedH[b]) continue;
					const k = (b + 0.5) / BUCKETS;
					ctx.strokeStyle = `rgba(${accent},${Math.min(1, k * 0.75 + 0.05).toFixed(3)})`;
					ctx.stroke(hot[b]);
				}
			}

			const dotA = Math.min(1, lineAlpha * 1.3);
			for (let i = 0; i < n; i++) {
				const p = P[i];
				const hotDot = accent && p.heat > 0.3;
				const rgb =
					BANDS > 1 ? mix(g0, g1, Math.min(1, Math.max(0, X[i] / width))) : ink;
				ctx.fillStyle = hotDot
					? `rgba(${accent},${p.fade})`
					: `rgba(${rgb},${(dotA * p.fade).toFixed(3)})`;
				const s = hotDot ? 3 : 2;
				ctx.fillRect(X[i] - s / 2, Y[i] - s / 2, s, s);
			}

			// Faint expanding rings make the click feedback legible.
			for (const wv of waves.current) {
				const a = (1 - wv.age / 1.6) ** 2 * (has("ripple") ? 0.35 : 0.22);
				ctx.strokeStyle = `rgba(${has("ripple") && accent ? accent : color},${a.toFixed(3)})`;
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.arc(wv.x, wv.y, wv.age * 520, 0, Math.PI * 2);
				ctx.stroke();
			}
		},
		{
			staticTime: 0,
			setup: ({ width, height }) => {
				const prev = size.current;
				size.current = { w: width, h: height };
				// Keep existing points on small resizes (e.g. mobile URL bar).
				if (
					pts.current.length &&
					Math.abs(prev.w - width) < 40 &&
					Math.abs(prev.h - height) < 200
				)
					return;
				const count = Math.min(
					260,
					Math.round(((width * height) / 5200) * density),
				);
				const P: P[] = [];
				for (let i = 0; i < count; i++) {
					P.push(
						makePoint(
							Math.random() * (width + 80) - 40,
							Math.random() * (height + 40) - 20,
							8 + Math.random() * Math.min(80, width / 8),
						),
					);
				}
				pts.current = P;
			},
		},
	);

	return <canvas ref={ref} className={className} aria-hidden="true" />;
}
