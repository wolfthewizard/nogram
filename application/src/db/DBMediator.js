import {enablePromise, openDatabase} from 'react-native-sqlite-storage';
import FieldStates from '../enums/FieldStates';
import FinishType from '../enums/FinishType';
import SolveStatus from '../enums/SolveStatus';
import {
  DB_NAME,
  PUZZLE_PACKS_TABLE_NAME,
  SOLVER_PUZZLES_TABLE_NAME,
  USER_PUZZLES_TABLE_NAME,
} from './dbData';
import puzzlePacks from './puzzlePacks';
import puzzles from './puzzles';
import solverPuzzles from './solverPuzzles';

const force_repopulate = false;

const getDBConnection = async () =>
  openDatabase({name: DB_NAME, location: 'default'});

const initDb = async () => {
  const db = await getDBConnection();
  // const dropTableQuery = `drop table if exists ${USER_PUZZLES_TABLE_NAME}`;
  // await db.executeSql(dropTableQuery);
  const createPuzzlePacksQuery = `create table if not exists ${PUZZLE_PACKS_TABLE_NAME} (
    id integer not null primary key,
    name text not null,
    imgPath text not null
  );`;
  await db.executeSql(createPuzzlePacksQuery);
  getPuzzlePacksSize(async (size) => {
    if (size === 0 || force_repopulate) {
      console.log('repopulating puzzle packs');
      if (force_repopulate) {
        const clearQuery = `delete from ${PUZZLE_PACKS_TABLE_NAME}`;
        await db.executeSql(clearQuery);
      }
      for (const puzzlePack of puzzlePacks) {
        const insertPuzzlePackQuery = `insert into ${PUZZLE_PACKS_TABLE_NAME} (
          id,
          name, 
          imgPath
        ) values (
          ${puzzlePack.id},
          '${puzzlePack.name}',
          '${puzzlePack.imgPath}'
        );`;
        await db.executeSql(insertPuzzlePackQuery);
      }
    }
  });
  const createDbQuery = `create table if not exists ${USER_PUZZLES_TABLE_NAME} (
    id integer not null primary key,
    packId integer not null,
    name text not null,
    totalPixels integer not null,
    foundPixels integer not null,
    solveStatus integer not null,
    finishType integer not null,
    maxLives integer not null,
    currentLives integer not null,
    boardWidth integer not null,
    boardHeight integer not null,
    fields text not null
  );`;
  await db.executeSql(createDbQuery);
  getDbSize(async (size) => {
    if (size === 0 || force_repopulate) {
      if (force_repopulate) {
        const clearQuery = `delete from ${USER_PUZZLES_TABLE_NAME}`;
        await db.executeSql(clearQuery);
      }
      for (const puzzle of puzzles) {
        const insertPuzzleQuery = `insert into ${USER_PUZZLES_TABLE_NAME} (
          packId,
          name, 
          totalPixels, 
          foundPixels, 
          solveStatus, 
          finishType, 
          maxLives, 
          currentLives,
          boardWidth,
          boardHeight,
          fields
        ) values (
          ${puzzle.packId},
          '${puzzle.name}',
          ${puzzle.fields.reduce(
            (currRowSum, nextRow) =>
              currRowSum +
              nextRow.reduce(
                (currSum, nextField) => currSum + (nextField.hasPixel ? 1 : 0),
                0,
              ),
            0,
          )},
          0,
          ${SolveStatus.UNSOLVED},
          ${FinishType.NEVER_FINISHED},
          ${puzzle.maxLives},
          ${puzzle.maxLives},
          ${puzzle.boardWidth},
          ${puzzle.boardHeight},
          '${JSON.stringify(
            puzzle.fields.map((row) =>
              row.map((fieldData) => ({
                ...fieldData,
                state: FieldStates.UNTOUCHED,
              })),
            ),
          )}'
        );`;
        await db.executeSql(insertPuzzleQuery);
      }
    }
  });
  const createSolverPuzzleTableQuery = `create table if not exists ${SOLVER_PUZZLES_TABLE_NAME} (
    id integer not null primary key,
    name text not null,
    boardWidth integer not null,
    boardHeight integer not null,
    colHints text not null,
    rowHints text not null
  );`;
  await db.executeSql(createSolverPuzzleTableQuery);
  getSolverPuzzlesSize(async (size) => {
    if (size === 0 || force_repopulate) {
      if (force_repopulate) {
        const clearQuery = `delete from ${SOLVER_PUZZLES_TABLE_NAME}`;
        await db.executeSql(clearQuery);
      }
      for (const puzzle of solverPuzzles.reverse()) {
        const insertPuzzleQuery = `insert into ${SOLVER_PUZZLES_TABLE_NAME} (
          name,
          boardWidth,
          boardHeight,
          colHints,
          rowHints
        ) values (
          '${puzzle.name}',
          ${puzzle.boardWidth},
          ${puzzle.boardHeight},
          '${JSON.stringify(puzzle.colHints)}',
          '${JSON.stringify(puzzle.rowHints)}'
        );`;
        await db.executeSql(insertPuzzleQuery);
      }
    }
  });
};

const getDbSize = async (callback) => {
  const db = await getDBConnection();
  const dbSize = await db.executeSql(
    `select count(*) from ${USER_PUZZLES_TABLE_NAME};`,
  );
  callback(dbSize[0].rows.item(0)['count(*)']);
};

const getPuzzlePacksSize = async (callback) => {
  const db = await getDBConnection();
  const dbSize = await db.executeSql(
    `select count(*) from ${PUZZLE_PACKS_TABLE_NAME};`,
  );
  callback(dbSize[0].rows.item(0)['count(*)']);
};

const getSolverPuzzlesSize = async (callback) => {
  const db = await getDBConnection();
  const dbSize = await db.executeSql(
    `select count(*) from ${SOLVER_PUZZLES_TABLE_NAME};`,
  );
  callback(dbSize[0].rows.item(0)['count(*)']);
};

enablePromise(true);
initDb();

export {getDBConnection};
