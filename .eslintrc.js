module.exports = {
  parser: "vue-eslint-parser", // Specifies the ESLint parser
  extends: [
    "eslint:recommended",
    "plugin:vue/recommended",
    "plugin:prettier/recommended",
    "plugin:security/recommended"
  ],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2018,
    ecmaFeatures: {
      globalReturn: false,
      impliedStrict: false,
      jsx: false
    },
    parser: "@typescript-eslint/parser"
  },
  env: {
    browser: true,
    node: true
  },
  rules: {
    "vue/html-self-closing": [
      "warning",
      {
        html: "never"
      }
    ],
    "vue/v-on-style": ["warning", "longform"],
    "vue/max-attributes-per-line": [
      "warning",
      {
        singleline: 3,
        multiline: {
          max: 1,
          allowFirstLine: true
        }
      }
    ]
  }
};
