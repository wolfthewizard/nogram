import {useFocusEffect} from '@react-navigation/core';
import React, {useCallback, useState} from 'react';
import {FlatList, View} from 'react-native';
import PuzzleCard from '../components/PuzzleCard';
import {getMenuPuzzleList, getPuzzleById} from '../db/GameDBMediator';

const UserChoosingActivity = ({navigation}) => {
  const [puzzles, setPuzzles] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getMenuPuzzleList((gamesList) => setPuzzles(gamesList));
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
                navigation.navigate('Play Puzzle', {
                  gameData: {
                    ...item,
                    ...gameData,
                  },
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

export default UserChoosingActivity;
