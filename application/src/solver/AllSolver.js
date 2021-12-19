import FieldStates from '../enums/FieldStates.js';

// AllSolver with implemented partial verification
// this solver cannot check for multiple solutions, and returns the first one found
class Solver {
  constructor() {}

  solve(
    width,
    height,
    initialFields,
    setSolutionsFound,
    setSolveMessage,
    rowHintsWithZeros,
    colHintsWithZeros,
  ) {
    const resetFields = initialFields.map((row) =>
      row.map((field) => ({
        ...field,
        color: undefined,
        state: FieldStates.UNTOUCHED,
      })),
    );

    const mutableRows = JSON.parse(JSON.stringify(resetFields));
    const mutableCols = [...Array(width).keys()].map((i) =>
      [...Array(height).keys()].map((j) => mutableRows[j][i]),
    );

    const rowHints = Solver.removeZerosFromHints(rowHintsWithZeros);
    const colHints = Solver.removeZerosFromHints(colHintsWithZeros);

    console.log('starting the solving process');
    const startTime = new Date().getTime();

    if (
      Solver.branchOnField(
        width,
        height,
        mutableRows,
        mutableCols,
        0,
        rowHints,
        colHints,
      )
    ) {
      const endTime = new Date().getTime();
      console.log('solved');
      setSolutionsFound([mutableRows]);
      console.log(`Solving took ${(endTime - startTime) / 1000}s`);
      setSolveMessage(`Found solution in ${(endTime - startTime) / 1000}s.`);
    } else {
      console.log('unsolvable');
      setSolveMessage('Puzzle is unsolvable.');
    }
  }

  static removeZerosFromHints = (hints) =>
    hints.map((line) => (line.length === 1 && line[0] === 0 ? [] : line));

  static branchOnField(
    width,
    height,
    mutableRows,
    mutableCols,
    absoluteIndex,
    rowHints,
    colHints,
  ) {
    if (absoluteIndex % width === 0 && absoluteIndex / width > 0) {
      // a row has been filled, partial validation is to be made
      if (
        !this.partiallyValidateAlongLines(
          mutableRows,
          colHints,
          width,
          absoluteIndex / width,
        )
      ) {
        return false;
      }
    }
    if (absoluteIndex === width * height) {
      // maximum recursion depth - validate solution
      return Solver.validateSolution(
        mutableRows,
        mutableCols,
        rowHints,
        colHints,
        width,
        height,
      );
    } else {
      // recursion on field on both states - empty and filled
      mutableRows[Math.floor(absoluteIndex / width)][
        absoluteIndex % width
      ].state = FieldStates.UNTOUCHED;
      if (
        Solver.branchOnField(
          width,
          height,
          mutableRows,
          mutableCols,
          absoluteIndex + 1,
          rowHints,
          colHints,
        )
      ) {
        return true;
      }
      mutableRows[Math.floor(absoluteIndex / width)][
        absoluteIndex % width
      ].state = FieldStates.CORRECTLY_UNCOVERED;
      return Solver.branchOnField(
        width,
        height,
        mutableRows,
        mutableCols,
        absoluteIndex + 1,
        rowHints,
        colHints,
      );
    }
  }

  static validateSolution(
    mutableRows,
    mutableCols,
    rowHints,
    colHints,
    width,
    height,
  ) {
    return (
      Solver.validateAlongLines(mutableRows, colHints, width, height) &&
      Solver.validateAlongLines(mutableCols, rowHints, height, width)
    );
  }

  static partiallyValidateAlongLines(
    alteredLines,
    hints,
    lineDepth,
    maxBroadth,
  ) {
    for (let i = 0; i < lineDepth; i++) {
      const hintLine = hints[i];
      let currentHintIndex = 0;
      let currentHint = hintLine[currentHintIndex];
      let currentHintBegan = false;
      for (let j = 0; j < maxBroadth; j++) {
        if (alteredLines[j][i].state === FieldStates.CORRECTLY_UNCOVERED) {
          if (currentHint === undefined) {
            // more blocks in a line than amount of hints suggests
            return false;
          }
          if (!currentHintBegan) {
            currentHintBegan = true;
          }
          currentHint--;
          if (currentHint < 0) {
            // more pixels in a block than current hint suggests
            return false;
          }
        } else {
          if (currentHintBegan) {
            if (currentHint > 0) {
              // less pixels in a block than current hint suggests
              return false;
            }
            currentHintBegan = false;
            currentHintIndex++;
            currentHint = hintLine[currentHintIndex];
          }
        }
      }
    }
    return true;
  }

  static validateAlongLines(alteredLines, hints, lineDepth, lineBroadth) {
    for (let i = 0; i < lineDepth; i++) {
      const hintLine = hints[i];
      let currentHintIndex = 0;
      let currentHint = hintLine[currentHintIndex];
      let currentHintBegan = false;
      for (let j = 0; j < lineBroadth; j++) {
        if (alteredLines[j][i].state === FieldStates.CORRECTLY_UNCOVERED) {
          if (currentHint === undefined) {
            // more blocks in a line than amount of hints suggests
            return false;
          }
          if (!currentHintBegan) {
            currentHintBegan = true;
          }
          currentHint--;
          if (currentHint < 0) {
            // more pixels in a block than current hint suggests
            return false;
          }
        } else {
          if (currentHintBegan) {
            if (currentHint > 0) {
              // less pixels in a block than current hint suggests
              return false;
            }
            currentHintBegan = false;
            currentHintIndex++;
            currentHint = hintLine[currentHintIndex];
          }
        }
      }
      if (currentHint > 0) {
        // last began hint was not finished
        return false;
      }
      if (
        (alteredLines[lineBroadth - 1][i].state === FieldStates.UNTOUCHED &&
          currentHintIndex !== hintLine.length) ||
        (alteredLines[lineBroadth - 1][i].state ===
          FieldStates.CORRECTLY_UNCOVERED &&
          currentHintIndex !== hintLine.length - 1)
      ) {
        // not all hints were satisfied
        return false;
      }
    }
    return true;
  }
}

export default Solver;
