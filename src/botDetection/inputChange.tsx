import React from "react";

interface InputDurations {
  [fieldName: string]: number[];
}

export function InputChange(
  setBotFlag: React.Dispatch<React.SetStateAction<number[]>>,
) {
  const [inputDurations, setInputDurations] = React.useState<InputDurations>(
    {},
  );
  const lastChangeTimeRef = React.useRef<Record<string, number>>({});
  const previousValuesRef = React.useRef<Record<string, string>>({});

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

    const isSuspicious = newCharacters.length > 2;

    setBotFlag((prev) => {
      const newFlags = [...prev];

      if (isSuspicious) {
        newFlags[1] = 1;
      }

      return newFlags;
    });
  };

  return { inputDurations, handleInputChange };
}
