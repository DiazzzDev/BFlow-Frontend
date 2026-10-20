/* eslint-env node */
module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-enum': [2, 'always', [
			'feat', 'fix', 'ui', 'refactor',
			'chore', 'docs', 'test', 'perf', 'revert', 'hotfix',
		]],
		'subject-empty': [2, 'never'],
		'subject-max-length': [2, 'always', 125],
		'subject-min-length': [2, 'always', 10],
	},
}