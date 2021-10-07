import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FieldStates from '../enums/FieldStates';
import Modes from '../enums/SolveModes';
import styles from '../styles';

const visualStateRepresentations = ['', 'close', 'close', 'check'];

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

  const style = {...styles.field, ...styles.boardField, width: '100%', height: '100%'};

  const iconColor =
    visualState === FieldStates.WRONGLY_UNCOVERED
      ? '#e03030'
      : visualState === FieldStates.CORRECTLY_UNCOVERED
      ? '#30e030'
      : '#e0e0e0';

  return (
    <View style={[styles.field, styles.boardField]}>
      <TouchableOpacity onPress={handlePress} style={style}>
        {visualState !== FieldStates.UNTOUCHED && (
          <Icon color={iconColor} name={visualStateRepresentations[visualState]} size={300 * size} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SolvableField;
