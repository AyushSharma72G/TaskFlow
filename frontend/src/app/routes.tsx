import { createBrowserRouter } from "react-router-dom";

const DummyPage = () => <div>App Started </div>;

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DummyPage />,
  },
]);
