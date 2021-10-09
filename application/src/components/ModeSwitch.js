import React from 'react';
import {View} from 'react-native';
import {Switch, Text} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Modes from '../enums/SolveModes';

const ModeSwitch = ({mode, setMode}) => (
  <View flexDirection="row">
    <Text style={{color: 'white'}}>Uncover</Text>
    <Switch
      trackColor={{false: Colors.switchOff, true: Colors.switchOn}}
      thumbColor="#ffffff"
      ios_backgroundColor="#303030"
      onValueChange={() => {
        setMode((previousMode) =>
          previousMode === Modes.MARK_EMPTY ? Modes.UNCOVER : Modes.MARK_EMPTY,
        );
      }}
      value={mode === Modes.MARK_EMPTY}
    />
    <Text style={{color: 'white'}}>Mark</Text>
  </View>
);

export default ModeSwitch;
