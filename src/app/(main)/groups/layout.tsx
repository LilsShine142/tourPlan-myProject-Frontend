"use client";

import { usePathname } from "next/navigation";
import { Avatar } from "antd";
import { TeamOutlined, CompassOutlined, FileTextOutlined } from "@ant-design/icons";
import GroupList from "@/app/(main)/components/groups/GroupList";

export default function GroupsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Kiểm tra xem có đang ở đúng trang /groups hay không
  const isRootPage = pathname === "/groups";

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] lg:pb-6 font-sans selection:bg-teal-200">
      <div className="max-w-[1400px] mx-auto lg:p-6 flex flex-col lg:flex-row gap-8 h-full lg:h-[calc(100vh-20px)]">
        
        {/* CỘT TRÁI: DANH SÁCH NHÓM */}
        <div className={`w-full lg:w-[420px] flex-shrink-0 flex-col h-full ${!isRootPage ? 'hidden lg:flex' : 'flex animate-in fade-in slide-in-from-left-4'}`}>
          <GroupList />
        </div>

        {/* CỘT PHẢI: NỘI DUNG (Children) */}
        <div className={`flex-1 flex-col h-full overflow-hidden ${isRootPage ? 'hidden lg:flex' : 'flex'}`}>
          {children}
        </div>
        
      </div>
    </div>
  );
}