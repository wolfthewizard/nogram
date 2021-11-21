import React, {useCallback, useEffect, useRef, useState} from 'react';
import {BackHandler, View} from 'react-native';
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
import FastBoard from '../components/FastBoard';

const UserSolvingActivity = ({route, navigation}) => {
  const {gameData} = route.params;
  const [gameState, setGameState] = useState(GameStates.GOING);
  const [gameFinished, setGameFinished] = useState(false);
  const [mode, setMode] = useState(Modes.UNCOVER);
  const [lives, setLives] = useState(
    gameData.currentLives || gameData.maxLives,
  );
  const [fields, setFields] = useState(gameData.fields);

  useEffect(
    () =>
      setFields(
        fields.map((row) =>
          row.map((field) =>
            field.state !== undefined
              ? field
              : {...field, state: FieldStates.UNTOUCHED},
          ),
        ),
      ),
    [],
  );

  const tilesLeft = useRef(gameData.tilesLeft);

  useEffect(() => {
    const lives =
      gameData.maxLives -
      fields.reduce(
        (a, row) =>
          a +
          row.reduce(
            (b, field) =>
              b + (field.state === FieldStates.WRONGLY_UNCOVERED ? 1 : 0),
            0,
          ),
        0,
      );
    tilesLeft.current =
      gameData.totalPixels -
      fields.reduce(
        (a, row) =>
          a +
          row.reduce(
            (b, field) =>
              b + (field.state === FieldStates.CORRECTLY_UNCOVERED ? 1 : 0),
            0,
          ),
        0,
      );

    if (
      (lives !== gameData.maxLives ||
        tilesLeft.current !== gameData.totalPixels) &&
      gameData.solveStatus !== SolveStatus.BEGAN
    ) {
      gameData.solveStatus = SolveStatus.BEGAN;
      saveGameStatus(gameData.id, SolveStatus.BEGAN);
    }

    if (lives <= 0) {
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
    } else if (tilesLeft.current === 0) {
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
      saveGameLivesCount(gameData.id, lives);
      setLives(lives);
    }
  }, [fields]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        !gameFinished && saveGameFieldsState(gameData.id, fields);
        saveGameFoundPixels(
          gameData.id,
          gameData.totalPixels - tilesLeft.current,
        );
        return false; // close activity and go back
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [fields, gameFinished]),
  );

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 0.8}}>
        <FastBoard
          boardWidth={gameData.boardWidth}
          boardHeight={gameData.boardHeight}
          fields={fields}
          mode={mode}
          gameFinished={gameFinished}
          setFields={setFields}
        />
      </View>
      <View style={{flex: 0.2}}>
        {gameState === GameStates.GOING && (
          <View style={{flex: 1, width: '100%'}}>
            <View style={{flex: 0.5, alignItems: 'center'}}>
              <ModeSwitch mode={mode} setMode={setMode} />
            </View>
            <View style={{flex: 0.5, alignItems: 'center'}}>
              <LifeBar maxLives={gameData.maxLives} lives={lives} />
            </View>
          </View>
        )}
        {gameState === GameStates.WON && (
          <Text style={{color: 'white', fontSize: 50, textAlign: 'center'}}>
            You win!
          </Text>
        )}
        {gameState === GameStates.LOST && (
          <Text style={{color: 'white', fontSize: 50, textAlign: 'center'}}>
            You lose!
          </Text>
        )}
      </View>
    </View>
  );
};

export default UserSolvingActivity;
