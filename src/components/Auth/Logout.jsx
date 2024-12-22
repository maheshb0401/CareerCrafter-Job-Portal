import { useContext } from "react";
import AuthContext from "./AuthContext";

export const useLogout = () => {
  const { clearAuth } = useContext(AuthContext);

  const logoutUser = () => {
    clearAuth();
    window.location.href = "/";
  };

  return logoutUser;
};
