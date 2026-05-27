import Link from "next/link";
import { Button } from "antd";
import { 
  RocketOutlined, 
  HeartOutlined, 
  SafetyCertificateOutlined, 
  TeamOutlined 
} from "@ant-design/icons";

export default function AboutPage() {
  const coreValues = [
    {
      icon: <HeartOutlined className="text-2xl text-rose-500" />,
      title: "Đam mê xê dịch",
      description: "Chúng tôi hiểu cảm giác hào hứng trước mỗi chuyến đi và muốn làm cho trải nghiệm đó trở nên hoàn hảo nhất từ khâu chuẩn bị."
    },
    {
      icon: <TeamOutlined className="text-2xl text-blue-500" />,
      title: "Kết nối bạn bè",
      description: "Du lịch là để chia sẻ. Nền tảng được thiết kế tối ưu cho việc cộng tác nhóm, phân chia chi phí và lịch trình minh bạch."
    },
    {
      icon: <SafetyCertificateOutlined className="text-2xl text-emerald-500" />,
      title: "Tiện lợi & An toàn",
      description: "Tạm biệt những file Excel dễ mất mát. Mọi dữ liệu của bạn được lưu trữ an toàn trên đám mây, truy cập mọi lúc mọi nơi."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      {/* Hero Section of About Page */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Về <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-400">Tour Plan</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Được xây dựng bởi những người yêu du lịch, dành cho những người yêu du lịch. Sứ mệnh của chúng tôi là xóa bỏ sự phiền toái trong việc lên kế hoạch, để bạn dành trọn vẹn thời gian tận hưởng những vùng đất mới.
        </p>
      </section>

      {/* Core Values */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coreValues.map((value, index) => (
            <div key={index} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-500 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 text-center">
        <div className="bg-teal-900 rounded-3xl p-10 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-teal-800 blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-emerald-800 blur-3xl opacity-50"></div>
          
          <h2 className="relative z-10 text-3xl md:text-4xl font-bold text-white mb-6">
            Sẵn sàng cho chuyến đi tiếp theo?
          </h2>
          <p className="relative z-10 text-teal-100 mb-10 max-w-2xl mx-auto text-lg">
            Hàng ngàn người dùng đã tạo ra những kỷ niệm tuyệt vời cùng Tour Plan. Tham gia ngay hôm nay hoàn toàn miễn phí.
          </p>
          <Link href="/register" className="relative z-10 inline-block">
            <Button 
              type="primary" 
              size="large" 
              icon={<RocketOutlined />}
              className="h-14 px-8 text-lg rounded-2xl font-semibold bg-emerald-500 hover:bg-emerald-400 border-0 shadow-lg shadow-emerald-500/30 transition-all duration-300"
            >
              Bắt đầu hành trình
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}