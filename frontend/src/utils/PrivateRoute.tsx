import { Navigate, Outlet } from "react-router-dom";

const TOKEN_KEY = "token";

function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export default function PrivateRoute() {
  const token = getToken();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
