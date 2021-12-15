import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-elements';
import Colors from '../data/Colors';

const SolverPuzzleCard = ({puzzleData, openPuzzle, requestDelete}) => {
  return (
    <TouchableOpacity
      onPress={openPuzzle}
      onLongPress={requestDelete}
      delayLongPress={500}>
      <View
        style={{
          backgroundColor: Colors.gray,
          margin: 5,
          marginHorizontal: 10,
          padding: 10,
          borderRadius: 5,
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 5 * global.fontSizeBase,
            fontStyle: puzzleData.name ? 'normal' : 'italic',
          }}>
          {puzzleData.name || 'Unnamed'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default SolverPuzzleCard;
