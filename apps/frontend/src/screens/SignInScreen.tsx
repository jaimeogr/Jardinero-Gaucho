// SignInScreen.tsx
// import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Button,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

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
      <KeyboardAvoidingView
        style={styles.elementsWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <View style={styles.formWrapper}>
          <Text style={styles.title}>Iniciar sesión</Text>
          <GoogleSignInButton onPress={signInWithGoogle} />

          <OrDivider />

          {/*  TODO: hide email and password labels for this screen? research */}
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
                onPress={() => navigation.navigate('ForgotMyPassword')} //TODO: Implement forgot password
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
        </View>
      </KeyboardAvoidingView>

      <View>
        <TermsAndConditions />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 50,
    paddingTop: 0,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  elementsWrapper: {
    flex: 1,
    // justifyContent: 'center',
  },
  formWrapper: {
    flex: 1, // Allows centering inside KeyboardAvoidingView
    justifyContent: 'center', // Centers form vertically
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
