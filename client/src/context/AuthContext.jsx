import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ridebridge_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem("ridebridge_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(payload) {
    const { data } = await api.post("/auth/login", payload);
    localStorage.setItem("ridebridge_token", data.token);
    setUser(data.user);
    return data.user;
  }

  async function register(payload) {
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("ridebridge_token", data.token);
    setUser(data.user);
    return data.user;
  }

  async function setupAdmin(payload) {
    const { data } = await api.post("/auth/setup-admin", payload);
    localStorage.setItem("ridebridge_token", data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("ridebridge_token");
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, register, setupAdmin, logout, setUser }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
