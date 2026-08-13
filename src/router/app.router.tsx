import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

import { HeroesLayout } from "@/heroes/layouts/HeroesLayout";
// import { AdminLayout } from "@/admin/layouts/AdminLayout";
// import { AdminPage } from "@/admin/pages/AdminPage";
import { HeroPage } from "@/heroes/pages/hero/HeroPage";
import { HomePage } from "@/heroes/pages/home/HomePage";

const SearchPage = lazy(() => import("@/heroes/pages/search/SearchPage"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HeroesLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "heroes/:idSlug",
        element: <HeroPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
  // {
  //   path: "/admin",
  //   element: <AdminLayout />,
  //   children: [
  //     {
  //       index: true,
  //       element: <AdminPage />,
  //     },
  //   ],
  // },
]);
