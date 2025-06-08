import { Footer } from 'antd/es/layout/layout';
import React from 'react';
import './footerBar.css';

const FooterBar: React.FC = () => {
  return (
    <div className="px-[150px] py-8">
      <Footer className="bg-[#232323] py-8 footer">
        <p className="mb-6 underline font-medium text-[gray]">
          Have a question? Contact us.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            ["FAQ", "Investor Relations", "Privacy", "Speed Test"],
            ["Help Center", "Jobs", "Cookie Preferences", "Legal Notices"],
            ["Account", "Ways to Watch", "Corporate Information", "Only on Netflix"],
            ["Media Center", "Terms of Use", "Contact Us"],
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
