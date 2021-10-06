import React, {useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, useColorScheme, View} from 'react-native';
import {Switch} from 'react-native-elements/dist/switch/switch';
import Icon from 'react-native-vector-icons/FontAwesome';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const fieldVisualStates = {untouched: 0, markedEmpty: 1, wronglyUncovered: 2, uncovered: 3};
const visualStateRepresentations = ['', 'close', 'close', 'check'];
const modes = {uncover: 0, markEmpty: 1};

const Field = ({fieldData, mode, size}) => {
  const [visualState, setVisualState] = useState(fieldVisualStates.untouched);
  const iconColor =
    visualState === fieldVisualStates.wronglyUncovered
      ? '#e03030'
      : visualState === fieldVisualStates.uncovered
      ? '#30e030'
      : '#e0e0e0';
  return (
    <TouchableOpacity
      onPress={() => {
        if (visualState === fieldVisualStates.untouched) {
          const newVisualState =
            mode === modes.uncover
              ? fieldData.hasPixel
                ? fieldVisualStates.uncovered
                : fieldVisualStates.wronglyUncovered
              : fieldVisualStates.markedEmpty;
          setVisualState(newVisualState);
        } else if (visualState === fieldVisualStates.markedEmpty && mode === modes.markEmpty) {
          setVisualState(fieldVisualStates.untouched);
        }
      }}
      style={{...styles.field, ...styles.boardField, width: '100%', height: '100%'}}>
      {visualState !== fieldVisualStates.untouched && (
        <Icon color={iconColor} name={visualStateRepresentations[visualState]} size={300 * size} />
      )}
    </TouchableOpacity>
  );
};

const Board = ({boardData}) => {
  const [boardFields, setBoardFields] = useState(boardData.fields.flat());
  const [mode, setMode] = useState(modes.uncover);
  const rows = boardData.fields;
  const columns = useMemo(
    () =>
      [...Array(boardData.width).keys()].map(i => [...Array(boardData.height).keys()].map(j => boardData.fields[j][i])),
    [],
  );

  const rowHints = useMemo(
    () =>
      rows.map(row => {
        const cellStreaks = [];
        let latestStreak = 0;
        for (const cell of row) {
          if (cell.hasPixel) {
            latestStreak++;
          } else if (latestStreak > 0) {
            cellStreaks.push(latestStreak);
            latestStreak = 0;
          }
        }
        latestStreak > 0 && cellStreaks.push(latestStreak);
        return cellStreaks.length > 0 ? cellStreaks : [0];
      }),
    [],
  );

  const columnHints = useMemo(
    () =>
      columns.map(column => {
        const cellStreaks = [];
        let latestStreak = 0;
        for (const cell of column) {
          if (cell.hasPixel) {
            latestStreak++;
          } else if (latestStreak > 0) {
            cellStreaks.push(latestStreak);
            latestStreak = 0;
          }
        }
        latestStreak > 0 && cellStreaks.push(latestStreak);
        return cellStreaks.length > 0 ? cellStreaks : [0];
      }),
    [],
  );

  const rowHintMaxLength = useMemo(() => Math.max(...rowHints.map(row => row.length)), [rowHints]);
  const colHintMaxLength = useMemo(() => Math.max(...columnHints.map(col => col.length)), [columnHints]);
  const totalWidth = useMemo(() => rowHintMaxLength + boardData.width, [rowHintMaxLength, boardData]);
  const totalHeight = useMemo(() => colHintMaxLength + boardData.height, [colHintMaxLength, boardData]);

  const size = useMemo(() => 1 / totalWidth, [totalWidth]);

  const wholeBoard = useMemo(
    () =>
      [...Array(totalHeight).keys()].map(absoluteRowNum => {
        const playingRowNum = absoluteRowNum - colHintMaxLength;
        return [...Array(totalWidth).keys()].map(absoluteColNum => {
          const playingColNum = absoluteColNum - rowHintMaxLength;
          if (playingRowNum < 0 && playingColNum < 0) {
            return null;
          } else if (playingRowNum >= 0 && playingColNum >= 0) {
            return (
              <View style={[styles.field, styles.boardField]}>
                <Field fieldData={boardData.fields[playingRowNum][playingColNum]} mode={mode} size={size} />
              </View>
            );
          } else {
            let hintId;
            let hints;
            let index;
            if (playingRowNum >= 0) {
              hintId = absoluteColNum - rowHintMaxLength + rowHints[playingRowNum].length;
              hints = rowHints;
              index = playingRowNum;
            } else {
              hintId = absoluteRowNum - colHintMaxLength + columnHints[playingColNum].length;
              hints = columnHints;
              index = playingColNum;
            }
            return (
              <View style={[styles.field, styles.hintField]}>
                {hintId >= 0 ? (
                  <Text
                    style={{
                      ...styles.field,
                      width: '100%',
                      height: '100%',
                      color: 'white',
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      fontSize: 300 * size,
                    }}>
                    {hints[index][hintId]}
                  </Text>
                ) : null}
              </View>
            );
          }
        });
      }),
    [rowHints, columnHints, mode],
  );

  return (
    <View style={{alignItems: 'center'}}>
      <View style={[styles.board, {aspectRatio: 1}]}>
        <View style={{flexDirection: 'column'}}>
          {wholeBoard.map((row, i) => (
            <View style={{flexDirection: 'row', width: '100%', aspectRatio: totalWidth}} key={i}>
              {row.map((cell, j) => (
                <View
                  key={j}
                  style={{
                    flex: 1,
                    aspectRatio: 1,
                  }}>
                  {cell}
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
      <View flexDirection="row">
        <Text style={{color: 'white'}}>Uncover</Text>
        <Switch
          trackColor={{false: '#202020', true: '#d0d0d0'}}
          thumbColor="#ffffff"
          ios_backgroundColor="#303030"
          onValueChange={() => {
            setMode(previousMode => (previousMode === modes.markEmpty ? modes.uncover : modes.markEmpty));
          }}
          value={mode === modes.markEmpty}
        />
        <Text style={{color: 'white'}}>Mark</Text>
      </View>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <View style={styles.application}>
      <Board
        boardData={{
          width: 5,
          height: 5,
          fields: [
            [{hasPixel: false}, {hasPixel: true}, {hasPixel: false}, {hasPixel: true}, {hasPixel: false}],
            [{hasPixel: false}, {hasPixel: true}, {hasPixel: false}, {hasPixel: true}, {hasPixel: false}],
            [{hasPixel: false}, {hasPixel: false}, {hasPixel: false}, {hasPixel: false}, {hasPixel: false}],
            [{hasPixel: true}, {hasPixel: false}, {hasPixel: false}, {hasPixel: false}, {hasPixel: true}],
            [{hasPixel: false}, {hasPixel: true}, {hasPixel: true}, {hasPixel: true}, {hasPixel: false}],
          ],
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  application: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#101010',
  },
  board: {
    // backgroundColor: '#101020',
  },
  field: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    borderRadius: 2,
  },
  boardField: {
    backgroundColor: '#2020d0',
  },
  hintField: {},
});

export default App;
