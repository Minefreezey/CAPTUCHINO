import React, { useEffect, useState } from "react";
import { Code } from "@heroui/code";

import { InputChange } from "@/botDetection/inputChange";
import { MouseMovementDetection } from "@/botDetection/mouseMovementDetection";
import { MouseHoverCheck } from "@/botDetection/mouseTracker";

// Interface for the data structure
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

// Props for the Captuchino component
interface CaptuchinoProps {
  children: React.ReactNode; // Child components
  status: "yes" | "no"; // Current status
  setStatus: React.Dispatch<React.SetStateAction<"yes" | "no">>; // Function to update status
  submitted: "yes" | "no"; // Submission status
  data: Data; // Data object
}

// Interface for mouse position
interface MousePosition {
  x: number;
  y: number;
}

// Captuchino component
export default function Captuchino({
  children,
  status,
  setStatus,
  submitted,
  data,
}: CaptuchinoProps) {
  const [botFlag, setBotFlag] = useState<number[]>([0, 0, 0]); // State to track bot detection flags
  const THRESHOLD = 2; // Threshold for suspicious behavior

  // Effect to update status based on bot detection flags
  useEffect(() => {
    const suspiciousCount = botFlag.reduce((count, flag) => count + flag, 0);

    if (suspiciousCount >= THRESHOLD) {
      setStatus("yes"); // Mark as suspicious
    } else {
      setStatus("no"); // Mark as not suspicious
    }
  }, [botFlag, setStatus]);

  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  }); // State to track mouse position
  const [pressedKey, setPressedKey] = useState<string | null>(null); // State to track the last pressed key

  // Function to handle mouse movement
  const handleMouseMove = (event: MouseEvent) => {
    const newMousePosition = { x: event.clientX, y: event.clientY };

    setMousePosition(newMousePosition);
  };

  // Effect to add and remove event listeners for mouse movement and key presses
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

  // Call the MouseMovementDetection function to analyze mouse movement
  MouseMovementDetection(setBotFlag);

  // Destructure the handleInputChange function from InputChange
  const { handleInputChange } = InputChange(setBotFlag);

  // Effect to add and remove event listeners for form input changes
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

  // Function to capture the elapsed time since the component was mounted
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

  const capturedTime = GetCapturedTime(); // Get the captured time

  // Effect to update status based on submission and captured time
  useEffect(() => {
    if (submitted === "yes" && capturedTime < 4000) {
      setStatus("yes"); // Mark as suspicious if submitted quickly
    }
  }, [submitted, capturedTime, setStatus]);

  return (
    <div className="relative flex flex-col">
      <div>
        <Code>{`Status: ${status}`}</Code>
        <br />
        <Code>{`Flag: ${botFlag}`}</Code>
        <br />
        <Code>{`Mouse Position: X: ${mousePosition.x}, Y: ${mousePosition.y}`}</Code>
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

      {/* Mouse hover detection */}
      <MouseHoverCheck data={data} setBotFlag={setBotFlag} />

      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
    </div>
  );
}
