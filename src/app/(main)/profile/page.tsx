
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Tabs, Button, Switch, Avatar, Badge, ConfigProvider, Drawer, Input } from "antd";
import { 
  MapPin, 
  Compass, 
  Heart, 
  Settings, 
  LogOut, 
  Camera, 
  Edit3, 
  ChevronRight,
  PlaneTakeoff,
  Milestone,
  User,
  Mail,
  FileText
} from "lucide-react";
import viVN from "antd/locale/vi_VN";
import Link from "next/link";
import MobileBottomSheet from "@/components/MobileBottomSheet";
import { MOCK_CURRENT_USER } from "@/lib/mockData";

export default function ProfilePage() {
  // --- STATE QUẢN LÝ GIAO DIỆN ---
  const [isDesktop, setIsDesktop] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const fileInputCoverRef = useRef<HTMLInputElement>(null);
  const fileInputAvatarRef = useRef<HTMLInputElement>(null);

  // --- STATE DỮ LIỆU NGƯỜI DÙNG ---
  const [userData, setUserData] = useState({ ...MOCK_CURRENT_USER });

  const [tempLinks, setTempLinks] = useState({ avatarUrl: "", coverUrl: "" });
  // UI-only coverUrl for preview (not in UserProfile)
  const [coverUrl, setCoverUrl] = useState<string>("");

  // --- FORM CHỈNH SỬA TẠM THỜI ---
  const [editForm, setEditForm] = useState({ ...MOCK_CURRENT_USER });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDesktop(window.innerWidth >= 768);
      const handleResize = () => setIsDesktop(window.innerWidth >= 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // --- XỬ LÝ ĐỔI ẢNH ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'avatar') {
        setUserData(prev => ({ ...prev, avatarUrl: url }));
        setTempLinks(prev => ({ ...prev, avatarUrl: url }));
      } else {
        setCoverUrl(url);
        setTempLinks(prev => ({ ...prev, coverUrl: url }));
      }
    }
  };

  // --- XỬ LÝ LƯU HỒ SƠ ---
  const handleSaveProfile = () => {
    setUserData({ ...editForm });
    setIsEditOpen(false);
    // Sau này gọi API tại đây: callApiUpdateProfile(editForm)
  };

  // --- TAB CONTENT ---
  const TripsTab = () => (
    <div className="space-y-4">
      {[
        { id: 1, name: "Khám phá Phú Quốc 4N3Đ", date: "24/04/2026", status: "upcoming", cover: "🏝️" },
        { id: 2, name: "Đà Lạt Mùa Sương Mù", date: "10/01/2026", status: "completed", cover: "🌲" },
      ].map((trip) => (
        <div key={trip.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-teal-300 transition-all cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">{trip.cover}</div>
            <div>
              <h4 className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors">{trip.name}</h4>
              <p className="text-xs text-gray-500 font-medium mt-0.5 flex items-center gap-1.5">
                <Compass size={12} /> {trip.date}
                <span className={`px-2 py-0.5 rounded-full text-[10px] ml-2 ${trip.status === 'upcoming' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                  {trip.status === 'upcoming' ? 'Sắp đi' : 'Đã hoàn thành'}
                </span>
              </p>
            </div>
          </div>
          <ChevronRight className="text-gray-300 group-hover:text-teal-500" size={18} />
        </div>
      ))}
    </div>
  );

  // --- RENDER FORM CHỈNH SỬA ---
  const renderEditForm = () => (
    <div className="space-y-5">
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
          <User size={20} />
        </div>
        <div>
          <h3 className="font-black text-base text-gray-900">Thông tin cá nhân</h3>
          <p className="text-xs text-gray-400 font-medium mt-0.5">Cập nhật tên và tiểu sử của bạn để mọi người cùng biết nhé.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Họ và tên</label>
          <Input 
            value={editForm.displayName}
            onChange={e => setEditForm({...editForm, displayName: e.target.value})}
            size="large"
            prefix={<User size={16} className="text-gray-400 mr-1" />}
            className="rounded-xl border-gray-200 h-11 font-medium"
          />
        </div>
        <div>
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Email liên hệ</label>
          <Input 
            value={editForm.email}
            disabled
            size="large"
            prefix={<Mail size={16} className="text-gray-400 mr-1" />}
            className="rounded-xl border-gray-200 h-11 bg-gray-50 text-gray-400"
          />
        </div>
        <div>
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Tiểu sử (Bio)</label>
          <Input.TextArea 
            value={editForm.bio}
            onChange={e => setEditForm({...editForm, bio: e.target.value})}
            placeholder="Viết gì đó về bạn..."
            autoSize={{ minRows: 3, maxRows: 5 }}
            className="rounded-xl border-gray-200 p-3 text-sm font-medium"
          />
        </div>
      </div>

      {/* Hiển thị Link ảnh để TEST theo yêu cầu */}
      {(tempLinks.avatarUrl || tempLinks.coverUrl) && (
        <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 space-y-1">
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Debug Link (Ảnh mới chọn):</p>
          {tempLinks.avatarUrl && <p className="text-[9px] text-amber-700 truncate">Avatar: {tempLinks.avatarUrl}</p>}
          {tempLinks.coverUrl && <p className="text-[9px] text-amber-700 truncate">Cover: {tempLinks.coverUrl}</p>}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F6F8FA] pb-10">
      <input type="file" ref={fileInputCoverRef} className="hidden" accept="image/*" onChange={e => handleFileChange(e, 'cover')} />
      <input type="file" ref={fileInputAvatarRef} className="hidden" accept="image/*" onChange={e => handleFileChange(e, 'avatar')} />

      {/* ── COVER HEADER ── */}
      <div
        className="h-40 md:h-56 bg-linear-to-r from-teal-500 via-teal-400 to-cyan-500 relative transition-all duration-500 flex items-center justify-center rounded-b-[10px] overflow-hidden md:max-w-[80%] mx-auto"
        style={coverUrl ? { backgroundImage: `url(${coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        {/* Mobile: Top left icon */}
        <button
          onClick={() => fileInputCoverRef.current?.click()}
          className="absolute top-3 left-3 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white p-2 rounded-full md:hidden flex items-center justify-center transition-colors"
          aria-label="Đổi ảnh bìa"
        >
          <Camera size={18} />
        </button>
        {/* Desktop: Bottom right button */}
        <button 
          onClick={() => fileInputCoverRef.current?.click()}
          className="absolute bottom-4 right-4 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-semibold items-center gap-1.5 transition-colors hidden md:flex"
        >
          <Camera size={14} /> <span className="hidden sm:inline">Đổi ảnh bìa</span>
        </button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 -mt-16 md:-mt-20 relative z-10">
          
          {/* CỘT TRÁI */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar size={100} src={userData.avatarUrl} className="border-4 border-white shadow-md bg-gray-100" />
                <button 
                  onClick={() => fileInputAvatarRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-sm border border-gray-100 text-teal-600 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                >
                  <Camera size={16} />
                </button>
              </div>

              <h2 className="text-xl font-black text-gray-900">{userData.displayName}</h2>
              <p className="text-xs text-gray-400 font-medium mt-1">{userData.email}</p>
              <p className="text-sm text-gray-600 mt-4 mb-6 italic bg-gray-50 px-4 py-2 rounded-xl w-full">"{userData.bio}"</p>

              <Button 
                type="primary" 
                onClick={() => { setEditForm({...userData}); setIsEditOpen(true); }}
                className="w-full bg-gray-900 hover:bg-gray-800 rounded-xl h-10 font-bold shadow-none"
              >
                <Edit3 size={14} className="mr-1" /> Chỉnh sửa hồ sơ
              </Button>
            </div>
          </div>

          {/* CỘT PHẢI */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 min-h-125">
              <ConfigProvider locale={viVN} theme={{ components: { Tabs: { inkBarColor: '#0d9488', itemActiveColor: '#0d9488', itemSelectedColor: '#0d9488', itemHoverColor: '#14b8a6' } } }}>
                <Tabs 
                  defaultActiveKey="trips" 
                  items={[
                    { key: "trips", label: <span className="font-semibold px-2 flex items-center gap-2"><Compass size={16}/> Hành trình</span>, children: <TripsTab /> },
                    { key: "saved", label: <span className="font-semibold px-2 flex items-center gap-2"><Heart size={16}/> Đã lưu</span>, children: <p className="text-center py-10 text-gray-400">Tính năng đang phát triển...</p> },
                  ]} 
                  className="w-full"
                />
              </ConfigProvider>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL CHỈNH SỬA (DESKTOP: DRAWER) ── */}
      {isDesktop && (
        <Drawer
          title={<span className="font-bold text-lg text-gray-800">Chỉnh sửa hồ sơ</span>}
          placement="right"
          width={420}
          onClose={() => setIsEditOpen(false)}
          open={isEditOpen}
          styles={{ body: { padding: "20px", backgroundColor: "#f9fafb" } }}
          className="rounded-l-2xl"
          extra={
            <Button type="primary" onClick={handleSaveProfile} className="bg-teal-600 rounded-xl font-semibold">Lưu lại</Button>
          }
        >
          {renderEditForm()}
        </Drawer>
      )}

      {/* ── MODAL CHỈNH SỬA (MOBILE: BOTTOM SHEET) ── */}
      {!isDesktop && (
        <MobileBottomSheet
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          title="Chỉnh sửa hồ sơ"
          defaultVh={75}
        >
          <div className="p-5 space-y-6">
            {renderEditForm()}
            <Button 
              type="primary" 
              onClick={handleSaveProfile} 
              className="w-full bg-teal-600 rounded-xl h-11 font-bold shadow-md"
            >
              Lưu thay đổi
            </Button>
          </div>
        </MobileBottomSheet>
      )}
    </div>
  );
}
