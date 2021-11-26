import React, {useState} from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../data/Colors';
import HintSlip from './HintSlip';

const InputBoard = ({colHints, rowHints, setColHints, setRowHints}) => {
  const [dimensions, setDimensions] = useState({width: 0, height: 0});

  const colHintsWidth = 1 + colHints.length;
  const rowHintsHeight = 1 + rowHints.length;

  const colHintsHeight =
    2 +
    colHints
      .map((colHintLine) => colHintLine.length)
      .reduce((curMax, nextLength) => Math.max(curMax, nextLength), 0);
  const rowHintsWidth =
    2 +
    rowHints
      .map((rowHintLine) => rowHintLine.length)
      .reduce((curMax, nextLength) => Math.max(curMax, nextLength), 0);

  const horizontalSize = dimensions.width / (colHintsWidth + rowHintsWidth);
  const verticalSize = dimensions.height / (rowHintsHeight + colHintsHeight);
  const size = Math.min(horizontalSize, verticalSize);
  const iconSize = size / 1.5;

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
      }}
      onLayout={(evt) => {
        const {x, y, width, height} = evt.nativeEvent.layout;
        setDimensions({width, height});
      }}>
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            width: rowHintsWidth * size,
            height: colHintsHeight * size,
            // backgroundColor: Colors.nearBlack,
          }}
        />
        <View
          style={{
            height: colHintsHeight * size,
            flexDirection: 'row',
            alignItems: 'flex-end',
            // backgroundColor: Colors.nearBlack,
          }}>
          {colHints.map((colHintsLine, i) => (
            <HintSlip
              itemFlexDirection="column"
              hints={colHintsLine}
              setHints={(call) => {
                setColHints((prevColHints) =>
                  prevColHints.map((prevColHintsLine, j) =>
                    j === i ? call(prevColHintsLine) : prevColHintsLine,
                  ),
                );
              }}
              deleteSelf={() => {
                if (colHints.length > 1) {
                  setColHints((prevColHints) =>
                    prevColHints.filter((_, j) => j !== i),
                  );
                } else {
                  setColHints([[0]]);
                }
              }}
              size={size}
              key={i}
            />
          ))}
          <TouchableWithoutFeedback
            onPress={() =>
              setColHints((prevColHints) => [...prevColHints, [0]])
            }>
            <Icon
              style={{
                // backgroundColor: Colors.nearBlack,
                textAlignVertical: 'center',
                width: size,
                height: '100%',
                textAlign: 'center',
              }}
              color="green"
              name="plus"
              size={iconSize}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            width: rowHintsWidth * size,
            flexDirection: 'column',
            alignItems: 'flex-end',
            // backgroundColor: Colors.nearBlack,
          }}>
          {rowHints.map((rowHintsLine, i) => (
            <HintSlip
              itemFlexDirection="row"
              hints={rowHintsLine}
              setHints={(call) => {
                setRowHints((prevRowHints) =>
                  prevRowHints.map((prevRowHintsLine, j) =>
                    j === i ? call(prevRowHintsLine) : prevRowHintsLine,
                  ),
                );
              }}
              deleteSelf={() => {
                if (rowHints.length > 1) {
                  setRowHints((prevRowHints) =>
                    prevRowHints.filter((_, j) => j !== i),
                  );
                } else {
                  setRowHints([[0]]);
                }
              }}
              size={size}
              key={i}
            />
          ))}
          <TouchableWithoutFeedback
            onPress={() =>
              setRowHints((prevRowHints) => [...prevRowHints, [0]])
            }>
            <Icon
              style={{
                backgroundColor: Colors.nearBlack,
                textAlignVertical: 'center',
                height: size,
                width: '100%',
                textAlign: 'center',
              }}
              color="green"
              name="plus"
              size={iconSize}
            />
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            width: colHintsWidth * size,
            height: rowHintsHeight * size,
            backgroundColor: Colors.nearBlack,
          }}
        />
      </View>
    </View>
  );
};

export default InputBoard;
