import { createContext, useContext, useState, useEffect } from "react";
import { getUserMe } from "../api/userAuth";

const UserAuthContext = createContext(null);

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (token) {
      getUserMe()
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem("user_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = (token, userData) => {
    localStorage.setItem("user_token", token);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem("user_token");
    setUser(null);
  };

  return (
    <UserAuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export const useUserAuth = () => useContext(UserAuthContext);
