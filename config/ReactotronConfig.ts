// ReactotronConfig.ts
import { NativeModules } from 'react-native';
import Reactotron from 'reactotron-react-native';

// Configure Reactotron
Reactotron.configure({
  name: 'React Native App', // Give your app a name in Reactotron
  host: NativeModules.SourceCode.scriptURL.split('://')[1].split(':')[0], // Ensures it works with both simulator and real device
})
  .useReactNative() // Add all built-in React Native plugins
  .connect(); // Establish the connection

// Clear Reactotron logs on every app refresh
Reactotron.clear();

// If you want to use Reactotron for console logs
console.tron = Reactotron;

export default Reactotron;
