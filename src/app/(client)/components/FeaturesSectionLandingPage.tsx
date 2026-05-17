import { 
    TeamOutlined,
    WalletOutlined,
    EnvironmentOutlined
} from "@ant-design/icons";

export default function FeaturesSectionLandingPage() {  

      const features = [
    {
      icon: <EnvironmentOutlined className="text-3xl text-teal-600" />,
      title: "Lịch trình thông minh",
      desc: "Tự động sắp xếp các điểm đến tối ưu thời gian di chuyển nhờ tích hợp bản đồ thông minh."
    },
    {
      icon: <WalletOutlined className="text-3xl text-teal-600" />,
      title: "Quản lý ngân sách",
      desc: "Ghi chép chi phí, dự toán ngân sách và chia tiền nhóm tự động với nhiều loại tiền tệ."
    },
    {
      icon: <TeamOutlined className="text-3xl text-teal-600" />,
      title: "Cộng tác thời gian thực",
      desc: "Mời bạn bè cùng tham gia chỉnh sửa lịch trình, chia sẻ ý tưởng cho chuyến đi dễ dàng."
    }
    ];
    
    return (
        <section className="w-full bg-white py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Mọi thứ bạn cần cho một chuyến đi
                    </h2>
                    <p className="text-lg text-gray-500">
                    Công cụ mạnh mẽ nhưng cực kỳ dễ sử dụng, giúp bạn tiết kiệm hàng giờ đồng hồ tìm kiếm và sắp xếp.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                    <div 
                        key={index} 
                        className="bg-gray-50 rounded-3xl p-8 hover:bg-teal-50/50 transition-colors duration-300 border border-transparent hover:border-teal-100"
                    >
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                        {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                        <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                    </div>
                    ))}
                </div>    
            </div>
        </section>
    )
}