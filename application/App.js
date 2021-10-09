import React from 'react';
import {View} from 'react-native';
import UserSolvingActivity from './src/activities/UserSolvingActivity';
import styles from './src/data/Styles';

const sampleGameData = {
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
};

const App = () => {
  return (
    <View style={styles.application}>
      <UserSolvingActivity gameData={sampleGameData} />
    </View>
  );
};

export default App;
