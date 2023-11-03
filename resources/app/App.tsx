import { RouterProvider } from "react-router-dom";
import router from "@/route/router";
import ToastNotifications from "@/components/ToastNotifications";
import PartialLoading from "./components/PartialLoading";
import { useAppSelector } from "./store/hooks";

function App() {
  const bLoading = useAppSelector((state) => state.shared.bLoading);
  return (
    <div>
      {bLoading && <PartialLoading />}
      <RouterProvider router={router} />
      <ToastNotifications />
    </div>
  );
}

export default App;
