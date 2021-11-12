import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import Board from '../components/Board';
import {Button} from 'react-native-elements';
import Colors from '../data/Colors';
import Solver from '../solver/NaiveSolver';
import FieldStates from '../enums/FieldStates';

const SolverSolvingActivity = ({route, navigation}) => {
  const {gameData} = route.params;
  const [fields, setFields] = useState(
    [...Array(gameData.boardHeight).keys()].map(() =>
      [...Array(gameData.boardWidth).keys()].map(() => ({
        state: FieldStates.UNTOUCHED,
      })),
    ),
  );

  // useEffect(
  //   () =>
  //     setFields((prevFields) =>
  //       prevFields.map((row) =>
  //         row.map((field) => ({...field, state: FieldStates.UNTOUCHED})),
  //       ),
  //     ),
  //   [],
  // );

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
        rowHintsPredefined={gameData.rowHints}
        colHintsPredefined={gameData.colHints}
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
