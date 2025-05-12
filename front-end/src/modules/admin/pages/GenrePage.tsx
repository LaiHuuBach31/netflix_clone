import React, { useState } from 'react'
import { motion } from "framer-motion";
import Header from '../components/common/Header'
import StatCard from '../components/common/StatCard';
import { ClockCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import GenreTable from '../components/genres/GenreTable';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';


const GenrePage:React.FC = () => {

	const {response} = useSelector((state:RootState) => state.genre);
	console.log(response);
	
	const totalGenres = response?.total ?? 0;
	
	return (
		<div className='flex-1 relative z-10 overflow-auto'>
				<Header title={"Genres"} />

				<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
					<motion.div
						className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1 }}
					>
						<StatCard name='Total Genres' icon={ShoppingCartOutlined} value={totalGenres.toString()} color='#6366F1' />

					</motion.div>

					<GenreTable />

				</main>

			</div>
		

	)
}

export default GenrePage