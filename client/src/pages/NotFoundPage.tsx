import { ROUTES } from "../shared/constants";
import BackButton from "../shared/components/ui/BackButton";

function NotFoundPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[70vh] gap-4">
      <div className="flex flex-col items-center">
        <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-100">
          404
        </span>
        <span className="text-zinc-500 text-base lg:text-lg text-center">
          This page could not be found.
        </span>
      </div>
      <BackButton to={ROUTES.home} label="Go to Home" />
    </div>
  );
}

export default NotFoundPage;
