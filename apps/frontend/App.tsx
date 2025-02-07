// App.tsx

import 'react-native-get-random-values';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// TODO: Replace this imports with @ pattern imports
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
  const { initializeServices } = useHomeScreenController();

  useEffect(() => {
    initializeServices();
  }, []);

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
          <NavigationContainer>
            <AuthNavigator />
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

// Authentication-based Navigation
function AuthNavigator() {
  // TODO: Replace this with a proper authentication check
  const isSignedIn = false;

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
