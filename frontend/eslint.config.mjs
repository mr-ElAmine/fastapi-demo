import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginImport from 'eslint-plugin-import';

export default [
  {
    // Ignorer certains fichiers/dossiers
    ignores: [
      'dist/**',
      'node_modules/**',
      'src/vite-env.d.ts',
      'vite.config.ts',
    ],
  },
  {
    // Cible tous les fichiers TypeScript
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        projectService: true,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: eslintPluginPrettier,
      import: eslintPluginImport,
    },
    rules: {
      // Règles générales
      'no-unused-vars': 'off', // Désactivé au profit de la règle TypeScript
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'prettier/prettier': 'error', // Vérifie le formatage avec Prettier

      // Règles d'import
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Modules natifs (Node.js)
            'external', // Modules tiers
            'internal', // Modules internes
            'parent', // Import relatifs vers le parent
            'sibling', // Import relatifs vers les fichiers voisins
            'index', // Import des fichiers index
          ],
          pathGroups: [
            {
              pattern: '@/**', // Gère l’alias "@"
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always', // Ligne vide entre groupes
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-duplicates': 'error', // Évite les doublons dans les imports
      'import/newline-after-import': 'error', // Ligne vide après les imports

      // Règles TypeScript
      '@typescript-eslint/no-explicit-any': 'warn', // Limite l’usage de `any`
      '@typescript-eslint/consistent-type-imports': 'error', // Préfère les imports de type
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Autorise l’inférence des types pour les fonctions
      '@typescript-eslint/no-inferrable-types': 'warn', // Suggère de ne pas déclarer les types inférés
      '@typescript-eslint/no-floating-promises': 'error', // Attrape les promesses non gérées

      // Règles React
      'react/jsx-uses-react': 'off', // Non nécessaire avec React 17+
      'react/react-in-jsx-scope': 'off', // Non nécessaire avec React 17+
      'react-hooks/rules-of-hooks': 'error', // Respect des règles des hooks React
      'react-hooks/exhaustive-deps': 'warn', // Vérifie les dépendances des hooks
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true, // Tente de résoudre les types depuis TypeScript
          project: './tsconfig.json', // Utilise la config TypeScript pour la résolution
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'], // Extensions à résoudre
          paths: ['./src'], // Support de l'alias `@`
        },
      },
    },
  },
];
