import { useAppDispatch } from "@/store/hooks";
import { setResponse } from "@/store/reducers/auth";
import { useLocation, Navigate } from "react-router-dom";
import { useAsync } from "react-use";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  let location = useLocation();
  const dispatch = useAppDispatch();

  useAsync(async () => {
    dispatch(
      setResponse({ success: true, email: localStorage.getItem("email") })
    );
  }, []);
  if (!localStorage.getItem("userToken")) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}
