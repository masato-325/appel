import LoginScreen from './screen/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WebViewScreen from './screen/WebViewScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Image } from 'react-native';

const ChatStack = createStackNavigator();

// const LogoTitle = (props) => (
//     <Image
//       style={{width: 200, height: 50, 
//               resizeMode: 'contain ' }}
//       source={require('./assets/img/APPEL_FULL_Logo-h.png')}
//     />
//   );

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <ChatStack.Navigator screenOptions={{ headerShown: false }}> 
          {/* <ChatStack.Screen name="Login" 
                            component={LoginScreen} 
                            options={{ headerTitle: (props) => <LogoTitle {...props} /> }}
                            he= {{bgColor: 'white', height: 50,}}
                            /> */}
          <ChatStack.Screen name="Login" component={LoginScreen} />
          <ChatStack.Screen name="WebView" component={WebViewScreen} />
        </ChatStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}