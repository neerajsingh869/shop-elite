import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

interface BackButtonProps {
  to: string;
  label: string;
}

function BackButton({ to, label }: BackButtonProps) {
  return (
    <Link
      to={to}
      className="text-sm text-zinc-400 border bg-zinc-950 border-zinc-800 px-4 py-2 rounded-lg mb-6 inline-flex items-center justify-center gap-1 transition-all hover:text-yellow-400 hover:border-yellow-600"
    >
      <ArrowLeft size={16} strokeWidth={1.5} /> {label}
    </Link>
  );
}

export default BackButton;
