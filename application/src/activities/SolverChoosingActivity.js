import {useFocusEffect} from '@react-navigation/core';
import React, {useCallback, useState} from 'react';
import {FlatList, TouchableWithoutFeedback, View} from 'react-native';
import PuzzleCard from '../components/PuzzleCard';
import {getPuzzleById} from '../db/GameDBMediator';
import {getSolverPuzzleById, getSolverPuzzleList} from '../db/SolverDBMediator';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../data/Colors';
import {Text} from 'react-native-elements';

const SolverChoosingActivity = ({navigation}) => {
  const [puzzles, setPuzzles] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getSolverPuzzleList((solverPuzzles, solvedUserPuzzles) => {
        setPuzzles(solvedUserPuzzles);
      });
    }, []),
  );

  return (
    <View style={{height: '100%'}}>
      <View
        style={{
          width: '15%',
          aspectRatio: 1,
          borderRadius: 100,
          backgroundColor: Colors.lightGray,
          position: 'absolute',
          bottom: '5%',
          right: '5%',
          zIndex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('SolverPuzzleInput')}>
          <View
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="plus" size={30} color={Colors.copper} />
          </View>
        </TouchableWithoutFeedback>
      </View>
      {/* todo: add loading */}
      <FlatList
        data={puzzles}
        renderItem={({item, index}) => {
          return (
            <PuzzleCard
              puzzleData={item}
              openPuzzle={() =>
                // getSolverPuzzleById(item.id, (gameData) =>
                //   navigation.navigate('SolverPuzzleSolve', {
                //     gameData,
                //   }),
                // )
                getPuzzleById(item.id, (gameData) =>
                  navigation.navigate('SolverPuzzleSolve', {
                    gameData,
                  }),
                )
              }
              key={index}
            />
          );
        }}
      />
    </View>
  );
};

export default SolverChoosingActivity;
