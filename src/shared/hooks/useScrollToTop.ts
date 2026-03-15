import { useRef, useEffect } from "react";

function useScrollToTop(loadingStatus: boolean) {
  const topRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadingStatus && topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [loadingStatus]);

  return { topRef };
}

export default useScrollToTop;
