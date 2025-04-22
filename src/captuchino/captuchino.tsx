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
        } else {
          setStatus("no");
          console.log("set status to: no");
        }

        return {
          calculateCount: newCalculateCount,
          botCount: newBotCount,
        };
      });
    }
  }, [mouseLog, setStatus]);

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
  const getCapturedTime = () => {
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

  const capturedTime = getCapturedTime();

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
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
    </div>
  );
}
