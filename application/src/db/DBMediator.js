import AsyncStorage from '@react-native-async-storage/async-storage';

class DBMediator {
  static async saveValue(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`error during saving value for key ${key}: ${e}`);
    }
  }

  static async readValue(key, callback) {
    try {
      const value = await AsyncStorage.getItem(key);
      const parsedValue = value !== null ? JSON.parse(value) : null;
      callback(parsedValue);
    } catch (e) {
      console.error(`error during reading value for key ${key}: ${e}`);
    }
  }
}

export default DBMediator;
