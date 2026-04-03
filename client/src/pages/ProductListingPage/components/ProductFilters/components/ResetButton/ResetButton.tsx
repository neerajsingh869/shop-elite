interface ResetButtonProps {
  resetFilter: () => void;
}

function ResetButton({ resetFilter }: ResetButtonProps) {
  return (
    <button
      className="text-xs text-zinc-500 hover:text-yellow-500 transition-colors cursor-pointer underline"
      onClick={resetFilter}
    >
      Reset
    </button>
  );
}

export default ResetButton;
