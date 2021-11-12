import React, {useState} from 'react';
import {TextInput, View} from 'react-native';
import {Button} from 'react-native-elements';
import InputBoard from '../components/InputBoard';
import Colors from '../data/Colors';
import {addPuzzle} from '../db/SolverDBMediator';

const SolverInputActivity = ({navigation}) => {
  const [puzzleTitle, setPuzzleTitle] = useState('');
  const [colHints, setColHints] = useState([[0]]);
  const [rowHints, setRowHints] = useState([[0]]);

  return (
    <View style={{flex: 1, flexDirection: 'column'}}>
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
            fontSize: 24,
            marginHorizontal: 20,
            textAlign: 'center',
          }}
        />
      </View>
      <View
        style={{
          width: '100%',
          flex: 0.7,
          backgroundColor: Colors.nearBlack,
        }}>
        <InputBoard
          colHints={colHints}
          rowHints={rowHints}
          setColHints={setColHints}
          setRowHints={setRowHints}
        />
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
            titleStyle={{color: Colors.nearBlack, fontSize: 36}}
            onPress={navigation.goBack}
          />
          <Button
            title="Add"
            buttonStyle={{backgroundColor: Colors.copper}}
            titleStyle={{color: Colors.nearBlack, fontSize: 36}}
            onPress={() => {
              // console.log(puzzleTitle);
              // console.log(colHints.length);
              // console.log(rowHints.length);
              // console.log(colHints);
              // console.log(rowHints);
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
