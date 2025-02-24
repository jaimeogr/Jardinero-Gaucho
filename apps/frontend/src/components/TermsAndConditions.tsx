// TermsAndConditions.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { theme } from '@/styles/styles';

const TermsAndConditions = () => {
  // TODO: This component sometimes flickers when opening the keyboard in the SignInScreen or SignUpScreen. Fix it.
  return (
    <View style={styles.termsAndConditions}>
      {/* TODO: add links to the Terms and Conditions, and to the Privacy Policy*/}
      <Text style={styles.termsText}>
        Al registrarte o usar esta aplicación, aceptas nuestros{' '}
        <Text style={styles.termsLink} onPress={() => console.error('Go to T&C')}>
          Términos y Condiciones
        </Text>{' '}
        y nuestra{' '}
        <Text style={styles.termsLink} onPress={() => console.error('Go to Privacy Policy')}>
          Política de Privacidad
        </Text>
        .
      </Text>
    </View>
  );
};

export default TermsAndConditions;

const styles = StyleSheet.create({
  termsAndConditions: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  termsLink: {
    color: theme.colors.link,
    fontWeight: 'bold',
  },
});
