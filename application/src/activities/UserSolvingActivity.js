import React, {useState} from 'react';
import {View} from 'react-native';
import Board from '../components/Board';
import Modes from '../enums/SolveModes';
import ModeSwitch from '../components/ModeSwitch';
import LifeBar from '../components/LifeBar';

const UserSolvingActivity = ({gameData}) => {
  const [mode, setMode] = useState(Modes.UNCOVER);
  const [lives, setLives] = useState(gameData.currentLives);

  return (
    <View style={{alignItems: 'center'}}>
      <Board boardData={gameData.boardData} mode={mode} setLives={setLives} />
      <ModeSwitch mode={mode} setMode={setMode} />
      <LifeBar maxLives={gameData.maxLives} lives={lives} />
    </View>
  );
};

export default UserSolvingActivity;
