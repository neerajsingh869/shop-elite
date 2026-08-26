import { useEffect, useMemo, useRef, useState } from "react";

import calculateVirtualGrid from "./calculateVirtualGrid";
import useVirtualGridConfig from "./useVirtualGridConfig";

interface VirtualGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  gap?: number;
}

function VirtualGrid<T>({ items, renderItem, gap = 16 }: VirtualGridProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [rowHeight, setRowHeight] = useState(300);

  const { containerHeight, columns } = useVirtualGridConfig();

  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!measureRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const height = entries[0].contentRect.height;
      if (height === 0) return;
      setRowHeight(entries[0].contentRect.height);
    });

    observer.observe(measureRef.current);

    return () => observer.disconnect();
  }, []);

  const { visibleItems, totalHeight, offsetY } = useMemo(() => {
    return calculateVirtualGrid({
      items,
      scrollTop,
      containerHeight,
      rowHeight: rowHeight + gap,
      columns,
    });
  }, [items, scrollTop, containerHeight, rowHeight, gap, columns]);

  return (
    <>
      {/*
        Only the rows in view are in the DOM, so a screen reader - and browser
        find in page - sees a fraction of the list. You cannot have both
        virtualization and a complete DOM, so at least make the real total
        available instead of silently under reporting it.
        Deliberately not a live region: it would fire on every scroll tick.
      */}
      <span className="sr-only">
        Showing {visibleItems.length} of {items.length} products
      </span>
    <div
      className="overflow-y-auto"
      style={{ height: containerHeight }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div
        style={{
          height: totalHeight,
          position: "relative",
        }}
      >
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
          }}
        >
          <div
            className="grid p-4"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gap,
            }}
          >
            {visibleItems.map((item, index) => (
              <div key={index} ref={index === 0 ? measureRef : undefined}>
                {renderItem(item, index)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default VirtualGrid;
