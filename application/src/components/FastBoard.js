import React, {useMemo, useRef, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Text} from 'react-native-elements';
import Colors from '../data/Colors';
import FieldConversion from '../enums/FieldConversion';
import FieldStates from '../enums/FieldStates';
import Modes from '../enums/SolveModes';
import Icon from 'react-native-vector-icons/FontAwesome';

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

const FastBoard = ({
  boardWidth,
  boardHeight,
  fields,
  mode,
  gameFinished,
  setFields,
  rowHintsPredefined,
  colHintsPredefined,
}) => {
  const rows = fields;
  const cols = useMemo(
    () =>
      [...Array(boardWidth).keys()].map((i) =>
        [...Array(boardHeight).keys()].map((j) => fields[j][i]),
      ),
    [],
  );
  const rowHints = useMemo(
    () => rowHintsPredefined || rows.map((row) => generateHints(row)),
    [],
  );
  const columnHints = useMemo(
    () => colHintsPredefined || cols.map((column) => generateHints(column)),
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
    () => rowHintMaxLength + boardWidth,
    [rowHintMaxLength, boardWidth],
  );
  const totalHeight = useMemo(
    () => colHintMaxLength + boardHeight,
    [colHintMaxLength, boardHeight],
  );

  const determineFieldState = (field) => {
    if (conversionType.current === FieldConversion.UNTOUCHED_TO_MARKED) {
      if (field.state === FieldStates.UNTOUCHED) {
        return FieldStates.MARKED_EMPTY;
      }
    } else if (conversionType.current === FieldConversion.MARKED_TO_UNTOUCHED) {
      if (field.state === FieldStates.MARKED_EMPTY) {
        return FieldStates.UNTOUCHED;
      }
    } else if (
      conversionType.current === FieldConversion.UNTOUCHED_TO_UNCOVERED
    ) {
      if (field.state === FieldStates.UNTOUCHED) {
        return field.hasPixel
          ? FieldStates.CORRECTLY_UNCOVERED
          : FieldStates.WRONGLY_UNCOVERED;
      }
    }
    return field.state;
  };

  const handleFieldsLineTap = (tappedFieldIndices) => {
    touchDirectionHorizontal.current
      ? setFields((prevFields) =>
          prevFields.map((row, i) =>
            i !== touchedLevel.current
              ? row
              : row.map((field, j) =>
                  j < tappedFieldIndices[0] ||
                  j > tappedFieldIndices[tappedFieldIndices.length - 1]
                    ? field
                    : {...field, state: determineFieldState(field)},
                ),
          ),
        )
      : setFields((prevFields) =>
          prevFields.map((row, i) =>
            i < tappedFieldIndices[0] ||
            i > tappedFieldIndices[tappedFieldIndices.length - 1]
              ? row
              : row.map((field, j) =>
                  j !== touchedLevel.current
                    ? field
                    : {...field, state: determineFieldState(field)},
                ),
          ),
        );
  };

  const [dimensions, setDimensions] = useState({width: 0, height: 0});
  const marginSize = 1;
  const horizontalSize =
    (dimensions.width - boardWidth * marginSize) / totalWidth;
  const verticalSize =
    (dimensions.height - boardHeight * marginSize) / totalHeight;
  const size = Math.min(horizontalSize, verticalSize);
  const textSize = size / 1.5;

  const horizontalOffset = useMemo(() => rowHintMaxLength * size, [size]);
  const verticalOffset = useMemo(() => colHintMaxLength * size, [size]);

  const touchedLevel = useRef(null);
  const previouslyTouchedTile = useRef({rowI: 0, colI: 0});
  const touchDirectionHorizontal = useRef(null);
  const conversionType = useRef(null);

  const textStyle = {
    width: size,
    height: size,
    color: 'white',
    fontSize: textSize,
    fontFamily: 'monospace',
    textAlign: 'center',
  };

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
      }}
      onLayout={(evt) => {
        const {width, height} = evt.nativeEvent.layout;
        setDimensions({width, height});
      }}>
      {dimensions.width && dimensions.height ? (
        <>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                width: rowHintMaxLength * size,
                height: colHintMaxLength * size,
              }}></View>
            <View
              style={{
                flexDirection: 'row',
                width: boardWidth * size,
                height: colHintMaxLength * size,
              }}>
              {columnHints.map((columnHintLine, i) => (
                <View
                  style={{
                    width: size,
                    height: colHintMaxLength * size,
                    justifyContent: 'flex-end',
                    marginLeft: marginSize,
                  }}
                  key={i}>
                  {columnHintLine.map((hint, j) => (
                    <Text style={textStyle} key={j}>
                      {hint}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                width: rowHintMaxLength * size,
                height: boardHeight * size,
              }}>
              {rowHints.map((rowHintLine, i) => (
                <View
                  style={{
                    width: rowHintMaxLength * size,
                    height: size,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    marginTop: marginSize,
                  }}
                  key={i}>
                  {rowHintLine.map((hint, j) => (
                    <Text style={textStyle} key={j}>
                      {hint}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
            <View
              onStartShouldSetResponder={() => !gameFinished}
              onMoveShouldSetResponder={() => !gameFinished}
              onResponderStart={({nativeEvent: {pageX, pageY}}) => {
                previouslyTouchedTile.current = {
                  rowI: Math.floor(
                    (pageY - verticalOffset) / (size + marginSize),
                  ),
                  colI: Math.floor(
                    (pageX - horizontalOffset) / (size + marginSize),
                  ),
                };
                const touchedField =
                  fields[previouslyTouchedTile.current.rowI][
                    previouslyTouchedTile.current.colI
                  ];
                conversionType.current =
                  mode === Modes.MARK_EMPTY
                    ? touchedField.state === FieldStates.MARKED_EMPTY
                      ? FieldConversion.MARKED_TO_UNTOUCHED
                      : FieldConversion.UNTOUCHED_TO_MARKED
                    : FieldConversion.UNTOUCHED_TO_UNCOVERED;
                setFields((prevFields) =>
                  prevFields.map((row, i) =>
                    i !== previouslyTouchedTile.current.rowI
                      ? row
                      : row.map((field, j) =>
                          j !== previouslyTouchedTile.current.colI
                            ? field
                            : {...field, state: determineFieldState(field)},
                        ),
                  ),
                );
              }}
              onResponderEnd={() => {
                previouslyTouchedTile.current = null;
                touchDirectionHorizontal.current = null;
                touchedLevel.current = null;
                conversionType.current = null;
              }}
              onResponderMove={({nativeEvent: {pageX, pageY}}) => {
                if (!gameFinished) {
                  const touchedTile = {
                    rowI: Math.floor(
                      (pageY - verticalOffset) / (size + marginSize),
                    ),
                    colI: Math.floor(
                      (pageX - horizontalOffset) / (size + marginSize),
                    ),
                  };
                  if (touchDirectionHorizontal.current === null) {
                    if (
                      touchedTile.rowI === previouslyTouchedTile.current.rowI &&
                      touchedTile.colI !== previouslyTouchedTile.current.colI
                    ) {
                      touchDirectionHorizontal.current = true;
                      touchedLevel.current = previouslyTouchedTile.current.rowI;
                    } else if (
                      touchedTile.rowI !== previouslyTouchedTile.current.rowI &&
                      touchedTile.colI === previouslyTouchedTile.current.colI
                    ) {
                      touchDirectionHorizontal.current = false;
                      touchedLevel.current = previouslyTouchedTile.current.colI;
                    }
                  }
                  if (touchDirectionHorizontal.current !== null) {
                    if (touchDirectionHorizontal.current === true) {
                      const sX =
                        previouslyTouchedTile.current.colI > touchedTile.colI
                          ? touchedTile.colI
                          : previouslyTouchedTile.current.colI;
                      const eX =
                        previouslyTouchedTile.current.colI < touchedTile.colI
                          ? touchedTile.colI
                          : previouslyTouchedTile.current.colI;
                      handleFieldsLineTap([sX, eX]);
                    } else {
                      const sY =
                        previouslyTouchedTile.current.rowI > touchedTile.rowI
                          ? touchedTile.rowI
                          : previouslyTouchedTile.current.rowI;
                      const eY =
                        previouslyTouchedTile.current.rowI < touchedTile.rowI
                          ? touchedTile.rowI
                          : previouslyTouchedTile.current.rowI;
                      handleFieldsLineTap([sY, eY]);
                    }
                    previouslyTouchedTile.current = touchedTile;
                  }
                }
              }}>
              <View
                style={{
                  flexDirection: 'column',
                  backgroundColor: '#101010',
                }}>
                {fields.map((row, i) => (
                  <View style={{flexDirection: 'row'}} key={i}>
                    {row.map((field, j) => (
                      <View
                        style={{
                          width: size,
                          height: size,
                          marginTop: marginSize,
                          marginLeft: marginSize,
                          backgroundColor:
                            field.state === FieldStates.CORRECTLY_UNCOVERED
                              ? field.color || Colors.nearWhite
                              : Colors.nearBlack,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        key={j}>
                        {(field.state === FieldStates.WRONGLY_UNCOVERED ||
                          field.state === FieldStates.MARKED_EMPTY) && (
                          <Icon
                            color={
                              field.state === FieldStates.WRONGLY_UNCOVERED
                                ? Colors.wrong
                                : Colors.default
                            }
                            name={'close'}
                            size={size}
                          />
                        )}
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </View>
          </View>
        </>
      ) : (
        <ActivityIndicator size="large" color={Colors.copper} />
      )}
    </View>
  );
};

export default FastBoard;
