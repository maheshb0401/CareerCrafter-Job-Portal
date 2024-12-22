import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize auth state from localStorage
  const [auth, setAuth] = useState(() => ({
    token: localStorage.getItem("accessToken") || null,
    role: localStorage.getItem("role") || null,
    username: localStorage.getItem("username") || null,
  }));

  // Sync auth state to localStorage whenever it changes
  useEffect(() => {
    if (auth.token) {
      localStorage.setItem("accessToken", auth.token);
    } else {
      localStorage.removeItem("accessToken");
    }

    if (auth.role) {
      localStorage.setItem("role", auth.role);
    } else {
      localStorage.removeItem("role");
    }

    if (auth.username) {
      localStorage.setItem("username", auth.username);
    } else {
      localStorage.removeItem("username");
    }
  }, [auth]);

  // Clear auth state and localStorage when logging out
  const clearAuth = () => {
    setAuth({ token: null, role: null, username: null });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
