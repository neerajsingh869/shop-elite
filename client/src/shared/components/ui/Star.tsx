interface StarProps {
  size: number;
  filled: boolean;
}

/*
  Tailwind scans the source for complete class names, so the old
  `w-${size} h-${size}` never generated a real class and the stars were
  rendering at the svg default size. An explicit map keeps them literal.
*/
const SIZE_CLASSES: Record<number, string> = {
  3: "w-3 h-3",
  4: "w-4 h-4",
  5: "w-5 h-5",
  6: "w-6 h-6",
  8: "w-8 h-8",
};

function StarSelf({ size, filled }: StarProps) {
  return (
    /*
      Purely decorative in every place we use it - the rating is always written
      out in text next to it, or in the label of the radio that wraps it. Left
      exposed it would read as "image, image, image, image, image".
    */
    <svg
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      fill={filled ? "oklch(85.2% 0.199 91.936)" : "oklch(0.552 0.016 285.938)"}
      viewBox={`0 0 28 28`}
      stroke={
        filled ? "oklch(85.2% 0.199 91.936)" : "oklch(0.552 0.016 285.938)"
      }
      className={`${SIZE_CLASSES[size] ?? "w-4 h-4"} transition`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 
           0l2.165 6.674a1 1 0 00.95.69h7.017
           c.969 0 1.371 1.24.588 1.81l-5.678
           4.124a1 1 0 00-.364 1.118l2.165
           6.674c.3.921-.755 1.688-1.54
           1.118l-5.678-4.124a1 1 0 00-1.176
           0l-5.678 4.124c-.784.57-1.838-.197-1.539-1.118l2.165-6.674a1 1 0 00-.364-1.118L.98 12.1c-.783-.57-.38-1.81.588-1.81h7.017a1 1 0 00.95-.69l2.165-6.674z"
      />
    </svg>
  );
}

export default StarSelf;
