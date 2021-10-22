import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import UserChoosingActivity from './src/activities/UserChoosingActivity';
import UserSolvingActivity from './src/activities/UserSolvingActivity';
import initDb from './src/db/initDb';

import styles from './src/data/Styles';

const Stack = createNativeStackNavigator();

const NogramStack = () => (
  <NavigationContainer
    theme={{
      dark: true,
      colors: {
        primary: '#d08020',
        background: '#101010',
        card: '#202020',
        text: '#e0e0e0',
        border: '#202020',
        notification: '#404040',
      },
    }}>
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home">
        {(props) => <UserChoosingActivity {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Play Puzzle" component={UserSolvingActivity} />
    </Stack.Navigator>
  </NavigationContainer>
);

const App = () => {
  useEffect(initDb, []);
  return (
    <View style={styles.application}>
      <NogramStack />
    </View>
  );
};

export default App;
