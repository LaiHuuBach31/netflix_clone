import React from 'react'
import RoleTable from '../components/role/RoleTable';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { Header } from 'antd/es/layout/layout';
import { motion } from 'framer-motion';
import StatCard from '../components/common/StatCard';
import { BookOutlined } from '@ant-design/icons';

const RolePage:React.FC = () => {

	const {response} = useSelector((state:RootState) => state.role);
	
	const totalRoles = response?.total ?? 0;
	
	return (
		<div className='flex-1 relative z-10 overflow-auto'>
				<Header title={"Roles"} />

				<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
					<motion.div
						className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1 }}
					>
						<StatCard name='Total Role' icon={BookOutlined} value={totalRoles.toString()} color='#6366F1' />

					</motion.div>

					<RoleTable />

				</main>

			</div>
	)
}

export default RolePage