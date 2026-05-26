"use client";

import { useState } from "react";
import { Input, Avatar } from "antd";
import { 
  PictureOutlined, 
  CloseOutlined, 
  FormOutlined, 
  SearchOutlined,
  IdcardOutlined,
  UserAddOutlined,
  CheckOutlined
} from "@ant-design/icons";

interface GroupEditProps {
  onBack: () => void;
}

export default function GroupEdit({ onBack }: GroupEditProps) {
  // State quản lý tab thêm thành viên
  const [addMethod, setAddMethod] = useState<"name" | "account">("name");
  
  // State giả lập trạng thái đã thêm
  const [addedUsers, setAddedUsers] = useState<number[]>([]);

  const handleAddUser = (id: number) => {
    setAddedUsers(prev => [...prev, id]);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-black text-gray-900">Chỉnh sửa nhóm</h3>
          <p className="text-sm text-gray-500 mt-1">Cập nhật thông tin & thành viên</p>
        </div>
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors lg:hidden"
        >
          <CloseOutlined />
        </button>
      </div>

      <div className="space-y-6">
        
        {/* Đổi ảnh Cover */}
        <div className="w-full h-32 bg-gradient-to-br from-teal-400 to-teal-600 rounded-[24px] flex flex-col items-center justify-center text-white cursor-pointer hover:opacity-90 transition-opacity shadow-inner">
          <PictureOutlined className="text-3xl mb-2" />
          <span className="font-bold text-sm">Thay đổi ảnh bìa</span>
        </div>

        {/* Thông tin chung */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Tên nhóm</label>
            <Input 
              size="large" 
              defaultValue="Đà Lạt Mộng Mơ"
              prefix={<FormOutlined className="text-gray-300 mr-2" />}
              className="rounded-2xl py-3 border-gray-200 font-bold text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Mô tả chuyến đi (Tùy chọn)</label>
            <Input.TextArea 
              rows={2}
              placeholder="Ghi chú thêm về chuyến đi..."
              className="rounded-2xl py-3 border-gray-200"
            />
          </div>
        </div>

        {/* Khung Thêm Thành Viên */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900 text-lg">Thêm thành viên</h4>
            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-lg">Đang có: 3</span>
          </div>

          {/* Sub-tabs điều hướng tìm kiếm */}
          <div className="flex p-1 bg-gray-50 border border-gray-100 rounded-xl mb-4">
            <button
              onClick={() => setAddMethod("name")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                addMethod === "name" 
                  ? "bg-white text-teal-700 shadow-sm border border-gray-100" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Tìm theo tên
            </button>
            <button
              onClick={() => setAddMethod("account")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                addMethod === "account" 
                  ? "bg-white text-teal-700 shadow-sm border border-gray-100" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Tìm tài khoản
            </button>
          </div>

          {/* Input Tìm kiếm dựa theo Tab */}
          {addMethod === "name" ? (
            <Input 
              size="large" 
              placeholder="Nhập tên bạn bè..." 
              prefix={<SearchOutlined className="text-gray-400 mr-2" />}
              className="rounded-2xl py-3 border-gray-200 bg-gray-50 focus-within:bg-white transition-colors"
            />
          ) : (
            <Input 
              size="large" 
              placeholder="Nhập SĐT hoặc ID người dùng..." 
              prefix={<IdcardOutlined className="text-gray-400 mr-2" />}
              className="rounded-2xl py-3 border-gray-200 bg-gray-50 focus-within:bg-white transition-colors"
            />
          )}

          {/* Kết quả tìm kiếm (Giả lập UI) */}
          <div className="mt-5 space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Gợi ý</p>
            
            {/* Item User 1 */}
            <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-2xl hover:border-teal-200 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar src="https://api.dicebear.com/7.x/thumbs/svg?seed=Vy" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">Thảo Vy</p>
                  <p className="text-[11px] text-gray-500">@thaovy_99</p>
                </div>
              </div>
              {addedUsers.includes(1) ? (
                <button className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                  <CheckOutlined />
                </button>
              ) : (
                <button 
                  onClick={() => handleAddUser(1)}
                  className="w-8 h-8 rounded-full bg-gray-50 text-teal-600 hover:bg-teal-50 flex items-center justify-center transition-colors border border-gray-200 hover:border-teal-200"
                >
                  <UserAddOutlined />
                </button>
              )}
            </div>

            {/* Item User 2 */}
            <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-2xl hover:border-teal-200 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar src="https://api.dicebear.com/7.x/thumbs/svg?seed=Minh" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">Nhật Minh</p>
                  <p className="text-[11px] text-gray-500">0987***321</p>
                </div>
              </div>
              {addedUsers.includes(2) ? (
                <button className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                  <CheckOutlined />
                </button>
              ) : (
                <button 
                  onClick={() => handleAddUser(2)}
                  className="w-8 h-8 rounded-full bg-gray-50 text-teal-600 hover:bg-teal-50 flex items-center justify-center transition-colors border border-gray-200 hover:border-teal-200"
                >
                  <UserAddOutlined />
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Actions Save/Cancel */}
        <div className="flex gap-4 pt-2">
          <button 
            onClick={onBack}
            className="flex-1 h-14 rounded-2xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={onBack} 
            className="flex-1 h-14 rounded-2xl bg-teal-600 text-white font-bold hover:bg-teal-500 shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all"
          >
            Lưu thay đổi
          </button>
        </div>

      </div>
    </div>
  );
}