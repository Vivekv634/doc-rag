import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LayoutComponent from "./layoutComponent";

const space_grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  preload: true,
  style: "normal",
});

export const metadata: Metadata = {
  title: "Doc-RAG",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        space_grotesk.className,
      )}
    >
      <body className="min-h-full flex flex-col">
        <LayoutComponent>{children}</LayoutComponent>
      </body>
    </html>
  );
}
