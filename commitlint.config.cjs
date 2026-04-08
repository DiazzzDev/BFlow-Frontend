module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feature', 'fix', 'ui', 'refactor',
      'chore', 'docs', 'test', 'perf', 'revert',
    ]],
    'type-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-max-length': [2, 'always', 72],
    'subject-min-length': [2, 'always', 10],
  },
}