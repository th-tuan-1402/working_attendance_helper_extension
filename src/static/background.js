let timerTime
let idTimer

chrome.runtime.onMessage.addListener(request => {
  if (request.type === 'notification') {
    chrome.notifications.create('', request.options);
  } else if (request.type === 'addTimer') {
    // idTimer = setInterval(request.data.callback, request.data.startTime - Date.now())
  }
});