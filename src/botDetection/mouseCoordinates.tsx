interface MousePosition {
  x: number;
  y: number;
}

interface Coordinates {
  mousePosition: MousePosition;
  time_stamp: number;
}

export const AnalyzeMouseMovement = (mouseLog: Coordinates[]) => {
  let totalJitter = 0;
  let totalAngularChange = 0;
  let speeds: number[] = [];
  let pauseCount = 0;
  let totalCurvature = 0;

  const PAUSE_THRESHOLD_MS = 200; // หยุดนิ่งนานกว่า 200 ms ถือเป็น pause

  for (let i = 2; i < mouseLog.length; i++) {
    const { x: x0, y: y0 } = mouseLog[i - 2].mousePosition;
    const { x: x1, y: y1 } = mouseLog[i - 1].mousePosition;
    const { x: x2, y: y2 } = mouseLog[i].mousePosition;

    const t0 = mouseLog[i - 2].time_stamp;
    const t1 = mouseLog[i - 1].time_stamp;
    const t2 = mouseLog[i].time_stamp;

    // ความเร็ว (pixels/ms)
    const distance = Math.hypot(x2 - x1, y2 - y1);
    const timeDiff = t2 - t1;
    const speed = distance / (timeDiff || 1); // prevent divide by 0

    speeds.push(speed);

    // ตรวจสอบ pause
    if (distance < 1 && timeDiff > PAUSE_THRESHOLD_MS) {
      pauseCount += 1;
    }

    // Jitter Calculation
    const v1 = { x: (x1 - x0) / (t1 - t0), y: (y1 - y0) / (t1 - t0) };
    const v2 = { x: (x2 - x1) / (t2 - t1), y: (y2 - y1) / (t2 - t1) };

    const accelJitter =
      Math.abs(v2.x - v1.x) / (t2 - t1) + Math.abs(v2.y - v1.y) / (t2 - t1);

    totalJitter += accelJitter;

    // Angular Change
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

    // Curvature (องศาของความโค้ง)
    totalCurvature += angle; // ใช้ angle เดียวกันแทน curvature ได้
  }

  const avgJitter = totalJitter / (mouseLog.length - 2);
  const avgAngularChange = totalAngularChange / (mouseLog.length - 2);
  const avgCurvature = totalCurvature / (mouseLog.length - 2);

  // Speed variance
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
