import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

/**
 * Root layout: fonts and metadata only. The public site and the admin
 * dashboard each bring their own chrome (navbar/footer vs. sidebar) in their
 * own nested layouts, so nothing visual belongs here.
 */

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Alexandra Carter — Canadian Immigration Lawyer",
    template: "%s · Carter Immigration Law",
  },
  description:
    "Canadian immigration lawyer in Toronto. Express Entry, study and work permits, family sponsorship and permanent residence — honest assessments, meticulous files.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white">{children}</body>
    </html>
  );
}
