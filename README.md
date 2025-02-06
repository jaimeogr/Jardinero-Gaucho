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

"npm install" has been working, but in case you get into trouble, "npm install --legacy-peer-deps" might be a good option. Since I included Clerk for authentication I started running into this, but I believe it stopped after I configured the monorepo project by including the apps/frontend/index.ts file which directs towars App.tsx.

Since the monorepo project shares dependencies at the root level of the project, its required that dependencies in the frontend and in the backend use the same version to avoid problems.
