// ResetPasswordScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

import supabase from '@/api/supabase/client'; // Ensure your Supabase client is configured here
import { theme } from '@/styles/styles';

const ResetPasswordScreen = ({ navigation, route }) => {
  // Optionally, you can get a token from the route params if needed
  const { token } = route.params || {};
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) {
        setError(updateError.message);
      } else {
        navigation.navigate('EmailSent');
      }
    } catch (err) {
      setError('Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Restablecer Contraseña</Text>
      <Text style={styles.subheader}>Introduce tu nueva contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Nueva contraseña"
        secureTextEntry
        placeholderTextColor="#999"
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        secureTextEntry
        placeholderTextColor="#999"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.accent} style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Actualizar Contraseña</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    color: theme.colors.primary || '#333',
    marginBottom: 10,
  },
  subheader: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  button: {
    backgroundColor: theme.colors.accent || '#4285F4',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  loader: {
    marginTop: 10,
  },
});

export default ResetPasswordScreen;
