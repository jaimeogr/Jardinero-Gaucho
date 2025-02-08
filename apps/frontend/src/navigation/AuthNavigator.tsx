import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';

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

export default AuthNavigator;
