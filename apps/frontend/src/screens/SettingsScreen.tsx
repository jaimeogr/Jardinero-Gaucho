// SettingsScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import GoogleAuth from '@/services/GoogleAuth';

const SettingsScreen = () => {
  const { signOut } = GoogleAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      // After signing out, navigate to the sign-in screen or another appropriate screen
      // navigation.navigate('SignIn');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={handleSignOut}>
        Sign Out
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
