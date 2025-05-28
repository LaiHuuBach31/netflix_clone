import React from 'react'
import { motion } from "framer-motion";

import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import Header from '../components/common/Header';
import StatCard from '../components/common/StatCard';
import { FileImageOutlined } from '@ant-design/icons';
import BannerTable from '../components/banner/BannerTable';

const BannerPage:React.FC = () => {

  const { response } = useSelector((state: RootState) => state.banner);
  const totalBanners = response?.total ?? 0;

  return (
    <div className='flex-1 relative z-10 overflow-auto'>
      <Header title={"Banners"} />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <motion.div
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name='Total Banners' icon={FileImageOutlined} value={totalBanners} color='#6366F1' />

        </motion.div>

        <BannerTable />

      </main>

    </div>


  )
}

export default BannerPage