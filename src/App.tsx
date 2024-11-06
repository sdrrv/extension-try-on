import React, { useEffect, useState } from "react";

function App() {
  console.log("App component rendered");
  // State to store the image URLs
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if an image is a single color
  const isSingleColorImage = (src: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = src;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const data = ctx.getImageData(0, 0, img.width, img.height).data;
          const firstPixel = [data[0], data[1], data[2], data[3]];
          for (let i = 4; i < data.length; i += 4) {
            if (
              data[i] !== firstPixel[0] ||
              data[i + 1] !== firstPixel[1] ||
              data[i + 2] !== firstPixel[2] ||
              data[i + 3] !== firstPixel[3]
            ) {
              resolve(false);
              return;
            }
          }
          resolve(true);
        } else {
          resolve(false);
        }
      };
      img.onerror = () => resolve(false);
    });
  };

  useEffect(() => {
    console.log("App component mounted");

    // Fetch images from content script
    const fetchImages = () => {
      chrome.runtime.sendMessage({ type: 'fetch_images' }, async (response) => {
        console.log("Received images in popup:", response.images);
        const filteredImages = [];
        const uniqueImages = new Set<string>();
        for (const src of response.images) {
          if (!(await isSingleColorImage(src)) && !uniqueImages.has(src)) {
            filteredImages.push(src);
            uniqueImages.add(src);
          }
        }
        setImages(filteredImages);
        setLoading(false);
      });
    };

    fetchImages();
  }, []);

  return (
    <div className="border-none w-[500px] p-4">
      <h2 className="text-lg font-bold mb-4">Hello there!!!</h2>
      {loading ? (
        <p>Loading...</p>
      ) : images.length === 0 ? (
        <p>No images found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {images.map((src, index) => (
            <div key={index} className="border p-2">
              <img src={src} alt={`Image ${index}`} className="max-w-full h-auto" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
