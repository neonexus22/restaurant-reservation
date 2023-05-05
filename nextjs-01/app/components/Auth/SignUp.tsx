"use client";

import { ChangeEvent, useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { Alert, CircularProgress } from "@mui/material";
import { useAuthContext } from "context/AuthContext";

type SignUpInputs = {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phone: string;
  password: string;
};

export default function Signup({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const { signUp } = useAuth();
  const { loading, data, error } = useAuthContext();
  const [disabled, setDisabled] = useState(true);
  const [inputs, setInputs] = useState<SignUpInputs>({
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    const { firstName, lastName, email, city, phone, password } = inputs;

    if (firstName && lastName && email && city && phone && password) {
      setDisabled(false);
      return;
    }
    setDisabled(true);
  }, [inputs]);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [event.target.name]: event.target.value,
    });
  };

  const onSignUpHandler = async () => {
    const { firstName, lastName, email, city, phone, password } = inputs;

    await signUp({
      firstName,
      lastName,
      email,
      city,
      phone,
      password,
    });
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
        <div>
          <div className="my-3 flex justify-between text-sm">
            <input
              type="text"
              className="border rounded p-2 py-3 w-[49%]"
              placeholder="First Name"
              name="firstName"
              value={inputs.firstName}
              onChange={onChangeHandler}
            />
            <input
              type="text"
              className="border rounded p-2 py-3 w-[49%]"
              placeholder="Last Name"
              name="lastName"
              value={inputs.lastName}
              onChange={onChangeHandler}
            />
          </div>
          <div className="my-3 flex justify-between text-sm">
            <input
              type="email"
              className="border rounded p-2 py-3 w-full"
              placeholder="Email"
              name="email"
              value={inputs.email}
              onChange={onChangeHandler}
            />
          </div>
          <div className="my-3 flex justify-between text-sm">
            <input
              type="text"
              className="border rounded p-2 py-3 w-[49%]"
              placeholder="Phone"
              name="phone"
              value={inputs.phone}
              onChange={onChangeHandler}
            />
            <input
              type="text"
              className="border rounded p-2 py-3 w-[49%]"
              placeholder="City"
              name="city"
              value={inputs.city}
              onChange={onChangeHandler}
            />
          </div>
          <div className="my-3 flex justify-between text-sm">
            <input
              type="password"
              className="border rounded p-2 py-3 w-full"
              placeholder="Password"
              name="password"
              value={inputs.password}
              onChange={onChangeHandler}
            />
          </div>
        </div>
        <div>
          <button
            onClick={onSignUpHandler}
            disabled={disabled || loading}
            className="uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400"
          >
            <span className="flex justify-center">
              <span className="mr-4">Create Account</span>{" "}
              {loading && <CircularProgress color="info" size={20} />}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
