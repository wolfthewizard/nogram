import React from 'react';
import {View} from 'react-native';
import {Switch, Text} from 'react-native-elements';
import Modes from '../enums/SolveModes';

const ModeSwitch = ({mode, setMode}) => (
  <View flexDirection="row">
    <Text style={{color: 'white'}}>Uncover</Text>
    <Switch
      trackColor={{false: '#202020', true: '#d0d0d0'}}
      thumbColor="#ffffff"
      ios_backgroundColor="#303030"
      onValueChange={() => {
        setMode(previousMode => (previousMode === Modes.MARK_EMPTY ? Modes.UNCOVER : Modes.MARK_EMPTY));
      }}
      value={mode === Modes.MARK_EMPTY}
    />
    <Text style={{color: 'white'}}>Mark</Text>
  </View>
);

export default ModeSwitch;
