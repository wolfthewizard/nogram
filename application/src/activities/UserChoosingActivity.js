import React from 'react';
import {FlatList, View} from 'react-native';
import PuzzleCard from '../components/PuzzleCard';

const UserChoosingActivity = ({navigation, puzzles}) => {
  return (
    <View>
      <FlatList
        data={puzzles}
        renderItem={({item, id}) => (
          <PuzzleCard
            puzzleData={item}
            openPuzzle={() =>
              navigation.navigate('Play Puzzle', {
                gameData: item,
              })
            }
            key={id}
          />
        )}
      />
    </View>
  );
};

export default UserChoosingActivity;
