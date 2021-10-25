import React, {useCallback, useEffect, useState} from 'react';
import {BackHandler, View} from 'react-native';
import Board from '../components/Board';
import Modes from '../enums/SolveModes';
import ModeSwitch from '../components/ModeSwitch';
import LifeBar from '../components/LifeBar';
import GameStates from '../enums/GameStates';
import {Text} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/core';
import GameDBMediator from '../db/GameDBMediator';
import FinishType from '../enums/FinishType';
import SolveStatus from '../enums/SolveStatus';

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
  const [fields, setFields] = useState(gameData.boardData.fields);

  const decrementLives = () => {
    setLives((previousLives) => previousLives - 1);
    if (gameData.solveStatus !== SolveStatus.BEGAN) {
      gameData.solveStatus = SolveStatus.BEGAN;
      GameDBMediator.saveGameStatus(SolveStatus.BEGAN);
    }
  };

  const decrementTilesLeft = () => {
    setTilesLeft((previousTiles) => previousTiles - 1);
    if (gameData.solveStatus !== SolveStatus.BEGAN) {
      gameData.solveStatus = SolveStatus.BEGAN;
      GameDBMediator.saveGameStatus(SolveStatus.BEGAN);
    }
  };

  // useEffect(() => {
  //   GameDBMediator.saveGameFoundPixels(
  //     gameData.id,
  //     gameData.totalPixels - tilesLeft,
  //   );
  // }, [tilesLeft]);

  // useEffect(
  //   () => GameDBMediator.saveGameLivesCount(gameData.id, lives),
  //   [lives],
  // );

  useEffect(() => {
    if (lives === 0) {
      setGameState(GameStates.LOST);
      setGameFinished(true);
      if (gameData.finishType === FinishType.NEVER_FINISHED) {
        // GameDBMediator.saveGameFinishType(
        //   gameData.id,
        //   FinishType.LOST_WITHOUT_FINISHING,
        // );
        // GameDBMediator.saveGameStatus(gameData.id, SolveStatus.UNSOLVED);
        GameDBMediator.afterGame(
          gameData.id,
          gameData.totalPixels - tilesLeft,
          SolveStatus.UNSOLVED,
          FinishType.LOST_WITHOUT_FINISHING,
        );
      } else if (
        gameData.finishType === FinishType.FINISHED_WITHOUT_LOSING ||
        gameData.finishType === FinishType.FINISHED_WITH_LOSING
      ) {
        // GameDBMediator.saveGameStatus(gameData.id, SolveStatus.SOLVED);
        GameDBMediator.afterGame(
          gameData.id,
          gameData.totalPixels - tilesLeft,
          SolveStatus.SOLVED,
          gameData.finishType,
        );
      }
    } else if (tilesLeft === 0) {
      setGameState(GameStates.WON);
      setGameFinished(true);
      if (gameData.finishType === FinishType.NEVER_FINISHED) {
        // GameDBMediator.saveGameFinishType(
        //   gameData.id,
        //   FinishType.FINISHED_WITHOUT_LOSING,
        // );
        GameDBMediator.afterGame(
          gameData.id,
          gameData.totalPixels - tilesLeft,
          SolveStatus.SOLVED,
          FinishType.FINISHED_WITHOUT_LOSING,
        );
      } else if (gameData.finishType === FinishType.LOST_WITHOUT_FINISHING) {
        // GameDBMediator.saveGameFinishType(
        //   gameData.id,
        //   FinishType.FINISHED_WITH_LOSING,
        // );
        GameDBMediator.afterGame(
          gameData.id,
          gameData.totalPixels - tilesLeft,
          SolveStatus.SOLVED,
          FinishType.FINISHED_WITH_LOSING,
        );
      }
      // GameDBMediator.saveGameStatus(gameData.id, SolveStatus.SOLVED);
    } else {
      GameDBMediator.saveGameFoundPixels(
        gameData.id,
        gameData.totalPixels - tilesLeft,
      );
      GameDBMediator.saveGameLivesCount(gameData.id, lives);
    }
  }, [lives, tilesLeft]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        !gameFinished &&
          GameDBMediator.saveGameFieldsState(gameData.id, fields);
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
        boardData={gameData.boardData}
        mode={mode}
        decrementLives={decrementLives}
        decrementTilesLeft={decrementTilesLeft}
        gameFinished={gameFinished}
        fields={fields}
        setFields={setFields}
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
