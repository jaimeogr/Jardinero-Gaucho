// linking.ts
import { Linking } from 'react-native';

const linking = {
  // Your custom or universal link prefixes
  // e.g. "jardinero://auth", or "https://yourdomain.com"
  prefixes: ['https://jaimeogr.github.io/tero-matero-deep-link-verification'],

  config: {
    screens: {
      ResetPassword: {
        path: 'reset-password/auth/reset',
        parse: {
          token_hash: (val) => val,
          type: (val) => val,
        },
      },
    },
  },

  async getInitialURL() {
    const url = await Linking.getInitialURL();
    return url;
  },
};

export default linking;
