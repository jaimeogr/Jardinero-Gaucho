// linking.ts
import { Linking } from 'react-native';

const linking = {
  // Your custom or universal link prefixes
  // e.g. "jardinero://auth", or "https://yourdomain.com"
  prefixes: ['teromatero://'],

  config: {
    screens: {
      ResetPassword: {
        path: 'reset-password',
        parse: {
          // Example: if your link is something like jardinero://auth/password-reset?token=abc123
          // This parse function gets "abc123" from the query param
          token: (url: string) => url.split('=')[1],
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
