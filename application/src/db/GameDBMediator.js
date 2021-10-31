import {TABLE_NAME} from './dbData';
import {getDBConnection} from './DBMediator';

const getMenuPuzzleList = async (callback) => {
  const db = await getDBConnection();
  try {
    const menuPuzzleList = [];
    const results = await db.executeSql(
      `select id, name, totalPixels, foundPixels, solveStatus, finishType from ${TABLE_NAME};`,
    );
    results.forEach((result) => {
      for (let index = 0; index < result.rows.length; index++) {
        menuPuzzleList.push(result.rows.item(index));
      }
    });
    callback(menuPuzzleList);
  } catch (error) {
    console.error(error);
    throw Error('Failed to retrieve puzzle list for menu.');
  }
};

const getPuzzleById = async (id, callback) => {
  const db = await getDBConnection();
  try {
    const puzzles = await db.executeSql(
      `select * from ${TABLE_NAME} where id=${id};`,
    );
    const puzzle = puzzles[0].rows.item(0);
    callback({...puzzle, fields: JSON.parse(puzzle.fields)});
  } catch (error) {
    console.error(error);
    throw Error('Failed to retrieve puzzle details.');
  }
};

const saveGameFieldsState = async (id, fields) => {
  const db = await getDBConnection();
  const insertQuery = `update ${TABLE_NAME} set fields='${JSON.stringify(
    fields,
  )}' where id=${id}`;
  db.executeSql(insertQuery);
};

const saveGameLivesCount = async (id, lives) => {
  const db = await getDBConnection();
  const insertQuery = `update ${TABLE_NAME} set currentLives='${lives}' where id=${id}`;
  db.executeSql(insertQuery);
};

const saveGameFoundPixels = async (id, foundPixels) => {
  const db = await getDBConnection();
  const insertQuery = `update ${TABLE_NAME} set foundPixels='${foundPixels}' where id=${id}`;
  db.executeSql(insertQuery);
};

const saveGameStatus = async (id, solveStatus) => {
  const db = await getDBConnection();
  const insertQuery = `update ${TABLE_NAME} set solveStatus='${solveStatus}' where id=${id}`;
  db.executeSql(insertQuery);
};

const saveGameFinishType = async (id, finishType) => {
  const db = await getDBConnection();
  const insertQuery = `update ${TABLE_NAME} set finishType='${finishType}' where id=${id}`;
  db.executeSql(insertQuery);
};

export {
  getMenuPuzzleList,
  getPuzzleById,
  saveGameFieldsState,
  saveGameLivesCount,
  saveGameFoundPixels,
  saveGameStatus,
  saveGameFinishType,
};
