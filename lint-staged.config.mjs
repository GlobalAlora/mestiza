// prettier 3 treats brackets in absolute paths as glob character classes,
// breaking dynamic routes like [id]. Fix: let prettier resolve its own globs
// from the project root instead of receiving absolute paths from lint-staged.
export default {
  '*.{ts,tsx}': (files) => [
    `eslint --fix ${files.map((f) => `"${f}"`).join(' ')}`,
    'prettier --write "src/**/*.{ts,tsx}"',
  ],
  '*.{js,mjs,cjs}': (files) => [
    `eslint --fix ${files.map((f) => `"${f}"`).join(' ')}`,
    'prettier --write "*.{js,mjs,cjs}"',
  ],
  '*.{json,yaml,yml,css,md}': () => ['prettier --write "*.{json,yaml,yml,css,md}"'],
};
