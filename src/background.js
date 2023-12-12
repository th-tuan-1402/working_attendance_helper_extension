chrome.runtime.onMessage.addListener(request => {
  const {type, url, options} = request

  if (type === 'notification') {
    chrome.notifications.create(url, options, function (notificationId) {});
  }
});

// Create listener for clicking notification
chrome.notifications.onClicked.addListener(function(notificationId) {
  chrome.tabs.create({url: notificationId});
});