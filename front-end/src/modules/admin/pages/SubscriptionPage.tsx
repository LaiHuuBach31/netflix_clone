import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import Header from '../components/common/Header';
import StatCard from '../components/common/StatCard';
import { SolutionOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import SubscriptionTable from '../components/subscription/SubscriptionTable';

const SubscriptionPage:React.FC = () => {

  const { response } = useSelector((state: RootState) => state.subscription);
  const totalSubscriptions = response?.total ?? 0;

  return (
    <div className='flex-1 relative z-10 overflow-auto'>
      <Header title={"Subscription"} />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <motion.div
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name='Total Plans' icon={SolutionOutlined} value={totalSubscriptions} color='#6366F1' />

        </motion.div>

        <SubscriptionTable />

      </main>

    </div>


  )
}

export default SubscriptionPage