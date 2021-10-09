import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../data/Colors';

const LifeBar = ({maxLives, lives}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      {[...Array(maxLives).keys()].map((index) => {
        const iconColor =
          index < lives ? Colors.lifeAvailable : Colors.lifeLost;
        return (
          <View style={{padding: 5}} key={index}>
            <Icon color={iconColor} name={'heart'} size={50} />
          </View>
        );
      })}
    </View>
  );
};

export default LifeBar;
