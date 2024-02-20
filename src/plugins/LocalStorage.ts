export type SaveData = Record<string, never>
interface ILocalStorage {
  get: (keys: string[]) => Promise<any>
  set: (saveData: SaveData) => Promise<any>
  remove: (keys: string[]) => Promise<any>
}

export default class LocalStorage {
  private localStorage: ILocalStorage

  constructor(localStorage: ILocalStorage) {
    this.localStorage = localStorage
  }

  /**
   * Set local storage item
   *
   * @param items
   * @returns
   */
  async setItem(items: SaveData) {
    return await this.localStorage.set(items)
  }

  /**
   * Get local storage item
   *
   * @param {*} key
   * @returns
   */
  async getItem(key: string) {
    return await this.localStorage.get([key]).then((result) => result[key])
  }

  /**
   * Remove local storage item
   *
   * @param key
   * @returns
   */
  async removeItem(key: string) {
    return await this.localStorage.remove([key])
  }
}
