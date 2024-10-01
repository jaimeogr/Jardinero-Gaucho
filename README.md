emulator is now in the package lock, android variables have to be in the system variable path for that to work.

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

Its probably better to code in Ubuntu to have access to Flipper and debug and analyze the components tree more easily and with better integration.
