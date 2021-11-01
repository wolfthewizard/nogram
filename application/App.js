import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import UserChoosingActivity from './src/activities/UserChoosingActivity';
import UserSolvingActivity from './src/activities/UserSolvingActivity';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// todo: resolve race condition: initial db population vs db data retrieval

import styles from './src/data/Styles';
import Colors from './src/data/Colors';

const Stack = createNativeStackNavigator();

const UserPuzzlesTab = () => (
  <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
    <Stack.Screen name="Home">
      {(props) => <UserChoosingActivity {...props} />}
    </Stack.Screen>
    <Stack.Screen name="Play Puzzle" component={UserSolvingActivity} />
  </Stack.Navigator>
);

const SolverPuzzlesTab = () => (
  <View>
    <Icon name="robot" size={64} color="red" />
  </View>
);

const Tab = createBottomTabNavigator();

const AppNavigation = () => (
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
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          const iconType = route.name === 'UserPuzzles' ? 'account' : 'robot';
          return <Icon name={iconType} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.copper,
        tabBarInactiveTintColor: Colors.gray,
      })}>
      <Tab.Screen name="UserPuzzles" component={UserPuzzlesTab} />
      <Tab.Screen name="SolverPuzzles" component={SolverPuzzlesTab} />
    </Tab.Navigator>
  </NavigationContainer>
);

const App = () => {
  return (
    <View style={styles.application}>
      <AppNavigation />
    </View>
  );
};

export default App;
