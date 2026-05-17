"use client";

import { WalletOutlined } from "@ant-design/icons";

export default function GroupsEmptyPage() {
  return (
    <div className="flex-1 bg-white rounded-[32px] shadow-sm border border-gray-100 items-center justify-center h-full flex">
       <div className="text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center text-teal-500 text-4xl mb-4">
            <WalletOutlined />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa chọn nhóm nào</h3>
          <p className="text-gray-500 text-sm max-w-xs">Hãy chọn một nhóm ở danh sách bên trái để xem thống kê chi tiết.</p>
       </div>
    </div>
  );
}