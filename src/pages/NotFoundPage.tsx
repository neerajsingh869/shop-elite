import { ROUTES } from "../shared/constants";
import BackButton from "../shared/components/ui/BackButton";

function NotFoundPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[70vh] gap-4">
      <div className="flex flex-col items-center">
        <span className="text-5xl md:text-6xl lg:text-8xl font-bold text-zinc-100">
          404
        </span>
        <span className="text-zinc-500 text-lg lg:text-xl text-center">
          This page could not be found.
        </span>
      </div>
      <BackButton to={ROUTES.home} label="Go to Home" />
    </div>
  );
}

export default NotFoundPage;
