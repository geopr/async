module.exports = {
	root: true,

	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
	],

	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
	},

	plugins: [
		'@typescript-eslint',
	],

	ignorePatterns: ['dist', '**/*/spec.ts', 'jest.config.js'],

	rules: {
		'indent': ['error', 'tab'],

		'@typescript-eslint/ban-types': [
			'error',
			{
				types: {
					String: false,
					Number: false,
					Boolean: false,
					BigInt: false,
					Function: false,
				},
			},
		],

		"@typescript-eslint/strict-boolean-expressions": [
			'error',
			{
				allowString: false,
				allowNumber: false,
				allowNullableObject: false,
			},
		],
	}
}
