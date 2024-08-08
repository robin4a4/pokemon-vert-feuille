import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token; // Return true if token exists
};

interface PrivateRouteProps {
    redirectPath?: string;
  }

  export function PrivateRoute({ redirectPath = '/login' }: PrivateRouteProps) {
    if (!isAuthenticated()) {
      return <Navigate to={redirectPath} replace />;
    }

    return <Suspense fallback="loading..."><Outlet /></Suspense>;
  }
