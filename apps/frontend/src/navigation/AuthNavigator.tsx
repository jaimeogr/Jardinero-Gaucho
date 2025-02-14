// AuthNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';

import useHomeScreenController from '@/controllers/useHomeScreenController';
import BottomTabNavigator from '@/navigation/BottonTabNavigator';
import SignInScreen from '@/screens/SignInScreen';
import SignUpScreen from '@/screens/SignUpScreen';
import useCurrentAccountStore from '@/stores/useCurrentAccountStore';
import { UserInterface } from '@/types/types';
import supabase from '@/utils/supabase';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const { initializeServices } = useHomeScreenController();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeServices();
  }, []);

  const currentUser: UserInterface | null = useCurrentAccountStore((state) => state.currentUser);

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
