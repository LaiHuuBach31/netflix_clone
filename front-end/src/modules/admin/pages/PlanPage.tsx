import React from 'react'
import { motion } from "framer-motion";

import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import Header from '../components/common/Header';
import StatCard from '../components/common/StatCard';
import PlanTable from '../components/plan/PlanTable';
import { ContainerOutlined } from '@ant-design/icons';

const PlanPage:React.FC = () => {

  const { response } = useSelector((state: RootState) => state.plan);
  const totalPlans = response?.total ?? 0;

  return (
    <div className='flex-1 relative z-10 overflow-auto'>
      <Header title={"Plans"} />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <motion.div
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name='Total Plans' icon={ContainerOutlined} value={totalPlans} color='#6366F1' />

        </motion.div>

        <PlanTable />

      </main>

    </div>


  )
}

export default PlanPage