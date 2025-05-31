import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import Header from '../components/common/Header';
import { motion } from 'framer-motion';
import StatCard from '../components/common/StatCard';
import { StarOutlined } from '@ant-design/icons';
import RatingTable from '../components/rating/RatingTable';

const RatingPage:React.FC = () => {

  const { response } = useSelector((state: RootState) => state.rating);
  const totalPlans = response?.total ?? 0;

  return (
    <div className='flex-1 relative z-10 overflow-auto'>
      <Header title={"Ratings"} />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <motion.div
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name='Total Rating' icon={StarOutlined} value={totalPlans} color='#6366F1' />

        </motion.div>

        <RatingTable />

      </main>

    </div>


  )
}

export default RatingPage