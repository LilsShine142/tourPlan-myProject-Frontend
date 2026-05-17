import { Input, Button, Slider, Select, Radio } from "antd";
import { 
  SearchOutlined, 
  EnvironmentOutlined, 
  FilterOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CloseOutlined
} from "@ant-design/icons";

interface HeaderFilterExplorePageProps {
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  CATEGORIES: string[]; 
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// Use the interface for the function props
export default function HeaderFilterExplorePage({
  showFilters,
  setShowFilters,
  priceRange,
  setPriceRange,
  CATEGORIES,
}: HeaderFilterExplorePageProps) {
  return (
      <section className="bg-white border-b border-gray-100 pt-12 pb-8 px-4 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Khám phá <span className="text-teal-600">bảng tin hành trình</span>
          </h1>
          <p className="text-gray-500 mb-8 max-w-2xl text-lg">
            Tìm cảm hứng từ cộng đồng hoặc đặt ngay các tour độc quyền từ những công ty lữ hành uy tín.
          </p>

          {/* Thanh tìm kiếm & Nút mở bộ lọc */}
          <div className="w-full max-w-3xl mb-6 flex gap-3">
            <Input
              size="large"
              placeholder="Tìm kiếm điểm đến, tên chuyến đi..."
              prefix={<SearchOutlined className="text-gray-400 text-lg mr-2" />}
              className="rounded-2xl py-3 shadow-sm hover:border-teal-400 focus:border-teal-500 text-base flex-1"
            />
            <Button 
              size="large"
              type={showFilters ? "primary" : "default"}
              icon={showFilters ? <CloseOutlined /> : <FilterOutlined />}
              onClick={() => setShowFilters(!showFilters)}
              className={`rounded-2xl h-auto px-6 font-medium shadow-sm transition-all duration-300 ${
                showFilters ? "bg-teal-600 hover:bg-teal-500 border-0" : "text-gray-600 border-gray-200 hover:border-teal-600 hover:text-teal-600"
              }`}
            >
              <span className="hidden sm:inline">{showFilters ? "Đóng bộ lọc" : "Lọc nâng cao"}</span>
            </Button>
          </div>

          {/* KHU VỰC BỘ LỌC NÂNG CAO (Collapse Animation) */}
          <div 
            className={`w-full max-w-3xl transition-all duration-500 ease-in-out overflow-hidden ${
              showFilters ? "max-h-[500px] opacity-100 mb-8" : "max-h-0 opacity-0 mb-0"
            }`}
          >
            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 text-left grid grid-cols-1 md:grid-cols-2 gap-6 shadow-inner">
              
              {/* Lọc theo Khu vực */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <EnvironmentOutlined className="text-teal-600" /> Khu vực
                </label>
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Chọn khu vực..."
                  className="w-full custom-select"
                  size="large"
                  options={[
                    { value: 'north', label: 'Miền Bắc' },
                    { value: 'central', label: 'Miền Trung' },
                    { value: 'south', label: 'Miền Nam' },
                    { value: 'international', label: 'Nước ngoài' },
                  ]}
                />
              </div>

              {/* Lọc theo Thời lượng */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <ClockCircleOutlined className="text-teal-600" /> Thời gian đi
                </label>
                <Select
                  placeholder="Tất cả thời gian"
                  className="w-full"
                  size="large"
                  options={[
                    { value: 'all', label: 'Tất cả' },
                    { value: '1-3', label: '1 - 3 Ngày (Ngắn ngày)' },
                    { value: '4-7', label: '4 - 7 Ngày (Vừa phải)' },
                    { value: '8+', label: 'Trên 7 Ngày (Dài ngày)' },
                  ]}
                />
              </div>

              {/* Lọc theo Loại hình (Chi phí) */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <DollarOutlined className="text-teal-600" /> Loại hình & Chi phí
                </label>
                <Radio.Group defaultValue="all" className="w-full flex flex-wrap gap-3">
                  <Radio.Button value="all" className="rounded-xl">Tất cả</Radio.Button>
                  <Radio.Button value="free" className="rounded-xl">Tham khảo (Cộng đồng)</Radio.Button>
                  <Radio.Button value="paid" className="rounded-xl">Tour thương mại (Mua ngay)</Radio.Button>
                </Radio.Group>
              </div>

              {/* Slider Khoảng giá */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-1 flex items-center justify-between">
                  <span>Khoảng giá</span>
                  <span className="text-teal-600">{formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</span>
                </label>
                <Slider 
                  range 
                  step={500000} 
                  max={20000000} 
                  defaultValue={[0, 10000000]}
                  onChange={(val) => setPriceRange(val as [number, number])}
                  tooltip={{ formatter: (val) => formatPrice(val || 0) }}
                  className="mt-4"
                />
              </div>

              {/* Nút Áp dụng */}
              <div className="md:col-span-2 flex justify-end gap-3 mt-2 pt-4 border-t border-gray-200">
                <Button size="large" className="rounded-xl" onClick={() => setShowFilters(false)}>
                  Hủy
                </Button>
                <Button type="primary" size="large" className="rounded-xl bg-teal-600 hover:bg-teal-500 border-0">
                  Áp dụng bộ lọc
                </Button>
              </div>
            </div>
          </div>

          {/* Tags danh mục (Chỉ hiện khi đóng bộ lọc để đỡ rối) */}
          {!showFilters && (
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl transition-all duration-300">
              {CATEGORIES.map((cat, index) => (
                <button
                  key={index}
                  className={`px-5 py-2 rounded-xl font-medium transition-all duration-300 border ${
                    index === 0 
                      ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-500/20" 
                      : "bg-white text-gray-600 border-gray-200 hover:border-teal-600 hover:text-teal-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
        </section>
    );
}