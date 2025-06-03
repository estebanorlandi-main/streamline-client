import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { api } from "../../libs/axios/api";

const ctx = createContext({
  session: null,
  isLoading: true,
});
export function AuthProvider({ children }) {
  const [state, setState] = useState({
    session: null,
    isLoading: true,
  });

  const getUser = useCallback(async (token) => {
    if (!token) return null;
    const { data } = await api.get("/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  }, []);

  async function logout() {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("expires");
    setState({ isLoading: false, session: null });
  }

  async function login(email, password) {
    setState((old) => ({ ...old, isLoading: true }));

    const { data } = await api.post("/login", {
      email,
      password,
    });

    const { token, expires } = data;

    window.localStorage.setItem("token", token);
    window.localStorage.setItem("expires", expires);

    const user = await getUser(token);
    setState((old) => ({
      ...old,
      isLoading: false,
      session: user,
      token,
      expires,
    }));
  }

  useEffect(() => {
    const d = new Date();

    let token = window.localStorage.getItem("token");
    let expires = window.localStorage.getItem("expires");

    // Si el token expiro elimina el token
    if (d.getTime() > new Date(Number(expires)).getTime()) {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("expires");
      token = null;
      expires = null;
    }

    if (!token)
      return setState({
        session: null,
        isLoading: false,
        token: null,
        expires: null,
      });

    getUser(token).then((user) =>
      setState((old) => ({ isLoading: false, session: user, token, expires }))
    );
  }, []);

  return (
    <ctx.Provider value={{ ...state, login, getUser, logout }}>
      {children}
    </ctx.Provider>
  );
}

export function useAuth() {
  return useContext(ctx);
}
