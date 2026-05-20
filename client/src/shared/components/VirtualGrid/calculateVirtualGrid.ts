interface CalculateVirtualGridParams<T> {
  items: T[]; // total items
  scrollTop: number; // how much scrolled from top of container
  containerHeight: number; // height of container
  rowHeight: number; // height of one row
  columns: number; // total number of columns in grid
  overscan?: number; // buffer to keep (both above and below) to make scrolling smooth
}

function calculateVirtualGrid<T>({
  items,
  scrollTop,
  containerHeight,
  rowHeight,
  columns,
  overscan = 2,
}: CalculateVirtualGridParams<T>) {
  const totalRows = Math.ceil(items.length / columns);

  const startRow = Math.max(
    0,
    Math.floor(scrollTop / rowHeight) - overscan,
  );

  const endRow = Math.min(
    totalRows,
    Math.ceil((scrollTop + containerHeight) / rowHeight) + overscan,
  );

  const startIndex = startRow * columns;
  const endIndex = endRow * columns;

  const visibleItems = items.slice(startIndex, endIndex);

  return {
    visibleItems,
    totalHeight: totalRows * rowHeight, // show the scroll as if all items exist
    offsetY: startRow * rowHeight, // match scoll exactly by showing right row
  };
}

export default calculateVirtualGrid;