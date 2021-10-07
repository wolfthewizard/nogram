import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../Colors';
import FieldStates from '../enums/FieldStates';
import Modes from '../enums/SolveModes';
import Styles from '../Styles';

const SolvableField = ({fieldData, mode, size}) => {
  const [visualState, setVisualState] = useState(FieldStates.UNTOUCHED);

  const handlePress = () => {
    if (visualState === FieldStates.UNTOUCHED) {
      const newVisualState =
        mode === Modes.UNCOVER
          ? fieldData.hasPixel
            ? FieldStates.CORRECTLY_UNCOVERED
            : FieldStates.WRONGLY_UNCOVERED
          : FieldStates.MARKED_EMPTY;
      setVisualState(newVisualState);
    } else if (visualState === FieldStates.MARKED_EMPTY && mode === Modes.MARK_EMPTY) {
      setVisualState(FieldStates.UNTOUCHED);
    }
  };

  const color =
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
    backgroundColor: color,
  };

  const iconColor = visualState === FieldStates.WRONGLY_UNCOVERED ? '#e03030' : '#808080';

  return (
    <View style={[Styles.field, Styles.boardField]}>
      <TouchableOpacity onPress={handlePress} style={style}>
        {(visualState === FieldStates.MARKED_EMPTY || visualState === FieldStates.WRONGLY_UNCOVERED) && (
          <Icon color={iconColor} name={'close'} size={300 * size} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SolvableField;
