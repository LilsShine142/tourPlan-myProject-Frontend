"use client";

import React, { useState, useEffect } from "react";
import { Drawer, Button, Input, DatePicker, Select, InputNumber } from "antd";
import { 
  Briefcase, 
  Calendar as CalendarIcon, 
  Users, 
  MapPin, 
  DollarSign, 
  FileText,
  Compass
} from "lucide-react";
import MobileBottomSheet from "@/components/MobileBottomSheet"; 

const { RangePicker } = DatePicker;

interface CreateTripModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (tripData: any) => void;
}

export function CreateTripModal({ open, onClose, onSave }: CreateTripModalProps) {
  const [isDesktop, setIsDesktop] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    dates: null as any,
    destination: "",
    members: 1,
    budget: "",
    notes: "",
    privacy: "private"
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDesktop(window.innerWidth >= 768);
      const handleResize = () => setIsDesktop(window.innerWidth >= 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFormSubmit = () => {
    if (!formData.name || !formData.destination) {
      alert("Vui lòng điền tên chuyến đi và điểm đến hành trình!");
      return;
    }
    onSave(formData);
    onClose();
  };

  const renderFormContent = () => (
    <div className="space-y-5">
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
          <Compass size={20} className="animate-spin-slow" />
        </div>
        <div>
          <h3 className="font-black text-base text-gray-900">Bắt đầu hành trình mới</h3>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            Lên kế hoạch thông minh, lưu giữ mọi khoảnh khắc đáng nhớ.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* 1. Tên chuyến đi */}
        <div>
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Tên chuyến đi</label>
          <Input 
            placeholder="Vd: Khám phá Phú Quốc hè 2026..."
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            size="large"
            prefix={<Briefcase size={16} className="text-gray-400 mr-1" />}
            className="rounded-xl border-gray-200 h-11 shadow-sm font-medium"
          />
        </div>

        {/* 2. Điểm đến chính */}
        <div>
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Điểm đến</label>
          <Input 
            placeholder="Vd: Phú Quốc, Kiên Giang..."
            value={formData.destination}
            onChange={(e) => handleInputChange("destination", e.target.value)}
            size="large"
            prefix={<MapPin size={16} className="text-gray-400 mr-1" />}
            className="rounded-xl border-gray-200 h-11 shadow-sm font-medium"
          />
        </div>

        {/* 3. 🔥 FIX OVERFLOW: Thời gian đi chia UX theo thiết bị */}
        <div>
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Thời gian diễn ra</label>
          
          {isDesktop ? (
            // Dùng RangePicker bình thường cho Desktop
            <RangePicker 
              size="large"
              placeholder={["Ngày đi", "Ngày về"]}
              value={formData.dates}
              onChange={(dates) => handleInputChange("dates", dates)}
              className="rounded-xl border-gray-200 h-11 shadow-sm font-medium w-full"
            />
          ) : (
            // Tách thành 2 DatePicker riêng biệt cho Mobile để không tràn màn hình
            <div className="flex gap-3">
              <DatePicker 
                size="large"
                placeholder="Ngày đi"
                value={formData.dates?.[0] || null}
                onChange={(date) => handleInputChange("dates", [date, formData.dates?.[1] || null])}
                className="rounded-xl border-gray-200 h-11 shadow-sm font-medium w-full"
              />
              <DatePicker 
                size="large"
                placeholder="Ngày về"
                value={formData.dates?.[1] || null}
                onChange={(date) => handleInputChange("dates", [formData.dates?.[0] || null, date])}
                className="rounded-xl border-gray-200 h-11 shadow-sm font-medium w-full"
              />
            </div>
          )}
        </div>

        {/* 4. Thành viên & Ngân sách dự kiến */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Số thành viên</label>
            <InputNumber 
              min={1} 
              max={100}
              value={formData.members}
              onChange={(val) => handleInputChange("members", val)}
              size="large"
              prefix={<Users size={16} className="text-gray-400 mr-1" />}
              className="rounded-xl border-gray-200 h-11 shadow-sm font-medium w-full flex items-center"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Dự chi ước tính</label>
            <Input 
              placeholder="Vd: 5,000,000đ"
              value={formData.budget}
              onChange={(e) => handleInputChange("budget", e.target.value)}
              size="large"
              prefix={<DollarSign size={16} className="text-gray-400 mr-1" />}
              className="rounded-xl border-gray-200 h-11 shadow-sm font-medium"
            />
          </div>
        </div>

        {/* 5. Chế độ riêng tư */}
        <div>
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Chế độ hiển thị</label>
          <Select
            size="large"
            value={formData.privacy}
            onChange={(val) => handleInputChange("privacy", val)}
            className="w-full h-11 rounded-xl shadow-sm"
            options={[
              { value: "private", label: "🔒 Riêng tư (Chỉ mình tôi)" },
              { value: "shared", label: "👥 Chia sẻ nhóm (Bạn bè xem/sửa cùng)" },
              { value: "public", label: "🌐 Công khai (Mọi người có thể copy)" },
            ]}
          />
        </div>

        {/* 6. Ghi chú tổng quan */}
        <div>
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Ghi chú hành trình</label>
          <Input.TextArea 
            placeholder="Nhập các lưu ý quan trọng chuẩn bị cho chuyến đi (Visa, hành lý, vé máy bay...)"
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            autoSize={{ minRows: 3, maxRows: 5 }}
            className="rounded-xl border-gray-200 shadow-sm p-3 text-xs font-medium"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isDesktop && (
        <Drawer
          title={<span className="font-bold text-lg text-gray-800">Lên lịch trình mới</span>}
          placement="right"
          width={440}
          onClose={onClose}
          open={open}
          styles={{ 
            body: { padding: "20px", backgroundColor: "#f9fafb" }, 
            header: { borderBottom: "1px solid #f3f4f6", padding: "16px", backgroundColor: "#fff" } 
          }}
          className="rounded-l-3xl"
          extra={
            <Button 
              type="primary" 
              onClick={handleFormSubmit} 
              className="bg-teal-600 hover:bg-teal-500 rounded-xl font-semibold h-10 shadow-sm"
            >
              Tạo chuyến đi
            </Button>
          }
        >
          {renderFormContent()}
        </Drawer>
      )}

      {!isDesktop && (
        <MobileBottomSheet
          open={open}
          onClose={onClose}
          title="Lên lịch trình mới"
          subtitle="Khởi tạo điểm đến và cấu hình thông tin tổng quan."
          defaultVh={80}
          maxVh={95}
        >
          <div className="p-5 space-y-5">
            {renderFormContent()}
            
            <div className="pt-2">
              <Button 
                type="primary" 
                onClick={handleFormSubmit} 
                className="w-full bg-teal-600 hover:bg-teal-500 rounded-xl h-11 font-bold text-sm shadow-md"
              >
                Tạo chuyến đi ngay
              </Button>
            </div>
          </div>
        </MobileBottomSheet>
      )}
    </>
  );
}