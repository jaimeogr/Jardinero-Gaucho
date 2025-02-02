// App.tsx

import 'react-native-get-random-values';
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// TODO: Replace this imports with @ pattern imports
import { tokenCache } from './cache';
import useHomeScreenController from './src/controllers/useHomeScreenController';
import BottomTabNavigator from './src/navigation/BottonTabNavigator';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';

const Stack = createNativeStackNavigator();

if (__DEV__) {
  console.log('The app is running in development mode');
  import('./config/ReactotronConfig').then(() => console.log('Reactotron Configured'));
} else {
  console.log('The app is running in production mode');
}

export default function App() {
  // Load Clerk publishable key from .env
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error('Missing Clerk Publishable Key. Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in .env');
  }

  const { initializeServices } = useHomeScreenController();

  useEffect(() => {
    initializeServices();
  }, []);

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <PaperProvider>
          <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
              <NavigationContainer>
                <AuthNavigator />
              </NavigationContainer>
            </SafeAreaView>
          </SafeAreaProvider>
        </PaperProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

// 🔹 Authentication-based Navigation
function AuthNavigator() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <BottomTabNavigator />;
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
