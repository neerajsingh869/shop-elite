import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
}

function ImageGallery({ images }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="group aspect-square bg-neutral-900 rounded-2xl border-zinc-800 border p-8">
        <img
          className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
          src={images[currentImageIndex]}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {images.map((imageUrl, index) => (
          <button
            key={imageUrl}
            className={`h-16 w-16 aspect-square p-2 border-2 rounded-lg bg-zinc-950 overflow-hidden ${currentImageIndex === index ? "border-yellow-500" : "border-zinc-800 hover:hover:border-zinc-600"}`}
            onClick={() => setCurrentImageIndex(index)}
          >
            <img className="w-full h-full object-contain" src={imageUrl} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ImageGallery;
