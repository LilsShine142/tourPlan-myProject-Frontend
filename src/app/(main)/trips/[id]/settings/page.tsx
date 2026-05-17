"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftOutlined, EditOutlined, GlobalOutlined, LockOutlined, DeleteOutlined, SaveOutlined, WarningOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function SettingsPage() {
  const router = useRouter();
  const [privacy, setPrivacy] = useState("private");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      router.back();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      {/* Header Sticky có hiệu ứng kính */}
      <div className="bg-white/80 backdrop-blur-xl px-4 py-3 flex items-center justify-between sticky top-0 z-20 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <ArrowLeftOutlined className="text-gray-700" />
          </button>
          <h1 className="font-bold text-lg text-gray-900">Cài đặt</h1>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-70"
        >
          {isSaving ? <span className="animate-spin text-lg">↻</span> : <SaveOutlined />} Lưu
        </button>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-6 mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Thông tin cơ bản */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100/50">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-lg"><EditOutlined /></div>
            <h3 className="font-bold text-gray-900 text-lg">Thông tin chuyến đi</h3>
          </div>
          
          <div className="space-y-4">
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-primary transition-colors">Tên chuyến đi</label>
              <input 
                type="text" 
                defaultValue="Đà Lạt mộng mơ"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3.5 text-gray-900 font-medium focus:outline-none focus:bg-white focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-primary transition-colors">Ngày đi</label>
                <input type="date" defaultValue="2024-06-10" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3.5 text-gray-700 font-medium focus:outline-none focus:bg-white focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all" />
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-primary transition-colors">Ngày về</label>
                <input type="date" defaultValue="2024-06-13" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3.5 text-gray-700 font-medium focus:outline-none focus:bg-white focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all" />
              </div>
            </div>
          </div>
        </div>

        {/* Quyền riêng tư (Dạng Card Select) */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100/50">
          <h3 className="font-bold text-gray-900 text-lg mb-4">Quyền riêng tư</h3>
          <div className="space-y-3">
            <div 
              onClick={() => setPrivacy("private")}
              className={`p-4 rounded-2xl cursor-pointer border-2 transition-all duration-200 flex items-start gap-4 ${privacy === "private" ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"}`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${privacy === "private" ? "border-primary" : "border-gray-300"}`}>
                {privacy === "private" && <div className="w-3 h-3 rounded-full bg-primary" />}
              </div>
              <div>
                <p className="font-bold text-gray-900 flex items-center gap-2"><LockOutlined className="text-gray-400"/> Chỉ thành viên</p>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">Chỉ những người được mời tham gia nhóm mới có thể xem và chỉnh sửa dữ liệu.</p>
              </div>
            </div>

            <div 
              onClick={() => setPrivacy("public")}
              className={`p-4 rounded-2xl cursor-pointer border-2 transition-all duration-200 flex items-start gap-4 ${privacy === "public" ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"}`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${privacy === "public" ? "border-primary" : "border-gray-300"}`}>
                {privacy === "public" && <div className="w-3 h-3 rounded-full bg-primary" />}
              </div>
              <div>
                <p className="font-bold text-gray-900 flex items-center gap-2"><GlobalOutlined className="text-gray-400"/> Công khai</p>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">Bất kỳ ai có đường liên kết đều có thể xem (nhưng không thể chỉnh sửa).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-6 border border-red-100">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <WarningOutlined className="text-xl" />
            <h3 className="font-bold text-lg">Khu vực nguy hiểm</h3>
          </div>
          <p className="text-sm text-red-600/80 mb-5 font-medium">Xóa chuyến đi sẽ xóa toàn bộ lịch trình, chi tiêu và không thể khôi phục lại.</p>
          <button className="w-full bg-red-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-700 active:scale-95 transition-all shadow-md shadow-red-200">
            <DeleteOutlined /> Xóa chuyến đi này
          </button>
        </div>
      </div>
    </div>
  );
}