import { RouterProvider } from "react-router";
import { router } from "./router/app.router";

export const HeroesApp = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};
