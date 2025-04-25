import React from "react";

// Interface to store input durations for each field
interface InputDurations {
  [fieldName: string]: number[];
}

// Function to handle input changes and detect suspicious behavior
export function InputChange(
  setBotFlag: React.Dispatch<React.SetStateAction<number[]>>, // Function to update bot detection flags
) {
  // State to store the durations of input changes for each field
  const [inputDurations, setInputDurations] = React.useState<InputDurations>(
    {},
  );

  // Ref to store the last change time for each field
  const lastChangeTimeRef = React.useRef<Record<string, number>>({});

  // Ref to store the previous values of each field
  const previousValuesRef = React.useRef<Record<string, string>>({});

  // Event handler for input changes
  const handleInputChange = (event: Event) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement; // Cast the event target to an input or textarea element
    const fieldName = target.name || target.id || "unknown"; // Get the field name or ID, or default to "unknown"

    const currentTime = Date.now(); // Get the current timestamp
    const lastChangeTime = lastChangeTimeRef.current[fieldName] || currentTime; // Get the last change time for the field
    const previousValue = previousValuesRef.current[fieldName] || ""; // Get the previous value of the field

    const currentValue = target.value; // Get the current value of the field
    const newCharacters = currentValue.slice(previousValue.length); // Get the newly added characters

    // Calculate the durations for each new character
    const durations = Array.from(newCharacters).map((_, index) => {
      return currentTime - lastChangeTime + index; // Simulate incremental time for each character
    });

    // Update the input durations state
    setInputDurations((prev) => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] || []), ...durations],
    }));

    // Update the last change time and previous value for the field
    lastChangeTimeRef.current[fieldName] = currentTime;
    previousValuesRef.current[fieldName] = currentValue;

    // Determine if the input change is suspicious (e.g., more than 2 characters added at once)
    const isSuspicious = newCharacters.length > 2;

    // Update the bot detection flags
    setBotFlag((prev) => {
      const newFlags = [...prev];

      if (isSuspicious) {
        newFlags[1] = 1; // Set the second flag to 1 if suspicious behavior is detected
      }

      return newFlags;
    });
  };

  // Return the input durations and the input change handler
  return { inputDurations, handleInputChange };
}
