"use client";

import { Avatar } from "antd";
import { BarChartOutlined, UserOutlined, ScanOutlined, CrownFilled } from "@ant-design/icons";

export default function GroupStats() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
      
      {/* Box Chart Phân tích (Giao diện mới) */}
      <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">Tổng đã chi</p>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">2.450<span className="text-2xl text-gray-400">K</span></h2>
          </div>
          <div className="bg-rose-50 text-rose-600 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-rose-100 cursor-pointer hover:bg-rose-100 transition">
            <BarChartOutlined /> Xem báo cáo
          </div>
        </div>

        {/* Biểu đồ thanh ngang */}
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-xs font-bold text-gray-600 mb-2">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-400"></span> Ăn uống (45%)</span> 
              <span className="text-gray-900">1.100K</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div className="bg-orange-400 h-2.5 rounded-full" style={{ width: "45%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold text-gray-600 mb-2">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Di chuyển (30%)</span> 
              <span className="text-gray-900">735K</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "30%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold text-gray-600 mb-2">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Lưu trú (25%)</span> 
              <span className="text-gray-900">615K</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: "25%" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Nút thao tác nhanh */}
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-white border border-teal-100 py-5 rounded-[24px] flex flex-col items-center justify-center gap-3 hover:bg-teal-50 transition shadow-sm group">
          <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            <UserOutlined />
          </div>
          <span className="font-bold text-sm text-gray-700">Trạng thái nợ</span>
        </button>
        <button className="bg-white border border-indigo-100 py-5 rounded-[24px] flex flex-col items-center justify-center gap-3 hover:bg-indigo-50 transition shadow-sm group">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            <ScanOutlined />
          </div>
          <span className="font-bold text-sm text-gray-700">Quét Bill AI</span>
        </button>
      </div>

      {/* Top chi tiêu */}
      <div className="pt-2">
        <h4 className="text-sm font-bold text-gray-900 mb-4 ml-2">Thành viên chi tiêu</h4>
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar src="https://api.dicebear.com/7.x/thumbs/svg?seed=Tuấn" size="large" />
                <div className="absolute -top-2 -right-2 text-yellow-400 text-lg rotate-12"><CrownFilled /></div>
              </div>
              <div>
                <p className="font-bold text-gray-900">Tuấn (Bạn)</p>
                <p className="text-xs text-gray-500 font-medium">1 hóa đơn</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-teal-600">1.100.000 đ</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}