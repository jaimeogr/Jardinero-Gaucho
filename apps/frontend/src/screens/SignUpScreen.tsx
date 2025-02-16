// SignUpScreen.tsx

import React, { useState, useCallback } from 'react';
import { Button, View, Text, TextInput, ActivityIndicator, StyleSheet } from 'react-native';

import AuthService from '@/services/authService';

const SignUpScreen = ({ navigation }) => {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  const { signUpWithEmailPassword, loading, error } = AuthService();

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
      <Text>Sign Up</Text>

      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(text) => setEmailAddress(text)}
        style={styles.textInput}
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        style={styles.textInput}
      />

      <Button title="Continue" onPress={onSignUpPress} />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default SignUpScreen;
