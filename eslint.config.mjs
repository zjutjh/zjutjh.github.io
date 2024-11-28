import zjutjh from "@zjutjh/eslint-config";

export default [
  ...await zjutjh({
    ts: true,
    vue: true,
    taro: false
  }),
  {
    name: "local/ignores",
    ignores: [
      ".nuxt",
      ".output",
      "dist"
    ]
  }
];