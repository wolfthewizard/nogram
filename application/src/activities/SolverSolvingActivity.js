import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-elements';
import Colors from '../data/Colors';
import Solver from '../solver/EliminationSolver';
import FieldStates from '../enums/FieldStates';
import FastBoard from '../components/FastBoard';

const SolverSolvingActivity = ({route, navigation}) => {
  const {gameData} = route.params;
  // const [fields, setFields] = useState(gameData.fields);
  const [fields, setFields] = useState(
    [...Array(gameData.boardHeight).keys()].map(() =>
      [...Array(gameData.boardWidth).keys()].map(() => ({
        state: FieldStates.UNTOUCHED,
      })),
    ),
  );

  useEffect(
    () =>
      setFields((prevFields) =>
        prevFields.map((row) =>
          row.map((field) => ({...field, state: FieldStates.UNTOUCHED})),
        ),
      ),
    [],
  );

  return (
    <View style={{alignItems: 'center', flex: 1}}>
      <View style={{flex: 0.8, width: '100%'}}>
        <FastBoard
          boardWidth={gameData.boardWidth}
          boardHeight={gameData.boardHeight}
          fields={fields}
          gameFinished={true}
          setFields={() => null}
          rowHintsPredefined={gameData.rowHints}
          colHintsPredefined={gameData.colHints}
        />
      </View>
      <View style={{paddingTop: 20, flex: 0.2}}>
        <Button
          title="Solve"
          onPress={() => {
            new Solver().solve(
              gameData.boardWidth,
              gameData.boardHeight,
              fields,
              setFields,
              gameData.rowHints,
              gameData.colHints,
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
