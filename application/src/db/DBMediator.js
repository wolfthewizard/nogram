import {enablePromise, openDatabase} from 'react-native-sqlite-storage';
import FieldStates from '../enums/FieldStates';
import FinishType from '../enums/FinishType';
import SolveStatus from '../enums/SolveStatus';
import {DB_NAME, TABLE_NAME} from './dbData';
import puzzles from './puzzles';

const force_repopulate = false;

const getDBConnection = async () =>
  openDatabase({name: DB_NAME, location: 'default'});

const initDb = async () => {
  const db = await getDBConnection();
  // const dropTableQuery = `drop table if exists ${TABLE_NAME}`;
  // await db.executeSql(dropTableQuery);
  const createDbQuery = `create table if not exists ${TABLE_NAME} (
          id integer not null primary key,
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
        const clearQuery = `delete from ${TABLE_NAME}`;
        await db.executeSql(clearQuery);
      }
      for (const puzzle of puzzles) {
        const insertPuzzleQuery = `insert into ${TABLE_NAME} (
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
              '${puzzle.name}',
              ${puzzle.fields.reduce(
                (currRowSum, nextRow) =>
                  currRowSum +
                  nextRow.reduce(
                    (currSum, nextField) =>
                      currSum + (nextField.hasPixel ? 1 : 0),
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
};

const getDbSize = async (callback) => {
  const db = await getDBConnection();
  const dbSize = await db.executeSql(`select count(*) from ${TABLE_NAME};`);
  callback(dbSize[0].rows.item(0)['count(*)']);
};

enablePromise(true);
initDb();

export {getDBConnection};
