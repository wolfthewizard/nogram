import SolveStatus from '../enums/SolveStatus';
import DBMediator from './DBMediator';
import {
  DB_INITIALIZED_SIGNATURE,
  USER_PUZZLE_DETAILS_SIGNATURE,
  USER_PUZZLE_LIST_SIGNATURE,
} from './dbQuerySignatures';
import puzzles from './puzzles';

const initDb = () => {
  DBMediator.readValue(DB_INITIALIZED_SIGNATURE, (isInitialized) => {
    if (!isInitialized) {
      const userPuzzleAllDatas = puzzles;
      const userPuzzleList = userPuzzleAllDatas.map((upad) => ({
        id: upad.id,
        name: upad.name,
        solveStatus: SolveStatus.UNSOLVED,
        firstSolveWithoutLosses: true,
      }));
      const userPuzzleDetailsList = userPuzzleAllDatas.map((upad) => ({
        id: upad.id,
        maxLives: upad.maxLives,
        currentLives: upad.currentLives,
        boardData: upad.boardData,
      }));
      DBMediator.saveValue(USER_PUZZLE_LIST_SIGNATURE, userPuzzleList);
      for (const upd of userPuzzleDetailsList) {
        DBMediator.saveValue(USER_PUZZLE_DETAILS_SIGNATURE + upd.id, upd);
      }
      DBMediator.saveValue(DB_INITIALIZED_SIGNATURE, true);
    }
  });
};

export default initDb;
