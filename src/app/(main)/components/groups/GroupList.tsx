"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Avatar } from "antd";
import { 
  BellOutlined, PlusOutlined, ArrowDownOutlined, ArrowUpOutlined, CompassOutlined, FileTextOutlined
} from "@ant-design/icons";

export default function GroupList() {
  const params = useParams();
  const currentGroupId = params.id as string; // Lấy ID nhóm từ URL hiện tại

  return (
    <div className="flex flex-col gap-6 px-4 pt-6 lg:px-0 lg:pt-0 pb-24 lg:pb-0 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Nhóm chi tiêu</h1>
        <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm active:scale-95">
          <BellOutlined className="text-lg text-gray-600" />
        </button>
      </div>

      {/* Thẻ Summary (Dark Teal) */}
      <div className="bg-gradient-to-br from-[#0B635D] to-[#063B37] rounded-[32px] p-6 text-white shadow-2xl shadow-teal-900/20 relative overflow-hidden group">
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/20 rounded-full blur-xl group-hover:bg-teal-400/30 transition-colors duration-700"></div>
        
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <p className="text-teal-100/70 text-[11px] font-bold tracking-widest uppercase mb-1.5">Tổng quan</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black">1</span>
              <span className="text-teal-50 text-base font-medium opacity-90">nhóm</span>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="bg-emerald-500/20 border border-emerald-400/30 px-3 py-1.5 rounded-2xl flex items-center gap-2 backdrop-blur-md shadow-sm">
              <div className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center"><ArrowDownOutlined className="text-emerald-400 text-[10px]" /></div>
              <span className="text-xs font-bold text-emerald-50">Dư 50.000đ</span>
            </div>
            <div className="bg-rose-500/20 border border-rose-400/30 px-3 py-1.5 rounded-2xl flex items-center gap-2 backdrop-blur-md shadow-sm opacity-60">
              <div className="w-5 h-5 rounded-full bg-rose-400/20 flex items-center justify-center"><ArrowUpOutlined className="text-rose-400 text-[10px]" /></div>
              <span className="text-xs font-bold text-rose-50">Nợ 0đ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách Item */}
      <div className="space-y-3 overflow-y-auto no-scrollbar pb-20 lg:pb-0 flex-1">
        
        <Link href="/groups/group-1" className="block">
          <div className={`rounded-[28px] p-4 flex items-center gap-4 transition-all duration-300 active:scale-[0.98] ${
            currentGroupId === "group-1" 
              ? "bg-teal-50 border-2 border-teal-500 shadow-md" 
              : "bg-white border-2 border-transparent shadow-sm hover:border-teal-100 hover:shadow-md"
          }`}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center text-3xl shadow-inner relative overflow-hidden shrink-0">
              <CompassOutlined />
              <div className="absolute bottom-1 bg-white/20 backdrop-blur-sm text-white text-[9px] font-bold px-2 rounded-full uppercase border border-white/30">VND</div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">Đà Lạt Mộng Mơ</h3>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-700 bg-teal-100/80 w-max px-2 py-0.5 rounded-md mb-2">
                <FileTextOutlined /> Du lịch
              </div>
              <Avatar.Group size="small" max={{ count: 3 }} className="opacity-90">
                <Avatar src="https://api.dicebear.com/7.x/thumbs/svg?seed=Tuấn" />
                <Avatar src="https://api.dicebear.com/7.x/thumbs/svg?seed=Hải" />
                <Avatar style={{ backgroundColor: '#f56a00' }}>T</Avatar>
              </Avatar.Group>
            </div>

            <div className="text-right shrink-0">
              <p className="text-emerald-500 font-bold text-base">+50K</p>
              <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">Nhận</p>
            </div>
          </div>
        </Link>

        {/* Nút Tạo nhóm mới */}
        <div className="border-2 border-dashed border-teal-200/60 bg-teal-50/30 rounded-[28px] p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-teal-50 hover:border-teal-300 transition-all active:scale-[0.98] group mt-3">
          <div className="w-12 h-12 bg-white text-teal-600 rounded-full flex items-center justify-center text-xl shadow-sm mb-3 group-hover:bg-teal-600 group-hover:text-white transition-colors">
            <PlusOutlined />
          </div>
          <h3 className="text-teal-800 font-bold text-base">Tạo Nhóm Mới</h3>
        </div>
      </div>
    </div>
  );
}