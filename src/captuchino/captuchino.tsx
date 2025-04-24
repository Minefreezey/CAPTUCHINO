import React, { useEffect, useState } from "react";
import { Code } from "@heroui/code";

import { InputChange } from "@/botDetection/inputChange";
import { MouseMovementDetection } from "@/botDetection/mouseMovementDetection";
import { MouseHoverCheck } from "@/botDetection/mouseTracker";

interface Data {
  fullName: string;
  date: string;
  number: string;
  otp: string;
  animal: string;
  switch1: boolean;
  switch2: boolean;
  button: string;
}

interface CaptuchinoProps {
  children: React.ReactNode;
  status: "yes" | "no";
  setStatus: React.Dispatch<React.SetStateAction<"yes" | "no">>;
  submitted: "yes" | "no";
  setSubmitted: React.Dispatch<React.SetStateAction<"yes" | "no">>;
  data: Data;
}
interface MousePosition {
  x: number;
  y: number;
}

interface Coordinates {
  mousePosition: MousePosition;
  time_stamp: number;
}

interface InputDurations {
  [fieldName: string]: number[];
}

export default function Captuchino({
  children,
  status,
  setStatus,
  submitted,
  setSubmitted,
  data,
}: CaptuchinoProps) {
  const [botFlag, setBotFlag] = useState<number[]>([0, 0, 0]);
  const THRESHOLD = 2;

  useEffect(() => {
    const suspiciousCount = botFlag.reduce((count, flag) => count + flag, 0);

    if (suspiciousCount >= THRESHOLD) {
      setStatus("yes");
    } else {
      setStatus("no");
    }
  }, [botFlag, setStatus]);
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handleMouseMove = (event: MouseEvent) => {
    const newMousePosition = { x: event.clientX, y: event.clientY };

    setMousePosition(newMousePosition);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setPressedKey(event.key);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  MouseMovementDetection(setStatus, setBotFlag); // Call mouse Coordinates function

  const { inputDurations, handleInputChange } = InputChange(
    setStatus,
    setBotFlag
  );

  useEffect(() => {
    const formElement = document.querySelector("form");

    if (formElement) {
      formElement.addEventListener("input", handleInputChange);
    }

    return () => {
      if (formElement) {
        formElement.removeEventListener("input", handleInputChange);
      }
    };
  }, [handleInputChange]);

  const GetCapturedTime = () => {
    const [capturedTime, setCapturedTime] = useState<number>(0);

    useEffect(() => {
      const startTime = Date.now();

      const interval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;

        setCapturedTime(elapsedTime);
      }, 1);

      return () => clearInterval(interval);
    }, []);

    return capturedTime;
  };

  const capturedTime = GetCapturedTime();

  useEffect(() => {
    console.log(submitted);
    if (submitted === "yes" && capturedTime < 4000) {
      console.log("suspicious!");
      setStatus("yes");
    }
  }, [submitted, capturedTime, setStatus]);

  return (
    <div className="relative flex flex-col">
      <div>
        <Code>{`Status: ${status}`}</Code>
        <br />
        <Code>{`Flag: ${botFlag}`}</Code>
        <br />
        <Code>{`Mouse Position: X: ${mousePosition.x}, Y: ${mousePosition.y}`}</Code>{" "}
        <br />
        <Code>{`Pressed Key: ${pressedKey || "None"}`}</Code>
        <br />
        <Code>{`Duration: ${capturedTime || "None"}`}</Code>
      </div>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: mousePosition.y,
            left: mousePosition.x,
            width: "80px",
            height: "80px",
            borderRadius: "80%",
            transform: "translate(-50%, -50%)",
            fontSize: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ☕
        </div>
      </div>
      <MouseHoverCheck data={data} setBotFlag={setBotFlag} />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
    </div>
  );
}
