import { Navigate, Outlet, useLocation } from "react-router";

import {
  selectInitStatus,
  selectIsAuthenticated,
} from "../../../features/auth/authSelectors";
import { useAppSelector } from "../../../store/hook";

function ProtectedRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const initStatus = useAppSelector(selectInitStatus);
  const location = useLocation();

  if (initStatus === "idle" || initStatus === "loading") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-yellow-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
