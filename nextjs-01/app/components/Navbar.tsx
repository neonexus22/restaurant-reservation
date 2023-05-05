"use client";

import Link from "next/link";
import React from "react";
import AuthModal from "./Modal";
import Login from "./Auth/Login";
import Signup from "./Auth/SignUp";
import { useAuthContext } from "context/AuthContext";
import useAuth from "../../hooks/useAuth";

export default function Navbar() {
  const { data, loading } = useAuthContext();
  const { signOut } = useAuth();

  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link href="/" className="font-bold text-gray-700 text-2xl">
        OpenTable{" "}
      </Link>
      {loading ? null : (
        <div>
          {data ? (
            <button
              onClick={signOut}
              className="bg-blue-400 text-white border p-1 px-4 rounded mr-3"
            >
              Sign out
            </button>
          ) : (
            <div className="flex">
              <AuthModal
                action={
                  <button className="bg-blue-400 text-white border p-1 px-4 rounded mr-3">
                    Sign in
                  </button>
                }
                width={600}
              >
                <Login title="SignIn" description="Log Into Your Account" />
              </AuthModal>

              <AuthModal
                action={
                  <button className="border p-1 px-4 rounded">Sign up</button>
                }
                width={600}
              >
                <Signup
                  title="CreateAccount"
                  description="Create Your OpenTable Account"
                />
              </AuthModal>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
