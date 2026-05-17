"use client";

import { Input, Select } from "antd";
import { 
  CameraOutlined, 
  FileTextOutlined, 
  DollarOutlined, 
  TagsOutlined,
  CloseOutlined
} from "@ant-design/icons";

interface GroupAddBillProps {
  onCancel: () => void;
}

export default function GroupAddBill({ onCancel }: GroupAddBillProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* Header riêng của Tab Add Bill (Dành cho Mobile hiển thị rõ ràng hơn) */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-black text-gray-900">Thêm Hóa Đơn</h3>
          <p className="text-sm text-gray-500 mt-1">Nhập thủ công hoặc dùng AI quét ảnh</p>
        </div>
        <button 
          onClick={onCancel}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors lg:hidden"
        >
          <CloseOutlined />
        </button>
      </div>

      <div className="space-y-5">
        
        {/* Nút Quét AI */}
        <button className="w-full bg-indigo-50 border border-indigo-200 border-dashed rounded-[24px] p-6 flex flex-col items-center justify-center gap-3 text-indigo-600 hover:bg-indigo-100 transition-colors group cursor-pointer">
          <div className="w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-transform">
            <CameraOutlined />
          </div>
          <p className="font-bold">Chụp ảnh / Quét Bill AI</p>
        </button>

        <div className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest my-2">Hoặc nhập tay</div>

        {/* Form Nhập */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 space-y-5">
          
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Số tiền</label>
            <Input 
              size="large" 
              placeholder="0 đ" 
              prefix={<DollarOutlined className="text-gray-400 mr-2" />}
              className="rounded-2xl py-3 border-gray-200 text-xl font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Tên chi tiêu</label>
            <Input 
              size="large" 
              placeholder="VD: Tiền taxi, Lẩu cá tầm..." 
              prefix={<FileTextOutlined className="text-gray-400 mr-2" />}
              className="rounded-2xl py-3 border-gray-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Danh mục</label>
            <Select
              size="large"
              placeholder="Chọn danh mục"
              className="w-full h-12"
              options={[
                { value: 'food', label: '🍜 Ăn uống' },
                { value: 'transport', label: '🚕 Di chuyển' },
                { value: 'hotel', label: '🏨 Lưu trú' },
                { value: 'ticket', label: '🎫 Vé tham quan' },
              ]}
            />
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button 
            onClick={onCancel}
            className="flex-1 h-14 rounded-2xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
          <button className="flex-1 h-14 rounded-2xl bg-teal-600 text-white font-bold hover:bg-teal-500 shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all">
            Lưu hóa đơn
          </button>
        </div>

      </div>
    </div>
  );
}