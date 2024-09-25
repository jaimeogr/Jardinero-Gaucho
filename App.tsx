import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import "'@/global.css'";
import { StyleSheet, Text, View } from 'react-native';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

import LotesScreen from './screens/LotesScreen';

import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <GluestackUIProvider mode="light">
      <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>
    </GluestackUIProvider>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
