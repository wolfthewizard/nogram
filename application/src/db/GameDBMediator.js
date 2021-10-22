import DBMediator from './DBMediator';
import {
  USER_PUZZLE_DETAILS_SIGNATURE,
  USER_PUZZLE_LIST_SIGNATURE,
} from './dbQuerySignatures';

class GameDBMediator {
  static async getGamesList(callback) {
    DBMediator.readValue(USER_PUZZLE_LIST_SIGNATURE, callback);
  }

  static async getGameDetails(id, callback) {
    DBMediator.readValue(USER_PUZZLE_DETAILS_SIGNATURE + id, callback);
  }
}

export default GameDBMediator;
