/* eslint-disable @typescript-eslint/no-require-imports */
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Tell Metro to ignore `react-dom` (since it's a web dependency)
config.resolver.extraNodeModules = {
  'react-dom': require.resolve('react-native'), // Trick Metro into using react-native instead of react-dom
};

module.exports = config;
