"use client";

import { type RefObject, useEffect, useRef } from "react";

export type Frame = {
	ctx: CanvasRenderingContext2D;
	width: number; // CSS px
	height: number; // CSS px
	t: number; // seconds since start
	dt: number; // seconds since last frame (clamped)
	pointer: Pointer;
};

export type Pointer = {
	x: number;
	y: number;
	active: boolean;
	/** True while a press that started over the canvas is held. */
	down: boolean;
	/** Clicks since the last frame (canvas coords); drained by the consumer. */
	clicks: { x: number; y: number }[];
};

type Setup = (info: { width: number; height: number }) => void;

/**
 * Drives a canvas render loop with DPR scaling, resize handling, pointer
 * tracking, and pausing when offscreen / tab hidden. With reduced motion,
 * renders a single frame (advanced to `staticTime`) and stops.
 */
export function useCanvas(
	ref: RefObject<HTMLCanvasElement | null>,
	draw: (f: Frame) => void,
	opts: {
		setup?: Setup;
		staticTime?: number;
		maxDpr?: number;
		/** Cap the redraw rate for slow-moving, expensive fields. */
		fps?: number;
	} = {},
) {
	const drawRef = useRef(draw);
	drawRef.current = draw;
	const setupRef = useRef(opts.setup);
	setupRef.current = opts.setup;

	// Options are read once on mount; draw/setup stay fresh via refs.
	// biome-ignore lint/correctness/useExhaustiveDependencies: mount-only effect
	useEffect(() => {
		const canvas = ref.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const reduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		const pointer: Pointer = {
			x: -1e4,
			y: -1e4,
			active: false,
			down: false,
			clicks: [],
		};
		let width = 0;
		let height = 0;
		let raf = 0;
		let visible = true;
		let last = performance.now();
		let t = opts.staticTime ?? 0;

		const resize = () => {
			const rect = canvas.getBoundingClientRect();
			const dpr = Math.min(window.devicePixelRatio || 1, opts.maxDpr ?? 2);
			width = rect.width;
			height = rect.height;
			canvas.width = Math.max(1, Math.round(width * dpr));
			canvas.height = Math.max(1, Math.round(height * dpr));
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			setupRef.current?.({ width, height });
			if (reduced) frame(performance.now());
		};

		const frame = (now: number) => {
			const dt = Math.min((now - last) / 1000, 1 / 20);
			last = now;
			if (!reduced) t += dt;
			drawRef.current({ ctx, width, height, t, dt, pointer });
		};

		const minGap = opts.fps ? 1000 / opts.fps - 2 : 0;
		const loop = (now: number) => {
			if (now - last >= minGap) frame(now);
			raf = requestAnimationFrame(loop);
		};
		const start = () => {
			if (reduced || raf || !visible || document.hidden) return;
			last = performance.now();
			raf = requestAnimationFrame(loop);
		};
		const stop = () => {
			cancelAnimationFrame(raf);
			raf = 0;
		};

		const ro = new ResizeObserver(resize);
		ro.observe(canvas);
		const io = new IntersectionObserver(([e]) => {
			visible = e.isIntersecting;
			visible ? start() : stop();
		});
		io.observe(canvas);
		const onVis = () => (document.hidden ? stop() : start());
		document.addEventListener("visibilitychange", onVis);

		const onMove = (e: PointerEvent) => {
			const rect = canvas.getBoundingClientRect();
			pointer.x = e.clientX - rect.left;
			pointer.y = e.clientY - rect.top;
			pointer.active =
				pointer.y >= 0 &&
				pointer.y <= rect.height &&
				pointer.x >= 0 &&
				pointer.x <= rect.width;
		};
		const onLeave = () => {
			pointer.active = false;
		};
		const onDown = (e: PointerEvent) => {
			onMove(e);
			if (!pointer.active) return;
			// Don't treat clicks on links/controls as canvas interactions.
			const target = e.target as Element | null;
			if (target?.closest("a,button,input,label,select,textarea")) return;
			pointer.down = true;
			pointer.clicks.push({ x: pointer.x, y: pointer.y });
			if (reduced) frame(performance.now());
		};
		const onUp = () => {
			pointer.down = false;
		};
		window.addEventListener("pointermove", onMove, { passive: true });
		window.addEventListener("pointerdown", onDown, { passive: true });
		window.addEventListener("pointerup", onUp, { passive: true });
		window.addEventListener("pointercancel", onUp, { passive: true });
		document.addEventListener("pointerleave", onLeave);

		resize();
		start();
		return () => {
			stop();
			ro.disconnect();
			io.disconnect();
			document.removeEventListener("visibilitychange", onVis);
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerdown", onDown);
			window.removeEventListener("pointerup", onUp);
			window.removeEventListener("pointercancel", onUp);
			document.removeEventListener("pointerleave", onLeave);
		};
	}, [ref]);
}
