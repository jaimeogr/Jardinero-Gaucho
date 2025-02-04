import { useSignIn } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import React, { useState, useCallback } from 'react';
import { Button, View, Text, StyleSheet, TextInput } from 'react-native';

const SignInScreen = ({ navigation }) => {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const redirectUrl = Linking.createURL('/auth-callback');

  // Handle the submission of the sign-in form
  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        console.log('Sign in complete, now I should redirect the user');
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, emailAddress, password]);

  // Google OAuth sign in
  const onGoogleSignInPress = async () => {
    if (!isLoaded) return;
    try {
      console.log('Redirect URL:', redirectUrl);

      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl,
        redirectUrlComplete: redirectUrl,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Apple OAuth sign in
  const onAppleSignInPress = async () => {
    if (!isLoaded) return;
    try {
      console.log('Redirect URL:', redirectUrl);

      await signIn.authenticateWithRedirect({
        strategy: 'oauth_apple',
        redirectUrl,
        redirectUrlComplete: redirectUrl,
      });
    } catch (err) {
      console.error(err);
    }
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
        <Button title="Sign in with Apple" onPress={onAppleSignInPress} />
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
