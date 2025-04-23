import React from "react";

interface InputDurations {
  [fieldName: string]: number[];
}

export function InputChange(
  setStatus: React.Dispatch<React.SetStateAction<"yes" | "no">>
) {
  const [inputDurations, setInputDurations] = React.useState<InputDurations>(
    {}
  );
  const lastChangeTimeRef = React.useRef<Record<string, number>>({});
  const previousValuesRef = React.useRef<Record<string, string>>({});

  const calculateAvg = (values: number[]) => {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);

    return sum / values.length;
  };

  const handleInputChange = (event: Event) => {
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
    console.log(`Character typed : ${newCharacters}`);

    if (newCharacters.length > 1) {
      setTimeout(() => {
        setStatus("yes");
        console.log("Suspicious!");
      }, 30);
    } else {
      setTimeout(() => {
        setStatus("no");
        console.log("Not suspicious");
      }, 30);
    }
  };

  return { inputDurations, handleInputChange };
}
