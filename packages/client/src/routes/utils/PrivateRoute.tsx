import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppRoute, AUTH_TOKEN_KEY } from "../../consts";

const isAuthenticated = () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return !!token;
};

interface PrivateRouteProps {
    redirectPath?: string;
    element: React.ReactNode
  }

  export function PrivateRoute({ redirectPath = AppRoute.LOGIN, element }: PrivateRouteProps) {
    if (!isAuthenticated()) {
      return <Navigate to={redirectPath} replace />;
    }

    return <Suspense fallback="loading...">{element}</Suspense>;
  }
