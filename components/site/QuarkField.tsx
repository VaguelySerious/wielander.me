"use client";

import { useRef } from "react";
import { useCanvas } from "./useCanvas";

type Quark = {
	cx: number; // orbit center
	cy: number;
	r: number; // orbit radius
	a: number; // angle
	w: number; // angular direction & speed
	ox: number; // displacement from shockwaves (springs back)
	oy: number;
	vx: number;
	vy: number;
	fade: number; // 0..1; spawned quarks fade in and out
	life: number; // seconds left; Infinity for the base field
};

type Wave = { x: number; y: number; age: number };

const WAVE_LIFE = 1.6; // s
const WAVE_SPEED = 520; // px/s
const WAVE_BAND = 36; // px
const BUCKETS = 12; // line opacity levels (one stroke call each)

function quark(x: number, y: number, r: number, life = Infinity): Quark {
	return {
		cx: x,
		cy: y,
		r,
		a: Math.random() * Math.PI * 2,
		w: (Math.random() < 0.5 ? -1 : 1) * (0.6 + Math.random() * 0.8),
		ox: 0,
		oy: 0,
		vx: 0,
		vy: 0,
		fade: Number.isFinite(life) ? 0 : 1,
		life,
	};
}

/**
 * Orbiting points joined by distance-faded lines (after QuarksJS).
 * Clicking spawns a small cluster of accent-colored quarks and sends out a
 * shockwave that pushes the field outward before it springs back.
 */
