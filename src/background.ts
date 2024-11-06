console.log("Background script running");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message in background:", message);
  if (message.type === 'fetch_images') {
    // Forward the message to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'fetch_images' }, (response) => {
          console.log("Received images from content script:", response.images);
          sendResponse(response);
        });
      }
    });
    return true; // Keep the message channel open for sendResponse
  }
});
