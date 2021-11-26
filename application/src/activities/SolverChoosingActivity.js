import {useFocusEffect} from '@react-navigation/core';
import React, {useCallback, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {getPuzzleById} from '../db/GameDBMediator';
import {
  getSolverPuzzleById,
  getSolverPuzzleList,
  removePuzzle,
} from '../db/SolverDBMediator';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../data/Colors';
import SolverPuzzleCard from '../components/SolverPuzzleCard';
import {Text} from 'react-native-elements';

const SolverChoosingActivity = ({navigation}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [puzzles, setPuzzles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const deletedPuzzle = useRef({});

  const refreshPuzzles = () =>
    getSolverPuzzleList((solverPuzzles, solvedUserPuzzles) => {
      setPuzzles(solverPuzzles);
      setIsLoaded(true);
    });

  useFocusEffect(
    useCallback(() => {
      refreshPuzzles();
    }, []),
  );

  return (
    <View style={{height: '100%'}}>
      {isLoaded ? (
        <>
          <Modal
            visible={modalOpen}
            animationType="fade"
            transparent
            onRequestClose={() => console.log('modal has been closed')}>
            <View
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  backgroundColor: Colors.lightGray,
                  width: '80%',
                  padding: 15,
                  borderRadius: 5,
                }}>
                <Text style={{color: 'white', fontSize: 20}}>
                  Are you sure you want to delete puzzle named '
                  {deletedPuzzle.current.name || 'Unnamed'}'?
                </Text>
                <View
                  style={{
                    paddingTop: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <View
                    style={{
                      padding: 10,
                      borderRadius: 2,
                    }}>
                    <TouchableOpacity onPress={() => setModalOpen(false)}>
                      <Text
                        style={{
                          color: Colors.nearWhite,
                          fontSize: 16,
                        }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      backgroundColor: Colors.gray,
                      borderRadius: 2,
                      padding: 10,
                    }}>
                    <TouchableOpacity
                      onPress={() =>
                        removePuzzle(deletedPuzzle.current.id, () => {
                          setModalOpen(false);
                          refreshPuzzles();
                        })
                      }>
                      <Text
                        style={{
                          color: Colors.nearWhite,
                          fontSize: 16,
                        }}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
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
          <FlatList
            data={puzzles}
            renderItem={({item, index}) => {
              return (
                <SolverPuzzleCard
                  puzzleData={item}
                  openPuzzle={
                    () =>
                      getSolverPuzzleById(item.id, (gameData) =>
                        navigation.navigate('SolverPuzzleSolve', {
                          gameData,
                        }),
                      )
                    // getPuzzleById(item.id, (gameData) =>
                    //   navigation.navigate('SolverPuzzleSolve', {
                    //     gameData,
                    //   }),
                    // )
                  }
                  requestDelete={() => {
                    deletedPuzzle.current = item;
                    setModalOpen(true);
                  }}
                  key={index}
                />
              );
            }}
          />
        </>
      ) : (
        <ActivityIndicator size="large" color={Colors.copper} />
      )}
    </View>
  );
};

export default SolverChoosingActivity;
