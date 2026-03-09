import antfu from '@antfu/eslint-config'

export default antfu(
  {
    astro: true,
    react: true,
    typescript: true,
    markdown: false,
    yaml: false,
    toml: false,
    formatters: {
      css: true,
    },
    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: false,
    },
    ignores: [
      '**/dist',
      '**/build',
      '**/.wrangler',
      '**/.cache',
      'apps/frontend/.astro/**',
      'apps/frontend/src/components/ui/**/*.tsx',
    ],
  },
  {
    rules: {
      'no-restricted-imports': ['error', {
        paths: [{
          name: 'zod',
          importNames: ['z'],
          message: 'Use `import * as z from "zod"` instead of `import { z }`.',
        }],
      }],
      'unused-imports/no-unused-imports': 'warn',
      'no-console': 'off',
      'no-debugger': 'error',
      'antfu/no-top-level-await': 'off',
      'antfu/if-newline': 'off',
      'e18e/prefer-array-from-map': 'off',
      'e18e/prefer-static-regex': 'off',
      'jsonc/sort-keys': 'off',
      'node/prefer-global/process': 'off',
      'prefer-arrow-callback': 'off',
      'react-dom/no-dangerously-set-innerhtml': 'off',
      'react-naming-convention/use-state': 'off',
      'react-hooks-extra/no-direct-set-state-in-use-effect': 'off',
      'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'style/no-tabs': 'error',
      'style/operator-linebreak': 'off',
      'style/multiline-ternary': 'off',
      'style/quote-props': 'off',
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-named-imports': 'off',
      'perfectionist/sort-exports': 'off',
      'perfectionist/sort-named-exports': 'off',
      'ts/consistent-type-definitions': 'off',
      'unicorn/escape-case': 'off',
    },
  },
  {
    files: ['**/*.astro'],
    rules: {
      'unused-imports/no-unused-imports': 'off',
    },
  },
)
