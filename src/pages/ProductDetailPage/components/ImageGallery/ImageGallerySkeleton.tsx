function ImageGallarySkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square bg-neutral-900 rounded-2xl border-zinc-800 border p-8 animate-pulse"></div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <button
            key={index}
            className={`h-16 w-16 aspect-square p-2 border-2 rounded-lg bg-neutral-900 border-zinc-800 overflow-hidden animate-pulse`}
          ></button>
        ))}
      </div>
    </div>
  );
}

export default ImageGallarySkeleton;
