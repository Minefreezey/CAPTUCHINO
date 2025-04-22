import { useEffect, useRef, useState } from "react";

export interface MousePosition {
  x: number;
  y: number;
}

export interface Coordinates {
  mousePosition: MousePosition;
  time_stamp: number;
}

export interface AnalyzeMouseResult {
  avgJitter: number;
  avgAngularChange: number;
  speedVariance: number;
  pauseCount: number;
  avgCurvature: number;
}

export interface HistoryResult {
  calculateCount: number;
  botCount: number;
}

const MAX_LOG_SIZE = 200;
const BATCH_SIZE = 50;
const BOT_RATIO_THRESHOLD = 0.3;

export function useMouseBotDetector(setStatus: (val: "yes" | "no") => void) {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [mouseLog, setMouseLog] = useState<Coordinates[]>([]);
  const [historyResult, setHistoryResult] = useState<HistoryResult>({
    calculateCount: 0,
    botCount: 0,
  });

  const lastTimeRef = useRef<number>(0);

  const handleMouseMove = (event: MouseEvent) => {
    const now = Date.now();
    const newMousePosition = { x: event.clientX, y: event.clientY };

    setMousePosition(newMousePosition);

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
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (mouseLog.length >= BATCH_SIZE && mouseLog.length % BATCH_SIZE === 0) {
      const result = AnalyzeMouseMovement(mouseLog);

      setHistoryResult((prev) => {
        const newCalculateCount = prev.calculateCount + 1;
        let suspicionScore = 0;

        if (result.avgJitter < 0.0001) suspicionScore++;
        if (result.avgAngularChange < 0.05) suspicionScore++;
        if (result.speedVariance < 0.01) suspicionScore++;
        if (result.pauseCount === 0) suspicionScore++;
        if (result.avgCurvature < 0.05) suspicionScore++;

        const isSuspicious = suspicionScore >= 3;
        const newBotCount = prev.botCount + (isSuspicious ? 1 : 0);
        const botDetectionRatio = newBotCount / newCalculateCount;

        console.log("Bot Detection Ratio:", botDetectionRatio);
        setStatus(botDetectionRatio > BOT_RATIO_THRESHOLD ? "yes" : "no");

        return {
          calculateCount: newCalculateCount,
          botCount: newBotCount,
        };
      });
    }
  }, [mouseLog, setStatus]);
}

export const AnalyzeMouseMovement = (
  mouseLog: Coordinates[],
): AnalyzeMouseResult => {
  let totalJitter = 0;
  let totalAngularChange = 0;
  let speeds: number[] = [];
  let pauseCount = 0;
  let totalCurvature = 0;

  const PAUSE_THRESHOLD_MS = 200;

  for (let i = 2; i < mouseLog.length; i++) {
    const { x: x0, y: y0 } = mouseLog[i - 2].mousePosition;
    const { x: x1, y: y1 } = mouseLog[i - 1].mousePosition;
    const { x: x2, y: y2 } = mouseLog[i].mousePosition;

    const t0 = mouseLog[i - 2].time_stamp;
    const t1 = mouseLog[i - 1].time_stamp;
    const t2 = mouseLog[i].time_stamp;

    const distance = Math.hypot(x2 - x1, y2 - y1);
    const timeDiff = t2 - t1;
    const speed = distance / (timeDiff || 1);

    speeds.push(speed);

    if (distance < 1 && timeDiff > PAUSE_THRESHOLD_MS) {
      pauseCount += 1;
    }

    const v1 = { x: (x1 - x0) / (t1 - t0), y: (y1 - y0) / (t1 - t0) };
    const v2 = { x: (x2 - x1) / (t2 - t1), y: (y2 - y1) / (t2 - t1) };

    const accelJitter =
      Math.abs(v2.x - v1.x) / (t2 - t1) + Math.abs(v2.y - v1.y) / (t2 - t1);

    totalJitter += accelJitter;

    const dotProduct = v1.x * v2.x + v1.y * v2.y;
    const magV1 = Math.hypot(v1.x, v1.y);
    const magV2 = Math.hypot(v2.x, v2.y);

    let angle = 0;

    if (magV1 > 0 && magV2 > 0) {
      angle = Math.acos(
        Math.max(-1, Math.min(1, dotProduct / (magV1 * magV2))),
      );
    }

    totalAngularChange += angle;
    totalCurvature += angle;
  }

  const avgJitter = totalJitter / (mouseLog.length - 2);
  const avgAngularChange = totalAngularChange / (mouseLog.length - 2);
  const avgCurvature = totalCurvature / (mouseLog.length - 2);
  const speedMean = speeds.reduce((a, b) => a + b, 0) / speeds.length;
  const speedVariance =
    speeds.reduce((sum, val) => sum + (val - speedMean) ** 2, 0) /
    speeds.length;

  return {
    avgJitter,
    avgAngularChange,
    speedVariance,
    pauseCount,
    avgCurvature,
  };
};
