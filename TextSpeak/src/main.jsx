import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Landing from "./components/Landing.jsx";
import Generator from "./components/Generator.jsx";

const router = createBrowserRouter([
  {
    element: <Landing />,
    path: "/",
  },
  {
    path: "/generator",
    element: <Generator />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
