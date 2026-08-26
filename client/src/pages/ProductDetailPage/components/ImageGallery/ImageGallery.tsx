import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="group aspect-square bg-neutral-900 rounded-2xl border-zinc-800 border p-8">
        {/*
          Informative image, so it needs a real alt. The index is in there
          because the alt changes as you click through the thumbnails and
          "which one am I looking at" is otherwise invisible.
        */}
        <img
          className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
          src={images[currentImageIndex]}
          alt={`${title} - image ${currentImageIndex + 1} of ${images.length}`}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {images.map((imageUrl, index) => (
          <button
            key={imageUrl}
            onClick={() => setCurrentImageIndex(index)}
            aria-label={`View image ${index + 1} of ${images.length}`}
            // aria-current marks which one of the set is showing - the yellow
            // border communicates that visually and nothing else did
            aria-current={currentImageIndex === index}
            className={`h-16 w-16 aspect-square p-2 border-2 rounded-lg bg-zinc-950 overflow-hidden cursor-pointer ${currentImageIndex === index ? "border-yellow-500" : "border-zinc-800 hover:border-zinc-600"}`}
          >
            {/* decorative - the button label already describes it */}
            <img
              className="w-full h-full object-contain"
              src={imageUrl}
              alt=""
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ImageGallery;
