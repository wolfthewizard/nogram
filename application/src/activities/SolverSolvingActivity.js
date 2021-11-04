import React, {useState} from 'react';
import {View} from 'react-native';
import Board from '../components/Board';
import {Button} from 'react-native-elements';
import Colors from '../data/Colors';
import Solver from '../solver/NaiveSolver';

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
