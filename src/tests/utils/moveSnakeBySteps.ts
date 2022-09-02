import { vi } from 'vitest';

export default (steps: number) => {
	vi.advanceTimersByTime(steps * 16);
};
