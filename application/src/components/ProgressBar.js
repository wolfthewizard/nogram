import React from 'react';
import {View} from 'react-native';
import Colors from '../data/Colors';

const ProgressBar = ({progress}) => {
  return (
    <View
      style={{
        width: '100%',
        height: 12,
        borderRadius: 100,
        backgroundColor: '#101010',
        overflow: 'hidden',
      }}>
      <View
        style={{
          width: `${progress * 100}%`,
          height: '100%',
          backgroundColor: Colors.copper,
          borderRadius: 100,
        }}></View>
    </View>
  );
};

export default ProgressBar;
