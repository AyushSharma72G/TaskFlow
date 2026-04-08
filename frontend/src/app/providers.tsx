import { Provider } from "react-redux";
import { useEffect, useRef } from "react";
import { RouterProvider } from "react-router-dom";
import { store } from "../store";
import { router } from "./routes";
import { useAppDispatch } from "../store/hooks";
import { fetchProfileThunk } from "../features/auth/store/authThunks";

const BootstrappedRouter = () => {
  const dispatch = useAppDispatch();
  const hasBootstrapped = useRef(false);

  useEffect(() => {
    if (hasBootstrapped.current) {
      return;
    }
    hasBootstrapped.current = true;
    dispatch(fetchProfileThunk());
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

export const AppProviders = () => {
  return (
    <Provider store={store}>
      <BootstrappedRouter />
    </Provider>
  );
};
