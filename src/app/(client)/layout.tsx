import Link from "next/link";
import { Button } from "antd";
import { CompassOutlined } from "@ant-design/icons";
import ClientFooter from "./components/ClientFooter";
import ClientHeader from "@/app/(client)/components/ClientHeader";
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* HEADER PUBLIC */}
    <ClientHeader />

      {/* NỘI DUNG CÁC TRANG CON (Trang chủ, Khám phá...) */}
      <main className="flex-1">
        {children}
      </main>

      {/* FOOTER ĐƠN GIẢN */}
      <ClientFooter />
    </div>
  );
}