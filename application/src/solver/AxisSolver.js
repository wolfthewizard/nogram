import FieldStates from '../enums/FieldStates';

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
        state: FieldStates.UNTOUCHED,
      })),
    );
    setFields(resetFields);

    const mutableRows = JSON.parse(JSON.stringify(resetFields));
    const mutableCols = [...Array(width).keys()].map((i) =>
      [...Array(height).keys()].map((j) => resetFields[j][i]),
    );

    const rowHints = mutableRows.map((row) => Solver.generateHints(row));
    const colHints = mutableCols.map((col) => Solver.generateHints(col));
    // const rowHints = Solver.removeZerosFromHints(rowHintsWithZeros);
    // const colHints = Solver.removeZerosFromHints(colHintsWithZeros);

    const startTime = new Date().getTime();

    const rowCombinationAmount = Solver.getAmountOfLineCombinations(
      rowHints,
      width,
    );
    const colCombinationAmount = Solver.getAmountOfLineCombinations(
      colHints,
      height,
    );

    if (rowCombinationAmount <= colCombinationAmount) {
      console.log('solving along rows');
      if (
        Solver.solveAlongLines(mutableRows, rowHints, width, height, colHints)
      ) {
        console.log('solved');
        setFields(mutableRows);
      } else {
        console.log('unsolvable');
      }
    } else {
      console.log('solving along columns');
      if (
        Solver.solveAlongLines(mutableCols, colHints, height, width, rowHints)
      ) {
        console.log('solved');
        setFields(
          [...Array(width).keys()].map((i) =>
            [...Array(height).keys()].map((j) => mutableCols[j][i]),
          ),
        );
      } else {
        console.log('unsolvable');
      }
    }

    const endTime = new Date().getTime();
    console.log(endTime - startTime);
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

  static solveAlongLines(
    lines,
    hintLines,
    lineDepth,
    lineBroadth,
    perpendicularHintLines,
  ) {
    const linesCombinations = hintLines.map((hintLine) => {
      if (!hintLine.length) {
        return {combinations: [...Array(lineDepth).keys()], blocks: lineDepth};
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

    return this.prepareLineAndLower(
      lines,
      linesCombinations,
      0,
      lineDepth,
      lineBroadth,
      hintLines,
      perpendicularHintLines,
    );
  }

  static prepareLineAndLower(
    lines,
    linesCombinations,
    index,
    lineDepth,
    lineBroadth,
    hintLines,
    perpendicularHintLines,
  ) {
    if (index === lineBroadth) {
      return this.validateAlongLines(
        lines,
        perpendicularHintLines,
        lineDepth,
        lineBroadth,
      );
    } else {
      const line = lines[index];
      const hints = hintLines[index];
      const {combinations, blocks} = linesCombinations[index];
      for (const combination of combinations) {
        // filling in the line
        let nextGapIndex = 0;
        let nextStreakIndex = 0;
        let positionIndex = 0;
        for (let i = 0; i < blocks; i++) {
          if (i === combination[nextGapIndex]) {
            line[positionIndex].state = FieldStates.UNTOUCHED;
            positionIndex++;
            nextGapIndex++;
          } else {
            // fill in the streak
            for (let j = 0; j < hints[nextStreakIndex]; j++) {
              line[positionIndex].state = FieldStates.CORRECTLY_UNCOVERED;
              positionIndex++;
            }
            if (nextStreakIndex !== hints.length - 1) {
              // it's not the last one so it has a gap incorporated at the end, no matter what
              line[positionIndex].state = FieldStates.UNTOUCHED;
              positionIndex++;
            }
            nextStreakIndex++;
          }
        }
        // if rules are broken so far, check next combination
        if (
          this.partiallyValidateAlongLines(
            lines,
            perpendicularHintLines,
            lineDepth,
            index,
          )
        ) {
          // for a given way to fill the line,
          // check if any combinations of filling lower lines produces a solution
          if (
            this.prepareLineAndLower(
              lines,
              linesCombinations,
              index + 1,
              lineDepth,
              lineBroadth,
              hintLines,
              perpendicularHintLines,
            )
          ) {
            return true;
          }
        }
      }
      return false;
    }
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
            // more pixels in a row than current hint suggests
            return false;
          }
        } else {
          if (currentHintBegan) {
            if (currentHint > 0) {
              // less pixels in a row than current hint suggests
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
            // more pixels in a row than current hint suggests
            return false;
          }
        } else {
          if (currentHintBegan) {
            if (currentHint > 0) {
              // less pixels in a row than current hint suggests
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
