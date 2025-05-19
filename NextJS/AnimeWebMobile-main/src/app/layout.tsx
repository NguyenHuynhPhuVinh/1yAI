// app/layout.tsx (hoặc file layout tương ứng của bạn)
import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import ResponsiveWrapper from "../components/ResponsiveWrapper"; // Đường dẫn đến file ResponsiveWrapper.tsx
import NavBar from "../components/ConditionalNavBar"; // Đường dẫn đến file NavBar.tsx

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TomiSakae",
  description: "Trang Web giải trí về Anime và Live2D!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-black`}>
        <ResponsiveWrapper>{children}<NavBar /></ResponsiveWrapper>
        <Script
          src="/live2d/core/live2dcubismcore.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/live2d/core/live2d.min.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
