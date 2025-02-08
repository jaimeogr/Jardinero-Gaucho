import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

import useHomeScreenController from '@/controllers/useHomeScreenController';
import BottomTabNavigator from '@/navigation/BottonTabNavigator';
import SignInScreen from '@/screens/SignInScreen';
import SignUpScreen from '@/screens/SignUpScreen';
import useUserStore from '@/stores/useUserStore';
import { UserInterface } from '@/types/types';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const { initializeServices } = useHomeScreenController();

  useEffect(() => {
    initializeServices();
  }, []);

  const currentUser: UserInterface | null = useUserStore((state) => state.currentUser);

  if (currentUser) {
    return <BottomTabNavigator />;
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa', // Light background for better visibility
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  error: {
    color: 'red',
    marginTop: 10,
    fontSize: 14,
  },
});

export default AuthNavigator;
