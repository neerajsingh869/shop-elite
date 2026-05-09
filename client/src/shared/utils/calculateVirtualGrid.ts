import type { Product } from "../types/api.types";

interface CalculateVirtualGridInput {
  items: Product[]; // total items on page
  scrollTop: number; // how far scrolled
  containerHeight: number; // height of scroll container
  rowHeight: number; // card height + gap (row height)
  columns: number; // total number of columns
}

interface CalculateVirtualGridOutput {
  visibleItems: Product[]; // only items to render
  totalHeight: number; // scrollbar height
  offsetY: number; // translateY value to position items correctly
}

function calculateVirtualGrid({
  items,
  scrollTop,
  containerHeight,
  rowHeight,
  columns,
}: CalculateVirtualGridInput): CalculateVirtualGridOutput {
  const totalRows = Math.ceil(items.length / columns);

  const firstVisibleRowIndex = Math.floor(scrollTop / rowHeight);
  const totalVisibleRows = Math.ceil(containerHeight / rowHeight);
  const lastVisibleRowIndex = firstVisibleRowIndex + totalVisibleRows + 2; // +2 buffer for smooth scroll

  const firstVisibleItemIndex = firstVisibleRowIndex * columns;
  const lastVisibleItemIndex = Math.min(
    lastVisibleRowIndex * columns,
    items.length,
  );
  const visibleItems = items.slice(firstVisibleItemIndex, lastVisibleItemIndex);

  const totalHeight = totalRows * rowHeight;

  const offsetY = firstVisibleRowIndex * rowHeight;

  return { visibleItems, totalHeight, offsetY };
}

export default calculateVirtualGrid;
