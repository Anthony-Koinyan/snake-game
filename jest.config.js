import presets from 'ts-jest/presets/index.js';
const { jsWithBabel: tsjPreset } = presets;

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
	transform: {
		'^.+\\.svelte$': ['svelte-jester', { preprocess: true }],
		...tsjPreset.transform
	},
	moduleFileExtensions: ['ts', 'svelte', 'js'],
	testEnvironment: 'jsdom',
	testEnvironmentOptions: { pretendToBeVisual: true },
	setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
	setupFiles: ['jest-canvas-mock'],
	moduleNameMapper: {
		'^\\$lib$': '<rootDir>/src/lib',
		'^\\$lib/(.*)$': '<rootDir>/src/lib/$1',
		'^\\$app/(.*)$': '<rootDir>/.svelte-kit/runtime/app/$1'
	}
};
