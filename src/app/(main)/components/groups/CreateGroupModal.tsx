// src/app/(main)/groups/components/CreateGroupModal.tsx
"use client";

import { useState } from "react";
import { Modal, Input, Button, message, Upload } from "antd";
import { CameraOutlined, TeamOutlined, AlignLeftOutlined } from "@ant-design/icons";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (groupData: any) => void;
}

export default function CreateGroupModal({ isOpen, onClose, onCreate }: CreateGroupModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) {
      message.error("Vui lòng nhập tên nhóm!");
      return;
    }

    setIsLoading(true);

    // Giả lập API call mất 0.5s
    setTimeout(() => {
      const newGroup = {
        id: `group-${Date.now()}`,
        name,
        description,
        memberCount: 1, // Mặc định người tạo là thành viên đầu tiên
        coverUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop", // Ảnh mặc định
        createdAt: new Date().toISOString(),
      };

      onCreate(newGroup);
      message.success("Tạo nhóm thành công!");
      
      // Reset form
      setName("");
      setDescription("");
      setIsLoading(false);
      onClose();
    }, 500);
  };

  return (
    <Modal
      title={<span className="font-bold text-lg text-gray-800">Tạo nhóm du lịch mới</span>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      className="md:min-w-[450px]"
      styles={{
        body: { borderRadius: "20px", padding: "24px" },
        header: { marginBottom: "20px" }
      }}
    >
      <div className="space-y-5">
        {/* Khu vực tải ảnh bìa (Mock UI) */}
        <div className="flex justify-center">
          <Upload showUploadList={false} action="/mock-upload">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all group">
              <CameraOutlined className="text-2xl text-gray-400 group-hover:text-teal-600 mb-1" />
              <span className="text-[10px] font-semibold text-gray-400 group-hover:text-teal-600">Thêm ảnh</span>
            </div>
          </Upload>
        </div>

        {/* Input Tên nhóm */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1.5 block">
            Tên nhóm <span className="text-red-500">*</span>
          </label>
          <Input
            size="large"
            placeholder="VD: Hội chị em phá đảo Đà Lạt..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            prefix={<TeamOutlined className="text-gray-400 mr-2" />}
            className="rounded-xl border-gray-200 shadow-sm"
          />
        </div>

        {/* Input Mô tả */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1.5 block">
            Mô tả ngắn
          </label>
          <Input.TextArea
            placeholder="Nhóm này được tạo ra để..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoSize={{ minRows: 3, maxRows: 5 }}
            className="rounded-xl border-gray-200 shadow-sm p-3"
          />
        </div>

        {/* Nút Submit */}
        <div className="pt-4 flex justify-end gap-3">
          <Button 
            size="large" 
            onClick={onClose} 
            className="rounded-xl font-semibold border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Hủy
          </Button>
          <Button 
            type="primary" 
            size="large" 
            loading={isLoading}
            onClick={handleSubmit} 
            className="rounded-xl font-semibold bg-teal-600 hover:bg-teal-700 shadow-md"
          >
            Tạo nhóm ngay
          </Button>
        </div>
      </div>
    </Modal>
  );
}