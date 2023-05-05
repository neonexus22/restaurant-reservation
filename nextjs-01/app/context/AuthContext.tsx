"use client";

import axios from "axios";
import { getCookie } from "cookies-next";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phone: string;
};

type RequestState = {
  loading: boolean;
  error: string | null;
  data: User | null;
};

type AuthState = RequestState & {
  setAuthState: Dispatch<SetStateAction<RequestState>>;
};

const AuthenticationContext = createContext<AuthState>({
  loading: false,
  error: null,
  data: null,
  setAuthState: () => {},
});

export const useAuthContext = () => {
  return useContext(AuthenticationContext);
};

export default function AuthContext({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<RequestState>({
    loading: true,
    data: null,
    error: null,
  });

  const fetchUser = async () => {
    setAuthState({
      loading: true,
      data: null,
      error: null,
    });

    const token = getCookie("jwt");
    if (!token) {
      return setAuthState({
        loading: false,
        data: null,
        error: null,
      });
    }

    try {
      const response = await axios.get("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setAuthState({
        loading: false,
        data: response.data,
        error: null,
      });
    } catch (error: any) {
      setAuthState({
        loading: false,
        data: null,
        error: error.response.data.errorMessage,
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthenticationContext.Provider value={{ ...authState, setAuthState }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
