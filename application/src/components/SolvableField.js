import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../data/Colors';
import FieldStates from '../enums/FieldStates';
import Modes from '../enums/SolveModes';
import Styles from '../data/Styles';

const SolvableField = ({fieldData, mode, setLives, size}) => {
  const [visualState, setVisualState] = useState(FieldStates.UNTOUCHED);

  const handlePress = () => {
    if (mode === Modes.UNCOVER) {
      if (visualState === FieldStates.UNTOUCHED) {
        let newVisualState;
        if (fieldData.hasPixel) {
          newVisualState = FieldStates.CORRECTLY_UNCOVERED;
        } else {
          newVisualState = FieldStates.WRONGLY_UNCOVERED;
          setLives((previousLives) => previousLives - 1);
        }
        setVisualState(newVisualState);
      }
    } else {
      const newVisualState =
        visualState === FieldStates.MARKED_EMPTY
          ? FieldStates.UNTOUCHED
          : FieldStates.MARKED_EMPTY;
      setVisualState(newVisualState);
    }
  };

  const backgroundColor =
    visualState !== FieldStates.CORRECTLY_UNCOVERED
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
    visualState === FieldStates.WRONGLY_UNCOVERED
      ? Colors.wrong
      : Colors.default;
  const icon =
    visualState === FieldStates.MARKED_EMPTY ||
    visualState === FieldStates.WRONGLY_UNCOVERED ? (
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
