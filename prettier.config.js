/**
 * @type {import("@trivago/prettier-plugin-sort-imports").PrettierConfig}
 */
export default {
  tabWidth: 2,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: ["^@comfyorg", "^./"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
