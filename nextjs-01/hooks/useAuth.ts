"use client";
import axios from "axios";
import { useModalContext } from "components/Modal";
import { useAuthContext } from "context/AuthContext";
import { getCookie, removeCookies } from "cookies-next";

const useAuth = () => {
  const { setAuthState } = useAuthContext();
  const ctx = useModalContext();

  const signIn = async (email: string, password: string) => {
    setAuthState({
      loading: true,
      data: null,
      error: null,
    });
    try {
      const response = await axios.post("/api/auth/signin", {
        email,
        password,
      });
      setAuthState({
        loading: false,
        data: response.data,
        error: null,
      });
      ctx?.setOpen(false);
    } catch (error: any) {
      setAuthState({
        loading: false,
        data: null,
        error: error.response.data.errorMessage,
      });
    }
  };
  const signUp = async ({
    firstName,
    lastName,
    email,
    city,
    phone,
    password,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    city: string;
    phone: string;
    password: string;
  }) => {
    setAuthState({
      loading: true,
      data: null,
      error: null,
    });
    try {
      const response = await axios.post("/api/auth/signup", {
        firstName,
        lastName,
        email,
        city,
        phone,
        password,
      });
      setAuthState({
        loading: false,
        data: response.data,
        error: null,
      });
      ctx?.setOpen(false);
    } catch (error: any) {
      console.log(error);
      setAuthState({
        loading: false,
        data: null,
        error: error.response.data.errorMessage,
      });
    }
  };

  const signOut = () => {
    removeCookies("jwt");
    setAuthState({
      loading: false,
      data: null,
      error: null,
    });
  };

  return {
    signIn,
    signUp,
    signOut,
  };
};

export default useAuth;
