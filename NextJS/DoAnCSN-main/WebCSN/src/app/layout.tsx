import type { Metadata } from "next";
import { Be_Vietnam_Pro, Montserrat } from 'next/font/google'
import "./globals.css";
import Navbar from '@/components/Navbar';
import { LoadingProvider } from '@/context/LoadingContext';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-be-vietnam-pro'
})

const montserrat = Montserrat({
  subsets: ['vietnamese'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-montserrat'
})

export const metadata: Metadata = {
  title: "ShowAI - Khám Phá Công Cụ AI Tốt Nhất",
  description: "Tìm kiếm và khám phá các công cụ AI hàng đầu tại ShowAI. Giúp bạn tìm ứng dụng AI phù hợp với nhu cầu của mình.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.variable} ${montserrat.variable} antialiased`}>
        <LoadingProvider>
          <Navbar />
          {children}
        </LoadingProvider>
      </body>
    </html>
  );
}
