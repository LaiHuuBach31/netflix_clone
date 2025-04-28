import { Footer } from 'antd/es/layout/layout';
import React from 'react';
import './footerBar.css';

const FooterBar: React.FC = () => {
  return (
    <div className="px-[150px] py-8">
      <Footer className="bg-[#232323] py-8 footer">
        <p className="mb-6 underline font-medium text-[gray]">
          Bạn có câu hỏi? Liên hệ với chúng tôi.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            ["Câu hỏi thường gặp", "Quan hệ với nhà đầu tư", "Quyền riêng tư", "Kiểm tra tốc độ"],
            ["Trung tâm trợ giúp", "Việc làm", "Tùy chọn cookie", "Thông báo pháp lý"],
            ["Tài khoản", "Các cách xem", "Thông tin doanh nghiệp", "Chỉ có trên Netflix"],
            ["Trung tâm đa phương tiện", "Điều khoản sử dụng", "Liên hệ với chúng tôi"],
          ].map((col, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              {col.map((link, i) => <a key={i} href="#">{link}</a>)}
            </div>
          ))}
        </div>
      </Footer>
    </div>
  );
};

export default FooterBar;
