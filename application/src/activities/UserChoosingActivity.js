import {useFocusEffect} from '@react-navigation/core';
import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';
import PackCard from '../components/PackCard';
import PuzzleCard from '../components/PuzzleCard';
import Colors from '../data/Colors';
import {getPuzzleById} from '../db/GameDBMediator';
import {getPuzzleListOfPack, getPuzzlePackList} from '../db/MenuDBMediator';

const UserChoosingActivity = ({route, navigation}) => {
  const {isPuzzleList, packId} = route.params || {};
  const [isLoaded, setIsLoaded] = useState(false);
  const [puzzles, setPuzzles] = useState([]);

  const itemsInRow = isPuzzleList ? 3 : 2;

  useEffect(() => {
    if (puzzles.length % itemsInRow) {
      setPuzzles((prevPuzzles) => [...prevPuzzles, 0]);
    }
  }, [puzzles]);

  useFocusEffect(
    useCallback(() => {
      isPuzzleList
        ? getPuzzleListOfPack(packId, (gamesList) => {
            while (gamesList.length % itemsInRow) {
              gamesList.push(0);
            }
            setPuzzles(gamesList);
            setIsLoaded(true);
          })
        : getPuzzlePackList((puzzlePacks) => {
            while (puzzlePacks.length % itemsInRow) {
              puzzlePacks.push(0);
            }
            setPuzzles(puzzlePacks);
            setIsLoaded(true);
          });
    }, []),
  );

  return (
    <View style={{width: '100%'}}>
      {isLoaded ? (
        <FlatList
          data={puzzles}
          renderItem={({item, id}) => {
            if (!item) {
              return (
                <View
                  style={{
                    flex: 1,
                    margin: 5,
                  }}></View>
              );
            }

            return (
              <View
                style={{
                  aspectRatio: 1,
                  flex: 1,
                  flexDirection: 'column',
                  margin: 5,
                }}
                key={id}>
                {isPuzzleList ? (
                  <PuzzleCard
                    puzzleData={item}
                    openPuzzle={() =>
                      getPuzzleById(item.id, (gameData) =>
                        navigation.navigate('UserPuzzleSolve', {
                          gameData,
                        }),
                      )
                    }
                    key={id}
                  />
                ) : (
                  <PackCard
                    packData={item}
                    openPack={() =>
                      navigation.push('Home', {
                        screen: 'UserPuzzleChoice',
                        params: {
                          isPuzzleList: true,
                          packId: item.id,
                        },
                      })
                    }
                  />
                )}
              </View>
            );
          }}
          numColumns={isPuzzleList ? 3 : 2}
        />
      ) : (
        <ActivityIndicator size="large" color={Colors.copper} />
      )}
    </View>
  );
};

export default UserChoosingActivity;
