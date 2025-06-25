/** @type {import('prettier').Config} */
module.exports = {
    arrowParens: 'avoid',
    bracketSameLine: false,
    embeddedLanguageFormatting: 'auto',
    endOfLine: 'lf',
    printWidth: 100,
    proseWrap: 'preserve',
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'all',
    plugins: ['@ianvs/prettier-plugin-sort-imports'],
    importOrder: ['^react$', '^next', '<THIRD_PARTY_MODULES>', '^@/.*', '^[./]'],
    importOrderSeparation: true,
  };
  