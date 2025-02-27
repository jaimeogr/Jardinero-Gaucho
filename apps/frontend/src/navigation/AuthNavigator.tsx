// AuthNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';

import useHomeScreenController from '@/controllers/useHomeScreenController';
import BottomTabNavigator from '@/navigation/BottonTabNavigator';
import EmailSentScreen from '@/screens/EmailSentScreen';
import ForgotMyPasswordScreen from '@/screens/ForgotMyPasswordScreen';
import ResetPasswordScreen from '@/screens/ResetPasswordScreen';
import SignInScreen from '@/screens/SignInScreen';
import SignUpScreen from '@/screens/SignUpScreen';
import useCurrentAccountStore from '@/stores/useCurrentAccountStore';
import { UserInterface } from '@/types/types';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const { initializeServices } = useHomeScreenController();

  useEffect(() => {
    initializeServices();
  }, []);

  const currentUser: UserInterface | null = useCurrentAccountStore((state) => state.currentUser);
  const authLoaded = useCurrentAccountStore((state) => state.authLoaded);

  if (!authLoaded) {
    return null; // will return nothing until the auth state is loaded in App.tsx
  }

  if (currentUser) {
    return <BottomTabNavigator />;
  }

  // TODO: fix resetPassword deeplink that should open the app on the right screen after the link is pressed on the email.
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="ForgotMyPassword"
        component={ForgotMyPasswordScreen}
        options={{ headerShown: true, title: '' }}
      />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: true, title: '' }} />
      <Stack.Screen name="EmailSent" component={EmailSentScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
