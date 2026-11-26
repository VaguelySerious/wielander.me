// Compact 3D simplex noise (after Stefan Gustavson), seeded.
export function createNoise3D(seed = 1) {
	const perm = new Uint8Array(512);
	const p = new Uint8Array(256);
	for (let i = 0; i < 256; i++) p[i] = i;
	let s = seed >>> 0 || 1;
	for (let i = 255; i > 0; i--) {
		s = (s * 1664525 + 1013904223) >>> 0;
		const j = s % (i + 1);
		[p[i], p[j]] = [p[j], p[i]];
	}
	for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
	const grad = [
		1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0,
		-1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1,
	];
	const F3 = 1 / 3;
	const G3 = 1 / 6;
	return function noise(x: number, y: number, z: number) {
		const s = (x + y + z) * F3;
		const i = Math.floor(x + s);
		const j = Math.floor(y + s);
		const k = Math.floor(z + s);
		const t = (i + j + k) * G3;
		const x0 = x - (i - t);
		const y0 = y - (j - t);
		const z0 = z - (k - t);
		let i1: number, j1: number, k1: number, i2: number, j2: number, k2: number;
		if (x0 >= y0) {
			if (y0 >= z0) [i1, j1, k1, i2, j2, k2] = [1, 0, 0, 1, 1, 0];
			else if (x0 >= z0) [i1, j1, k1, i2, j2, k2] = [1, 0, 0, 1, 0, 1];
			else [i1, j1, k1, i2, j2, k2] = [0, 0, 1, 1, 0, 1];
		} else {
			if (y0 < z0) [i1, j1, k1, i2, j2, k2] = [0, 0, 1, 0, 1, 1];
			else if (x0 < z0) [i1, j1, k1, i2, j2, k2] = [0, 1, 0, 0, 1, 1];
			else [i1, j1, k1, i2, j2, k2] = [0, 1, 0, 1, 1, 0];
		}
		const x1 = x0 - i1 + G3;
		const y1 = y0 - j1 + G3;
		const z1 = z0 - k1 + G3;
		const x2 = x0 - i2 + 2 * G3;
		const y2 = y0 - j2 + 2 * G3;
		const z2 = z0 - k2 + 2 * G3;
		const x3 = x0 - 1 + 3 * G3;
		const y3 = y0 - 1 + 3 * G3;
		const z3 = z0 - 1 + 3 * G3;
		const ii = i & 255;
		const jj = j & 255;
		const kk = k & 255;
		const corner = (gx: number, x: number, y: number, z: number) => {
			let tt = 0.6 - x * x - y * y - z * z;
			if (tt < 0) return 0;
			const g = (gx % 12) * 3;
			tt *= tt;
			return tt * tt * (grad[g] * x + grad[g + 1] * y + grad[g + 2] * z);
		};
		const n0 = corner(perm[ii + perm[jj + perm[kk]]], x0, y0, z0);
		const n1 = corner(
			perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]],
			x1,
			y1,
			z1,
		);
		const n2 = corner(
			perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]],
			x2,
			y2,
			z2,
		);
		const n3 = corner(perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]], x3, y3, z3);
		return 32 * (n0 + n1 + n2 + n3); // ~[-1, 1]
	};
}
