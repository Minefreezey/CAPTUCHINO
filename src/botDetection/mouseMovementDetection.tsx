import { useEffect, useRef, useState } from "react";

// Interface to represent the mouse position
export interface MousePosition {
  x: number;
  y: number;
}

// Interface to represent mouse movement coordinates with timestamps
export interface Coordinates {
  mousePosition: MousePosition;
  time_stamp: number;
}

// Interface to represent the result of mouse movement analysis
export interface AnalyzeMouseResult {
  avgJitter: number;
  avgAngularChange: number;
  speedVariance: number;
  pauseCount: number;
  avgCurvature: number;
}

// Interface to track bot detection history
export interface HistoryResult {
  calculateCount: number;
  botCount: number;
}

// Function to detect mouse movement patterns and update bot detection flags
export function MouseMovementDetection(
  setBotFlag: React.Dispatch<React.SetStateAction<number[]>>,
) {
  const [mouseLog, setMouseLog] = useState<Coordinates[]>([]); // State to store mouse movement logs
  const [, setHistoryResult] = useState<HistoryResult>({
    calculateCount: 0,
    botCount: 0,
  });

  const lastTimeRef = useRef<number>(0); // Ref to track the last timestamp of mouse movement
  const MAX_LOG_SIZE = 200; // Maximum size of the mouse log
  const BATCH_SIZE = 50; // Number of movements to analyze in each batch

  // Event handler for mouse movement
  const handleMouseMove = (event: MouseEvent) => {
    const now = Date.now();
    const newMousePosition = { x: event.clientX, y: event.clientY };

    // Log mouse movement if enough time has passed since the last event
    if (now - lastTimeRef.current > 10) {
      setMouseLog((prev) => {
        const newLog = [
          ...prev,
          { mousePosition: newMousePosition, time_stamp: now },
        ];

        // Limit the log size to MAX_LOG_SIZE
        return newLog.length > MAX_LOG_SIZE ? newLog.slice(BATCH_SIZE) : newLog;
      });
      lastTimeRef.current = now;
    }
  };

  // Add and remove the mousemove event listener
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Analyze mouse movement logs in batches
  useEffect(() => {
    if (mouseLog.length >= BATCH_SIZE && mouseLog.length % BATCH_SIZE === 0) {
      const result = AnalyzeMouseMovement(mouseLog);

      setHistoryResult((prev) => {
        const newCalculateCount = prev.calculateCount + 1;
        let suspicionScore = 0;

        // Evaluate metrics to determine suspicious behavior
        if (result.avgJitter < 0.001) suspicionScore++;
        if (result.avgAngularChange < 0.1) suspicionScore++;
        if (result.speedVariance < 0.05) suspicionScore++;
        if (result.pauseCount === 0) suspicionScore++;
        if (result.avgCurvature < 0.1) suspicionScore++;

        const isSuspicious = suspicionScore >= 3;
        const newBotCount = prev.botCount + (isSuspicious ? 1 : 0);

        // Update bot detection flags
        setBotFlag((prev) => {
          const newFlags = [...prev];

          newFlags[0] = isSuspicious ? 1 : 0;

          return newFlags;
        });

        return {
          calculateCount: newCalculateCount,
          botCount: newBotCount,
        };
      });
    }
  }, [mouseLog]);
}

// Function to analyze mouse movement logs and calculate metrics
export const AnalyzeMouseMovement = (
  mouseLog: Coordinates[],
): AnalyzeMouseResult => {
  let totalJitter = 0;
  let totalAngularChange = 0;
  let speeds: number[] = [];
  let pauseCount = 0;
  let totalCurvature = 0;

  const PAUSE_THRESHOLD_MS = 200; // Threshold for detecting pauses

  // Iterate through the mouse log to calculate metrics
  for (let i = 2; i < mouseLog.length; i++) {
    const { x: x0, y: y0 } = mouseLog[i - 2].mousePosition;
    const { x: x1, y: y1 } = mouseLog[i - 1].mousePosition;
    const { x: x2, y: y2 } = mouseLog[i].mousePosition;

    const t0 = mouseLog[i - 2].time_stamp;
    const t1 = mouseLog[i - 1].time_stamp;
    const t2 = mouseLog[i].time_stamp;

    const d01 = Math.hypot(x1 - x0, y1 - y0);
    const d12 = Math.hypot(x2 - x1, y2 - y1);
    const d02 = Math.hypot(x2 - x0, y2 - y0);

    const timeDiff = t2 - t1;
    const speed = d12 / (timeDiff || 1);

    speeds.push(speed);

    // Detect pauses in movement
    if (d12 < 1 && timeDiff > PAUSE_THRESHOLD_MS) {
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

    const arcLength = d01 + d12;
    const chordLength = d02 || 1e-6;
    const curvature = arcLength / chordLength;

    totalCurvature += curvature;
  }

  const n = mouseLog.length - 2;

  const avgJitter = totalJitter / n;
  const avgAngularChange = totalAngularChange / n;
  const avgCurvature = totalCurvature / n;

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
