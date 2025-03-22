import { Link } from "@heroui/link";

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
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://heroui.com"
          title="heroui.com homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">HeroUI</p>
        </Link>
      </footer>
    </div>
  );
}
