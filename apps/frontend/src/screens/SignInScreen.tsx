// SignInScreen.tsx
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import React, { useState, useCallback } from 'react';
import { Button, View, Text, StyleSheet, TextInput, ActivityIndicator } from 'react-native';

import GoogleAuth from '@/services/GoogleAuth';

const SignInScreen = ({ navigation }) => {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const { user, loading, error, signIn, signOut } = GoogleAuth();

  // Handle the submission of the sign-in form
  const onSignInPress = useCallback(async () => {
    console.error('Google OAuth Sign-In Error:');
  }, [emailAddress, password]);

  if (loading) {
    return <ActivityIndicator size="large" color="#4285F4" />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <Button title="Sign in" onPress={onSignInPress} />

      <View>
        <Text style={styles.divider}>O iniciá sesión con:</Text>
        <Button title="Google Sign-In" onPress={signIn} color="#4285F4" />
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
        />
      </View>

      <View style={styles.signupSection}>
        <Text>Dont have an account?</Text>
        <Button title="Don't have an account? Sign Up" onPress={() => navigation.navigate('SignUp')} />
      </View>
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
  divider: {
    marginVertical: 10,
    fontSize: 16,
  },
  signupSection: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default SignInScreen;
