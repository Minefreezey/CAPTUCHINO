import React from "react";
import { useNavigate } from "react-router-dom";

export default function Failed() {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen w-screen">
        <div className="text-2xl">Failed !</div>
        <div className="text-xl">You are not human !!!</div>
        <button
          className="bg-blue-600 w-1/12 h-1/12 rounded-md my-3"
          onClick={goBack}
        >
          Go back
        </button>
      </div>
    </>
  );
}
