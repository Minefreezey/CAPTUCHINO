import React, { useEffect, useRef, useState } from "react";
import { Code } from "@heroui/code";

import { Smoothness } from "@/botDetection/mouseCoordinates";

interface CaptuchinoProps {
  children: React.ReactNode;
  isRobot?: "yes" | "no";
}

interface MousePosition {
  x: number;
  y: number;
}

interface Coordinates {
  mousePosition: MousePosition;
  time_stamp: number;
}

interface SmoothnessResult {
  avgJitter: number;
  avgAngularChange: number;
}

export default function Captuchino({ children, isRobot }: CaptuchinoProps) {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [mouseLog, setMouseLog] = useState<Coordinates[]>([]);
  const lastTimeRef = useRef<number>(0);
  const MAX_LOG_SIZE = 200;
  const BATCH_SIZE = 50;

  const handleMouseMove = (event: MouseEvent) => {
    const now = Date.now();
    const newMousePosition = { x: event.clientX, y: event.clientY };

    setMousePosition(newMousePosition);

    // Sampling rate of 10ms
    if (now - lastTimeRef.current > 10) {
      setMouseLog((prev) => {
        const newLog = [
          ...prev,
          { mousePosition: newMousePosition, time_stamp: now },
        ];

        return newLog.length > MAX_LOG_SIZE ? newLog.slice(BATCH_SIZE) : newLog;
      });

      lastTimeRef.current = now;
    }
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

  const checkForBot = (mouseLog: Coordinates[]): SmoothnessResult => {
    return Smoothness(mouseLog);
  };

  useEffect(() => {
    if (mouseLog.length >= BATCH_SIZE && mouseLog.length % BATCH_SIZE === 0) {
      var result: SmoothnessResult = checkForBot(mouseLog);

      if (result.avgJitter < 0.0001 || result.avgAngularChange < 0.05) {
        console.log("Bot Detected");
        // setSubmitted(data);
        // setStatus("yes");
      } else {
        console.log("Not a Bot");
      }
    }
  }, [mouseLog]);

  return (
    <div
      className={`relative flex flex-col ${isRobot === "yes" ? "border-2 border-red-500 animate-pulse" : ""}`}
      style={{
        boxShadow: isRobot === "yes" ? "inset 0 0 30px 10px red" : undefined,
      }}
    >
      <div>
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
