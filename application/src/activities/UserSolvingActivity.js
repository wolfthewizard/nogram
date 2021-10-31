import React, {useCallback, useEffect, useState} from 'react';
import {BackHandler, View} from 'react-native';
import Board from '../components/Board';
import Modes from '../enums/SolveModes';
import ModeSwitch from '../components/ModeSwitch';
import LifeBar from '../components/LifeBar';
import GameStates from '../enums/GameStates';
import {Text} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/core';
import FinishType from '../enums/FinishType';
import SolveStatus from '../enums/SolveStatus';
import {
  saveGameFieldsState,
  saveGameFinishType,
  saveGameFoundPixels,
  saveGameLivesCount,
  saveGameStatus,
} from '../db/GameDBMediator';
import FieldStates from '../enums/FieldStates';

const UserSolvingActivity = ({route, navigation}) => {
  const {gameData} = route.params;
  const [gameState, setGameState] = useState(GameStates.GOING);
  const [gameFinished, setGameFinished] = useState(false);
  const [mode, setMode] = useState(Modes.UNCOVER);
  const [lives, setLives] = useState(
    gameData.currentLives || gameData.maxLives,
  );
  const [tilesLeft, setTilesLeft] = useState(
    gameData.totalPixels - gameData.foundPixels,
  );
  const [fields, setFields] = useState(gameData.fields);

  const decrementLives = () => {
    setLives((previousLives) => previousLives - 1);
    if (gameData.solveStatus !== SolveStatus.BEGAN) {
      gameData.solveStatus = SolveStatus.BEGAN;
      saveGameStatus(gameData.id, SolveStatus.BEGAN);
    }
  };

  const decrementTilesLeft = () => {
    setTilesLeft((previousTiles) => previousTiles - 1);
    if (gameData.solveStatus !== SolveStatus.BEGAN) {
      gameData.solveStatus = SolveStatus.BEGAN;
      saveGameStatus(gameData.id, SolveStatus.BEGAN);
    }
  };

  useEffect(() => {
    if (lives === 0) {
      setGameState(GameStates.LOST);
      setGameFinished(true);
      if (gameData.finishType === FinishType.NEVER_FINISHED) {
        saveGameFinishType(gameData.id, FinishType.LOST_WITHOUT_FINISHING);
        saveGameStatus(gameData.id, SolveStatus.UNSOLVED);
      } else if (
        gameData.finishType === FinishType.FINISHED_WITHOUT_LOSING ||
        gameData.finishType === FinishType.FINISHED_WITH_LOSING
      ) {
        saveGameStatus(gameData.id, SolveStatus.SOLVED);
      }
      saveGameFoundPixels(gameData.id, 0);
      saveGameLivesCount(gameData.id, gameData.maxLives);
      saveGameFieldsState(
        gameData.id,
        fields.map((row) =>
          row.map((field) => ({...field, state: FieldStates.UNTOUCHED})),
        ),
      );
    } else if (tilesLeft === 0) {
      setGameState(GameStates.WON);
      setGameFinished(true);
      if (gameData.finishType === FinishType.NEVER_FINISHED) {
        saveGameFinishType(gameData.id, FinishType.FINISHED_WITHOUT_LOSING);
      } else if (gameData.finishType === FinishType.LOST_WITHOUT_FINISHING) {
        saveGameFinishType(gameData.id, FinishType.FINISHED_WITH_LOSING);
      }
      saveGameStatus(gameData.id, SolveStatus.SOLVED);
      saveGameFoundPixels(gameData.id, 0);
      saveGameLivesCount(gameData.id, gameData.maxLives);
      saveGameFieldsState(
        gameData.id,
        fields.map((row) =>
          row.map((field) => ({...field, state: FieldStates.UNTOUCHED})),
        ),
      );
    } else {
      saveGameFoundPixels(gameData.id, gameData.totalPixels - tilesLeft);
      saveGameLivesCount(gameData.id, lives);
    }
  }, [lives, tilesLeft]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        !gameFinished && saveGameFieldsState(gameData.id, fields);
        return false; // close activity and go back
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [fields, gameFinished]),
  );

  return (
    <View style={{alignItems: 'center'}}>
      <Board
        boardWidth={gameData.boardWidth}
        boardHeight={gameData.boardHeight}
        fields={fields}
        mode={mode}
        gameFinished={gameFinished}
        setFields={setFields}
        decrementLives={decrementLives}
        decrementTilesLeft={decrementTilesLeft}
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
