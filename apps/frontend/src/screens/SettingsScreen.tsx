// SettingsScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import AuthService from '@/services/authService';

const SettingsScreen = ({ navigation }) => {
  const { signOut } = AuthService();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={handleSignOut}>
        Sign Out
      </Button>
      <Button style={{ marginTop: 40 }} mode="contained" onPress={() => navigation.navigate('WorkgroupSelection')}>
        Mis grupos de trabajo
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
