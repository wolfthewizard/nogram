import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Entypo';
import Colors from '../data/Colors';
import FinishType from '../enums/FinishType';
import SolveStatus from '../enums/SolveStatus';

const getTextColor = (percent) => {
  const h = Math.round(220 * (1 - percent / 100)) * 0x10000 + 255 * 0x100;
  return '#' + ('000000' + h.toString(16)).slice(-6);
};

const PuzzleCard = ({puzzleData, openPuzzle}) => {
  const completePercent = Math.floor(
    (puzzleData.foundPixels / puzzleData.totalPixels) * 100,
  );
  const elementColor =
    puzzleData.finishType === FinishType.FINISHED_WITHOUT_LOSING
      ? Colors.gold
      : puzzleData.finishType === FinishType.FINISHED_WITH_LOSING
      ? Colors.silver
      : '#404040';

  return (
    <View
      style={{
        marginHorizontal: 10,
        marginVertical: 5,
        padding: 10,
        backgroundColor: '#404040',
        borderRadius: 15,
      }}>
      <TouchableOpacity onPress={openPuzzle} style={{flexDirection: 'row'}}>
        <View
          style={{
            flex: 0.2,
            aspectRatio: 1,
            borderRadius: 5,
            backgroundColor: elementColor,
          }}>
          <View
            style={{
              flex: 1,
              margin: 5,
              backgroundColor: '#404040',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {puzzleData.solveStatus === SolveStatus.BEGAN ? (
              <Text
                style={{
                  color: getTextColor(completePercent),
                  fontSize: 30,
                }}>
                {completePercent}%
              </Text>
            ) : puzzleData.solveStatus === SolveStatus.SOLVED ? (
              <Icon name="trophy" size={50} color={elementColor} />
            ) : null}
          </View>
        </View>
        <Text
          style={{
            flex: 0.8,
            color: 'white',
            fontSize: 20,
          }}>
          {puzzleData.name}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PuzzleCard;
