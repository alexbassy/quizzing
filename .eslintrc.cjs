module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/base',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
  ],

  plugins: ['prettier', '@typescript-eslint', 'import'],

  parser: 'vue-eslint-parser',

  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
  },

  rules: {
    'vue/html-indent': 'off',

    'vue/max-attributes-per-line': 'off',

    '@typescript-eslint/no-non-null-assertion': 'off',

    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always',
        },
      },
    ],

    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: 'vue',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: '@/**',
            group: 'external',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['vue'],
      },
    ],
  },
  ignorePatterns: ['node_modules', 'build', 'dist', 'public'],
}
