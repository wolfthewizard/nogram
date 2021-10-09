import React from 'react';
import {View} from 'react-native';
import UserSolvingActivity from './src/activities/UserSolvingActivity';
import styles from './src/data/Styles';

const App = () => {
  return (
    <View style={styles.application}>
      <UserSolvingActivity />
    </View>
  );
};

export default App;
