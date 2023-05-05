"use client";
import Image from "next/image";
import React from "react";

import errorMascot from "../../../public/icons/error.png";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="bg-gray-200 flex flex-col flex-1 justify-center items-center">
      <Image src={errorMascot} alt="error" />
      <div className="bg-white px-9 py-14 shadow rounded">
        <h3 className="text-3xl font-bold">Well, this is embarassing</h3>
        <p className="text-reg font-bold">
          The restaurant could not be found!!! (inside slug)
        </p>
        <p className="mt-6 text-sm font-light">Error code: 404</p>
      </div>
    </div>
  );
}
