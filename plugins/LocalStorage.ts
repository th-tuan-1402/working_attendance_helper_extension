export type SaveData = Record<string, any>
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
   * Set array items
   * @param items array type of items
   */
  async setArray(items: SaveData) {
    for (let key in items) {
      let value = JSON.stringify(items[key])
      await this.setItem({ [key]: value })
    }
  }

  /**
 * Set array items
 * @param items array type of items
 */
  async getArray(key: string) {
    let value = await this.getItem(key)
    return value ? JSON.parse(await this.getItem(key)) : null
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
