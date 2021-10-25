import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../data/Colors';
import FieldStates from '../enums/FieldStates';
import Modes from '../enums/SolveModes';
import Styles from '../data/Styles';

const SolvableField = ({
  fieldData,
  updateOwnState,
  mode,
  decrementLives,
  decrementTilesLeft,
  gameFinished,
  size,
}) => {
  const handlePress = () => {
    if (!gameFinished) {
      if (mode === Modes.UNCOVER) {
        if (fieldData.state === FieldStates.UNTOUCHED) {
          let newVisualState;
          if (fieldData.hasPixel) {
            newVisualState = FieldStates.CORRECTLY_UNCOVERED;
            decrementTilesLeft();
          } else {
            newVisualState = FieldStates.WRONGLY_UNCOVERED;
            decrementLives();
          }
          updateOwnState(newVisualState);
        }
      } else {
        const newVisualState =
          fieldData.state === FieldStates.MARKED_EMPTY
            ? FieldStates.UNTOUCHED
            : FieldStates.MARKED_EMPTY;
        updateOwnState(newVisualState);
      }
    }
  };

  const backgroundColor =
    fieldData.state !== FieldStates.CORRECTLY_UNCOVERED
      ? Colors.untouchedBoardField
      : fieldData.color
      ? fieldData.color
      : Colors.uncoveredBoardField;

  const style = {
    ...Styles.field,
    ...Styles.boardField,
    width: '100%',
    height: '100%',
    backgroundColor: backgroundColor,
  };

  const iconColor =
    fieldData.state === FieldStates.WRONGLY_UNCOVERED
      ? Colors.wrong
      : Colors.default;
  const icon =
    fieldData.state === FieldStates.MARKED_EMPTY ||
    fieldData.state === FieldStates.WRONGLY_UNCOVERED ? (
      <Icon color={iconColor} name={'close'} size={300 * size} />
    ) : null;

  return (
    <View style={[Styles.field, Styles.boardField]}>
      <TouchableOpacity onPress={handlePress} style={style}>
        {icon}
      </TouchableOpacity>
    </View>
  );
};

export default SolvableField;
