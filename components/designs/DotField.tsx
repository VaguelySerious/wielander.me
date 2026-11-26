"use client";

import { useMemo, useRef } from "react";
import { createNoise3D } from "./noise";
import { useCanvas } from "./useCanvas";

/** Dot-matrix grid with drifting noise waves and a cursor spotlight. */
export function DotField({
	className,
	gap = 16,
	color = "235,235,240",
	accent = "120,255,200",
	alpha = 0.7,
	fade = { x: 0.25, y: 0, rx: 1.0, ry: 0.95 },
}: {
	className?: string;
	gap?: number;
	color?: string;
	accent?: string;
	alpha?: number;
	/** Elliptical falloff (fractions of the canvas) so the field fades out. */
	fade?: { x: number; y: number; rx: number; ry: number };
}) {
	const ref = useRef<HTMLCanvasElement>(null);
	const noise = useMemo(() => createNoise3D(3), []);
	const spot = useRef({ x: -1e4, y: -1e4, s: 0 });
	const B = 10;

	useCanvas(
		ref,
		({ ctx, width, height, t, dt, pointer }) => {
			const sp = spot.current;
			// Ease the spotlight toward the pointer for a smooth trail.
			const target = pointer.active ? 1 : 0;
			sp.s += (target - sp.s) * Math.min(1, dt * 4);
			if (pointer.active) {
				const k = Math.min(1, dt * 10);
				sp.x = sp.x < -1e3 ? pointer.x : sp.x + (pointer.x - sp.x) * k;
				sp.y = sp.y < -1e3 ? pointer.y : sp.y + (pointer.y - sp.y) * k;
			}
			ctx.clearRect(0, 0, width, height);
			const base: Path2D[] = Array.from({ length: B }, () => new Path2D());
			const hot: Path2D[] = Array.from({ length: B }, () => new Path2D());
			const ox = (width % gap) / 2;
			const oy = (height % gap) / 2;
			for (let y = oy; y < height; y += gap) {
				for (let x = ox; x < width; x += gap) {
					const n =
						noise(x * 0.004 - t * 0.05, y * 0.006, t * 0.08) * 0.6 +
						noise(x * 0.012, y * 0.012 + t * 0.04, 4) * 0.4;
					let v = Math.max(0, n * 0.55 + 0.5) ** 1.6;
					const fx = (x / width - fade.x) / fade.rx;
					const fy = (y / height - fade.y) / fade.ry;
					const fall = Math.max(0, 1 - Math.sqrt(fx * fx + fy * fy));
					if (fall <= 0) continue;
					v *= fall * 1.4;
					const dx = x - sp.x;
					const dy = y - sp.y;
					const h = sp.s * Math.exp(-(dx * dx + dy * dy) / 14000);
					v = Math.min(1, v * 0.9 + h * 0.9);
					if (v < 0.03) continue;
					const r = 0.8 + v * 1.8 + h * 0.8;
					const bucket = Math.min(B - 1, Math.floor(v * B));
					(h > 0.25 ? hot : base)[bucket].rect(x - r / 2, y - r / 2, r, r);
				}
			}
			for (let b = 0; b < B; b++) {
				const a = (((b + 0.5) / B) * alpha).toFixed(3);
				ctx.fillStyle = `rgba(${color},${a})`;
				ctx.fill(base[b]);
				ctx.fillStyle = `rgba(${accent},${a})`;
				ctx.fill(hot[b]);
			}
		},
		{ staticTime: 2 },
	);

	return <canvas ref={ref} className={className} aria-hidden="true" />;
}
