"use client";

import { useMemo, useRef } from "react";
import { createNoise3D } from "./noise";
import { useCanvas } from "./useCanvas";

/** Slowly drifting topographic contour lines (marching squares over simplex noise). */
export function Contours({
	className,
	color = "40,36,30",
	levels = 14,
	cell = 9,
	scale = 0.0032,
	speed = 0.035,
	alpha = 0.35,
}: {
	className?: string;
	color?: string;
	levels?: number;
	cell?: number;
	scale?: number;
	speed?: number;
	alpha?: number;
}) {
	const ref = useRef<HTMLCanvasElement>(null);
	const noise = useMemo(() => createNoise3D(7), []);
	const field = useRef(new Float32Array(0));

	useCanvas(
		ref,
		({ ctx, width, height, t, pointer }) => {
			const cols = Math.ceil(width / cell) + 1;
			const rows = Math.ceil(height / cell) + 1;
			if (field.current.length !== cols * rows)
				field.current = new Float32Array(cols * rows);
			const F = field.current;
			const z = t * speed;
			const px = pointer.active ? pointer.x : -1e4;
			const py = pointer.active ? pointer.y : -1e4;
			for (let j = 0; j < rows; j++) {
				for (let i = 0; i < cols; i++) {
					const x = i * cell;
					const y = j * cell;
					let v =
						noise(x * scale, y * scale, z) * 0.75 +
						noise(x * scale * 2.3, y * scale * 2.3, z * 1.6 + 10) * 0.25;
					// A gentle "hill" under the cursor bends nearby contours.
					const dx = x - px;
					const dy = y - py;
					v += 0.35 * Math.exp(-(dx * dx + dy * dy) / 9000);
					F[j * cols + i] = v;
				}
			}
			ctx.clearRect(0, 0, width, height);
			ctx.lineWidth = 0.8;
			ctx.lineJoin = "round";
			for (let l = 0; l < levels; l++) {
				const iso = -0.85 + (1.9 * l) / (levels - 1);
				const major = l % 4 === 0;
				ctx.strokeStyle = `rgba(${color},${major ? alpha * 1.6 : alpha})`;
				ctx.beginPath();
				for (let j = 0; j < rows - 1; j++) {
					for (let i = 0; i < cols - 1; i++) {
						const a = F[j * cols + i];
						const b = F[j * cols + i + 1];
						const c = F[(j + 1) * cols + i + 1];
						const d = F[(j + 1) * cols + i];
						const idx =
							(a > iso ? 8 : 0) |
							(b > iso ? 4 : 0) |
							(c > iso ? 2 : 0) |
							(d > iso ? 1 : 0);
						if (idx === 0 || idx === 15) continue;
						const x = i * cell;
						const y = j * cell;
						const top = () => [x + (cell * (iso - a)) / (b - a), y];
						const right = () => [x + cell, y + (cell * (iso - b)) / (c - b)];
						const bottom = () => [x + (cell * (iso - d)) / (c - d), y + cell];
						const left = () => [x, y + (cell * (iso - a)) / (d - a)];
						const seg = (p: number[], q: number[]) => {
							ctx.moveTo(p[0], p[1]);
							ctx.lineTo(q[0], q[1]);
						};
						switch (idx) {
							case 1:
							case 14:
								seg(left(), bottom());
								break;
							case 2:
							case 13:
								seg(bottom(), right());
								break;
							case 3:
							case 12:
								seg(left(), right());
								break;
							case 4:
							case 11:
								seg(top(), right());
								break;
							case 6:
							case 9:
								seg(top(), bottom());
								break;
							case 7:
							case 8:
								seg(left(), top());
								break;
							case 5:
								seg(left(), top());
								seg(bottom(), right());
								break;
							case 10:
								seg(top(), right());
								seg(left(), bottom());
								break;
						}
					}
				}
				ctx.stroke();
			}
		},
		{ staticTime: 3, fps: 30 },
	);

	return <canvas ref={ref} className={className} aria-hidden="true" />;
}
