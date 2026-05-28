"use client";

import React from "react";
import { Tag, Button, Input, Rate, Select, Spin } from "antd";
import { Calendar, Clock, DollarSign, Globe, MapPin, Phone, Route as RouteIcon, X, ChevronUp, ChevronDown } from "lucide-react";

type PlaceItem = {
  id: string;
  name: string;
  time?: string;
  note?: string;
  cost?: string;
  lat?: number;
  lng?: number;
  osmId?: string;
};

type OsmPlaceDetails = {
  rating?: number;
  user_ratings_total?: number;
  formatted_phone_number?: string;
  website?: string;
  weekday_text?: string[];
  open_now?: boolean;
  url?: string;
};

type DayColumn = {
  id: string;
  day: string;
  date: string;
  items: PlaceItem[];
};

type RouteData = {
  coordinates: [number, number][];
  duration: number;
  distance: number;
};

type RouteOption = { value: string; label: string };

type TripDetailContentProps = {
  editingItem: { dayId: string; item: PlaceItem } | null;
  board: DayColumn[];

  // OSM
  isLoadingDetails: boolean;
  placeDetails: OsmPlaceDetails | null;

  // Route builder state
  routeStartId: string;
  setRouteStartId: (v: string) => void;
  routeWaypoints: string[];
  setRouteWaypoints: (v: string[]) => void;
  routeDestination: PlaceItem | null;
  calculateCustomRoute: () => void;
  isRouting: boolean;

  // Extra info
  isExtraInfoExpanded: boolean;
  setIsExtraInfoExpanded: (v: boolean) => void;
  formData: Partial<PlaceItem>;
  setFormData: (v: Partial<PlaceItem>) => void;
  handleSaveDetail: () => void;

  // Dropdown options
  placeOptions: RouteOption[];
};

