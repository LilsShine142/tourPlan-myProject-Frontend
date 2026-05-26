import { MOCK_TRIPS } from '@/lib/mockData';
import { ManOutlined, DollarOutlined, TeamOutlined, SettingOutlined } from '@ant-design/icons';
import { useParams, useRouter } from 'next/navigation';

const renderGridMenu = () => {
      const params = useParams();
      const router = useRouter();
      const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined;
      const trip = MOCK_TRIPS.find(t => t.id === id);
        const menuItems = [
          {
            title: "Xếp lịch",
            icon: <ManOutlined className="text-lg" />,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "hover:border-blue-200",
            onClick: () => router.push(`/trips/${trip?.id}/itinerary`), // Link tới trang Kéo thả
          },
          {
            title: "Chi tiêu",
            icon: <DollarOutlined className="text-lg" />,
            color: "text-rose-600",
            bg: "bg-rose-50",
            border: "hover:border-rose-200",
            onClick: () => router.push(`/trips/${trip?.id}/expenses`),
          },
          {
            title: "Nhóm",
            icon: <TeamOutlined className="text-lg" />,
            color: "text-purple-600",
            bg: "bg-purple-50",
            border: "hover:border-purple-200",
            onClick: () => router.push(`/trips/${trip?.id}/members`),
          },
          {
            title: "Cài đặt",
            icon: <SettingOutlined className="text-lg" />,
            color: "text-gray-600",
            bg: "bg-gray-100",
            border: "hover:border-gray-300",
           onClick: () => router.push(`/trips/${trip?.id}/settings`),
          }
        ];
    
        return (
          <div className="grid grid-cols-4 gap-2.5 mb-4">
            {menuItems.map((item, index) => (
              <div 
                key={index}
                onClick={item.onClick}
                className={`bg-white p-2 rounded-2xl border border-gray-100 shadow-sm ${item.border} active:scale-95 transition-all cursor-pointer flex flex-col items-center text-center group`}
              >
                <div className={`w-10 h-10 rounded-full ${item.bg} ${item.color} flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h4 className="font-bold text-gray-700 text-[11px] leading-tight">{item.title}</h4>
              </div>
            ))}
          </div>
        );
};
    
export default renderGridMenu;