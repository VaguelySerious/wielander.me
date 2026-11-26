"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import s from "./quarks.module.css";

type QuarkAnimation = {
	start(): void;
	update(options: Record<string, unknown>): void;
	destroy(): void;
};

declare global {
	interface Window {
		QuarkAnimation?: new (options: Record<string, unknown>) => QuarkAnimation;
	}
}

const SIZE = 600;

export function Playground() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const quark = useRef<QuarkAnimation | null>(null);
	const [loaded, setLoaded] = useState(false);
	const [count, setCount] = useState(200);
	const [speed, setSpeed] = useState(1);
	const [spacing, setSpacing] = useState(75);

	// The script may already be cached from a previous visit.
	useEffect(() => {
		if (window.QuarkAnimation) setLoaded(true);
	}, []);

	useEffect(() => {
		const QA = window.QuarkAnimation;
		if (!loaded || !QA || !canvasRef.current) return;
		const q = new QA({
			element: canvasRef.current,
			bounds: { x: SIZE, y: SIZE },
			color: "24,24,27",
			respectReducedMotion: true,
		});
		quark.current = q;
		q.start();
		return () => {
			q.destroy();
			quark.current = null;
		};
	}, [loaded]);

	// `loaded` re-runs this once the animation exists, applying current values.
	// biome-ignore lint/correctness/useExhaustiveDependencies: see above
	useEffect(() => {
		quark.current?.update({ count, speed, spacing });
	}, [count, speed, spacing, loaded]);

	const controls = [
		{ label: "Nodes", value: count, set: setCount, min: 1, max: 600, step: 1 },
		{ label: "Speed", value: speed, set: setSpeed, min: 0, max: 4, step: 0.1 },
		{
			label: "Spacing",
			value: spacing,
			set: setSpacing,
			min: 20,
			max: 200,
			step: 1,
		},
	];

	return (
		<>
			<Script
				src="/quarks.js"
				strategy="afterInteractive"
				onLoad={() => setLoaded(true)}
			/>
			<div className={s.controls}>
				{controls.map((c) => (
					<label key={c.label} className={s.control}>
						<span>{c.label}</span>
						<input
							type="range"
							min={c.min}
							max={c.max}
							step={c.step}
							value={c.value}
							onChange={(e) => c.set(Number(e.target.value))}
						/>
						<output>{c.step < 1 ? c.value.toFixed(1) : c.value}</output>
					</label>
				))}
			</div>
			<div className={s.stage}>
				<canvas ref={canvasRef} width={SIZE} height={SIZE} />
			</div>
		</>
	);
}
