/**
 * Vitest stub for the `server-only` package. The real package throws when
 * imported into a Client Component bundle; under Vitest (plain Node) there is
 * no such boundary, so the import is aliased to this empty module in
 * `vitest.config.ts`.
 */
export {}
