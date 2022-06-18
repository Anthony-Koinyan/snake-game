export interface SnakeCoords {
	x1: number;
	x2: number;
	y1: number;
	y2: number;
	direction: 'right' | 'left' | 'up' | 'down';
}

class Snake {
	thickness: number;
	chunckSize: number;
	private body: SnakeCoords[];

	constructor(thickness: number, chunkSize: number, bodyCoords: SnakeCoords) {
		this.thickness = thickness;
		this.chunckSize = chunkSize;
		this.body = [];
		this.body.push(bodyCoords);
	}

	get head() {
		return this.body[0];
	}

	set head(headCoords: SnakeCoords) {
		if (this.body.length > 1) {
			if (this.head.direction === 'right') {
				this.head.x1 -= this.thickness;
			}

			if (this.head.direction === 'left') {
				this.head.x1 += this.thickness;
			}
		}

		this.body.unshift(headCoords);
	}

	get tail() {
		return this.body[this.body.length - 1];
	}

	set tail(tailCoords: SnakeCoords) {
		this.body.push(tailCoords);
	}

	get snakeBody(): SnakeCoords[] {
		return JSON.parse(JSON.stringify(this.body));
	}

	removeTail() {
		this.body.pop();
	}
}

export default Snake;
