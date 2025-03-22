import React from "react";
import {
  Form,
  InputOtp,
  Button,
  NumberInput,
  Select,
  SelectItem,
  DatePicker,
  Switch,
} from "@heroui/react";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import Captchino from "@/captuchino/captuchino";
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
export default function App() {
  const [submitted, setSubmitted] = React.useState(null);
  const [status, setStatus] = React.useState<"yes" | "no">("no");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    // setSubmitted(data);
    setStatus("yes");
  };

  return (
    <DefaultLayout isRobot={status}>
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
        <Captchino>
          <Form className="w-full max-w-xs" onSubmit={onSubmit}>
            {/* <Input
            isRequired
            errorMessage="Please enter a valid username"
            label="Username"
            labelPlacement="outside"
            name="username"
            placeholder="Enter your username"
            type="text"
          />
          <Input
            isRequired
            errorMessage="Please enter a valid email"
            label="Email"
            labelPlacement="outside"
            name="email"
            placeholder="Enter your email"
            type="email"
          /> */}
            <DatePicker label="Date" labelPlacement="outside" />
            <NumberInput
              className="max-w-xs"
              label="Number"
              labelPlacement="outside"
              placeholder="Enter the amount"
            />
            <InputOtp
              isRequired
              aria-label="OTP input field"
              label="OTP"
              length={7}
              name="otp"
              placeholder="Enter code"
            />
            <Select
              className="max-w-xs"
              label="Favorite Animal"
              labelPlacement="outside"
              placeholder="Select an animal"
            >
              {animals.map((animal) => (
                <SelectItem key={animal.key}>{animal.label}</SelectItem>
              ))}
            </Select>
            <Switch defaultSelected size="sm">
              Enable A function
            </Switch>
            <Switch defaultSelected size="sm">
              Enable B function
            </Switch>
            <Button type="submit" variant="bordered">
              Submit
            </Button>
            {submitted && (
              <div className="text-small text-default-500">
                You submitted: <code>{JSON.stringify(submitted)}</code>
              </div>
            )}
          </Form>
        </Captchino>
      </section>
    </DefaultLayout>
  );
}
