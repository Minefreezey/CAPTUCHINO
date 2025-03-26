interface MousePosition {
  x: number;
  y: number;
}

interface Coordinates {
  mousePosition: MousePosition;
  time_stamp: number;
}

export const Smoothness = (mouseLog: Coordinates[]) => {
  let totalJitter = 0;
  let totalAngularChange = 0;

  for (let i = 2; i < mouseLog.length; i++) {
    const { x: x0, y: y0 } = mouseLog[i - 2].mousePosition;
    const { x: x1, y: y1 } = mouseLog[i - 1].mousePosition;
    const { x: x2, y: y2 } = mouseLog[i].mousePosition;

    const t0 = mouseLog[i - 2].time_stamp;
    const t1 = mouseLog[i - 1].time_stamp;
    const t2 = mouseLog[i].time_stamp;

    const v1 = { x: (x1 - x0) / (t1 - t0), y: (y1 - y0) / (t1 - t0) };
    const v2 = { x: (x2 - x1) / (t2 - t1), y: (y2 - y1) / (t2 - t1) };

    const accelJitter =
      Math.abs(v2.x - v1.x) / (t2 - t1) + Math.abs(v2.y - v1.y) / (t2 - t1);

    totalJitter += accelJitter;

    const dotProduct = v1.x * v2.x + v1.y * v2.y;
    const magV1 = Math.sqrt(v1.x ** 2 + v1.y ** 2);
    const magV2 = Math.sqrt(v2.x ** 2 + v2.y ** 2);

    if (magV1 > 0 && magV2 > 0) {
      const angle = Math.acos(
        Math.max(-1, Math.min(1, dotProduct / (magV1 * magV2))),
      );

      totalAngularChange += angle;
    }
  }

  const avgJitter = totalJitter / (mouseLog.length - 2);
  const avgAngularChange = totalAngularChange / (mouseLog.length - 2);

  console.log("Average Jitter:", avgJitter);
  console.log("Average Angular Change:", avgAngularChange);

  return { avgJitter, avgAngularChange };
};
