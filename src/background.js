chrome.runtime.onMessage.addListener(request => {
  if (request.type === 'notification') {
    chrome.notifications.create('', request.options);
  }
});