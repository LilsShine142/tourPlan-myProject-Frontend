"use client";

import { useRef, useState, useEffect } from "react";
import { Modal, Carousel, Spin, message } from "antd";
import {
  DownloadOutlined,
  TeamOutlined,
  CalendarOutlined,
  CompassOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
// Thay html2canvas bằng html-to-image
import { toPng } from "html-to-image";

interface TripSummaryExportProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
}

export default function TripSummaryExport({ isOpen, onClose, groupId }: TripSummaryExportProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const hiddenContainerRef = useRef<HTMLDivElement>(null);

  const tripData = {
    name: "Đà Lạt Mộng Mơ",
    total: 2450000,
    members: 3,
    days: 3,
    categories: [
      { id: "cat-1", name: "Ăn uống", amount: 1100000, color: "bg-orange-400" },
      { id: "cat-2", name: "Di chuyển", amount: 735000, color: "bg-blue-500" },
      { id: "cat-3", name: "Lưu trú", amount: 615000, color: "bg-purple-500" },
    ],
    itinerary: [
      { 
        id: "day-1", date: "Ngày 1 (12/05)", 
        items: [{ id: "item-1-1", time: "10:00", name: "Thuê xe máy tại bến", price: 300000 }, { id: "item-1-2", time: "12:30", name: "Lẩu gà lá é Tao Ngộ", price: 450000 }] 
      },
      { 
        id: "day-2", date: "Ngày 2 (13/05)", 
        items: [{ id: "item-2-1", time: "09:00", name: "Vé cổng KDL Langbiang", price: 150000 }, { id: "item-2-2", time: "19:00", name: "Tiệc BBQ Đêm trong rừng", price: 800000 }] 
      },
      { 
        id: "day-3", date: "Ngày 3 (14/05)", 
        items: [{ id: "item-3-1", time: "08:00", name: "Cafe Tỏi Đen ngắm cảnh", price: 150000 }, { id: "item-3-2", time: "14:00", name: "Vé xe giường nằm về SG", price: 600000 }] 
      },
    ],
  };

  useEffect(() => {
    let isMounted = true;

    if (isOpen) {
      setLoading(true);
      setImages([]);

      const timer = setTimeout(async () => {
        if (!hiddenContainerRef.current) return;

        try {
          const pages = hiddenContainerRef.current.querySelectorAll(".export-page-template");
          const generatedImages: string[] = [];

          // Sử dụng html-to-image thay cho html2canvas
          for (let i = 0; i < pages.length; i++) {
            const page = pages[i] as HTMLElement;
            const dataUrl = await toPng(page, {
              pixelRatio: 2, // Đảm bảo độ nét ảnh
              cacheBust: true, // Tránh lỗi cache ảnh
            });
            generatedImages.push(dataUrl);
          }

          if (isMounted) {
            setImages(generatedImages);
          }
        } catch (error) {
          console.error("Lỗi tạo ảnh preview:", error);
          if (isMounted) messageApi.error("Không thể tạo ảnh xem trước!");
        } finally {
          if (isMounted) setLoading(false);
        }
      }, 600);

      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    }
  }, [isOpen, messageApi]);

  const downloadAllImages = () => {
    if (images.length === 0) return;

    images.forEach((imgUrl, idx) => {
      const link = document.createElement("a");
      link.download = `Trip_${tripData.name}_Page_${idx + 1}.png`;
      link.href = imgUrl;
      link.click();
    });
    messageApi.success(`Đã tải xuống trọn bộ ${images.length} ảnh!`);
    onClose();
  };

  return (
    <>
      {contextHolder}

      {isOpen && (
        <div className="fixed top-0 left-0 w-0 h-0 overflow-hidden z-[-9999] pointer-events-none">
          <div ref={hiddenContainerRef} className="flex flex-col gap-4">
            
            {/* TRANG 1 */}
            <div className="export-page-template relative w-[360px] h-[640px] bg-gradient-to-br from-teal-500 via-emerald-600 to-teal-800 p-6 flex flex-col justify-between font-sans">
              <div>
                <div className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                  <CompassOutlined /> Trip App Vietnam
                </div>
                <h2 className="text-2xl font-black text-white leading-tight mb-4">
                  {tripData.name}
                </h2>

                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 mb-4 border border-white/20 shadow-sm">
                  <p className="text-white/70 text-[10px] font-bold uppercase mb-1">
                    Tổng chi phí chuyến đi
                  </p>
                  <p className="text-3xl font-black text-white tracking-tight">
                    {tripData.total.toLocaleString()} đ
                  </p>
                  <div className="flex gap-4 mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-1.5 text-xs text-white font-medium">
                      <TeamOutlined /> {tripData.members} thành viên
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-white font-medium">
                      <CalendarOutlined /> {tripData.days} ngày hành trình
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-md">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-3">
                    Khoản chi lớn nhất
                  </p>
                  <div className="space-y-3.5">
                    {/* FIX KEY REACT: Sửa index thành id độc nhất */}
                    {tripData.categories.map((cat) => (
                      <div key={cat.id}>
                        <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                          <span>{cat.name}</span>
                          <span>{cat.amount.toLocaleString()}đ</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${cat.color}`}
                            style={{ width: `${(cat.amount / tripData.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-center text-[10px] text-white/50 font-bold uppercase tracking-widest">
                Trang 1 / {tripData.itinerary.length + 1}
              </div>
            </div>

            {/* CÁC TRANG LỊCH TRÌNH */}
            {/* FIX KEY REACT: Sửa index thành id độc nhất */}
            {tripData.itinerary.map((day, index) => (
              <div
                key={day.id}
                className="export-page-template relative w-[360px] h-[640px] bg-[#FCFDFE] p-6 flex flex-col justify-between font-sans border border-gray-100"
              >
                <div>
                  <div className="text-teal-600 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                    <CompassOutlined /> {tripData.name}
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 mb-6 border-b-2 border-teal-500 pb-2 inline-block">
                    {day.date}
                  </h2>

                  <div className="space-y-5">
                    {/* FIX KEY REACT: Sửa index thành id độc nhất */}
                    {day.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-teal-500 mt-1 shadow-sm shadow-teal-500/40"></div>
                          <div className="w-0.5 h-12 bg-gray-200 mt-1"></div>
                        </div>
                        <div className="flex-1">
                          <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                            {item.time}
                          </span>
                          <p className="font-bold text-gray-800 text-sm mt-1 leading-tight">
                            {item.name}
                          </p>
                          <p className="text-xs font-black text-gray-400 mt-0.5">
                            {item.price.toLocaleString()} đ
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Trang {index + 2} / {tripData.itinerary.length + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL VIEW */}
      <Modal
        open={isOpen}
        onCancel={onClose}
        footer={null}
        centered
        width={350}
        styles={{ body: { padding: 0, background: "transparent", boxShadow: "none" } }}
        closeIcon={
          <div className="bg-black/40 backdrop-blur-md p-2 rounded-full w-8 h-8 flex items-center justify-center mt-2 mr-[-10px] text-white hover:bg-black/60 transition-colors">
            ✕
          </div>
        }
      >
        <div className="flex flex-col items-center">
          <div className="text-center text-white mb-3">
            <h3 className="text-base font-black tracking-wide">Xem trước ảnh tổng kết</h3>
            <p className="text-xs opacity-75">Vuốt ngang để xem các trang ảnh thật</p>
          </div>

          <div className="w-[300px] h-[533px] bg-white/5 backdrop-blur-lg rounded-[32px] overflow-hidden shadow-2xl flex items-center justify-center border border-white/10">
            {loading ? (
              <div className="text-center text-white">
                <Spin indicator={<LoadingOutlined style={{ fontSize: 32, color: "#fff" }} spin />} />
                <p className="text-xs font-bold mt-3 opacity-80">Đang khởi tạo ảnh preview...</p>
              </div>
            ) : (
              <Carousel dotPlacement="bottom" className="w-[300px] h-[533px] rounded-[32px]">
                {images.map((imgSrc, idx) => (
                  <div key={`preview-img-${idx}`} className="w-[300px] h-[533px] outline-none">
                    <img
                      src={imgSrc}
                      alt={`Page ${idx + 1}`}
                      className="w-full h-full object-cover select-none pointer-events-none rounded-[32px]"
                    />
                  </div>
                ))}
              </Carousel>
            )}
          </div>

          <button
            onClick={downloadAllImages}
            disabled={loading}
            className="mt-5 w-[300px] h-14 rounded-2xl bg-teal-600 hover:bg-teal-500 active:scale-[0.98] transition-all text-white font-bold text-base shadow-xl shadow-teal-600/30 flex items-center justify-center gap-2 disabled:bg-gray-500 disabled:text-gray-300 disabled:shadow-none"
          >
            <DownloadOutlined /> Lưu trọn bộ ({images.length})
          </button>
        </div>
      </Modal>
    </>
  );
}