export function QuarkField({
	className,
	color = "24,24,27",
	accent = "234,88,12",
	density = 1.2,
	spacing = 120,
	speed = 1,
	lineAlpha = 0.55,
	spawnCount = 6,
	maxSpawned = 60,
}: {
	className?: string;
	/** "r,g,b" base ink. */
	color?: string;
	/** "r,g,b" color of spawned quarks. */
	accent?: string;
	density?: number;
	spacing?: number;
	speed?: number;
	lineAlpha?: number;
	spawnCount?: number;
	maxSpawned?: number;
}) {
	const ref = useRef<HTMLCanvasElement>(null);
	const quarks = useRef<Quark[]>([]);
	const waves = useRef<Wave[]>([]);
	const size = useRef({ w: 0, h: 0 });

	useCanvas(
		ref,
		({ ctx, width, height, dt, pointer }) => {
			let Q = quarks.current;

			// Input: each click spawns a cluster and a shockwave.
			for (const c of pointer.clicks) {
				waves.current.push({ x: c.x, y: c.y, age: 0 });
				for (let i = 0; i < spawnCount; i++) {
					const ang = Math.random() * Math.PI * 2;
					const dist = Math.random() * 34;
					Q.push(
						quark(
							c.x + Math.cos(ang) * dist,
							c.y + Math.sin(ang) * dist,
							6 + Math.random() * 34,
							7 + Math.random() * 5,
						),
					);
				}
				let spawned = 0;
				for (let i = Q.length - 1; i >= 0; i--) {
					if (Number.isFinite(Q[i].life) && ++spawned > maxSpawned)
						Q[i].life = 0;
				}
			}
			pointer.clicks.length = 0;

			// Simulation.
			for (const wv of waves.current) wv.age += dt;
			waves.current = waves.current.filter((wv) => wv.age < WAVE_LIFE);
			const W = waves.current;

			for (const q of Q) {
				for (const wv of W) {
					const px = q.cx + Math.cos(q.a) * q.r + q.ox;
					const py = q.cy + Math.sin(q.a) * q.r + q.oy;
					const dx = px - wv.x;
					const dy = py - wv.y;
					const d = Math.sqrt(dx * dx + dy * dy) || 1;
					const band = Math.abs(d - wv.age * WAVE_SPEED);
					if (band < WAVE_BAND) {
						const s = (1 - band / WAVE_BAND) * (1 - wv.age / WAVE_LIFE);
						q.vx += (dx / d) * s * 4000 * dt;
						q.vy += (dy / d) * s * 4000 * dt;
					}
				}
				// Damped spring back to the orbit.
				q.vx += (-q.ox * 40 - q.vx * 7) * dt;
				q.vy += (-q.oy * 40 - q.vy * 7) * dt;
				q.ox += q.vx * dt;
				q.oy += q.vy * dt;
				q.a += (q.w * speed * dt * 22) / q.r;
				if (Number.isFinite(q.life)) {
					q.life -= dt;
					q.fade = Math.min(1, q.fade + dt * 2) * Math.min(1, q.life / 1.5);
				}
			}
			if (Q.some((q) => q.life <= 0)) {
				Q = quarks.current = Q.filter((q) => q.life > 0);
			}

			const n = Q.length;
			const X = new Float32Array(n);
			const Y = new Float32Array(n);
			for (let i = 0; i < n; i++) {
				const q = Q[i];
				X[i] = q.cx + Math.cos(q.a) * q.r + q.ox;
				Y[i] = q.cy + Math.sin(q.a) * q.r + q.oy;
			}

			// Draw: lines are bucketed by opacity so each bucket is one stroke.
			ctx.clearRect(0, 0, width, height);
			const max2 = spacing * spacing;
			const ink = Array.from({ length: BUCKETS }, () => new Path2D());
			const hot = Array.from({ length: BUCKETS }, () => new Path2D());
			const usedInk = new Uint8Array(BUCKETS);
			const usedHot = new Uint8Array(BUCKETS);
			const link = (
				x1: number,
				y1: number,
				x2: number,
				y2: number,
				d2: number,
				m2: number,
				isHot: boolean,
			) => {
				const k = 1 - Math.sqrt(d2 / m2);
				const b = Math.min(BUCKETS - 1, Math.floor(k * BUCKETS));
				(isHot ? hot : ink)[b].moveTo(x1, y1);
				(isHot ? hot : ink)[b].lineTo(x2, y2);
				(isHot ? usedHot : usedInk)[b] = 1;
			};
			for (let i = 0; i < n; i++) {
				const x = X[i];
				const y = Y[i];
				const qi = Q[i];
				for (let j = i + 1; j < n; j++) {
					const dx = X[j] - x;
					const dy = Y[j] - y;
					let d2 = dx * dx + dy * dy;
					if (d2 >= max2) continue;
					const qj = Q[j];
					const f = qi.fade * qj.fade;
					if (f < 1) {
						if (f <= 0.01) continue;
						d2 /= f * f; // fading quarks lose their links gradually
						if (d2 >= max2) continue;
					}
					const isHot = Number.isFinite(qi.life) || Number.isFinite(qj.life);
					link(x, y, X[j], Y[j], d2, max2, isHot);
				}
			}
			// The cursor acts as one more quark with a longer reach.
			if (pointer.active) {
				const pm = max2 * 2.2;
				for (let i = 0; i < n; i++) {
					const dx = X[i] - pointer.x;
					const dy = Y[i] - pointer.y;
					const d2 = dx * dx + dy * dy;
					if (d2 < pm) link(pointer.x, pointer.y, X[i], Y[i], d2, pm, false);
				}
			}

			ctx.lineWidth = 0.75;
			for (let b = 0; b < BUCKETS; b++) {
				if (!usedInk[b]) continue;
				const k = (b + 0.5) / BUCKETS;
				ctx.strokeStyle = `rgba(${color},${(k * k * lineAlpha).toFixed(3)})`;
				ctx.stroke(ink[b]);
			}
			ctx.lineWidth = 1;
			for (let b = 0; b < BUCKETS; b++) {
				if (!usedHot[b]) continue;
				const k = (b + 0.5) / BUCKETS;
				ctx.strokeStyle = `rgba(${accent},${(k * 0.75 + 0.05).toFixed(3)})`;
				ctx.stroke(hot[b]);
			}

			const dotA = Math.min(1, lineAlpha * 1.3);
			for (let i = 0; i < n; i++) {
				const q = Q[i];
				const spawned = Number.isFinite(q.life);
				ctx.fillStyle = spawned
					? `rgba(${accent},${q.fade.toFixed(3)})`
					: `rgba(${color},${dotA})`;
				const s = spawned ? 3 : 2;
				ctx.fillRect(X[i] - s / 2, Y[i] - s / 2, s, s);
			}

			// Faint expanding rings make the click legible.
			ctx.lineWidth = 1;
			for (const wv of W) {
				const a = (1 - wv.age / WAVE_LIFE) ** 2 * 0.22;
				ctx.strokeStyle = `rgba(${color},${a.toFixed(3)})`;
				ctx.beginPath();
				ctx.arc(wv.x, wv.y, wv.age * WAVE_SPEED, 0, Math.PI * 2);
				ctx.stroke();
			}
		},
		{
			setup: ({ width, height }) => {
				const prev = size.current;
				size.current = { w: width, h: height };
				// Keep existing quarks on small resizes (e.g. mobile URL bar).
				if (
					quarks.current.length &&
					Math.abs(prev.w - width) < 40 &&
					Math.abs(prev.h - height) < 200
				)
					return;
				const count = Math.min(
					260,
					Math.round(((width * height) / 5200) * density),
				);
				quarks.current = Array.from({ length: count }, () =>
					quark(
						Math.random() * (width + 80) - 40,
						Math.random() * (height + 40) - 20,
						8 + Math.random() * Math.min(80, width / 8),
					),
				);
			},
		},
	);

	return <canvas ref={ref} className={className} />;
}
