import React, { useEffect, useRef, useState } from "react";
import { Code } from "@heroui/code";

import { MouseMovementDetection } from "@/botDetection/mouseMovementDetection";

interface CaptuchinoProps {
  children: React.ReactNode;
  status: "yes" | "no";
  setStatus: React.Dispatch<React.SetStateAction<"yes" | "no">>;
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
}: CaptuchinoProps) {
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

  MouseMovementDetection(setStatus); // Call mouse Coordinates function

  const [inputDurations, setInputDurations] = useState<InputDurations>({});
  const lastChangeTimeRef = useRef<Record<string, number>>({});
  const previousValuesRef = useRef<Record<string, string>>({});

  const handleInputChange = (event: React.FormEvent) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const fieldName = target.name || target.id || "unknown";

    const currentTime = Date.now();
    const lastChangeTime = lastChangeTimeRef.current[fieldName] || currentTime;
    const previousValue = previousValuesRef.current[fieldName] || "";

    const currentValue = target.value;
    const newCharacters = currentValue.slice(previousValue.length);

    const durations = Array.from(newCharacters).map((_, index) => {
      return currentTime - lastChangeTime + index; // Simulate incremental time for each character
    });

    setInputDurations((prev) => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] || []), ...durations],
    }));

    lastChangeTimeRef.current[fieldName] = currentTime;
    previousValuesRef.current[fieldName] = currentValue;
    console.log(`Input changed: ${target.name} = ${target.value}`);
    console.log(`Time is : ${durations}`);
    console.log(`character typed : ${newCharacters}`);

    if (newCharacters.length > 1) {
      setTimeout(() => {
        setStatus("yes");
        console.log("suspicious!");
      }, 30);
    } else {
      setTimeout(() => {
        setStatus("no");
        console.log("not sus");
      }, 30);
    }
  };

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
  }, []);

  return (
    <div className="relative flex flex-col">
      <div>
        <Code>{`Status: ${status}`}</Code>
        <br />
        {/* <Code>{`INpur Durations: ${JSON.stringify(inputDurations, null, 2)}`}</Code> */}
        <br />
        <Code>{`Mouse Position: X: ${mousePosition.x}, Y: ${mousePosition.y}`}</Code>{" "}
        <br />
        <Code>{`Pressed Key: ${pressedKey || "None"}`}</Code>
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
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
    </div>
  );
}
