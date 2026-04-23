// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) & {
  cancel: () => void;
} {
  let timerId: ReturnType<typeof setTimeout>;

  function debounced(...args: Parameters<T>) {
    clearTimeout(timerId);
    timerId = setTimeout(() => func(...args), delay);
  }

  debounced.cancel = function () {
    clearTimeout(timerId);
  };

  return debounced;
}
