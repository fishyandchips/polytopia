import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { GameContextProvider } from "~/app/contexts/useGame";

export const metadata: Metadata = {
  title: "Polytopia",
  description: "A civilisation-based strategy game",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <GameContextProvider>
          {children}
        </GameContextProvider>
      </body>
    </html>
  );
}
