import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

// Flat-config equivalent of the previous `.eslintrc.json`
// (`{ "extends": "next/core-web-vitals" }`). Flat config does not cascade to
// parent directories, so the old `root: true` (worktree nesting guard) is no
// longer needed.
const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([
    // eslint-config-next already ignores these via its own preset; restated
    // here for visibility (not an override):
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Generated output not covered by any default. ESLint 9 flat config only
    // default-ignores `**/node_modules/` and `.git/` — other dot-directories
    // are NOT default-ignored, so list them explicitly:
    'playwright-report/**',
    'test-results/**',
    'coverage/**',
    // Local worktrees nested under the main checkout: without this, `pnpm
    // lint` from the main repo descends into each worktree's `.next/` output,
    // because the `.next/**` pattern above anchors at the config directory.
    '.worktrees/**',
    // Untracked local tool state at the main repo root.
    '.codex/**',
  ]),
])

export default eslintConfig
