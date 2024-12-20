import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type ProtectedRouteTypes = {
  children: ReactNode;
  redirect?: string;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const ProtectedRoute = ({
  children,
  redirect = "/auth",
  isAuthenticated,
  isLoading,
}: ProtectedRouteTypes) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated && !isLoading) navigate(redirect);
  }, [isAuthenticated]);
  return children;
};

export default ProtectedRoute;
