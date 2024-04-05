import AppContext from '../core/AppContext';

export default class ChromeHelper {
  private chrome;

  constructor() {
    this.chrome = AppContext.getInstance().make('chrome');
  }

  /**
   * Emit notification
   *
   * @param {*} title
   * @param {*} message notification message
   * @param {*} url     callback url
   */
  notify(title: string = 'notification', message: string, url: string = ''): void {
    let params: Record<string, any> = {
      type: 'notification',
      options: {
        title: title,
        message: message,
        iconUrl: 'https://hito.lampart-vn.com/static/imgs/favicon.ico',
        type: 'basic'
      }
    }

    if (url) {
      params.url = url
    }

    this.chrome.runtime.sendMessage('', params);
  }

  /**
   * Adds a message listener to the chrome runtime.
   *
   * @param {function} callback - The callback function to be added as a listener
   * @return {void} 
   */
  addMessageListener(callback: Function): void {
    this.chrome.runtime.onMessage.addListener(callback);
  }

  /**
   * Creates a notification using the provided URL, options, and callback.
   *
   * @param {string} url - The URL to use for the notification.
   * @param {object} options - The options for the notification.
   * @param {Function} callback - The callback function to be executed after the notification is created.
   * @return {any} The result of the notification creation.
   */
  createNotification(url: string, options: object, callback: Function): any {
    return this.chrome.notifications.create(url, options, callback);
  }

  /**
   * A description of the entire function.
   *
   * @param {string} type - description of parameter
   * @param {Function} callback - description of parameter
   * @return {void} description of return value
   */
  addNotificationListener(type: string, callback: Function): void {
    if (type === 'click') {
      // Create listener for clicking notification
      this.chrome.notifications.onClicked.addListener(callback);
    } else {
      throw Error('Notification type not supported')
    }
  }

  /**
   * Creates a new tab using the provided options.
   *
   * @param {object} options - The options for creating the tab.
   * @return {void} This function does not return a value.
   */
  createTab(options: object): void {
    this.chrome.tabs.create(options);
  }

  /**
   * Creates an alarm with the specified name and options.
   *
   * @param {string} name - The name of the alarm.
   * @param {object} options - The options for the alarm.
   * @return {void} This function does not return a value.
   */
  createAlarm(name: string, options: object): void {
    this.chrome.alarms.create(name, options);
  }

  /**
   * Adds a listener for alarm events.
   *
   * @param {Function} callback - The function to be called when the alarm event is triggered.
   * @return {void} 
   */
  addAlarmListener(callback: Function): void {
    this.chrome.alarms.onAlarm.addListener(callback)
  }

  /**
   * Send a message to any available tab
   *
   * @param {Object} message Message to send
   */
  sendMessageToContentScript(message: object) {
    // Query for any available tabs
    this.chrome.tabs.query({ url: ['http://*/*', 'https://*/*'] }, function (tabs) {
      // If there are any tabs found
      if (tabs && tabs.length > 0) {
        // Send the message to the first tab
        this.chrome.tabs.sendMessage(tabs[0].id, message);
      } else {
        // If no tabs were found, log an error
        console.error("No tabs found.");
      }
    });
  }
}
