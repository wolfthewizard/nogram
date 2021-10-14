import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-elements';

const PuzzleCard = ({puzzleData, openPuzzle}) => {
  return (
    <View
      style={{
        marginHorizontal: 10,
        marginVertical: 5,
        padding: 10,
        backgroundColor: '#404040',
        borderRadius: 15,
      }}>
      <TouchableOpacity onPress={openPuzzle}>
        <Text style={{color: 'white', fontSize: 20}}>{puzzleData.title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PuzzleCard;
