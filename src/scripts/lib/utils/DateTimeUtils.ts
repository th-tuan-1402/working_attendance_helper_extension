import dayjs from 'dayjs'

export default class DateTimeUtils {
  /**
   * Get current date
   * @returns Date
   */
  static getCurrentDate() {
    const now = dayjs().format('YYYY/MM/DD')

    return dayjs(now).toDate()
  }

  /**
   * Get current time
   * @returns string
   */
  static getCurrentTimeAsString() {
    return dayjs().format('HH:mm:ss')
  }

  /**
   * Format as hyphen string
   * @param {*} date
   * @returns
   */
  static formatHyphen(date: Date) {
    return dayjs(date).format('YYYY-MM-DD')
  }
}
