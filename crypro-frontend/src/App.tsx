import { Navigate, useRoutes } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import DashBoardLayout from "./layouts/DashBoardLayout";
import { lazy } from "react";
import Loadable from "./utils/LazyLoading";
import NotFound from "./pages/NotFoundPage";
import OpenRoute from "./components/openRoutes/OpenRoutes";
import PrivateRoute from "./components/privateRoutes/PrivateRoute";

const LoginPage = Loadable(lazy(() => import("./pages/LoginPage")));
const RegisterPage = Loadable(lazy(() => import("./pages/RegisterPage")));
const HomePage = Loadable(lazy(() => import("./pages/HomePage")));
const ProfilePage = Loadable(lazy(() => import("./pages/ProfilePage")));
const AssetPage = Loadable(lazy(() => import("./pages/AssetPage")));
const ThresholdListPage = Loadable(
  lazy(() => import("./pages/ThresholdListingPage"))
);
const ThreshHoldManagerPage = Loadable(
  lazy(() => import("./pages/ThreshHoldManagerPage"))
);
const Prediction = Loadable(
  lazy(() => import("./pages/Prediction"))
);

const App = () => {
  // throw new Error("Error thrown from App component")
  return useRoutes([
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        { element: <Navigate to={"login"} replace />, index: true },
        {
          path: "login",
          element: (
            <OpenRoute>
              <LoginPage />
            </OpenRoute>
          ),
        },
        {
          path: "register",
          element: (
            <OpenRoute>
              <RegisterPage />
            </OpenRoute>
          ),
        },
      ],
    },
    {
      path: "/",
      element: <DashBoardLayout />,
      children: [
        { element: <Navigate to={"app"} replace />, index: true },
        {
          path: "app",
          element: (
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          ),
        },
        {
          path: "app/profile",
          element: (
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          ),
        },
        {
          path: "app/assets",
          element: (
            <PrivateRoute>
              <AssetPage />
            </PrivateRoute>
          ),
        },
        {
          path: "app/set-threshold",
          element: (
            <PrivateRoute>
              <ThreshHoldManagerPage />
            </PrivateRoute>
          ),
        },
        {
          path: "app/my-threshold",
          element: (
            <PrivateRoute>
              <ThresholdListPage />
            </PrivateRoute>
          ),
        },
        {
          path: "app/predictions",
          element: (
            <PrivateRoute>
              <Prediction />
            </PrivateRoute>
          ),
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
};

export default App;
