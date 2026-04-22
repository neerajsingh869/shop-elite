// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timerId: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>) {
    clearTimeout(timerId);
    timerId = setTimeout(() => func(...args), delay);
  };
}
