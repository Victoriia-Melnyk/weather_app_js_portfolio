module.exports = {
  extends: "@mate-academy/eslint-config",
  env: {
    browser: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module", // Додаємо цей параметр для підтримки ES-модулів
  },
  rules: {},
};
