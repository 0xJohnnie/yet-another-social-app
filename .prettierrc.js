module.exports = {
  printWidth: 80,
  trailingComma: 'all',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  bracketSpacing: true,

  plugins: [require.resolve('@trivago/prettier-plugin-sort-imports')],

  importOrder: [
    '^(next/(.*)$)|^(next$)',
    '^(mantine/(.*)$)|^(mantine$)',
    '^@core/(.*)$',
    '^@server/(.*)$',
    '^@ui/(.*)$',
    '<THIRD_PARTY_MODULES>',
    'next-seo.config',
    '^components/(.*)$',
    '^assets/(.*)$',
    '^@fontsource/(.*)$',
    '^@/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
};
