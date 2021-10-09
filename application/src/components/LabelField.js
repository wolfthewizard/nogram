import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-elements';
import Styles from '../data/Styles';

const LabelField = ({value, size}) => {
  return (
    <View style={[Styles.field, Styles.hintField]}>
      <Text
        style={{
          ...Styles.field,
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
