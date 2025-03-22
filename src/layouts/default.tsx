import { ThemeSwitch } from "@/components/theme-switch";

export default function DefaultLayout({
  children,
  isRobot,
}: {
  children: React.ReactNode;
  isRobot?: "yes" | "no";
}) {
  return (
    <div
      className={`relative flex flex-col h-screen ${
        isRobot === "yes" ? "border-2 border-red-500 animate-pulse" : ""
      }`}
      style={{
        boxShadow: isRobot === "yes" ? "inset 0 0 30px 10px red" : undefined,
      }}
    >
      <div className="absolute top-4 right-4">
        <ThemeSwitch />
      </div>
      {/* <Navbar /> */}
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
    </div>
  );
}
