import React from "react";
import {
  Input,
  Form,
  InputOtp,
  Button,
  NumberInput,
  Select,
  SelectItem,
  DatePicker,
  Switch,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import Captuchino from "@/captuchino/captuchino";
// Removed unused imports
export const animals = [
  { key: "cat", label: "Cat" },
  { key: "dog", label: "Dog" },
  { key: "elephant", label: "Elephant" },
  { key: "lion", label: "Lion" },
  { key: "tiger", label: "Tiger" },
  { key: "giraffe", label: "Giraffe" },
  { key: "dolphin", label: "Dolphin" },
  { key: "penguin", label: "Penguin" },
  { key: "zebra", label: "Zebra" },
  { key: "shark", label: "Shark" },
  { key: "whale", label: "Whale" },
  { key: "otter", label: "Otter" },
  { key: "crocodile", label: "Crocodile" },
];

export default function FormPage() {
  const [submitted, setSubmitted] = React.useState<"yes" | "no">("no");
  const navigate = useNavigate();
  const [status, setStatus] = React.useState<"yes" | "no">("no");
  const [submitStatus, setSubmitStatus] = React.useState<"yes" | "no">("no");

  const [fullName, setFullName] = React.useState("");
  const [date, setDate] = React.useState("");
  // Removed unused state variables
  // setSubmitted("yes");

  React.useEffect(() => {
    if (submitted === "yes") {
      const timeout = setTimeout(() => {
        navigate(status === "no" ? "/success" : "/failed");
      }, 100); // Delay navigation by 5 seconds

      return () => clearTimeout(timeout); // Cleanup to prevent multiple navigations
    }
  }, [submitted, status, navigate]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Before state update, submitted:", submitted);

    setSubmitted("yes"); // Update the state
    setSubmitStatus(status); // Update submitStatus

    console.log("After state update, submitted:", submitted);

  };

  return (
    <DefaultLayout isRobot={submitStatus}>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <span
            className={title({
              class:
                "bg-gradient-to-r from-[#603813] to-[#b29f94] bg-clip-text text-transparent",
            })}
          >
            CAPTUCHINO
          </span>
          <span className={title({})}> ☕</span>
        </div>
        <Captuchino setStatus={setStatus} status={status} submitted={submitted} setSubmitted={setSubmitted}>
          <Form className="w-full max-w-xs" onSubmit={onSubmit}>
            <Input
              className="max-w-xs"
              label="Full name"
              labelPlacement="outside"
              name="fullname"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <DatePicker
              label="Date"
              name="date"
              labelPlacement="outside"
            // value={date}
            // onChange={(value) => setDate(value)}
            />
            <NumberInput
              className="max-w-xs"
              label="Number"
              labelPlacement="outside"
              name="number"
              placeholder="Enter the amount"
            />
            <InputOtp
              isRequired
              aria-label="OTP input field"
              label="OTP"
              length={7}
              name="otp"
              placeholder="Enter code"
            // value={otp}
            // onChange={(value) => setOtp(value)}
            />
            <Select
              className="max-w-xs"
              label="Favorite Animal"
              labelPlacement="outside"
              name="select"
              placeholder="Select an animal"
            >
              {animals.map((animal) => (
                <SelectItem key={animal.key}>{animal.label}</SelectItem>
              ))}
            </Select>
            <Switch defaultSelected name="switch1" size="sm">
              Enable A function
            </Switch>
            <Switch defaultSelected name="switch2" size="sm">
              Enable B function
            </Switch>
            <Button name="submit" type="submit" variant="bordered">
              Submit
            </Button>
            {submitted === "yes" && (
              <div className="text-small text-default-500">
                You submitted successfully!
              </div>
            )}
          </Form>
        </Captuchino>
      </section>
    </DefaultLayout>
  );
}
