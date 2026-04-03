interface ProductDetailErrorProps {
  message: string;
  onRetry: () => void;
}

function ProductDetailError({ message, onRetry }: ProductDetailErrorProps) {
  return (
    <div className="flex flex-col justify-center items-center min-h-[70vh] gap-4">
      <div className="flex flex-col items-center">
        <span className="text-xl md:text-2xl lg:text-3xl font-bold text-zinc-100">
          Something went wrong
        </span>
        <span className="text-zinc-500 text-sm lg:text-base text-center">
          Error: {message}
        </span>
      </div>
      <button
        className="text-sm text-zinc-400 border bg-zinc-950 border-zinc-800 px-4 py-2 rounded-lg mb-6 inline-flex items-center justify-center gap-1 transition-all hover:text-yellow-400 hover:border-yellow-600"
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  );
}

export default ProductDetailError;
