emulator script is in the package json, android variables have to be in the system variable path for that to work.

This configuration is required inside your .vscode/settings.json file:
{
"css.lint.unknownAtRules": "ignore",
"scss.lint.unknownAtRules": "ignore",
"less.lint.unknownAtRules": "ignore",
"editor.codeActionsOnSave": {
"source.fixAll.eslint": "explicit"
},
"eslint.validate": [
"javascript",
"javascriptreact",
"typescript",
"typescriptreact"
],
"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.formatOnSave": true,
"prettier.requireConfig": true,
"eslint.run": "onSave"
}

the script "sound" inside the "apps/frontend/package.json" is just a wrapper for building an EAS development build, but with a feedback sound on success or failure.

Its probably better to code in Ubuntu to have access to Flipper and debug and analyze the components tree more easily and with better integration.

Icons:
import { MaterialCommunityIcons } from '@expo/vector-icons';

when debugging, remember you can use 'react-devtools' command on the console to open the HTML inspector.

POSIBLE ERRORS:

Since the monorepo project shares dependencies at the root level of the project, its required that dependencies in the frontend and in the backend use the same version to avoid problems.

Handling environment variables in different environments:
If you create an environment-specific file, like .env.test, you can load it by setting NODE_ENV when running the Expo CLI:

NODE_ENV=test npx expo start
