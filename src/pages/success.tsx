import React from "react";
import { useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen w-screen">
        <div className="text-2xl">Success !</div>
        <div className="text-xl">You are human</div>
        <button
          className="bg-blue-600 px-5 py-2 rounded-lg my-3"
          onClick={goBack}
        >
          Go back
        </button>
      </div>
    </>
  );
}
