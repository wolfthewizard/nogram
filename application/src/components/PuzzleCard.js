import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../data/Colors';
import FinishType from '../enums/FinishType';
import SolveStatus from '../enums/SolveStatus';

const PuzzleCard = ({puzzleData, openPuzzle}) => {
  const elementColor =
    puzzleData.finishType === FinishType.FINISHED_WITHOUT_LOSING
      ? Colors.gold
      : puzzleData.finishType === FinishType.FINISHED_WITH_LOSING
      ? Colors.silver
      : Colors.gray;
  const iconName =
    puzzleData.solveStatus === SolveStatus.BEGAN
      ? 'step-forward'
      : puzzleData.solveStatus === SolveStatus.SOLVED
      ? 'check'
      : 'play';
  const iconColor =
    puzzleData.solveStatus === SolveStatus.BEGAN
      ? Colors.darkGray
      : puzzleData.solveStatus === SolveStatus.SOLVED
      ? Colors.green
      : Colors.darkGray;

  return (
    <TouchableOpacity onPress={openPuzzle}>
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: elementColor,
          borderRadius: 5,
          overflow: 'hidden',
        }}>
        <View
          style={{
            flex: 1,
            margin: 4,
            backgroundColor: Colors.gray,
            borderRadius: 5,
            overflow: 'hidden',
          }}>
          <View
            style={{
              flex: 0.75,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name={iconName} size={80} color={iconColor} />
          </View>
          <View
            style={{
              flex: 0.25,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.darkGray,
            }}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontSize: 4 * global.fontSizeBase,
              }}>
              {puzzleData.name || 'Unnamed'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PuzzleCard;
