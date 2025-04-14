import React, { useEffect, useRef, useState } from "react";
import { Code } from "@heroui/code";

import { AnalyzeMouseMovement } from "@/botDetection/mouseCoordinates";

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

interface AnalyzeMouseResult {
  avgJitter: number;
  avgAngularChange: number;
  speedVariance: number;
  pauseCount: number;
  avgCurvature: number;
}

interface HistoryResult {
  calculateCount: number;
  botCount: number;
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
  const [mouseLog, setMouseLog] = useState<Coordinates[]>([]);
  const lastTimeRef = useRef<number>(0);
  const MAX_LOG_SIZE = 200;
  const BATCH_SIZE = 50;
  const [historyResult, setHistoryResult] = useState<HistoryResult>({
    calculateCount: 0,
    botCount: 0,
  });
  const BOT_RATIO_THRESHOLD = 0.3; // เริ่มต้นประมาณนี้ก่อน

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

  const checkForBot = (mouseLog: Coordinates[]): AnalyzeMouseResult => {
    return AnalyzeMouseMovement(mouseLog);
  };

  useEffect(() => {
    if (mouseLog.length >= BATCH_SIZE && mouseLog.length % BATCH_SIZE === 0) {
      const result = checkForBot(mouseLog);

      setHistoryResult((prev) => {
        const newCalculateCount = prev.calculateCount + 1;

        // logic ตัดสินใจแบบ multi-dimensional
        let suspicionScore = 0;

        if (result.avgJitter < 0.0001) suspicionScore++;
        if (result.avgAngularChange < 0.05) suspicionScore++;
        if (result.speedVariance < 0.01) suspicionScore++;
        if (result.pauseCount === 0) suspicionScore++;
        if (result.avgCurvature < 0.05) suspicionScore++;

        const isSuspicious = suspicionScore >= 3; // 3 จาก 5 ถือว่าน่าสงสัย

        const newBotCount = prev.botCount + (isSuspicious ? 1 : 0);
        const botDetectionRatio = newBotCount / newCalculateCount;

        console.log("Bot Detection Ratio:", botDetectionRatio);
        if (botDetectionRatio > BOT_RATIO_THRESHOLD) {
          setStatus("yes");
          console.log("set status to: yes");
        }

        return {
          calculateCount: newCalculateCount,
          botCount: newBotCount,
        };
      });
    }
  }, [mouseLog, setStatus]);

  return (
    <div className="relative flex flex-col">
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
