import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem('ACCESS_TOKEN', token);
      localStorage.setItem('token', token); // Double sécurité pour votre ancien code
    } else {
      localStorage.removeItem('ACCESS_TOKEN');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }
  };

  const logout = () => {
    setToken(null);
    setUser({});
  };

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
