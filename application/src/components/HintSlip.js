import React, {useEffect, useRef, useState} from 'react';
import {TextInput, TouchableWithoutFeedback, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../data/Colors';

const HintSlip = ({itemFlexDirection, hints, setHints, deleteSelf, size}) => {
  const [hintAmount, setHintAmount] = useState(hints.length);

  const lastHintRef = useRef();

  const baseSize = size;
  const iconSize = size / 2;
  const fontSize = size / 2.5;
  const padSize = size / 4;

  const tileStyle = {
    width: baseSize,
    height: baseSize,
    padding: padSize,
    color: 'white',
    backgroundColor: Colors.nearBlack,
    fontSize: fontSize,
    textAlign: 'center',
  };

  useEffect(() => {
    if (hints.length > hintAmount) {
      lastHintRef.current.focus();
    }
    setHintAmount(hints.length);
  }, [hints]);

  return (
    <View
      style={{
        ...{
          flexDirection: itemFlexDirection,
          justifyContent: 'space-between',
        },
        ...(itemFlexDirection === 'column'
          ? {height: '100%'}
          : {width: '100%'}),
      }}>
      <TouchableWithoutFeedback onLongPress={deleteSelf}>
        <Icon
          style={{...tileStyle, color: 'red'}}
          name="minus"
          size={iconSize}
        />
      </TouchableWithoutFeedback>
      <View
        style={{
          flexDirection: itemFlexDirection,
        }}>
        {hints.map((hint, i) => (
          <TextInput
            value={hint.toString()}
            selection={{
              start: hint.toString().length,
              end: hint.toString().length,
            }}
            onChangeText={(val) =>
              setHints((prevHints) =>
                prevHints.map((h, j) =>
                  j === i ? (val ? parseInt(val) : val) : h,
                ),
              )
            }
            onEndEditing={() => {
              if (!hint) {
                if (hints.length === 1) {
                  setHints(() => [0]);
                } else {
                  setHints((prevHints) => prevHints.filter((_, j) => j !== i));
                }
              }
            }}
            keyboardType="numeric"
            style={tileStyle}
            key={i}
            ref={i === hints.length - 1 ? lastHintRef : null}
          />
        ))}
        <TouchableWithoutFeedback
          onPress={() => {
            if (
              (hints.length > 1 || hints[0] !== 0) &&
              hints[hints.length - 1]
            ) {
              setHints((prevHints) => [...prevHints, '']);
            } else {
              lastHintRef.current.focus();
            }
          }}>
          <Icon style={tileStyle} name="plus" size={iconSize} />
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default HintSlip;
