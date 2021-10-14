import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import Board from '../components/Board';
import Modes from '../enums/SolveModes';
import ModeSwitch from '../components/ModeSwitch';
import LifeBar from '../components/LifeBar';
import GameStates from '../enums/GameStates';
import {Text} from 'react-native-elements';

const UserSolvingActivity = ({route, navigation}) => {
  const {gameData} = route.params;
  const [gameState, setGameState] = useState(GameStates.GOING);
  const [gameFinished, setGameFinished] = useState(false);
  const [mode, setMode] = useState(Modes.UNCOVER);
  const [lives, setLives] = useState(gameData.currentLives);
  const [tilesLeft, setTilesLeft] = useState(
    gameData.boardData.fields.flat().filter((tile) => tile.hasPixel).length,
  );

  const decrementLives = () => setLives((previousLives) => previousLives - 1);
  const decrementTilesLeft = () =>
    setTilesLeft((previousTiles) => previousTiles - 1);

  useEffect(() => {
    if (lives === 0) {
      setGameState(GameStates.LOST);
      setGameFinished(true);
    } else if (tilesLeft === 0) {
      setGameState(GameStates.WON);
      setGameFinished(true);
    }
  }, [lives, tilesLeft]);

  return (
    <View style={{alignItems: 'center'}}>
      <Board
        boardData={gameData.boardData}
        mode={mode}
        decrementLives={decrementLives}
        decrementTilesLeft={decrementTilesLeft}
        gameFinished={gameFinished}
      />
      {gameState === GameStates.GOING && (
        <>
          <ModeSwitch mode={mode} setMode={setMode} />
          <LifeBar maxLives={gameData.maxLives} lives={lives} />
        </>
      )}
      {gameState === GameStates.WON && (
        <Text style={{color: 'white', fontSize: 50}}>You win!</Text>
      )}
      {gameState === GameStates.LOST && (
        <Text style={{color: 'white', fontSize: 50}}>You lose!</Text>
      )}
    </View>
  );
};

export default UserSolvingActivity;
