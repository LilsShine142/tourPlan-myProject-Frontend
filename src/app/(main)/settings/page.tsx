"use client";

import React, { useState } from "react";
import { Button, Input, Switch, Select, Divider, Popconfirm } from "antd";
import { 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Trash2, 
  Save,
  KeyRound,
  Smartphone,
  Mail,
  ChevronDown
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dữ liệu cấu hình mô phỏng
  const [formData, setFormData] = useState({
    name: "Nguyễn Văn A",
    phone: "0901234567",
    email: "nguyenvana.travel@example.com",
    language: "vi",
    currency: "VND"
  });

  // ── MẢNG CÁC TAB ĐIỀU HƯỚNG ──
  const menuItems = [
    { id: "account", icon: <User size={18} />, label: "Tài khoản chung" },
    { id: "security", icon: <Shield size={18} />, label: "Bảo mật & Mật khẩu" },
    { id: "notifications", icon: <Bell size={18} />, label: "Thông báo" },
    { id: "preferences", icon: <Globe size={18} />, label: "Tùy chọn hiển thị" },
  ];

  // Tìm kiếm tab hiện tại để hiển thị tiêu đề trên nút bấm Mobile
  const activeItem = menuItems.find(item => item.id === activeTab) || menuItems[0];

  // ── RENDER NỘI DUNG THEO TAB ──
  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <h2 className="text-lg font-black text-gray-900">Thông tin tài khoản</h2>
              <p className="text-sm text-gray-400 mt-1">Cập nhật thông tin cơ bản liên kết với tài khoản của bạn.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Họ và tên</label>
                <Input size="large" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="rounded-xl border-gray-200 h-11 font-medium" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Số điện thoại</label>
                <Input size="large" prefix={<Smartphone size={16} className="text-gray-400 mr-1" />} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="rounded-xl border-gray-200 h-11 font-medium" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Địa chỉ Email</label>
                <Input size="large" prefix={<Mail size={16} className="text-gray-400 mr-1" />} value={formData.email} disabled className="rounded-xl border-gray-200 h-11 bg-gray-50 text-gray-400" />
                <p className="text-xs text-gray-400 mt-1.5 ml-1">Email được dùng để đăng nhập và không thể thay đổi.</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="primary" icon={<Save size={16} />} className="bg-teal-600 hover:bg-teal-500 rounded-xl h-10 px-6 font-bold shadow-sm">
                Lưu thay đổi
              </Button>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <h2 className="text-lg font-black text-gray-900">Đổi mật khẩu</h2>
              <p className="text-sm text-gray-400 mt-1">Đảm bảo tài khoản của bạn sử dụng mật khẩu dài và an toàn.</p>
            </div>

            <div className="space-y-4 max-w-md">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Mật khẩu hiện tại</label>
                <Input.Password size="large" prefix={<KeyRound size={16} className="text-gray-400 mr-1" />} className="rounded-xl border-gray-200 h-11" placeholder="Nhập mật khẩu cũ" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Mật khẩu mới</label>
                <Input.Password size="large" prefix={<Shield size={16} className="text-gray-400 mr-1" />} className="rounded-xl border-gray-200 h-11" placeholder="Nhập mật khẩu mới" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Xác nhận mật khẩu mới</label>
                <Input.Password size="large" prefix={<Shield size={16} className="text-gray-400 mr-1" />} className="rounded-xl border-gray-200 h-11" placeholder="Nhập lại mật khẩu mới" />
              </div>
            </div>

            <div className="pt-2">
              <Button type="primary" className="bg-gray-900 hover:bg-gray-800 rounded-xl h-10 px-6 font-bold shadow-sm">
                Cập nhật mật khẩu
              </Button>
            </div>

            <Divider className="border-gray-100" />

            <div>
              <h3 className="text-base font-bold text-red-600 flex items-center gap-2 mb-2">
                <Trash2 size={18} /> Xóa tài khoản
              </h3>
              <p className="text-sm text-gray-500 mb-4">Khi xóa tài khoản, tất cả dữ liệu chuyến đi, hình ảnh và lịch trình của bạn sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.</p>
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa tài khoản?"
                description="Hành động này không thể khôi phục."
                okText="Xóa vĩnh viễn"
                cancelText="Hủy"
                okButtonProps={{ danger: true, className: "rounded-lg" }}
                cancelButtonProps={{ className: "rounded-lg" }}
              >
                <Button danger className="rounded-xl h-10 font-bold border-red-200 bg-red-50 hover:bg-red-100">
                  Xóa tài khoản của tôi
                </Button>
              </Popconfirm>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <h2 className="text-lg font-black text-gray-900">Cài đặt thông báo</h2>
              <p className="text-sm text-gray-400 mt-1">Chọn loại thông báo bạn muốn nhận để không bỏ lỡ các cập nhật quan trọng.</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 flex items-center justify-between border-b border-gray-50">
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Lời mời tham gia chuyến đi</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Khi ai đó mời bạn tham gia nhóm du lịch.</p>
                </div>
                <Switch defaultChecked className="bg-gray-200 [&.ant-switch-checked]:bg-teal-500" />
              </div>
              <div className="p-4 flex items-center justify-between border-b border-gray-50">
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Nhắc nhở lịch trình sắp tới</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Nhắc nhở 24h trước khi chuyến đi bắt đầu.</p>
                </div>
                <Switch defaultChecked className="bg-gray-200 [&.ant-switch-checked]:bg-teal-500" />
              </div>
              <div className="p-4 flex items-center justify-between border-b border-gray-50">
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Tin nhắn nhóm</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Nhận thông báo khi có thảo luận mới trong chuyến đi.</p>
                </div>
                <Switch defaultChecked className="bg-gray-200 [&.ant-switch-checked]:bg-teal-500" />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Khuyến mãi & Cập nhật</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Nhận email về tính năng mới và mã giảm giá.</p>
                </div>
                <Switch className="bg-gray-200 [&.ant-switch-checked]:bg-teal-500" />
              </div>
            </div>
          </div>
        );

      case "preferences":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <h2 className="text-lg font-black text-gray-900">Tùy chọn hệ thống</h2>
              <p className="text-sm text-gray-400 mt-1">Cá nhân hóa trải nghiệm sử dụng TripPlanner của bạn.</p>
            </div>

            <div className="space-y-5 max-w-sm">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Ngôn ngữ hiển thị</label>
                <Select
                  value={formData.language}
                  onChange={(val) => setFormData({...formData, language: val})}
                  className="w-full h-11 [&_.ant-select-selector]:rounded-xl [&_.ant-select-selector]:border-gray-200"
                  options={[
                    { value: 'vi', label: 'Tiếng Việt' },
                    { value: 'en', label: 'English' },
                  ]}
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Tiền tệ mặc định</label>
                <Select
                  value={formData.currency}
                  onChange={(val) => setFormData({...formData, currency: val})}
                  className="w-full h-11 [&_.ant-select-selector]:rounded-xl [&_.ant-select-selector]:border-gray-200"
                  options={[
                    { value: 'VND', label: 'Việt Nam Đồng (VND)' },
                    { value: 'USD', label: 'US Dollar (USD)' },
                  ]}
                />
                <p className="text-xs text-gray-400 mt-1.5 ml-1">Được sử dụng khi tính toán chi phí chung của nhóm.</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FA] pb-12 pt-6 sm:pt-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TIÊU ĐỀ TRANG */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Cài đặt</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý tài khoản, mật khẩu và tùy chọn của bạn.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
          
          {/* ── SIDEBAR NAVIGATION ── */}
          <div className="w-full md:w-64 shrink-0">
            
            {/* 1. NÚT TRIGGER CHỈ HIỂN THỊ TRÊN MOBILE */}
            <div className="md:hidden mb-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between font-bold text-gray-800 active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-teal-500">{activeItem.icon}</span>
                  <span className="text-sm">{activeItem.label}</span>
                </div>
                <ChevronDown 
                  size={18} 
                  className={`text-gray-400 transition-transform duration-300 ${isMobileMenuOpen ? "rotate-180" : ""}`} 
                />
              </button>
            </div>

            {/* 2. DANH SÁCH MENU DỌC (Hỗ trợ Collapse trên Mobile, Sidebar cố định trên Desktop) */}
            <div className={`
              ${isMobileMenuOpen ? "flex mb-4" : "hidden"} 
              md:flex flex-col bg-white p-2 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 gap-1 
              animate-in slide-in-from-top-2 duration-200 md:animate-none
            `}>
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false); // Đóng menu thả xuống sau khi chọn mục mới trên Mobile
                    }}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all text-left
                      ${isActive 
                        ? "bg-teal-50/60 text-teal-600 shadow-sm border border-teal-100/50" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                      }
                    `}
                  >
                    <span className={`${isActive ? "text-teal-500" : "text-gray-400"}`}>
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                );
              })}
            </div>

          </div>

          {/* ── MAIN CONTENT AREA ── */}
          <div className="flex-1 min-w-0">
            <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[400px]">
              {renderContent()}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}