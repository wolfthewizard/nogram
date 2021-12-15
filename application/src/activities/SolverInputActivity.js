import React, {useEffect, useRef, useState} from 'react';
import {TextInput, View} from 'react-native';
import {Button} from 'react-native-elements';
import InputBoard from '../components/InputBoard';
import Colors from '../data/Colors';
import {addPuzzle} from '../db/SolverDBMediator';
import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';

const SolverInputActivity = ({navigation}) => {
  const [puzzleTitle, setPuzzleTitle] = useState('');
  const [colHints, setColHints] = useState([[0]]);
  const [rowHints, setRowHints] = useState([[0]]);
  const isInitial = useRef(true);

  const zoomableView = useRef(null);

  // useEffect(() => {
  //   if (isInitial.current) {
  //     isInitial.current = false;
  //   } else {
  //     zoomableView.current
  //       .zoomTo(
  //         zoomableView.current.zoomLevel +
  //           (1 - (colHints.length + 3) / (colHints.length + 4)) * 0.75,
  //       )
  //       .then(() => {
  //         console.log('done zoomin');
  //         zoomableView.current.moveTo(2000, -2000);
  //       });
  //   }
  // }, [colHints, zoomableView]);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Colors.nearBlack,
      }}>
      <View
        style={{
          width: '100%',
          flex: 0.85,
          flexDirection: 'column-reverse',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            width: '100%',
            flex: 0.85,
            backgroundColor: Colors.nearBlack,
          }}>
          <ReactNativeZoomableView
            ref={zoomableView}
            maxZoom={5}
            minZoom={1}
            zoomStep={0.5}
            initialZoom={1}
            bindToBorders={true}
            style={{
              backgroundColor: Colors.nearBlack,
              width: '100%',
              height: '100%',
            }}>
            <InputBoard
              colHints={colHints}
              rowHints={rowHints}
              setColHints={setColHints}
              setRowHints={setRowHints}
            />
          </ReactNativeZoomableView>
        </View>
        <View
          style={{
            width: '100%',
            flex: 0.15,
            backgroundColor: Colors.nearBlack,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TextInput
            value={puzzleTitle}
            onChangeText={(val) => setPuzzleTitle(val)}
            placeholder="Puzzle title"
            placeholderTextColor={Colors.veryLightGray}
            style={{
              borderWidth: 1,
              borderColor: Colors.gray,
              borderRadius: 5,
              color: 'white',
              alignSelf: 'stretch',
              fontSize: 6 * global.fontSizeBase,
              marginHorizontal: 20,
              textAlign: 'center',
            }}
          />
        </View>
      </View>
      <View
        style={{
          width: '100%',
          flex: 0.15,
          backgroundColor: Colors.nearBlack,
          justifyContent: 'center',
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <Button
            title="Cancel"
            buttonStyle={{backgroundColor: Colors.gray}}
            titleStyle={{
              color: Colors.nearBlack,
              fontSize: 9 * global.fontSizeBase,
            }}
            onPress={navigation.goBack}
          />
          <Button
            title="Add"
            buttonStyle={{backgroundColor: Colors.copper}}
            titleStyle={{
              color: Colors.nearBlack,
              fontSize: 9 * global.fontSizeBase,
            }}
            onPress={() => {
              addPuzzle(
                {
                  name: puzzleTitle,
                  boardWidth: colHints.length,
                  boardHeight: rowHints.length,
                  colHints: colHints,
                  rowHints: rowHints,
                },
                navigation.goBack,
              );
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default SolverInputActivity;
