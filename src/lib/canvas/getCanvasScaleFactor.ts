export default (
	originalWidth: number,
	originalHeight: number,
	maxWidth: number,
	maxHeight: number
) => {
	if (originalWidth > maxWidth || originalHeight > maxHeight) {
		return 1;
	}

	const heightScale = maxHeight / originalHeight;
	const widthScale = maxWidth / originalWidth;
	return Math.min(heightScale, widthScale);
};
