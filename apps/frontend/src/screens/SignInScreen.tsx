// SignInScreen.tsx
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import React, { useState } from 'react';
import { Button, View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import CustomTextInput from '@/components/CustomTextInput';
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
        />

        <Button title="Sign in" onPress={() => signInWithEmailPassword(emailAddress, password)} />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View>
          <Text style={styles.divider}>O iniciá sesión con:</Text>
          <Button title="Google Sign-In" onPress={signInWithGoogle} color="#4285F4" />
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={signInWithGoogle}
          />
        </View>

        <View style={styles.signupSection}>
          <Text>Dont have an account?</Text>
          <Button title="Don't have an account? Sign Up" onPress={() => navigation.navigate('SignUp')} />
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
    width: '100%',
  },
  divider: {
    marginVertical: 10,
    fontSize: 16,
  },
  signupSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default SignInScreen;
