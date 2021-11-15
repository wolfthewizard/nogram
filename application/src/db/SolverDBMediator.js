import FinishType from '../enums/FinishType';
import PuzzleType from '../enums/PuzzleType';
import {SOLVER_PUZZLES_TABLE_NAME, USER_PUZZLES_TABLE_NAME} from './dbData';
import {getDBConnection} from './DBMediator';

const getSolverPuzzleList = async (callback) => {
  const db = await getDBConnection();
  try {
    const solverPuzzles = [];
    const results1 = await db.executeSql(
      `select id, name 
        from ${SOLVER_PUZZLES_TABLE_NAME};`,
    );
    results1.forEach((result) => {
      for (let index = 0; index < result.rows.length; index++) {
        solverPuzzles.push(result.rows.item(index));
      }
    });

    const solvedUserPuzzles = [];
    const results2 = await db.executeSql(
      `select id, name 
      from ${USER_PUZZLES_TABLE_NAME};',
        // from ${USER_PUZZLES_TABLE_NAME} 
        // where finishType = ${FinishType.FINISHED_WITHOUT_LOSING} 
        // or finishType = ${FinishType.FINISHED_WITH_LOSING};`,
    );
    results2.forEach((result) => {
      for (let index = 0; index < result.rows.length; index++) {
        solvedUserPuzzles.push(result.rows.item(index));
      }
    });

    callback(
      solverPuzzles.map((obj) => ({...obj, type: PuzzleType.SOLVER_PUZZLE})),
      solvedUserPuzzles.map((obj) => ({...obj, type: PuzzleType.USER_PUZZLE})),
    );
  } catch (error) {
    console.error(error);
    throw Error('Failed to retrieve puzzle list for solver.');
  }
};

const addPuzzle = async (puzzleData, callback) => {
  const db = await getDBConnection();
  const insertQuery = `insert into ${SOLVER_PUZZLES_TABLE_NAME} (
    name,
    boardWidth,
    boardHeight,
    colHints,
    rowHints
  ) values (
    '${puzzleData.name}',
    ${puzzleData.boardWidth},
    ${puzzleData.boardHeight},
    '${JSON.stringify(puzzleData.colHints)}',
    '${JSON.stringify(puzzleData.rowHints)}'
  );`;
  db.executeSql(insertQuery);
  callback && callback();
};

const getSolverPuzzleById = async (id, callback) => {
  const db = await getDBConnection();
  try {
    const puzzles = await db.executeSql(
      `select * from ${SOLVER_PUZZLES_TABLE_NAME} where id=${id};`,
    );
    const puzzle = puzzles[0].rows.item(0);
    callback({
      ...puzzle,
      colHints: JSON.parse(puzzle.colHints),
      rowHints: JSON.parse(puzzle.rowHints),
    });
  } catch (error) {
    console.error(error);
    throw Error('Failed to retrieve solver puzzle.');
  }
};

export {getSolverPuzzleList, getSolverPuzzleById, addPuzzle};
