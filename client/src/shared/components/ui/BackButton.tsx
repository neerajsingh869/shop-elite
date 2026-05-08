import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";

interface BackButtonProps {
  to?: string;
  label: string;
}

function BackButton({ to, label }: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  function handleBack() {
    if (location.key === "default") {
      navigate("/", { replace: true });
    } else {
      navigate(-1);
    }
  }

  return (
    <>
      {to ? (
        <Link
          to={to}
          className="text-sm text-zinc-400 border bg-zinc-950 border-zinc-800 px-4 py-2 rounded-lg mb-6 inline-flex items-center justify-center gap-1 transition-all hover:text-yellow-400 hover:border-yellow-600"
        >
          <ArrowLeft size={16} strokeWidth={1.5} /> {label}
        </Link>
      ) : (
        <button
          onClick={handleBack}
          className="text-sm text-zinc-400 border bg-zinc-950 border-zinc-800 px-4 py-2 rounded-lg mb-6 inline-flex items-center justify-center gap-1 transition-all hover:text-yellow-400 hover:border-yellow-600"
        >
          {" "}
          <ArrowLeft size={16} strokeWidth={1.5} /> {label}
        </button>
      )}
    </>
  );
}

export default BackButton;
