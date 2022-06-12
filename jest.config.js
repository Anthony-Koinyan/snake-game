/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
	transform: {
		'^.+\\.svelte$': ['svelte-jester', { preprocess: true }],
		'^.+\\.ts$': 'ts-jest'
	},
	moduleFileExtensions: ['js', 'ts', 'svelte'],
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect']
};
