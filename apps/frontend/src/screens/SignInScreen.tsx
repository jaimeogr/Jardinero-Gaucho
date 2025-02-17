// SignInScreen.tsx
// import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import React, { useState } from 'react';
import { Button, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';

import CustomTextInput from '@/components/CustomTextInput';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import OrDivider from '@/components/OrDivider';
import AuthService from '@/services/authService';

const SignInScreen = ({ navigation }) => {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const { signInWithGoogle, signInWithEmailPassword, loading, error } = AuthService();

  if (loading) {
    return <ActivityIndicator size="large" color="#4285F4" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.elementsWrapper}>
        <Text style={styles.title}>Iniciar sesión</Text>
        <GoogleSignInButton onPress={signInWithGoogle} />

        <OrDivider />

        <CustomTextInput
          label="Email"
          placeholder="Ingresá el email"
          value={emailAddress}
          autoCapitalize="none"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />

        <CustomTextInput
          label="Contraseña"
          placeholder="Ingresá la contraseña"
          value={password}
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
          contentBetweenInputAndError={
            <TouchableOpacity onPress={() => console.error('Forgot password not implemented yet')}>
              <Text style={styles.forgotPasswordText}>Olvidé mi contraseña</Text>
            </TouchableOpacity>
          }
        />

        <Button title="Iniciar sesión" onPress={() => signInWithEmailPassword(emailAddress, password)} />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.signupSection} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupText}>
            No tenés cuenta todavía? <Text style={styles.signupLink}>Registrarme</Text>
          </Text>
        </TouchableOpacity>

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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  elementsWrapper: {
    paddingTop: 40,
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: 24,
    marginBottom: 40,
    alignSelf: 'center',
  },
  forgotPasswordText: {
    color: 'blue',
    alignSelf: 'flex-end',
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 10,
    fontSize: 16,
  },
  signupSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  signupText: {
    fontSize: 16,
    color: '#333',
  },
  signupLink: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  termsAndConditions: {
    position: 'absolute',
    bottom: 20,
    width: '85%',
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  termsLink: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default SignInScreen;
