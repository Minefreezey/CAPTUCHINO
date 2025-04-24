import React, { useEffect } from "react";
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

export default function FormPage() {
  const [submitted, setSubmitted] = React.useState<"yes" | "no">("no");
  const navigate = useNavigate();
  const [status, setStatus] = React.useState<"yes" | "no">("no");
  const [submitStatus, setSubmitStatus] = React.useState<"yes" | "no">("no");

  //const [fullName, setFullName] = React.useState("");
  // Removed unused state variables
  // setSubmitted("yes");
  const [data, setData] = React.useState<Data>({
    fullName: "",
    date: "",
    number: "",
    otp: "",
    animal: "",
    switch1: false,
    switch2: false,
    button: "",
  });

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

  useEffect(() => {
    console.log("Data updated:", data);
  }, [data]);

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
        <Captuchino
          data={data}
          setStatus={setStatus}
          status={status}
          submitted={submitted}
        >
          <Form className="w-full max-w-xs" onSubmit={onSubmit}>
            <Input
              className="max-w-xs"
              id="fullname"
              label="Full name"
              labelPlacement="outside"
              name="fullname"
              placeholder="Enter your full name"
              value={data.fullName} // ใช้ data.fullName
              onChange={(e) => setData({ ...data, fullName: e.target.value })} // อัปเดต data.fullName
            />
            <DatePicker
              id="date"
              label="Date"
              name="date"
              labelPlacement="outside"
              //value={data.date} // ใช้ data.date
              onChange={(date) =>
                setData({ ...data, date: date?.toString() || "" })
              } // อัปเดต data.date
            />
            <NumberInput
              className="max-w-xs"
              id="number"
              label="Number"
              labelPlacement="outside"
              name="number"
              placeholder="Enter the amount"
              //value={data.number} // ใช้ data.number
              onChange={(value) =>
                setData({ ...data, number: value.toString() })
              } // Convert number to string before updating data.number
            />
            <InputOtp
              isRequired
              aria-label="OTP input field"
              id="otp"
              label="OTP"
              length={7}
              name="otp"
              placeholder="Enter code"
              type="text"
              value={data.otp} // ใช้ data.otp
              onChange={(e) =>
                setData({ ...data, otp: (e.target as HTMLInputElement).value })
              } // อัปเดต data.otp
            />
            <Select
              className="max-w-xs"
              id="animal"
              label="Favorite Animal"
              labelPlacement="outside"
              name="select"
              placeholder="Select an animal"
              value={data.animal} // ใช้ data.animal
              onChange={(e) => setData({ ...data, animal: e.target.value })} // อัปเดต data.animal
            >
              {animals.map((animal) => (
                <SelectItem key={animal.key} data-value={animal.key}>
                  {animal.label}
                </SelectItem>
              ))}
            </Select>
            <Switch
              defaultSelected={data.switch1} // ใช้ data.switch1
              id="switch1"
              name="switch1"
              size="sm"
              type="checkbox"
              onChange={(e) => setData({ ...data, switch1: e.target.checked })} // อัปเดต data.switch1
            >
              Enable A function
            </Switch>
            <Switch
              defaultSelected={data.switch2} // ใช้ data.switch2
              id="switch2"
              name="switch2"
              size="sm"
              type="checkbox"
              onChange={(e) => setData({ ...data, switch2: e.target.checked })} // อัปเดต data.switch2
            >
              Enable B function
            </Switch>
            <Button
              id="button"
              name="submit"
              type="submit"
              variant="bordered"
              onPress={() => setData({ ...data, button: "clicked" })} // อัปเดต data.button
            >
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
