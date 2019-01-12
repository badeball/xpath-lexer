import pkg from "./package.json";

export default {
  input: "lib/xpath_lexer.js",
  output: [
    {
      file: pkg.main,
      format: "cjs",
    },
    {
      file: pkg.module,
      format: "es",
    },
  ]
};
