import React, {useState} from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../data/Colors';

const LifeBar = ({maxLives, lives}) => {
  const [dimensions, setDimensions] = useState({width: 0, height: 0});
  const horizontalSize = dimensions.width / maxLives;
  const verticalSize = dimensions.height;
  const size = Math.min(horizontalSize, verticalSize);
  const iconSize = size * 0.8;
  const paddingSize = size * 0.1;

  return (
    <View
      onLayout={(evt) => {
        const {width, height} = evt.nativeEvent.layout;
        setDimensions({width, height});
      }}
      style={{
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
      {[...Array(maxLives).keys()].map((index) => {
        const iconColor =
          index < lives ? Colors.lifeAvailable : Colors.lifeLost;
        return (
          <View
            style={{width: size, height: size, padding: paddingSize}}
            key={index}>
            <Icon color={iconColor} name={'heart'} size={iconSize} />
          </View>
        );
      })}
    </View>
  );
};

export default LifeBar;
