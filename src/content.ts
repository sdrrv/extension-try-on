console.log("Content script loading...");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'fetch_images') {
    console.log("Fetching images...");
    const images: string[] = Array.from(document.querySelectorAll('img')).map((img: HTMLImageElement) => img.src);
    console.log("Found images:", images);
    sendResponse({ images });
  }
});
