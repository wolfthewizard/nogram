import React, {useEffect, useState} from 'react';
import {TouchableNativeFeedback, View} from 'react-native';
import {Button, Text} from 'react-native-elements';
import Colors from '../data/Colors';
import Solver from '../solver/EliminationSolver';
import FieldStates from '../enums/FieldStates';
import FastBoard from '../components/FastBoard';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/FontAwesome';

const SolverSolvingActivity = ({route, navigation}) => {
  const {gameData} = route.params;
  const [solveMessage, setSolveMessage] = useState('');
  const [findAllSolutions, setFindAllSolutions] = useState(false);
  const [solutionsFound, setSolutionsFound] = useState([]);
  const [displayedSolutionIndex, setDisplayedSolutionIndex] = useState(0);
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

  useEffect(() => {
    displayedSolutionIndex < solutionsFound.length &&
      setFields(solutionsFound[displayedSolutionIndex]);
  }, [solutionsFound, displayedSolutionIndex]);

  return (
    <View style={{alignItems: 'center', flex: 1}}>
      <View style={{flex: 0.7, width: '100%'}}>
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
      <View style={{paddingTop: 20, flex: 0.1}}>
        <Text style={{color: 'white', fontSize: 6 * global.fontSizeBase}}>
          {solveMessage}
        </Text>
      </View>
      <View
        style={{
          flex: 0.1,
          flexDirection: 'row',
          width: '100%',
        }}>
        <View
          style={{
            flex: 0.6,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <CheckBox
            disabled={false}
            value={findAllSolutions}
            onValueChange={(newValue) => setFindAllSolutions(newValue)}
            tintColors={{false: 'white', true: 'white'}}
          />
          <Text style={{color: 'white', fontSize: 4 * global.fontSizeBase}}>
            Search for all solutions
          </Text>
        </View>
        <View
          style={{
            flex: 0.4,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableNativeFeedback
            onPress={() => {
              displayedSolutionIndex > 0 &&
                setDisplayedSolutionIndex(displayedSolutionIndex - 1);
            }}>
            <Icon
              name="caret-left"
              color={displayedSolutionIndex > 0 ? Colors.copper : 'gray'}
              size={8 * global.fontSizeBase}
            />
          </TouchableNativeFeedback>
          <Text
            style={{
              color: 'white',
              fontSize: 6 * global.fontSizeBase,
              paddingHorizontal: 5,
            }}>{`${
            displayedSolutionIndex + (solutionsFound.length > 0 ? 1 : 0)
          } / ${solutionsFound.length}`}</Text>
          <TouchableNativeFeedback
            onPress={() => {
              displayedSolutionIndex < solutionsFound.length &&
                setDisplayedSolutionIndex(displayedSolutionIndex + 1);
            }}>
            <Icon
              name="caret-right"
              color={
                displayedSolutionIndex < solutionsFound.length - 1
                  ? Colors.copper
                  : 'gray'
              }
              size={8 * global.fontSizeBase}
            />
          </TouchableNativeFeedback>
        </View>
      </View>
      <View
        style={{
          paddingBottom: 20,
          flex: 0.1,
        }}>
        <Button
          title="Solve"
          onPress={() => {
            new Solver().solve(
              gameData.boardWidth,
              gameData.boardHeight,
              fields,
              setSolutionsFound,
              setSolveMessage,
              gameData.rowHints,
              gameData.colHints,
              findAllSolutions,
            );
          }}
          buttonStyle={{
            backgroundColor: Colors.copper,
            borderRadius: 1000,
            paddingHorizontal: 20,
          }}
          titleStyle={{
            color: Colors.nearBlack,
            fontSize: 8 * global.fontSizeBase,
          }}
        />
      </View>
    </View>
  );
};

export default SolverSolvingActivity;
