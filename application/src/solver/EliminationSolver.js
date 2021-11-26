import CombinationFieldState from '../enums/CombinationFieldState';
import FieldStates from '../enums/FieldStates';
import SolverFieldState from '../enums/SolverFieldState';

class PriorityQueue {
  constructor() {
    this.objectsList = [];
  }

  addItemUnsafely(item) {
    this.objectsList.push(item);
  }

  addItem(item) {
    for (let i = 0; i < this.objectsList.length; i++) {
      const currentItem = this.objectsList[i];
      if (item === currentItem) {
        this.objectsList.splice(i, 1);
        break;
      }
    }
    this.objectsList.push(item);
  }

  popItem() {
    return this.objectsList.pop();
  }

  isNotEmpty() {
    return this.objectsList.length > 0;
  }
}

const factorial = (num) => {
  let total = 1;
  while (num > 0) {
    total *= num--;
  }
  return total;
};

const combinations = (elementAmount, elements) => {
  if (elementAmount <= 0) {
    return [[]];
  } else if (elements.length < elementAmount) {
    return [];
  } else {
    const slicedElements = elements.slice(1);
    return combinations(elementAmount - 1, slicedElements)
      .map((sublist) => [elements[0], ...sublist])
      .concat(combinations(elementAmount, slicedElements));
  }
};

class Solver {
  constructor() {}

  solve(
    width,
    height,
    initialFields,
    setFields,
    rowHintsWithZeros,
    colHintsWithZeros,
  ) {
    const resetFields = initialFields.map((row) =>
      row.map((field) => ({
        ...field,
        color: undefined,
        state: SolverFieldState.UNTOUCHED,
      })),
    );
    setFields(resetFields);

    const mutableRows = JSON.parse(JSON.stringify(resetFields));
    const mutableCols = [...Array(width).keys()].map((i) =>
      [...Array(height).keys()].map((j) => mutableRows[j][i]),
    );

    // const rowHints = mutableRows.map((row) => Solver.generateHints(row));
    // const colHints = mutableCols.map((col) => Solver.generateHints(col));

    const rowHints = Solver.removeZerosFromHints(rowHintsWithZeros);
    const colHints = Solver.removeZerosFromHints(colHintsWithZeros);

    console.log('starting the solving process');
    const startTime = new Date().getTime();

    if (
      Solver.solveByElimination(
        mutableRows,
        mutableCols,
        rowHints,
        colHints,
        width,
        height,
      )
    ) {
      const endTime = new Date().getTime();
      console.log('solved');
      setFields(
        mutableRows.map((row) =>
          row.map((field) => ({
            ...field,
            state:
              field.state === SolverFieldState.GUESSED_EMPTY ||
              field.state === SolverFieldState.KNOWN_EMPTY
                ? FieldStates.UNTOUCHED
                : FieldStates.CORRECTLY_UNCOVERED,
          })),
        ),
      );
      console.log(`Solving took ${(endTime - startTime) / 1000}s`);
    } else {
      console.log('unsolvable');
    }
  }

  static generateHints = (series) => {
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
    return cellStreaks;
    // in contrast to hints on board, do not generate 0 hint for empty line
    // return cellStreaks.length > 0 ? cellStreaks : [0];
  };

  static removeZerosFromHints = (hints) =>
    hints.map((line) => (line.length === 1 && line[0] === 0 ? [] : line));

  static getAmountOfLineCombinations(hints, dimension) {
    return hints.reduce((currentCombinations, nextLineHints) => {
      const nextLineStreaks = nextLineHints.length;
      const nextLineGaps =
        dimension -
        nextLineHints.reduce((s, nh) => s + nh, 0) -
        nextLineStreaks +
        1;
      const nextRowCombinations =
        factorial(nextLineGaps + nextLineStreaks) /
        (factorial(nextLineGaps) * factorial(nextLineStreaks));
      return currentCombinations * nextRowCombinations;
    }, 1);
  }

  static generateCombinationsFromHints(hintLine, lineDepth) {
    return hintLine.map((hintLine) => {
      if (!hintLine.length) {
        return {
          combinations: [[...Array(lineDepth).keys()]],
          blocks: lineDepth,
        };
      }
      const streaks = hintLine.length;
      const gaps =
        lineDepth - hintLine.reduce((s, nh) => s + nh, 0) - streaks + 1;
      const blocks = gaps + streaks; // block is either an empty pixel or full series of filled pixels from hint
      return {
        combinations: combinations(gaps, [...Array(blocks).keys()]),
        blocks,
      };
    });
  }

