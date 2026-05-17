"use client";

import { Avatar } from "antd";
import { ArrowRightOutlined, CheckCircleFilled, QrcodeOutlined } from "@ant-design/icons";

export default function GroupSettle() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
      
      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
        <CheckCircleFilled className="text-emerald-500 text-xl" />
        <div>
          <p className="font-bold text-emerald-800">Tất toán chi tiêu</p>
          <p className="text-xs text-emerald-600 mt-0.5">Dưới đây là phương án trả nợ tối ưu nhất.</p>
        </div>
      </div>

      <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Avatar src="https://api.dicebear.com/7.x/thumbs/svg?seed=Hải" />
            <span className="font-bold text-gray-900">Hải</span>
          </div>
          
          <div className="flex flex-col items-center px-4">
            <p className="text-xs font-bold text-gray-400 mb-1">Cần trả</p>
            <div className="flex items-center gap-2 text-rose-500 font-black">
              50.000đ <ArrowRightOutlined />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Avatar src="https://api.dicebear.com/7.x/thumbs/svg?seed=Tuấn" />
            <span className="font-bold text-gray-900">Bạn</span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="flex-1 h-12 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
            <QrcodeOutlined /> Mã QR
          </button>
          <button className="flex-1 h-12 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-500 shadow-md shadow-teal-500/20 transition-all active:scale-[0.98]">
            Đã thanh toán
          </button>
        </div>
      </div>
      
    </div>
  );
}