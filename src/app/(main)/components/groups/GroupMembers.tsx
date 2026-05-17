"use client";

import { Avatar } from "antd";
import { UserAddOutlined, CrownFilled, CloseOutlined, DeleteOutlined } from "@ant-design/icons";

interface GroupMembersProps {
  onBack: () => void;
}

export default function GroupMembers({ onBack }: GroupMembersProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-black text-gray-900">Thành viên</h3>
          <p className="text-sm text-gray-500 mt-1">Quản lý những người tham gia nhóm</p>
        </div>
        {/* Nút Back dành cho Mobile */}
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors lg:hidden"
        >
          <CloseOutlined />
        </button>
      </div>

      <button className="w-full mb-6 h-14 rounded-2xl border border-dashed border-teal-300 bg-teal-50 text-teal-700 font-bold hover:bg-teal-100 transition-colors flex items-center justify-center gap-2">
        <UserAddOutlined /> Mời thêm bạn bè
      </button>

      <div className="bg-white rounded-[24px] p-2 shadow-sm border border-gray-100 divide-y divide-gray-100">
        
        {/* Leader */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar src="https://api.dicebear.com/7.x/thumbs/svg?seed=Tuấn" size="large" />
              <div className="absolute -top-1 -right-1 text-yellow-400 text-sm"><CrownFilled /></div>
            </div>
            <div>
              <p className="font-bold text-gray-900">Tuấn (Bạn)</p>
              <p className="text-xs text-gray-500">Trưởng nhóm</p>
            </div>
          </div>
        </div>

        {/* Member */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Avatar src="https://api.dicebear.com/7.x/thumbs/svg?seed=Hải" size="large" />
            <div>
              <p className="font-bold text-gray-900">Quang Hải</p>
              <p className="text-xs text-gray-500">Đã tham gia 2 ngày trước</p>
            </div>
          </div>
          <button className="w-8 h-8 rounded-full flex items-center justify-center text-rose-400 hover:bg-rose-50 hover:text-rose-500 transition-colors">
            <DeleteOutlined />
          </button>
        </div>

      </div>
    </div>
  );
}