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

.env variables must start with the prefix 'EXPO_PUBLIC' for them to work using something like: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID

EAS Builds are located in:
C:\Users\current-user\AppData\Local\Temp\eas-cli-nodejs\eas-build-run-cache

Update using EAS, critical Environment variables:
from 'https://docs.expo.dev/eas/environment-variables/'.

"When the --environment flag is provided, eas update will use the environment variables on EAS servers for and won't use the .env files present in your project. Expo CLI will substitute prefixed variables in your code (for example,process.env.EXPO_PUBLIC_VARNAME) with the corresponding plain text and sensitive environment variable values set on EAS servers for the environment specified with the --environment flag.

Any EXPO*PUBLIC* variables in your application code will be replaced inline with the corresponding values from your EAS environment whether that is your local machine or your CI/CD server.

We recommend using the --environment flag to ensure the same environment variables are used both for your update and build jobs."
