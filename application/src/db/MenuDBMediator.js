import FinishType from '../enums/FinishType';
import {PUZZLE_PACKS_TABLE_NAME, USER_PUZZLES_TABLE_NAME} from './dbData';
import {getDBConnection} from './DBMediator';

const getPuzzlePackList = async (callback) => {
  const db = await getDBConnection();
  try {
    const puzzlePacks = [];
    const results = await db.executeSql(
      `select 
            ${PUZZLE_PACKS_TABLE_NAME}.id, 
            ${PUZZLE_PACKS_TABLE_NAME}.name, 
            ${PUZZLE_PACKS_TABLE_NAME}.imgPath,
            count(${USER_PUZZLES_TABLE_NAME}.id) as totalPuzzles,
            sum(
                case when 
                    ${USER_PUZZLES_TABLE_NAME}.finishType = ${FinishType.FINISHED_WITHOUT_LOSING} or
                    ${USER_PUZZLES_TABLE_NAME}.finishType = ${FinishType.FINISHED_WITH_LOSING}
                then 1 else 0 end
            ) as completedPuzzles
        from ${PUZZLE_PACKS_TABLE_NAME}
        left join ${USER_PUZZLES_TABLE_NAME}
            on ${PUZZLE_PACKS_TABLE_NAME}.id = ${USER_PUZZLES_TABLE_NAME}.packId
        group by ${PUZZLE_PACKS_TABLE_NAME}.id;`,
    );
    results.forEach((result) => {
      for (let index = 0; index < result.rows.length; index++) {
        puzzlePacks.push(result.rows.item(index));
      }
    });
    callback(puzzlePacks);
  } catch (error) {
    console.error(error);
    throw Error('Failed to retrieve puzzle pack list.');
  }
};

const getPuzzleListOfPack = async (packId, callback) => {
  const db = await getDBConnection();
  try {
    const menuPuzzleList = [];
    const results = await db.executeSql(
      `select id, name, totalPixels, foundPixels, solveStatus, finishType 
        from ${USER_PUZZLES_TABLE_NAME} 
        where packId = ${packId};`,
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

export {getPuzzlePackList, getPuzzleListOfPack};
