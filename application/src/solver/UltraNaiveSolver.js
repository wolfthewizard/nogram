import FieldStates from '../enums/FieldStates';

class Solver {
  constructor() {}

  solve(width, height, initialFields, setFields) {
    const resetFields = initialFields.map((row) =>
      row.map((field) => ({
        ...field,
        color: undefined,
        state: FieldStates.UNTOUCHED,
      })),
    );
    setFields(resetFields);

    const mutableFields = JSON.parse(JSON.stringify(resetFields));

    if (Solver.branchOnField(width, height, mutableFields, 0)) {
      setFields(mutableFields);
    } else {
      console.log('unsolvable');
    }
  }

  static branchOnField(width, height, fields, absoluteIndex) {
    if (absoluteIndex === width * height) {
      return Solver.validateSolution(fields);
    } else {
      fields[Math.floor(absoluteIndex / width)][absoluteIndex % width].state =
        FieldStates.UNTOUCHED;
      if (Solver.branchOnField(width, height, fields, absoluteIndex + 1)) {
        return true;
      }
      fields[Math.floor(absoluteIndex / width)][absoluteIndex % width].state =
        FieldStates.CORRECTLY_UNCOVERED;
      return Solver.branchOnField(width, height, fields, absoluteIndex + 1);
    }
  }

  static validateSolution(proposedFields) {
    for (const row of proposedFields) {
      for (const field of row) {
        if (
          (field.state === FieldStates.CORRECTLY_UNCOVERED &&
            !field.hasPixel) ||
          (field.state === FieldStates.UNTOUCHED && field.hasPixel)
        ) {
          return false;
        }
      }
    }
    return true;
  }
}

export default Solver;
