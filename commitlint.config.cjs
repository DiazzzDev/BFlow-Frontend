module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'ui', 'refactor',
      'chore', 'docs', 'test', 'perf', 'revert',
    ]],
    'type-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-max-length': [2, 'always', 72],
    'subject-min-length': [2, 'always', 10],
  },
  helpUrl: false,  // quita el link de ayuda
  prompt: {
    messages: {
      skip: '(presiona enter para omitir)',
      max: 'máximo %d caracteres',
      min: 'mínimo %d caracteres',
      emptyWarning: 'el campo no puede estar vacío',
      upperLimitWarning: 'demasiado largo',
      lowerLimitWarning: 'demasiado corto',
    },
  },
}