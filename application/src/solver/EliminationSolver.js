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
      if (item.lineNum === currentItem.lineNum) {
        for (let j = 0; j < currentItem.indices.length; j++) {
          if (currentItem.indices[j] === item.addedIndex) {
            return;
          }
        }
        currentItem.indices.push(item.addedIndex);
        return;
      }
    }
    this.objectsList.push({
      lineNum: item.lineNum,
      indices: [item.addedIndex],
    });
  }

  popItem() {
    return this.objectsList.pop();
  }

  isNotEmpty() {
    return this.objectsList.length > 0;
  }
}

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

// EliminationSolver with line's changed indices tracking
// the solver can check for multiple solutions
class Solver {
  constructor() {
    this.obtainedSolutions = [];
  }

  solve(
    width,
    height,
    initialFields,
    setSolutionsFound,
    setSolveMessage,
    rowHintsWithZeros,
    colHintsWithZeros,
    findAllSolutions,
  ) {
    this.obtainedSolutions = [];
    const resetFields = initialFields.map((row) =>
      row.map((field) => ({
        ...field,
        color: undefined,
        state: SolverFieldState.UNTOUCHED,
      })),
    );

    const mutableRows = JSON.parse(JSON.stringify(resetFields));
    const mutableCols = [...Array(width).keys()].map((i) =>
      [...Array(height).keys()].map((j) => mutableRows[j][i]),
    );

    const rowHints = Solver.removeZerosFromHints(rowHintsWithZeros);
    const colHints = Solver.removeZerosFromHints(colHintsWithZeros);

    const startTime = new Date().getTime();

    this.solveByElimination(
      mutableRows,
      mutableCols,
      rowHints,
      colHints,
      width,
      height,
      findAllSolutions,
    );
    const endTime = new Date().getTime();
    if (this.obtainedSolutions.length) {
      setSolutionsFound(
        this.obtainedSolutions.map((solution) =>
          solution.map((row) =>
            row.map((field) => ({
              ...field,
              state:
                field.state === SolverFieldState.GUESSED_EMPTY ||
                field.state === SolverFieldState.KNOWN_EMPTY
                  ? FieldStates.UNTOUCHED
                  : FieldStates.CORRECTLY_UNCOVERED,
            })),
          ),
        ),
      );
      console.log(`Solving took ${(endTime - startTime) / 1000}s`);
      setSolveMessage(
        `Found ${
          (findAllSolutions && `${this.obtainedSolutions.length} `) || ''
        }solution${this.obtainedSolutions.length > 1 ? 's' : ''} in ${
          (endTime - startTime) / 1000
        }s.`,
      );
    } else {
      console.log('unsolvable');
      setSolveMessage('Puzzle is unsolvable.');
    }
  }

  solveByElimination(
    mutableRows,
    mutableCols,
    rowHints,
    colHints,
    width,
    height,
    findAllSolutions,
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
      linesToCheck.addItemUnsafely({
        lineNum: i,
        indices: [...Array(width).keys()],
      });
    }
    for (let i = 0; i < width; i++) {
      linesToCheck.addItemUnsafely({
        lineNum: -i - 1,
        indices: [...Array(height).keys()],
      });
    }

    this.solveRecursively(
      mutableRows,
      mutableCols,
      possibleRows,
      possibleCols,
      width,
      height,
      linesToCheck,
      findAllSolutions,
    );
  }

  solveRecursively(
    mutableRows,
    mutableCols,
    possibleRows,
    possibleCols,
    width,
    height,
    linesToCheck,
    findAllSolutions,
  ) {
    const filledField = SolverFieldState.GUESSED_FILLED;
    const emptyField = SolverFieldState.GUESSED_EMPTY;

    // while there are lines to be checked, do so (which may generate new lines to check)
    while (linesToCheck.isNotEmpty()) {
      const lineToCheck = linesToCheck.popItem();
      if (lineToCheck.lineNum >= 0) {
        if (
          !Solver.checkLine(
            lineToCheck.lineNum,
            mutableRows[lineToCheck.lineNum],
            lineToCheck.indices,
            possibleRows[lineToCheck.lineNum],
            width,
            filledField,
            emptyField,
            linesToCheck,
            false,
          )
        ) {
          return false;
        }
      } else {
        if (
          !Solver.checkLine(
            -lineToCheck.lineNum - 1,
            mutableCols[-lineToCheck.lineNum - 1],
            lineToCheck.indices,
            possibleCols[-lineToCheck.lineNum - 1],
            height,
            filledField,
            emptyField,
            linesToCheck,
            true,
          )
        ) {
          return false;
        }
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
      this.obtainedSolutions.push(mutableRows);
      return true;
    } else {
      // begin assuming
      const rowAssumption = this.assumeOnLines(
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
        findAllSolutions,
      );

      // if there was an assumption series on rows, return result; otherwise look at columns
      return rowAssumption !== null
        ? rowAssumption
        : this.assumeOnLines(
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
            findAllSolutions,
          );
    }
  }

  assumeOnLines(
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
    findAllSolutions,
  ) {
    // choose first row/col to have more than one combination available
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
            linesToCheck.addItemUnsafely({
              lineNum: isCol ? k : -k - 1,
              indices: [...Array(lineBroadth).keys()],
            });
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

          const branchingResult = this.solveRecursively(
            isCol ? perpendicularLinesCopy : linesCopy,
            !isCol ? perpendicularLinesCopy : linesCopy,
            isCol ? perpendicularPossibleLinesCopy : possibleLinesCopy,
            !isCol ? perpendicularPossibleLinesCopy : possibleLinesCopy,
            isCol ? lineBroadth : lineLength,
            !isCol ? lineBroadth : lineLength,
            linesToCheck,
            findAllSolutions,
          );
          if (branchingResult && !findAllSolutions) {
            return true;
          }
        }
        return false;
      }
    }
    return null;
  }

  static checkLine(
    lineIndex,
    line,
    indices,
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
      const isValid = Solver.checkLineCombination(line, indices, possibleLine);
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
            linesToCheck.addItem({
              lineNum: isCol ? i : -i - 1,
              addedIndex: lineIndex,
            });
          }
        }
      }
      return true;
    } else {
      return false;
    }
  }

  static checkLineCombination(line, indices, possibleLine) {
    // checking if possible line is compatible with line
    for (const j of indices) {
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

  static removeZerosFromHints = (hints) =>
    hints.map((line) => (line.length === 1 && line[0] === 0 ? [] : line));

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
}

export default Solver;