  static generatePossibleLinesLists(linesCombinations, linesHints) {
    return linesCombinations.map((lineCombinations, i) => {
      const {combinations, blocks} = lineCombinations;
      const lineHints = linesHints[i];
      return combinations.map((combination) => {
        const line = [];
        // filling in the line
        let nextGapIndex = 0;
        let nextStreakIndex = 0;
        for (let i = 0; i < blocks; i++) {
          if (i === combination[nextGapIndex]) {
            line.push(CombinationFieldState.EMPTY);
            nextGapIndex++;
          } else {
            // fill in the streak
            for (let j = 0; j < lineHints[nextStreakIndex]; j++) {
              line.push(CombinationFieldState.FILLED);
            }
            if (nextStreakIndex !== lineHints.length - 1) {
              // it's not the last one so it has a gap incorporated at the end, no matter what
              line.push(CombinationFieldState.EMPTY);
            }
            nextStreakIndex++;
          }
        }
        return line;
      });
    });
  }

  static solveByElimination(
    mutableRows,
    mutableCols,
    rowHints,
    colHints,
    width,
    height,
  ) {
    // first we generate combinations as list of indexes where we need to insert a gap
    const rowCombinations = Solver.generateCombinationsFromHints(
      rowHints,
      width,
    );
    const colCombinations = Solver.generateCombinationsFromHints(
      colHints,
      height,
    );

    // then we convert them to actual lines of {filled/empty} values
    const possibleRows = Solver.generatePossibleLinesLists(
      rowCombinations,
      rowHints,
    );
    const possibleCols = Solver.generatePossibleLinesLists(
      colCombinations,
      colHints,
    );

    // all rows & columns need to be checked at least once, so we add them to priority queue
    // positive indices are row indices, negative are column indices as an offset
    const linesToCheck = new PriorityQueue();
    for (let i = 0; i < height; i++) {
      linesToCheck.addItemUnsafely(i);
    }
    for (let i = 0; i < width; i++) {
      linesToCheck.addItemUnsafely(-i - 1);
    }

    return Solver.solveRecursively(
      mutableRows,
      mutableCols,
      possibleRows,
      possibleCols,
      width,
      height,
      linesToCheck,
      false,
    );
  }

  static solveRecursively(
    mutableRows,
    mutableCols,
    possibleRows,
    possibleCols,
    width,
    height,
    linesToCheck,
    hadGuessed,
  ) {
    // todo: legacy, delete when refactoring
    const filledField = hadGuessed
      ? SolverFieldState.GUESSED_FILLED
      : SolverFieldState.KNOWN_FILLED;
    const emptyField = hadGuessed
      ? SolverFieldState.GUESSED_EMPTY
      : SolverFieldState.KNOWN_EMPTY;

    // while there are lines to be checked, do so (which may generate new lines to check)
    while (linesToCheck.isNotEmpty()) {
      const lineIndex = linesToCheck.popItem();
      if (lineIndex >= 0) {
        Solver.checkLine(
          mutableRows[lineIndex],
          possibleRows[lineIndex],
          width,
          filledField,
          emptyField,
          linesToCheck,
          false,
        );
      } else {
        Solver.checkLine(
          mutableCols[-lineIndex - 1],
          possibleCols[-lineIndex - 1],
          height,
          filledField,
          emptyField,
          linesToCheck,
          true,
        );
      }
    }

    // no more lines to check
    // if all lines have only one combination, then we found a solution
    // if a line has no combinations, then there's no solution in the current branch
    // otherwise, we have a line with some combinations to check, so we branch on each possibility
    if (
      possibleRows.every((c) => c.length === 1) &&
      possibleCols.every((c) => c.length === 1)
    ) {
      return true;
    } else if (
      possibleRows.some((c) => c.length === 0) ||
      possibleCols.some((c) => c.length === 0)
    ) {
      return false;
    } else {
      // begin assuming
      const rowAssumption = Solver.assumeOnLines(
        mutableRows,
        mutableCols,
        possibleRows,
        possibleCols,
        width,
        height,
        emptyField,
        filledField,
        linesToCheck,
        false,
      );

      // if there was an assumption series on rows, return result; otherwise look at columns
      return rowAssumption !== null
        ? rowAssumption
        : Solver.assumeOnLines(
            mutableCols,
            mutableRows,
            possibleCols,
            possibleRows,
            height,
            width,
            emptyField,
            filledField,
            linesToCheck,
            true,
          );
    }
  }

