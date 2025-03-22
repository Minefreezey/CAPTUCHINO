import React, { useEffect, useState } from "react";
import { Code } from "@heroui/code";

interface CaptuchinoProps {
  children: React.ReactNode;
  isRobot?: "yes" | "no";
}

export default function Captuchino({ children, isRobot }: CaptuchinoProps) {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

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

  return (
    <div
      className={`relative flex flex-col h-screen ${
        isRobot === "yes" ? "border-2 border-red-500 animate-pulse" : ""
      }`}
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
            fontSize: "64px", // Adjust font size to scale the emoji
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
