import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

// Flat-config equivalent of the previous `.eslintrc.json`
// (`{ "extends": "next/core-web-vitals" }`). Flat config does not cascade to
// parent directories, so the old `root: true` (worktree nesting guard) is no
// longer needed.
const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Generated output not covered by the defaults (node_modules and
    // dot-directories are ignored by ESLint itself):
    'playwright-report/**',
    'test-results/**',
    'coverage/**',
  ]),
])

export default eslintConfig
