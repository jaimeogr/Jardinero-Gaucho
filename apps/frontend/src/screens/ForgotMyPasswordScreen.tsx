// ForgotMyPasswordScreen.tsx
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Button, View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import CustomTextInput from '@/components/CustomTextInput';
import AuthService from '@/services/authService';
import { theme } from '@/styles/styles';

const ForgotMyPasswordScreen = ({ navigation }) => {
  const [emailAddress, setEmailAddress] = useState('');
  const { resetPassword, loading, error } = AuthService();

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
          <Text style={styles.title}>Recuperar Contraseña</Text>
          <Text style={styles.description}>Vas a recibir instrucciones en tu email.</Text>
          <CustomTextInput
            label="Email"
            placeholder="Ingresá tu email"
            value={emailAddress}
            autoCapitalize="none"
            onChangeText={(email) => setEmailAddress(email)}
          />
          <Button title="Enviar Instrucciones" onPress={() => resetPassword(emailAddress)} />
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 30,
    paddingTop: 20,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  elementsWrapper: {
    flex: 1,
  },
  formWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    // alignSelf: 'center',
    textAlign: 'left',
  },
  description: {
    fontSize: 18,
    color: '#333',
    textAlign: 'left',
    marginBottom: 20,
    paddingLeft: 4,
  },
  backToSignIn: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backText: {
    fontSize: 16,
    color: theme.colors.link,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default ForgotMyPasswordScreen;
