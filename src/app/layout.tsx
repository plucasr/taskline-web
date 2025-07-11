import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Taskline",
  description: "Kanban boards with built-in room chat and voice",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
