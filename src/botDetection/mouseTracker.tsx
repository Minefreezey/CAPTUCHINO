import React, { useEffect, useState } from "react";
import { Code } from "@heroui/code";

// Interface for the data structure
interface Data {
  fullName: string;
  date: string;
  number: string;
  otp: string;
  animal: string;
  switch1: boolean;
  switch2: boolean;
  button: string;
}

// Props for the MouseHoverCheck component
interface MouseTrackerProps {
  data: Data; // Data object
  setBotFlag: React.Dispatch<React.SetStateAction<number[]>>; // Function to update bot detection flags
}

// Component to track mouse hover and detect suspicious behavior
export const MouseHoverCheck: React.FC<MouseTrackerProps> = ({
  data,
  setBotFlag,
}) => {
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null); // State to track the currently hovered element
  const [lastInsideElementId, setLastInsideElementId] = useState<string | null>(
    null,
  ); // State to track the last hovered element

  // Function to log when the mouse enters or leaves a block
  const setInsideBlockAndLog = (elementId: string | null) => {
    const inside = elementId !== null ? "Yes" : "No";

    if (elementId !== lastInsideElementId) {
      if (elementId) {
        console.log(
          `Inside the block: ${inside}, Element ID: ${elementId}`,
          data,
        );
      } else {
        console.log("Outside the block");
      }
      setLastInsideElementId(elementId);
    }
  };

  // Effect to add event listeners for mouse hover
  useEffect(() => {
    const ids = [
      "fullname",
      "date",
      "number",
      "otp",
      "animal",
      "switch1",
      "switch2",
      "button",
    ]; // List of element IDs to track
    const handleEnter = (id: string) => () => setHoveredElementId(id); // Handler for mouse enter
    const handleLeave = () => setHoveredElementId(null); // Handler for mouse leave

    // Add event listeners for each element
    ids.forEach((id) => {
      const element = document.getElementById(id);

      if (element) {
        element.addEventListener("pointerenter", handleEnter(id));
        element.addEventListener("pointerleave", handleLeave);
      }
    });

    // Cleanup event listeners on unmount
    return () => {
      ids.forEach((id) => {
        const element = document.getElementById(id);

        if (element) {
          element.removeEventListener("pointerenter", handleEnter(id));
          element.removeEventListener("pointerleave", handleLeave);
        }
      });
    };
  }, []);

  // Effect to update bot detection flags based on hover state
  useEffect(() => {
    setInsideBlockAndLog(hoveredElementId);
    if (!hoveredElementId) {
      setBotFlag((prev) => {
        const newFlags = [...prev];

        newFlags[2] = 1; // Set flag to 1 if no element is hovered

        return newFlags;
      });
    } else {
      setBotFlag((prev) => {
        const newFlags = [...prev];

        newFlags[2] = 0; // Reset flag to 0 if an element is hovered

        return newFlags;
      });
    }
  }, [hoveredElementId, setBotFlag]);

  // Function to add input change handlers
  const addInputChangeHandler = (id: string) => {
    const element = document.getElementById(id) as HTMLInputElement | null;

    if (element) {
      const handleChange = (event: Event) => {
        const hasChanged = (event.target as HTMLInputElement).value !== "";

        if (hoveredElementId !== id && hasChanged) {
          console.log(
            `Suspicious activity detected: Input changed on ${id} but mouse not over it.`,
          );
        } else if (hasChanged) {
          console.log(`Input changed on ${id} with mouse over.`);
        }
      };

      element.addEventListener("change", handleChange);

      return () => {
        element.removeEventListener("change", handleChange);
      };
    }
  };

  // Function to add dropdown change handlers
  const addDropdownChangeHandler = () => {
    const dropdown = document.getElementById(
      "animal",
    ) as HTMLSelectElement | null;

    if (dropdown) {
      let isMouseOver = false;

      const handleMouseEnter = () => {
        isMouseOver = true;
      };
      const handleMouseLeave = () => {
        isMouseOver = false;
      };

      const handler = () => {
        if (!isMouseOver) {
          console.log(
            "Suspicious activity detected: Dropdown changed on animal but mouse not over it.",
          );
        } else {
          console.log("Dropdown changed on animal with mouse over.");
        }
      };

      dropdown.addEventListener("mouseenter", handleMouseEnter);
      dropdown.addEventListener("mouseleave", handleMouseLeave);
      dropdown.addEventListener("change", handler);

      return () => {
        dropdown.removeEventListener("mouseenter", handleMouseEnter);
        dropdown.removeEventListener("mouseleave", handleMouseLeave);
        dropdown.removeEventListener("change", handler);
      };
    }
  };

  // Function to add date change handlers
  const addDateChangeHandler = () => {
    const dateInput = document.getElementById(
      "date",
    ) as HTMLInputElement | null;

    if (dateInput) {
      let isMouseOver = false;

      const handleMouseEnter = () => {
        isMouseOver = true;
      };
      const handleMouseLeave = () => {
        isMouseOver = false;
      };

      const handleChange = () => {
        if (!isMouseOver) {
          console.log(
            "Suspicious activity detected: Date changed but mouse not over it.",
          );
        } else {
          console.log("Date changed with mouse over.");
        }
      };

      dateInput.addEventListener("mouseenter", handleMouseEnter);
      dateInput.addEventListener("mouseleave", handleMouseLeave);
      dateInput.addEventListener("change", handleChange);

      return () => {
        dateInput.removeEventListener("mouseenter", handleMouseEnter);
        dateInput.removeEventListener("mouseleave", handleMouseLeave);
        dateInput.removeEventListener("change", handleChange);
      };
    }
  };

  // Function to add switch change handlers
  const addSwitchChangeHandler = (id: string) => {
    const element = document.getElementById(id);

    if (element) {
      const handler = () => {
        if (hoveredElementId !== id) {
          console.log(
            `Suspicious activity detected: Switch toggled on ${id} but mouse not over it.`,
          );
        } else {
          console.log(`Switch toggled on ${id} with mouse over.`);
        }
      };

      element.addEventListener("change", handler);

      return () => element.removeEventListener("change", handler);
    }
  };

  // Function to add button click handlers
  const addButtonClickHandler = () => {
    const button = document.getElementById("button");

    if (button) {
      const handler = () => {
        if (hoveredElementId !== "button") {
          console.log(
            `Suspicious activity detected: Button clicked on button but mouse not over it.`,
          );
        } else {
          console.log(`Button clicked on button with mouse over.`);
        }
      };

      button.addEventListener("click", handler);

      return () => button.removeEventListener("click", handler);
    }
  };

  // Effect to add event listeners for various elements
  useEffect(() => {
    const cleanups: (() => void)[] = [];

    // Add input change handlers
    ["fullname", "number", "otp"].forEach((id) => {
      const cleanup = addInputChangeHandler(id);

      if (cleanup) cleanups.push(cleanup);
    });

    // Add dropdown change handler
    const dropdownCleanup = addDropdownChangeHandler();

    if (dropdownCleanup) cleanups.push(dropdownCleanup);

    // Add date change handler
    const dateCleanup = addDateChangeHandler();

    if (dateCleanup) cleanups.push(dateCleanup);

    // Add switch change handlers
    ["switch1", "switch2"].forEach((id) => {
      const cleanup = addSwitchChangeHandler(id);

      if (cleanup) cleanups.push(cleanup);
    });

    // Add button click handler
    const buttonCleanup = addButtonClickHandler();

    if (buttonCleanup) cleanups.push(buttonCleanup);

    // Cleanup all event listeners on unmount
    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [hoveredElementId]);

  return (
    <div className="relative flex flex-col">
      <div>
        <Code>{`Inside Block: ${hoveredElementId ? "Yes" : "No"} (${hoveredElementId || "None"})`}</Code>
        <br />
      </div>
    </div>
  );
};
