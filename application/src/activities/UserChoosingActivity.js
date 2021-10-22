import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import PuzzleCard from '../components/PuzzleCard';
import GameDBMediator from '../db/GameDBMediator';

const UserChoosingActivity = ({navigation}) => {
  const [puzzles, setPuzzles] = useState([]);

  // todo: make sure it is updated after coming back from solving puzzle
  useEffect(() => {
    GameDBMediator.getGamesList((gamesList) => setPuzzles(gamesList));
  }, []);

  return (
    <View>
      {/* todo: add loading */}
      <FlatList
        data={puzzles}
        renderItem={({item, id}) => (
          <PuzzleCard
            puzzleData={item}
            openPuzzle={() =>
              GameDBMediator.getGameDetails(item.id, (gameData) =>
                navigation.navigate('Play Puzzle', {
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

export default UserChoosingActivity;
