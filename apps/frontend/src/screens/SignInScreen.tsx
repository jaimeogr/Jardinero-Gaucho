// SignInScreen.tsx
import React, { useState, useCallback } from 'react';
import { Button, View, Text, StyleSheet, TextInput } from 'react-native';

const SignInScreen = ({ navigation }) => {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  // Handle the submission of the sign-in form
  const onSignInPress = useCallback(async () => {
    console.error('Google OAuth Sign-In Error:');
  }, [emailAddress, password]);

  // Google OAuth sign in
  const onGoogleSignInPress = async () => {
    console.error('Google OAuth Sign-In Error:');
  };

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
        <Text style={styles.divider}>Or sign in with:</Text>
        <Button title="Sign in with Google" onPress={onGoogleSignInPress} />
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
