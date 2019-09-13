export default class LocalStorage {
  static set(key: string, value: string | number | object) {
    window.localStorage.setItem(
      key,
      typeof value === 'object' ? JSON.stringify(value) : String(value),
    );
  }

  static get(key: string) {
    return window.localStorage.getItem(key);
  }

  static getJSON(key: string) {
    const data = LocalStorage.get(key);
    try {
      return JSON.parse(data as string);
    } catch (e) {
      return null;
    }
  }
}
