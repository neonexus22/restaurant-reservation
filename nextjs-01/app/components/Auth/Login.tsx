"use client";

import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import useAuth from "../../../hooks/useAuth";
import { useAuthContext } from "context/AuthContext";
import { Alert } from "@mui/material";

export default function Login({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const { signIn } = useAuth();
  const { loading, data, error } = useAuthContext();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const { email, password } = inputs;
    if (email && password) {
      setDisabled(false);
      return;
    }
    setDisabled(true);
  }, [inputs]);

  const signInHandler = () => {
    const { email, password } = inputs;
    signIn(email, password);
  };

  return (
    <div className="p-2">
      <div className="uppercase font-bold text-center pb-2 border-b mb-2">
        <div className="text-sm">{title}</div>
      </div>
      <div className="m-auto">
        <div className="text-2xl font-light text-center">{description}</div>
        {error && (
          <Alert severity="error" className="mt-4">
            {error}
          </Alert>
        )}
        <div>{data?.firstName}</div>
        <div>
          <div className="my-3 flex justify-between text-sm">
            <input
              type="email"
              className="border rounded p-2 py-3 w-full"
              placeholder="Email"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            />
          </div>
          <div className="my-3 flex justify-between text-sm">
            <input
              type="password"
              className="border rounded p-2 py-3 w-full"
              placeholder="Password"
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
            />
          </div>
          <div>
            <button
              onClick={signInHandler}
              className="uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400"
              disabled={disabled || loading}
            >
              <span className="flex justify-center">
                <span className="mr-4">Sign In</span>{" "}
                {loading && <CircularProgress color="info" size={20} />}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
