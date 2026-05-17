import type { Metadata, Viewport } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, App as AntApp } from "antd";
import viVN from "antd/locale/vi_VN";
import { ANT_DESIGN_THEME } from "@/constants";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import GlobalLoadingWrapper from "@/components/ui/GlobalLoadingWrapper";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Tour Planner & Split Bill',
  description: "Chia bill nhanh gọn và lên kế hoạch du lịch dễ dàng cùng bạn bè",
  manifest:    "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width:               "device-width",
  initialScale:        1,
  maximumScale:        1,
  themeColor:          "#00B894",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={cn("font-sans", inter.variable)}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* Thêm dòng này để React bỏ qua việc check lỗi mismatch thuộc tính trên body do Extension gây ra */}
      <body 
        className="min-h-screen bg-[#F8F9FA] font-sans antialiased"
        suppressHydrationWarning
      >
        {/* <AntdRegistry> */}
          <ConfigProvider theme={ANT_DESIGN_THEME} locale={viVN}>
            <AntApp>
              {children}
            </AntApp>
          </ConfigProvider>
        {/* </AntdRegistry> */}
        <GlobalLoadingWrapper />
      </body>
    </html>
  );
}