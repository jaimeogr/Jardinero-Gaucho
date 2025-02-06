// SignInScreen.tsx
import { useSSO, useSignIn } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import React, { useState, useCallback, useEffect } from 'react';
import { Button, View, Text, StyleSheet, TextInput } from 'react-native';

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const SignInScreen = ({ navigation }) => {
  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

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
    try {
      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        strategy: 'oauth_google',
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      } else if (signIn) {
        console.warn('⚠️ OAuth flow requires additional steps for sign-in:', signIn.status);
      } else if (signUp) {
        console.warn('⚠️ OAuth flow requires additional steps for sign-up:', signUp.status);
      } else {
        console.warn('Google - Unknown issue in OAuth flow');
      }
    } catch (err) {
      console.error('Google OAuth Sign-In Error:', err);
    }
  };

  // Apple OAuth sign in
  const onAppleSignInPress = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_apple',
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      } else {
        console.warn('Apple OAuth flow needs additional steps (e.g., MFA)');
      }
    } catch (err) {
      console.error('Apple OAuth Sign-In Error:', err);
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
