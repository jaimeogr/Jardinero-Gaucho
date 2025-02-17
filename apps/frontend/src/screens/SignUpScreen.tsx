// SignUpScreen.tsx
import React, { useState, useCallback } from 'react';
import { Button, View, Text, TextInput, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';

import CustomTextInput from '@/components/CustomTextInput';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import OrDivider from '@/components/OrDivider';
import TermsAndConditions from '@/components/TermsAndConditions';
import AuthService from '@/services/authService';
import { theme } from '@/styles/styles';

const SignUpScreen = ({ navigation }) => {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  const {
    signInWithGoogle,
    signUpWithEmailPassword,
    clearEmailError,
    clearPasswordError,
    loading,
    error,
    emailError,
    passwordError,
  } = AuthService();

  // Handle submission of sign-up form
  const onSignUpPress = useCallback(async () => {
    await signUpWithEmailPassword(emailAddress, password);

    // If your Supabase settings require confirmation, you might:
    // setPendingVerification(true);
    // or navigate somewhere else. For now, do nothing special.
  }, [emailAddress, password, signUpWithEmailPassword]);

  if (loading) {
    return <ActivityIndicator size="large" color="#4285F4" />;
  }

  // If you want to implement a "Verify your email code" flow manually, you'd do it here.
  // For most Supabase use cases with email confirmations, you'll just wait for the user
  // to click the link in their email, so no code entry is needed. So we’ll skip it for now.
  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Text>Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(text) => setCode(text)}
          style={styles.textInput}
        />
        <Button
          title="Verify"
          onPress={() => {
            /* not implemented */
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.elementsWrapper}>
        <Text style={styles.title}>Registrate y mateá con Tero!</Text>
        <GoogleSignInButton onPress={signInWithGoogle} />

        <OrDivider />

        <CustomTextInput
          label="Email"
          placeholder="Ingresá el email"
          value={emailAddress}
          onChangeText={(emailAddress) => {
            clearEmailError();
            setEmailAddress(emailAddress);
          }}
          autoCapitalize="none"
          error={emailError}
        />

        <CustomTextInput
          label="Contraseña"
          value={password}
          placeholder="Ingresá la contraseña"
          onChangeText={(text) => {
            clearPasswordError();
            setPassword(text);
          }}
          secureTextEntry={true}
          error={passwordError}
        />

        <Button title="Continuar" onPress={onSignUpPress} />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.signInSection} onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.signInText}>
            Ya tenés una cuenta? <Text style={styles.signInLink}>Iniciar Sesión</Text>
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
    flex: 1,
    width: '100%',
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    marginBottom: 40,
    alignSelf: 'center',
  },
  textInput: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
  },
  signInSection: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  signInText: {
    fontSize: 16,
    color: '#333',
  },
  signInLink: {
    fontSize: 16,
    color: theme.colors.link,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 30,
  },
});

export default SignUpScreen;
