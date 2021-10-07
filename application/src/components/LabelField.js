import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-elements';
import styles from '../styles';

const LabelField = ({value, size}) => {
  return (
    <View style={[styles.field, styles.hintField]}>
      <Text
        style={{
          ...styles.field,
          width: '100%',
          height: '100%',
          color: 'white',
          textAlign: 'center',
          textAlignVertical: 'center',
          fontSize: 300 * size,
        }}>
        {value}
      </Text>
    </View>
  );
};

export default LabelField;
