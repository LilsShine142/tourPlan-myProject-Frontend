import React from "react";
import { EnvironmentOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Tag } from "antd";

interface PlaceItem {
  id: string;
  name: string;
  time?: string;
  note?: string;
  cost?: string;
}

interface LocationCardProps {
  loc: PlaceItem;
}

const LocationCard: React.FC<LocationCardProps> = ({ loc }) => (
  <div key={loc.id} className="flex items-start gap-3 bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 transition-all hover:shadow-md">
    <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-lg shrink-0 mt-0.5">
      <EnvironmentOutlined />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="font-semibold text-gray-900 truncate">{loc.name}</span>
        <Tag
          color="cyan"
          className="rounded-full text-[10px] cursor-pointer shrink-0 m-0"
          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name)}`, "_blank")}
        >
          Bản đồ ↗
        </Tag>
      </div>
      {loc.note && <p className="text-xs text-gray-500 truncate">{loc.note}</p>}
      {loc.time && (
        <div className="mt-2.5 inline-flex items-center gap-1.5 bg-teal-50/50 text-teal-600 rounded-full px-2.5 py-1 text-[11px] font-medium border border-teal-600/10">
          <ClockCircleOutlined />
          {loc.time}
        </div>
      )}
    </div>
  </div>
);

export default LocationCard;
