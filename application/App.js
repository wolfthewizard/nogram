import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import UserChoosingActivity from './src/activities/UserChoosingActivity';
import UserSolvingActivity from './src/activities/UserSolvingActivity';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './src/data/Styles';
import Colors from './src/data/Colors';
import SolverChoosingActivity from './src/activities/SolverChoosingActivity';
import {Text} from 'react-native-elements';
import SolverSolvingActivity from './src/activities/SolverSolvingActivity';
import SolverInputActivity from './src/activities/SolverInputActivity';
import {initDb} from './src/db/DBMediator';
import {Dimensions} from 'react-native';

const {width} = Dimensions.get('window');
global.fontSizeBase = width * 0.01;

const TabNavigator = createBottomTabNavigator();

const Tabs = () => (
  <TabNavigator.Navigator
    initialRouteName="UserPuzzleChoice"
    screenOptions={({route}) => ({
      headerShown: false,
      tabBarIcon: ({color, size}) => {
        const iconType =
          route.name === 'UserPuzzleChoice' ? 'account' : 'robot';
        return <Icon name={iconType} size={size} color={color} />;
      },
      tabBarLabel: ({color}) =>
        route.name === 'UserPuzzleChoice' ? (
          <Text style={{color}}>Play</Text>
        ) : (
          <Text style={{color}}>Autosolve</Text>
        ),
      tabBarActiveTintColor: Colors.copper,
      tabBarInactiveTintColor: Colors.gray,
    })}>
    <TabNavigator.Screen
      name="UserPuzzleChoice"
      component={UserChoosingActivity}
    />
    <TabNavigator.Screen
      name="SolverPuzzleChoice"
      component={SolverChoosingActivity}
    />
  </TabNavigator.Navigator>
);

const StackNavigator = createNativeStackNavigator();

const Stacks = () => (
  <StackNavigator.Navigator
    initialRouteName="Home"
    screenOptions={{headerShown: false}}>
    <StackNavigator.Screen name="Home" component={Tabs} />
    <StackNavigator.Screen
      name="UserPuzzleSolve"
      component={UserSolvingActivity}
    />
    <StackNavigator.Screen
      name="SolverPuzzleSolve"
      component={SolverSolvingActivity}
    />
    <StackNavigator.Screen
      name="SolverPuzzleInput"
      component={SolverInputActivity}
    />
  </StackNavigator.Navigator>
);

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
    <Stacks />
  </NavigationContainer>
);

const App = () => {
  const [dbReady, setDbReady] = useState(false);
  const [dbSetupId, setDbSetupId] = useState(0);

  useEffect(() => {
    initDb(() => setDbSetupId((prevDbSetupId) => prevDbSetupId + 1));
  }, []);

  useEffect(() => dbSetupId >= 4 && setDbReady(true), [dbSetupId]);

  return (
    <View style={styles.application}>
      {dbReady ? (
        <AppNavigation />
      ) : (
        <ActivityIndicator size="large" color={Colors.copper} />
      )}
    </View>
  );
};

export default App;
