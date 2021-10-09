import React, {useMemo} from 'react';
import {View} from 'react-native';
import LabelField from '../components/LabelField';
import SolvableField from '../components/SolvableField';
import Styles from '../data/Styles';

const generateHints = (series) => {
  const cellStreaks = [];
  let latestStreak = 0;
  for (const cell of series) {
    if (cell.hasPixel) {
      latestStreak++;
    } else if (latestStreak > 0) {
      cellStreaks.push(latestStreak);
      latestStreak = 0;
    }
  }
  latestStreak > 0 && cellStreaks.push(latestStreak);
  return cellStreaks.length > 0 ? cellStreaks : [0];
};

const Board = ({
  boardData,
  mode,
  decrementLives,
  decrementTilesLeft,
  gameFinished,
}) => {
  const rows = boardData.fields;
  const columns = useMemo(
    () =>
      [...Array(boardData.width).keys()].map((i) =>
        [...Array(boardData.height).keys()].map((j) => boardData.fields[j][i]),
      ),
    [],
  );

  const rowHints = useMemo(() => rows.map((row) => generateHints(row)), []);
  const columnHints = useMemo(
    () => columns.map((column) => generateHints(column)),
    [],
  );

  const rowHintMaxLength = useMemo(
    () => Math.max(...rowHints.map((row) => row.length)),
    [rowHints],
  );
  const colHintMaxLength = useMemo(
    () => Math.max(...columnHints.map((col) => col.length)),
    [columnHints],
  );
  const totalWidth = useMemo(
    () => rowHintMaxLength + boardData.width,
    [rowHintMaxLength, boardData],
  );
  const totalHeight = useMemo(
    () => colHintMaxLength + boardData.height,
    [colHintMaxLength, boardData],
  );

  const size = 1 / totalWidth;

  const wholeBoard = useMemo(
    () =>
      [...Array(totalHeight).keys()].map((absoluteRowNum) => {
        const playingRowNum = absoluteRowNum - colHintMaxLength;
        return [...Array(totalWidth).keys()].map((absoluteColNum) => {
          const playingColNum = absoluteColNum - rowHintMaxLength;
          if (playingRowNum < 0 && playingColNum < 0) {
            return null;
          } else if (playingRowNum >= 0 && playingColNum >= 0) {
            return (
              <SolvableField
                fieldData={boardData.fields[playingRowNum][playingColNum]}
                mode={mode}
                decrementLives={decrementLives}
                decrementTilesLeft={decrementTilesLeft}
                gameFinished={gameFinished}
                size={size}
              />
            );
          } else {
            let hint;
            if (playingRowNum >= 0) {
              const hintId =
                absoluteColNum -
                rowHintMaxLength +
                rowHints[playingRowNum].length;
              hint = hintId >= 0 ? rowHints[playingRowNum][hintId] : '';
            } else {
              const hintId =
                absoluteRowNum -
                colHintMaxLength +
                columnHints[playingColNum].length;
              hint = hintId >= 0 ? columnHints[playingColNum][hintId] : '';
            }
            return <LabelField value={hint} size={size} />;
          }
        });
      }),
    [rowHints, columnHints, mode, gameFinished],
  );

  return (
    <View style={{...Styles.board, aspectRatio: 1}}>
      <View style={{flexDirection: 'column'}}>
        {wholeBoard.map((row, i) => (
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              aspectRatio: totalWidth,
            }}
            key={i}>
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
  );
};

export default Board;
