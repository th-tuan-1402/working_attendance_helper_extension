// @ts-nocheck
export default defineBackground(() => {
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

  // Set up an alarm to periodically wake up the background script
  chrome.alarms.create("periodicAlarm", { periodInMinutes: 1 }); // Adjust period as needed

  // Add an event listener to handle the alarm
  chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === "periodicAlarm") {
        // Perform tasks here to keep the background script active
        console.log("Background script is active due to periodic alarm.");
        sendMessageToContentScript({action: "checkTime"});
      }
  });

  /**
   * Send a message to any available tab
   *
   * @param {Object} message Message to send
   */
  function sendMessageToContentScript(message: object) {
    // Query for any available tabs
    chrome.tabs.query({ active: true, url: ['http://*/*', 'https://*/*'] }, function (tabs) {
      try {
        // If there are any tabs found
        if (tabs && tabs.length > 0) {
          // Send the message to the first tab
          chrome.tabs.sendMessage(tabs[0].id, message);
        } else {
          // If no tabs were found, log an error
          console.error("No tabs found.");
        }
      } catch (error) {
        console.error("Error sending message to content script: ", error);
      }
    });
  }
});
