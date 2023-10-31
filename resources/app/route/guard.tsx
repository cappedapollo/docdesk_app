import { useLocation, Navigate } from "react-router-dom";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  let location = useLocation();

  if (!localStorage.getItem("userToken")) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}
