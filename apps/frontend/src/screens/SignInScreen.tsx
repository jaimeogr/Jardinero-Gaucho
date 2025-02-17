// SignInScreen.tsx
// import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import React, { useState } from 'react';
import { Button, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';

import CustomTextInput from '@/components/CustomTextInput';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import OrDivider from '@/components/OrDivider';
import TermsAndConditions from '@/components/TermsAndConditions';
import AuthService from '@/services/authService';
import { theme } from '@/styles/styles';

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
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={() => console.error('Forgot password not implemented yet')} //TODO: Implement forgot password
            >
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

        <TermsAndConditions />
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
    paddingTop: 60,
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: 28,
    marginBottom: 40,
    alignSelf: 'center',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  forgotPasswordText: {
    color: theme.colors.link,
    alignSelf: 'flex-end',
    fontWeight: 'bold',
  },
  signupSection: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  signupText: {
    fontSize: 16,
    color: '#333',
  },
  signupLink: {
    fontSize: 16,
    color: theme.colors.link,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default SignInScreen;
