interface MousePosition {
  x: number;
  y: number;
}

interface Coordinates {
  mousePosition: MousePosition;
  time_stamp: number;
}

export const Smoothness = (mouseLog: Coordinates[]) => {
  // Example usage to avoid unused variable errors
  console.log(mouseLog);
};
