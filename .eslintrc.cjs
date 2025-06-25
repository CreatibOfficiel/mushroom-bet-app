module.exports = {
    root: true,
    env: { browser: true, es2021: true, node: true },
    parser: '@typescript-eslint/parser',
    parserOptions: { ecmaVersion: 'latest', sourceType: 'module', project: './tsconfig.json' },
    plugins: [
      '@typescript-eslint',
      'react',
      'react-hooks',
      'import',
      'tailwindcss',
      'sonarjs',
      'prettier',
    ],
    extends: [
      'next/core-web-vitals',            // rules Next.js + React
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:import/recommended',
      'plugin:sonarjs/recommended',      // detect code smells
      'plugin:tailwindcss/recommended',  // signal unknown classes
      'plugin:prettier/recommended',     // activate eslint-plugin-prettier
    ],
    rules: {
      // ------- Style / Qualité -------
      'prettier/prettier': 'error',
      'import/order': [                  // organize imports
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
      'react/react-in-jsx-scope': 'off', // useless with Next 13+
      'react/jsx-uses-react': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
    settings: {
      react: { version: 'detect' },
      tailwindcss: { callees: ['clsx', 'cva'] },
    },
  };
  