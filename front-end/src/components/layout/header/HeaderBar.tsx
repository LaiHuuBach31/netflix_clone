import React, { useRef, useState, useEffect } from 'react';
import { Avatar, Badge, Button, Dropdown, MenuProps, Space } from 'antd';
import { BellOutlined, SearchOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { Header } from 'antd/es/layout/layout';
import { Link } from 'react-router-dom';

const items: MenuProps['items'] = [
  { key: '1', label: 'My Account', disabled: true },
  { type: 'divider' },
  { key: '2', label: <Link to="/profile">Profile</Link>, extra: '⌘P' },
  { key: '3', label: 'Billing', extra: '⌘B' },
  { key: '4', label: 'Settings', icon: <SettingOutlined />, extra: '⌘S' },
];

const HeaderBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  return (
    <Header className="flex items-center justify-between px-15 bg-[#242424f7]">
      <div className="flex items-center gap-5">
        <Link to={''}>
          <img
            className="w-[100px]"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1200px-Netflix_2015_logo.svg.png"
            alt="Logo"
          />
        </Link>
     
        <ul className="flex gap-5 list-none text-red-600">
          <li><Link to={''} className="font-medium hover:text-gray-300">Home</Link> <a ></a></li>
          <li><Link to={'/tv-show'} className="font-medium hover:text-gray-300">TV Shows</Link> <a ></a></li>
          <li><Link to={'/movies'} className="font-medium hover:text-gray-300">Movies</Link> <a ></a></li>
          <li><Link to={'/recently-added'} className="font-medium hover:text-gray-300">Recently Added</Link> <a ></a></li>
          <li><Link to={'/favourite'} className="font-medium hover:text-gray-300">My List</Link> <a ></a></li>
        </ul>
      </div>

      <div className="flex items-center">
        <div className="flex items-center overflow-hidden transition-all duration-600">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            className={`bg-transparent border-b border-gray-400 text-white outline-none px-2 transition-all duration-500 ${isOpen ? 'w-52 opacity-100' : 'w-0 opacity-0'}`}
            onBlur={() => setIsOpen(false)}
          />
          <SearchOutlined className="text-red-600 text-xl cursor-pointer ml-2" onClick={() => setIsOpen(true)} />
        </div>

        <BellOutlined className="text-red-600 text-xl px-8" />

        <Space size={24}>
          <Badge count={1}>
            <Avatar shape="square" icon={<UserOutlined />} />
          </Badge>
          <Dropdown menu={{ items }} className="px-3">
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <Badge dot>
                  <Avatar shape="square" src="https://media.vov.vn/sites/default/files/styles/large/public/2025-02/liverpool-2.jpg" />
                </Badge>
              </Space>
            </a>
          </Dropdown>
        </Space>

        <Link to="/login">
          <Button className="bt-login font-medium" shape="round">
            Đăng nhập
          </Button>
        </Link>

      </div>
    </Header>
  );
};

export default HeaderBar;
