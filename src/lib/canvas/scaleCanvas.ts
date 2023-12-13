export default function scaleCanvas(canvas: HTMLCanvasElement) {
	const ctx = canvas.getContext('2d');
	const dpr = window.devicePixelRatio || 1;

	const baseWidth = 600;
	const baseHeight = 400;

	// Get container size
	const containerWidth = canvas?.parentElement?.clientWidth;
	const containerHeight = canvas?.parentElement?.clientHeight;

	// Set canvas dimensions and scale the canvas
	if (!containerHeight || !containerWidth || !ctx) return;

	const scaleX = containerWidth / baseWidth;
	const scaleY = containerHeight / baseHeight;
	const scale = Math.min(scaleX, scaleY);

	// Set canvas dimensions
	canvas.width = baseWidth * scale * dpr;
	canvas.height = baseHeight * scale * dpr;

	// Set canvas styles
	canvas.style.width = `${baseWidth * scale}px`;
	canvas.style.height = `${baseHeight * scale}px`;

	// Scale canvas
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.scale(scale * dpr, scale * dpr);
}
