//AuthContext provides login state to the ENTIRE app
//Any component can check: is the user logged in? what's their role?
//Without this, every component would need to read localStorage separately

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); //logged-in user object
  const [token, setToken] = useState(null); //JWT token
  const [loading, setLoading] = useState(true); //loading while checking localStorage

  //on app start, check if user was already logged in (token in localStorage)
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  //called after successful login/register
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  //called on logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

//custom hook.... components use this to access auth state
//usage: const { user, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);
