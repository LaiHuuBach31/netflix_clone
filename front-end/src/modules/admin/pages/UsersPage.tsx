import { CheckCircleOutlined, PlusCircleOutlined, TeamOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import UserGrowthChart from "../components/users/UserGrowthChart";
import UserActivityHeatmap from "../components/users/UserActivityHeatmap";
import UserDemographicsChart from "../components/users/UserDemographicsChart";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { data } from "react-router";
import { User } from "../services/userService";
import { now } from "lodash";

const UsersPage:React.FC = () => {

	const { response } = useSelector((state: RootState) => state.user);
	const totalUsers = response?.total ?? 0;

	// const users = response?.data || [];	
	// const activeUsers = users.filter((user: User) => user.status == true).length;

	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Users' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard
						name='Total Users'
						icon={TeamOutlined}
						value={totalUsers.toLocaleString()}
						color='#6366F1'
					/>
					{/* <StatCard
						name='Active Users'
						icon={CheckCircleOutlined}
						value={activeUsers.toLocaleString()}
						color='#F59E0B'
					/> */}
				</motion.div>

				<UsersTable />

				{/* USER CHARTS */}
				{/* <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
					<UserGrowthChart />
					<UserActivityHeatmap />
					<UserDemographicsChart />
				</div> */}
			</main>
		</div>
	);
};

export default UsersPage;
