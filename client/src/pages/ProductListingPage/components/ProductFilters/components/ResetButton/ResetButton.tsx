interface ResetButtonProps {
  resetFilter: () => void;
  label: string;
}

function ResetButton({ resetFilter, label }: ResetButtonProps) {
  return (
    // every filter block has a button that just says "Reset" - fine visually
    // because the heading is right there, useless when a screen reader lists
    // all the buttons on the page and gets "Reset" five times
    <button
      aria-label={label}
      className="text-xs text-zinc-400 hover:text-yellow-500 transition-colors cursor-pointer underline"
      onClick={resetFilter}
    >
      Reset
    </button>
  );
}

export default ResetButton;
