module.exports = {
    parser: "@typescript-eslint/parser", // Specifies the ESLint parser
    parserOptions: {
      ecmaVersion: 2020, // Allows parsing of modern ECMAScript features
      sourceType: "module", // Allows the use of imports
      ecmaFeatures: {
        jsx: true // Enable JSX if you're using React
      },
    },
    extends: [
      "eslint:recommended",
      "plugin:react/recommended", // Use if you're working with React
      "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
      "plugin:prettier/recommended" // Enables eslint-plugin-prettier and displays Prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    ],
    plugins: ["@typescript-eslint"], // Use TypeScript ESLint rules
    rules: {
      // Place any additional ESLint rules here
      "@typescript-eslint/no-unused-vars": ["warn"], // Example: Warns for unused variables
    },
    settings: {
      react: {
        version: "detect" // Automatically detect the React version if you're using React
      }
    }
  };
  