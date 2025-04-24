import React, { useEffect, useState } from "react";
import { Code } from "@heroui/code";

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

interface MouseTrackerProps {
  data: Data;
  setBotFlag: React.Dispatch<React.SetStateAction<number[]>>;
}

export const MouseHoverCheck: React.FC<MouseTrackerProps> = ({
  data,
  setBotFlag,
}) => {
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [lastInsideElementId, setLastInsideElementId] = useState<string | null>(
    null,
  );

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
    ];
    const handleEnter = (id: string) => () => setHoveredElementId(id);
    const handleLeave = () => setHoveredElementId(null);

    ids.forEach((id) => {
      const element = document.getElementById(id);

      if (element) {
        element.addEventListener("pointerenter", handleEnter(id));
        element.addEventListener("pointerleave", handleLeave);
      }
    });

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

  useEffect(() => {
    setInsideBlockAndLog(hoveredElementId);
    if (!hoveredElementId) {
      setBotFlag((prev) => {
        const newFlags = [...prev];

        newFlags[2] = 1;

        return newFlags;
      });
    } else {
      setBotFlag((prev) => {
        const newFlags = [...prev];

        newFlags[2] = 0;

        return newFlags;
      });
    }
  }, [hoveredElementId, setBotFlag]);

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

  useEffect(() => {
    const cleanups: (() => void)[] = [];

    ["fullname", "number", "otp"].forEach((id) => {
      const cleanup = addInputChangeHandler(id);

      if (cleanup) cleanups.push(cleanup);
    });

    const dropdownCleanup = addDropdownChangeHandler();

    if (dropdownCleanup) cleanups.push(dropdownCleanup);

    const dateCleanup = addDateChangeHandler();

    if (dateCleanup) cleanups.push(dateCleanup);

    ["switch1", "switch2"].forEach((id) => {
      const cleanup = addSwitchChangeHandler(id);

      if (cleanup) cleanups.push(cleanup);
    });

    const buttonCleanup = addButtonClickHandler();

    if (buttonCleanup) cleanups.push(buttonCleanup);

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
