import React, {useCallback, useEffect, useState} from 'react';
import {BackHandler, View} from 'react-native';
import Board from '../components/Board';
import Modes from '../enums/SolveModes';
import ModeSwitch from '../components/ModeSwitch';
import LifeBar from '../components/LifeBar';
import GameStates from '../enums/GameStates';
import {Button, Text} from 'react-native-elements';
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
import Colors from '../data/Colors';
import Solver from '../solver/UltraNaiveSolver';

const SolverSolvingActivity = ({route, navigation}) => {
  const {gameData} = route.params;
  const [fields, setFields] = useState(gameData.fields);

  return (
    <View style={{alignItems: 'center'}}>
      <Board
        boardWidth={gameData.boardWidth}
        boardHeight={gameData.boardHeight}
        fields={fields}
        gameFinished={true}
        setFields={() => null}
        decrementLives={() => null}
        decrementTilesLeft={() => null}
      />
      <View style={{paddingTop: 20}}>
        <Button
          title="Solve"
          onPress={() => {
            new Solver().solve(
              gameData.boardWidth,
              gameData.boardHeight,
              fields,
              setFields,
            );
          }}
          buttonStyle={{backgroundColor: Colors.copper}}
          titleStyle={{color: Colors.nearBlack, fontSize: 36}}
        />
      </View>
    </View>
  );
};

export default SolverSolvingActivity;