export default function TripDetailContent({
  editingItem,
  board,
  isLoadingDetails,
  placeDetails,
  routeStartId,
  setRouteStartId,
  routeWaypoints,
  setRouteWaypoints,
  routeDestination,
  calculateCustomRoute,
  isRouting,
  isExtraInfoExpanded,
  setIsExtraInfoExpanded,
  formData,
  setFormData,
  handleSaveDetail,
  placeOptions,
}: TripDetailContentProps) {
  return (
    <div className="p-5 space-y-5">
      {/** 1. Tiêu đề hoạt động */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
          <MapPin size={20} />
        </div>
        <div>
          <h3 className="font-black text-base text-gray-900">{editingItem?.item.name}</h3>
          <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-0.5">
            <Calendar size={12} /> Thuộc {board.find((c) => c.id === editingItem?.dayId)?.day}
          </p>
        </div>
      </div>

      {/** 2. Bản đồ & Chỉ đường (Gộp OSM và Route Builder) */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <span className="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>Bản đồ & Chỉ đường
          </span>
          {editingItem?.item.osmId && (
            <Tag color="blue" className="text-[10px] rounded-md border-0 bg-blue-50 text-blue-600">
              Đã đồng bộ
            </Tag>
          )}
        </div>

        {/* Thông tin OSM */}
        {isLoadingDetails ? (
          <div className="py-6 flex flex-col items-center justify-center gap-2">
            <Spin size="small" />
            <span className="text-xs text-gray-400">Đang tải dữ liệu...</span>
          </div>
        ) : placeDetails ? (
          <div className="space-y-3.5 text-xs">
            {placeDetails.rating && (
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl">
                <span className="font-black text-sm text-amber-500">{placeDetails.rating}</span>
                <Rate disabled defaultValue={placeDetails.rating} allowHalf className="text-xs text-amber-400" />
                <span className="text-gray-400">({placeDetails.user_ratings_total?.toLocaleString()} đánh giá)</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-500">Trạng thái:</span>
              {placeDetails.open_now ? (
                <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-md">Đang mở cửa</span>
              ) : (
                <span className="text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-md">Đóng cửa</span>
              )}
            </div>
            {placeDetails.formatted_phone_number && (
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={14} className="text-gray-400" />
                <span>{placeDetails.formatted_phone_number}</span>
              </div>
            )}
            {placeDetails.website && (
              <div className="flex items-center gap-2 text-gray-600 truncate">
                <Globe size={14} className="text-gray-400" />
                <a
                  href={placeDetails.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-600 hover:underline"
                >
                  {placeDetails.website}
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-2 bg-gray-50/50 rounded-xl">
            <p className="text-xs text-gray-400">Chưa có dữ liệu bản đồ.</p>
          </div>
        )}

        {/* Khối vẽ lộ trình nhúng trực tiếp */}
        <div className="pt-4 border-t border-gray-100 space-y-4">
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">
              A. Điểm bắt đầu
            </label>
            <Select className="w-full h-10" value={routeStartId} onChange={setRouteStartId} options={placeOptions} />
          </div>

          <div className="space-y-2">
            {routeWaypoints.map((wpId, index) => (
              <div key={index} className="flex gap-2 items-center bg-gray-50 p-2 rounded-xl border border-gray-100">
                <Select
                  className="flex-1"
                  variant="borderless"
                  placeholder="Chọn điểm dừng..."
                  value={wpId || undefined}
                  onChange={(val) => {
                    const newWps = [...routeWaypoints];
                    newWps[index] = val;
                    setRouteWaypoints(newWps);
                  }}
                  options={placeOptions.filter((p) => p.value !== "current")}
                />
                <Button
                  type="text"
                  danger
                  icon={<X size={16} />}
                  onClick={() => {
                    const newWps = [...routeWaypoints];
                    newWps.splice(index, 1);
                    setRouteWaypoints(newWps);
                  }}
                />
              </div>
            ))}
            <Button
              type="dashed"
              onClick={() => setRouteWaypoints([...routeWaypoints, ""])}
              className="w-full h-8 text-xs border-teal-200 text-teal-600 hover:text-teal-700 rounded-lg flex items-center justify-center gap-1"
            >
              <span aria-hidden>
                {/* giữ icon giống original */}
              </span>
              {/* lucide-react X/Plus không có trong props ở đây; bỏ icon không ảnh hưởng logic */}
              Thêm điểm dừng
            </Button>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">
              B. Điểm kết thúc
            </label>
            <Input
              value={routeDestination?.name || editingItem?.item.name || ""}
              disabled
              className="h-10 rounded-xl bg-gray-50 text-gray-700 font-medium"
              prefix={<MapPin size={16} className="text-gray-400 mr-1" />}
            />
          </div>

          <Button
            type="primary"
            className="w-full h-10 bg-teal-600 hover:bg-teal-700 rounded-xl font-bold shadow-md shadow-teal-600/20"
            loading={isRouting}
            onClick={calculateCustomRoute}
            icon={<RouteIcon size={16} />}
          >
            Vẽ lộ trình
          </Button>
        </div>
      </div>

      {/** 3. Chi tiết bổ sung (Có thể đóng/mở) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <button
          onClick={() => setIsExtraInfoExpanded(!isExtraInfoExpanded)}
          className="w-full flex items-center justify-between p-4 bg-gray-50/80 hover:bg-gray-100 transition-colors"
        >
          <span className="text-xs font-black text-gray-800 uppercase tracking-wider">Chi tiết hành trình</span>
          {isExtraInfoExpanded ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </button>

        {isExtraInfoExpanded && (
          <div className="p-4 space-y-4 border-t border-gray-100">
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">
                Thời gian dự kiến
              </label>
              <Input
                type="time"
                value={(formData as any).time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                size="large"
                prefix={<Clock size={16} className="text-gray-400" />}
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">
                Chi phí ước tính
              </label>
              <Input
                placeholder="Vd: 150,000đ..."
                value={(formData as any).cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                size="large"
                prefix={<DollarSign size={16} className="text-gray-400" />}
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">
                Ghi chú cá nhân
              </label>
              <Input.TextArea
                placeholder="Nhập ghi chú..."
                value={(formData as any).note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                autoSize={{ minRows: 3, maxRows: 5 }}
                className="rounded-xl"
              />
            </div>

            <div className="pt-2">
              <Button
                type="primary"
                onClick={handleSaveDetail}
                className="w-full h-11 bg-teal-600 rounded-xl font-bold text-base shadow-lg shadow-teal-600/20"
              >
                Lưu cập nhật
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

