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
}
