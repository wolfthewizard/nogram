import FieldStates from '../enums/FieldStates';
import DBMediator from './DBMediator';
import {
  USER_PUZZLE_DETAILS_SIGNATURE,
  USER_PUZZLE_LIST_SIGNATURE,
} from './dbQuerySignatures';

class GameDBMediator {
  static getGamesList(callback) {
    DBMediator.readValue(USER_PUZZLE_LIST_SIGNATURE, callback);
  }

  static getGameDetails(id, callback) {
    DBMediator.readValue(USER_PUZZLE_DETAILS_SIGNATURE + id, callback);
  }

  static saveGameFieldsState(id, fields) {
    DBMediator.readValue(USER_PUZZLE_DETAILS_SIGNATURE + id, () =>
      DBMediator.mergeValue(USER_PUZZLE_DETAILS_SIGNATURE + id, {
        boardData: {fields: fields},
      }),
    );
  }

  static saveGameLivesCount(id, currentLives) {
    DBMediator.readValue(USER_PUZZLE_DETAILS_SIGNATURE + id, () =>
      DBMediator.mergeValue(USER_PUZZLE_DETAILS_SIGNATURE + id, {
        currentLives: currentLives,
      }),
    );
  }

  static saveGameFoundPixels(id, foundPixels) {
    DBMediator.readValue(
      USER_PUZZLE_LIST_SIGNATURE,
      (puzzleList) =>
        DBMediator.saveValue(
          USER_PUZZLE_LIST_SIGNATURE,
          puzzleList.map((puzzleDescr) =>
            puzzleDescr.id !== id
              ? puzzleDescr
              : {...puzzleDescr, foundPixels: foundPixels},
          ),
        ),
      // DBMediator.mergeValue(USER_PUZZLE_LIST_SIGNATURE, {
      //   list: puzzleList.list.map((puzzleDescr) =>
      //     puzzleDescr.id !== id ? {} : {foundPixels: foundPixels},
      //   ),
      // }),
    );
  }

  static saveGameStatus(id, solveStatus) {
    DBMediator.readValue(
      USER_PUZZLE_LIST_SIGNATURE,
      (puzzleList) =>
        DBMediator.saveValue(
          USER_PUZZLE_LIST_SIGNATURE,
          puzzleList.map((puzzleDescr) =>
            puzzleDescr.id !== id
              ? puzzleDescr
              : {...puzzleDescr, solveStatus: solveStatus},
          ),
        ),
      // DBMediator.mergeValue(USER_PUZZLE_LIST_SIGNATURE, {
      //   list: puzzleList.list.map((puzzleDescr) =>
      //     puzzleDescr.id !== id ? {} : {solveStatus: solveStatus},
      //   ),
      // }),
    );
  }

  static saveGameFinishType(id, finishType) {
    DBMediator.readValue(USER_PUZZLE_LIST_SIGNATURE, (puzzleList) => {
      DBMediator.saveValue(
        USER_PUZZLE_LIST_SIGNATURE,
        puzzleList.map((puzzleDescr) =>
          puzzleDescr.id !== id
            ? puzzleDescr
            : {...puzzleDescr, finishType: finishType},
        ),
      );
      // DBMediator.mergeValue(USER_PUZZLE_LIST_SIGNATURE, {
      //   list: puzzleList.list.map((puzzleDescr) =>
      //     puzzleDescr.id !== id ? {} : {finishType: finishType},
      //   ),
      // });
    });
  }

  static afterGame(id, foundPixels, solveStatus, finishType) {
    DBMediator.readValue(USER_PUZZLE_LIST_SIGNATURE, (puzzleList) => {
      DBMediator.saveValue(
        USER_PUZZLE_LIST_SIGNATURE,
        puzzleList.map((puzzleDescr) =>
          puzzleDescr.id !== id
            ? puzzleDescr
            : {
                ...puzzleDescr,
                foundPixels: 0,
                solveStatus: solveStatus,
                finishType: finishType,
              },
        ),
      );
    });
    DBMediator.readValue(USER_PUZZLE_DETAILS_SIGNATURE + id, (puzzleDetails) =>
      DBMediator.saveValue(USER_PUZZLE_DETAILS_SIGNATURE + id, {
        ...puzzleDetails,
        currentLives: puzzleDetails.maxLives,
        boardData: {
          ...puzzleDetails.boardData,
          fields: puzzleDetails.boardData.fields.map((row) =>
            row.map((fieldData) => ({
              ...fieldData,
              state: FieldStates.UNTOUCHED,
            })),
          ),
        },
      }),
    );
  }
}

export default GameDBMediator;
