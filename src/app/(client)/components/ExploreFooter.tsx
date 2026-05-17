import { 
  UserOutlined,
  VerifiedOutlined,
} from "@ant-design/icons";

interface ExploreFooterProps {
  feed: any; // Thay 'any' bằng kiểu dữ liệu thực tế của feed nếu có
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export default function ExploreFooter({ feed }: ExploreFooterProps) {
    return (
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
            <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-50">
                      {feed.trip.members[0]?.avatarUrl ? (
                        <img src={feed.trip.members[0].avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <UserOutlined className="text-gray-400 mt-2 ml-3" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-medium">
                        {feed.publisherType === 'business' ? 'Tổ chức bởi' : 'Chia sẻ bởi'}
                      </div>
                      <div className={`text-sm font-bold truncate max-w-[120px] ${feed.publisherType === 'business' ? 'text-blue-600' : 'text-gray-700'}`}>
                        {feed.trip.members[0]?.displayName}
                        {feed.publisherType === 'business' && <VerifiedOutlined className="ml-1 text-blue-500" />}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {feed.publisherType === 'business' ? (
                      <>
                        <div className="text-xs text-gray-400 font-medium">Giá trọn gói từ</div>
                        <div className="text-lg font-bold text-teal-600">{formatPrice(feed.price!)}</div>
                      </>
                    ) : feed.price ? (
                      <>
                        <div className="text-xs text-gray-400 font-medium">Chi phí ước tính</div>
                        <div className="text-base font-bold text-gray-700">{formatPrice(feed.price)}</div>
                      </>
                    ) : (
                      <div className="text-sm font-bold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-lg">
                        Miễn phí
                      </div>
                    )}
                  </div>         
        </div>
    );
}
        