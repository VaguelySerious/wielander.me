"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

export default function QuarksPage() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const quarkRef = useRef<any>(null);
	const [count, setCount] = useState(200);
	const [scriptLoaded, setScriptLoaded] = useState(false);

	const update = () => {
		if (quarkRef.current) {
			quarkRef.current.update({
				bounds: { x: 600, y: 600 },
				padding: 100,
				count: count,
				color: "0,0,0",
			});
		}
	};

	useEffect(() => {
		if (scriptLoaded && canvasRef.current) {
			const QA = (window as any).QuarkAnimation;
			if (QA) {
				const quark = new QA({
					id: "canvas",
				});
				quarkRef.current = quark;
				update();
				quark.start();

				return () => {
					if (quarkRef.current && quarkRef.current.stop) {
						quarkRef.current.stop();
					}
				};
			}
		}
	}, [scriptLoaded]);

	useEffect(() => {
		update();
	}, [count]);

	return (
		<>
			<Script
				src="/quarks.js"
				onLoad={() => setScriptLoaded(true)}
				strategy="afterInteractive"
			/>
			<main className="main">
				<div className="head" style={{ paddingBottom: "1rem" }}>
					<h1>QuarksJS Playground</h1>
					<div className="quark-input">
						Node count
						<input
							value={count}
							onChange={(e) => setCount(Number(e.target.value))}
							type="range"
							min="1"
							max="500"
							name="count"
							id="count"
						/>
						{count}
					</div>
				</div>
				<canvas id="canvas" ref={canvasRef} width="600" height="600" />
			</main>
		</>
	);
}
