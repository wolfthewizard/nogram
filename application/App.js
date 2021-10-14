import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {View} from 'react-native';
import UserChoosingActivity from './src/activities/UserChoosingActivity';
import UserSolvingActivity from './src/activities/UserSolvingActivity';

import styles from './src/data/Styles';

const sampleGameData = [
  {
    title: 'Smile',
    maxLives: 3,
    currentLives: 3,
    boardData: {
      width: 5,
      height: 5,
      fields: [
        [
          {hasPixel: false},
          {hasPixel: true, color: '#f0f0f0'},
          {hasPixel: false},
          {hasPixel: true, color: '#f0f0f0'},
          {hasPixel: false},
        ],
        [
          {hasPixel: false},
          {hasPixel: true, color: '#080808'},
          {hasPixel: false},
          {hasPixel: true, color: '#080808'},
          {hasPixel: false},
        ],
        [
          {hasPixel: false},
          {hasPixel: false},
          {hasPixel: false},
          {hasPixel: false},
          {hasPixel: false},
        ],
        [
          {hasPixel: true, color: '#d02020'},
          {hasPixel: false},
          {hasPixel: false},
          {hasPixel: false},
          {hasPixel: true, color: '#d02020'},
        ],
        [
          {hasPixel: false},
          {hasPixel: true, color: '#d02020'},
          {hasPixel: true, color: '#d02020'},
          {hasPixel: true, color: '#d02020'},
          {hasPixel: false},
        ],
      ],
    },
  },
  {
    title: 'Five',
    maxLives: 3,
    currentLives: 3,
    boardData: {
      width: 5,
      height: 5,
      fields: [
        [
          {hasPixel: false},
          {hasPixel: true},
          {hasPixel: true},
          {hasPixel: true},
          {hasPixel: false},
        ],
        [
          {hasPixel: false},
          {hasPixel: true},
          {hasPixel: false},
          {hasPixel: false},
          {hasPixel: false},
        ],
        [
          {hasPixel: false},
          {hasPixel: true},
          {hasPixel: true},
          {hasPixel: true},
          {hasPixel: false},
        ],
        [
          {hasPixel: false},
          {hasPixel: false},
          {hasPixel: false},
          {hasPixel: true},
          {hasPixel: false},
        ],
        [
          {hasPixel: false},
          {hasPixel: true},
          {hasPixel: true},
          {hasPixel: true},
          {hasPixel: false},
        ],
      ],
    },
  },
  {
    title: 'Magical Wolf',
    maxLives: 3,
    currentLives: 3,
    boardData: {
      width: 5,
      height: 5,
      fields: [
        [
          {hasPixel: false},
          {hasPixel: false},
          {hasPixel: true, color: '#101060'},
          {hasPixel: true, color: '#101060'},
          {hasPixel: true, color: '#d0d010'},
        ],
        [
          {hasPixel: true, color: '#202020'},
          {hasPixel: true, color: '#101060'},
          {hasPixel: true, color: '#101060'},
          {hasPixel: true, color: '#101060'},
          {hasPixel: true, color: '#202020'},
        ],
        [
          {hasPixel: true, color: '#202020'},
          {hasPixel: true, color: '#202020'},
          {hasPixel: true, color: '#202020'},
          {hasPixel: true, color: '#202020'},
          {hasPixel: true, color: '#202020'},
        ],
        [
          {hasPixel: true, color: '#202020'},
          {hasPixel: true, color: '#a01010'},
          {hasPixel: true, color: '#202020'},
          {hasPixel: true, color: '#a01010'},
          {hasPixel: true, color: '#202020'},
        ],
        [
          {hasPixel: true, color: '#202020'},
          {hasPixel: true, color: '#202020'},
          {hasPixel: true, color: '#202020'},
          {hasPixel: true, color: '#202020'},
          {hasPixel: true, color: '#202020'},
        ],
      ],
    },
  },
  {
    title: 'Chick',
    maxLives: 3,
    currentLives: 3,
    boardData: {
      width: 5,
      height: 5,
      fields: [
        [
          {hasPixel: false},
          {hasPixel: true, color: '#020202'},
          {hasPixel: true, color: '#d0d010'},
          {hasPixel: false},
          {hasPixel: false},
        ],
        [
          {hasPixel: true, color: '#d08020'},
          {hasPixel: true, color: '#d08020'},
          {hasPixel: true, color: '#d0d010'},
          {hasPixel: false},
          {hasPixel: false},
        ],
        [
          {hasPixel: false},
          {hasPixel: true, color: '#d0d010'},
          {hasPixel: true, color: '#d0d010'},
          {hasPixel: true, color: '#d0d010'},
          {hasPixel: true, color: '#d0d010'},
        ],
        [
          {hasPixel: false},
          {hasPixel: false},
          {hasPixel: true, color: '#654321'},
          {hasPixel: false},
          {hasPixel: false},
        ],
        [
          {hasPixel: false},
          {hasPixel: true, color: '#654321'},
          {hasPixel: true, color: '#654321'},
          {hasPixel: false},
          {hasPixel: false},
        ],
      ],
    },
  },
];

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
        {(props) => (
          <UserChoosingActivity {...props} puzzles={sampleGameData} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Play Puzzle" component={UserSolvingActivity} />
    </Stack.Navigator>
  </NavigationContainer>
);

const App = () => (
  <View style={styles.application}>
    <NogramStack />
  </View>
);

export default App;
