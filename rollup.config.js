import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

export default {
  input: "lib/xpath_lexer.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs"
    },
    {
      file: pkg.module,
      format: "es"
    },
  ],
  plugins: [
    typescript({ tsconfigOverride: { exclude: ["test/**/*.ts"] } })
  ]
};
