"use client";

import { useRef } from "react";
import { useCanvas } from "./useCanvas";

/** A Clifford strange attractor whose parameters drift, leaving soft trails. */
export function Attractor({
	className,
	color = [20, 20, 24] as [number, number, number],
	res = 560,
	iterations = 80000,
	speed = 1,
	captionClassName,
}: {
	className?: string;
	color?: [number, number, number];
	res?: number;
	iterations?: number;
	speed?: number;
	captionClassName?: string;
}) {
	const ref = useRef<HTMLCanvasElement>(null);
	const cap = useRef<HTMLElement>(null);
	const frameNo = useRef(0);
	const state = useRef<{
		density: Float32Array;
		off: HTMLCanvasElement;
		octx: CanvasRenderingContext2D;
		img: ImageData;
		x: number;
		y: number;
	} | null>(null);

	useCanvas(
		ref,
		({ ctx, width, height, t }) => {
			if (!state.current) {
				const off = document.createElement("canvas");
				off.width = res;
				off.height = res;
				const octx = off.getContext("2d")!;
				state.current = {
					density: new Float32Array(res * res),
					off,
					octx,
					img: octx.createImageData(res, res),
					x: 0.1,
					y: 0.1,
				};
			}
			const s = state.current;
			const D = s.density;
			const tt = t * speed;
			const a = -1.45 + 0.28 * Math.sin(tt * 0.071);
			const b = 1.55 + 0.25 * Math.sin(tt * 0.053 + 1.3);
			const c = 1.0 + 0.32 * Math.sin(tt * 0.089 + 2.1);
			const d = 0.72 + 0.26 * Math.sin(tt * 0.061 + 3.7);
			if (cap.current && frameNo.current++ % 12 === 0) {
				const f = (v: number) => (v < 0 ? "−" : "+") + Math.abs(v).toFixed(3);
				cap.current.textContent = `a ${f(a)}  b ${f(b)}  c ${f(c)}  d ${f(d)}`;
			}
			const ext = 1 + Math.max(Math.abs(c), Math.abs(d)) + 0.08;
			const k = res / (2 * ext);
			for (let i = 0; i < D.length; i++) D[i] *= 0.9;
			let x = s.x;
			let y = s.y;
			for (let i = 0; i < iterations; i++) {
				const nx = Math.sin(a * y) + c * Math.cos(a * x);
				y = Math.sin(b * x) + d * Math.cos(b * y);
				x = nx;
				const px = ((x + ext) * k) | 0;
				const py = ((y + ext) * k) | 0;
				if (px >= 0 && px < res && py >= 0 && py < res) D[py * res + px] += 1;
			}
			s.x = x;
			s.y = y;
			let max = 0;
			for (let i = 0; i < D.length; i++) if (D[i] > max) max = D[i];
			const lm = Math.log1p(max) || 1;
			const px = s.img.data;
			const [r, g, bl] = color;
			for (let i = 0, p = 0; i < D.length; i++, p += 4) {
				const v = D[i] > 0 ? Math.log1p(D[i]) / lm : 0;
				px[p] = r;
				px[p + 1] = g;
				px[p + 2] = bl;
				px[p + 3] = Math.min(255, v ** 0.9 * 235);
			}
			s.octx.putImageData(s.img, 0, 0);
			ctx.clearRect(0, 0, width, height);
			const size = Math.min(width, height);
			ctx.imageSmoothingEnabled = true;
			ctx.drawImage(s.off, (width - size) / 2, (height - size) / 2, size, size);
		},
		{ staticTime: 0, fps: 30 },
	);

	return (
		<>
			<canvas ref={ref} className={className} aria-hidden="true" />
			{captionClassName && (
				<code ref={cap} className={captionClassName} aria-hidden="true" />
			)}
		</>
	);
}
