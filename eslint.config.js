// Latest syntax and ES modules (eslint defaults) plus the browser globals in use.
export default [
  {
    files: ['assets/*.js'],
    languageOptions: {
      globals: {
        document: 'readonly',
        window: 'readonly',
        fetch: 'readonly',
        AbortSignal: 'readonly',
        Element: 'readonly',
        HTMLTableRowElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLTextAreaElement: 'readonly',
      },
    },
    rules: { 'no-undef': 'error', 'no-unused-vars': 'error' },
  },
]
