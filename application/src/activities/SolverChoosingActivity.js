import {useFocusEffect} from '@react-navigation/core';
import React, {useCallback, useState} from 'react';
import {FlatList, View} from 'react-native';
import PuzzleCard from '../components/PuzzleCard';
import {getPuzzleById, getSolverPuzzleList} from '../db/GameDBMediator';

const SolverChoosingActivity = ({navigation}) => {
  const [puzzles, setPuzzles] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getSolverPuzzleList((gamesList) => setPuzzles(gamesList));
    }, []),
  );

  return (
    <View>
      {/* todo: add loading */}
      <FlatList
        data={puzzles}
        renderItem={({item, id}) => (
          <PuzzleCard
            puzzleData={item}
            openPuzzle={() =>
              getPuzzleById(item.id, (gameData) =>
                navigation.navigate('SolverPuzzleSolve', {
                  gameData,
                }),
              )
            }
            key={id}
          />
        )}
      />
    </View>
  );
};

export default SolverChoosingActivity;
