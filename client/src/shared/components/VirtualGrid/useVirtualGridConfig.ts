import { useEffect, useState } from "react";

const HEADER_HEIGHT = 200;

function getConfig(width: number, height: number) {
  let columns = 4;

  if (width < 640) {
    columns = 1;
  } else if (width <= 768) {
    columns = 2;
  } else if (width <= 1024) {
    columns = 3;
  }

  return {
    columns: columns,
    containerHeight: height,
  };
}

function useVirtualGridConfig() {
  const [config, setConfig] = useState(
    getConfig(window.innerWidth, window.innerHeight),
  );

  useEffect(() => {
    function handleResize() {
      setConfig(getConfig(window.innerWidth, window.innerHeight));
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    containerHeight: config.containerHeight - HEADER_HEIGHT,
    columns: config.columns,
  };
}

export default useVirtualGridConfig;
