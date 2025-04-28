import React from 'react';
import { Layout, theme } from 'antd';
import { Outlet } from 'react-router';

import HeaderBar from '../components/layout/header/HeaderBar';
import FooterBar from '../components/layout/footer/FooterBar';


const { Content } = Layout;

const UserLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className="min-h-screen flex flex-col bg-[#242424f7]">
      <HeaderBar />
      <Content style={{ flex: 1, padding: '0 48px' }}>
        <Outlet />
      </Content>
      <FooterBar />
    </Layout>
  );
};

export default UserLayout;