  static assumeOnLines(
    lines,
    perpendicularLines,
    possibleLines,
    perpendicularPossibleLines,
    lineLength,
    lineBroadth,
    emptyField,
    filledField,
    linesToCheck,
    isCol,
  ) {
    // choose first row/col to have more than one combination available
    // todo: determine if it's heuristically worth to choose one with least amount of combinations
    for (let i = 0; i < lineBroadth; i++) {
      if (possibleLines[i].length > 1) {
        // line chosen, if all branching fails then puzzle is unsolvable at current branch
        for (let j = 0; j < possibleLines[i].length; j++) {
          // first, we need to write our chosen possibility to mutableLine
          const chosenLineVersion = possibleLines[i][j];
          for (let k = 0; k < lineLength; k++) {
            lines[i][k].state =
              chosenLineVersion[k] === CombinationFieldState.EMPTY
                ? emptyField
                : filledField;
          }

          // then, add all perpendiculars to linesToCheck
          for (let k = 0; k < lineLength; k++) {
            linesToCheck.addItem(isCol ? k : -k - 1);
          }

          // finally, we copy our data in a way that
          // - we do not affect state of current data (to allow for next branching)
          // - copied rows and columns contain same cell objects
          // - combination amount for line we branch on is reduced to one
          const linesCopy = JSON.parse(JSON.stringify(lines));
          const perpendicularLinesCopy = [...Array(lineLength).keys()].map(
            (i) => [...Array(lineBroadth).keys()].map((j) => linesCopy[j][i]),
          );

          const possibleLinesCopy = possibleLines.map((lineOptions) =>
            lineOptions.map((possibleLine) => possibleLine),
          );
          possibleLinesCopy[i] = [possibleLinesCopy[i][j]];
          const perpendicularPossibleLinesCopy = perpendicularPossibleLines.map(
            (lineOptions) => lineOptions.map((possibleLine) => possibleLine),
          );

          const branchingResult = Solver.solveRecursively(
            isCol ? perpendicularLinesCopy : linesCopy,
            !isCol ? perpendicularLinesCopy : linesCopy,
            isCol ? perpendicularPossibleLinesCopy : possibleLinesCopy,
            !isCol ? perpendicularPossibleLinesCopy : possibleLinesCopy,
            isCol ? lineBroadth : lineLength,
            !isCol ? lineBroadth : lineLength,
            linesToCheck,
            true,
          );
          if (branchingResult) {
            // we found a solution
            // we need to copy it to current lines to enable passing data up
            for (let k = 0; k < lineLength; k++) {
              lines[k] = linesCopy[k];
            }
            for (let k = 0; k < lineBroadth; k++) {
              perpendicularLines[k] = perpendicularLinesCopy[k];
            }
            return true;
          }
        }
        return false;
      }
    }
    return null;
  }

  static checkLine(
    line,
    possibleLines,
    lineLength,
    filledField,
    emptyField,
    linesToCheck,
    isCol,
  ) {
    let i = 0;
    // first we need to eliminate all invalid lines so far
    while (i < possibleLines.length) {
      const possibleLine = possibleLines[i];
      const isValid = Solver.checkLineCombination(
        line,
        possibleLine,
        lineLength,
      );
      if (isValid) {
        i++;
      } else {
        possibleLines.splice(i, 1);
      }
    }

    // then we look for new state common for all combinations (a cell that must be empty/filled)
    if (possibleLines.length > 0) {
      for (i = 0; i < lineLength; i++) {
        const cell = line[i];
        if (cell.state === SolverFieldState.UNTOUCHED) {
          let firstLineState = possibleLines[0][i];
          for (let j = 1; j < possibleLines.length; j++) {
            if (possibleLines[j][i] !== firstLineState) {
              firstLineState = null;
              break;
            }
          }
          if (firstLineState !== null) {
            cell.state =
              firstLineState === CombinationFieldState.EMPTY
                ? emptyField
                : filledField;
            linesToCheck.addItem(isCol ? i : -i - 1);
          }
        }
      }
    }
  }

  static checkLineCombination(line, possibleLine, lineLength) {
    // checking if possible line is compatible with line
    for (let j = 0; j < lineLength; j++) {
      if (
        line[j].state === SolverFieldState.GUESSED_EMPTY ||
        line[j].state === SolverFieldState.KNOWN_EMPTY
      ) {
        if (possibleLine[j] === CombinationFieldState.FILLED) {
          return false;
        }
      } else if (
        line[j].state === SolverFieldState.GUESSED_FILLED ||
        line[j].state === SolverFieldState.KNOWN_FILLED
      ) {
        if (possibleLine[j] === CombinationFieldState.EMPTY) {
          return false;
        }
      }
    }
    return true;
  }
}

export default Solver;
