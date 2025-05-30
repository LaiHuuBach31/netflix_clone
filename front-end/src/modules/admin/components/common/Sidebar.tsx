import {
	AppstoreOutlined,
	BarChartOutlined,
	BookOutlined,
	ContainerOutlined,
	FileImageOutlined,
	MenuOutlined,
	PlaySquareOutlined,
	SettingOutlined,
	ShoppingCartOutlined,
	SolutionOutlined,
	UsergroupAddOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const SIDEBAR_ITEMS = [
	{ name: "Overview", icon: BarChartOutlined, color: "#6366f1", href: "/admin" },
	{ name: "Genres", icon: AppstoreOutlined, color: "#6366f1", href: "/admin/genres" },
	{ name: "Menus", icon: MenuOutlined, color: "#6366f1", href: "/admin/menus" },
	{ name: "Plans", icon: ContainerOutlined, color: "#6366f1", href: "/admin/plans" },
	{ name: "Movies", icon: PlaySquareOutlined, color: "#6366f1", href: "/admin/movies" },
	{ name: "Users", icon: UsergroupAddOutlined, color: "#EC4899", href: "/admin/users" },
	{ name: "Role", icon: BookOutlined, color: "#EC4899", href: "/admin/roles" },
	{ name: "Banner", icon: FileImageOutlined, color: "#EC4899", href: "/admin/banners" },
	{ name: "Subscriptions", icon: SolutionOutlined, color: "#EC4899", href: "/admin/subscriptions" },
	{ name: "Orders", icon: ShoppingCartOutlined, color: "#F59E0B", href: "/admin/orders" },
	{ name: "Settings", icon: SettingOutlined, color: "#6EE7B7", href: "/admin/settings" },
  ];

const Sidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	return (
		<motion.div
			className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? "w-64" : "w-20"
				}`}
			animate={{ width: isSidebarOpen ? 256 : 80 }}
		>
			<div className='h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700'>
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					className='p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit'
				>
					<MenuOutlined style={{ fontSize: 24 }} />
				</motion.button>

				<nav className='mt-8 flex-grow'>

					{SIDEBAR_ITEMS.map((item) => {
						const Icon = item.icon;
						return (
							<>	
								<Link key={item.href} to={item.href}>
									<motion.div className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'>
										<Icon style={{ color: item.color, fontSize: 20, minWidth: 20 }} />
										<AnimatePresence>
											{isSidebarOpen && (
												<motion.span
													className='ml-4 whitespace-nowrap'
													initial={{ opacity: 0, width: 0 }}
													animate={{ opacity: 1, width: "auto" }}
													exit={{ opacity: 0, width: 0 }}
													transition={{ duration: 0.2, delay: 0.3 }}
												>
													{item.name}
												</motion.span>
											)}
											
										</AnimatePresence>
									</motion.div>
								</Link>
							</>
						);
					})}
				</nav>
			</div>
		</motion.div>
	);
};

export default Sidebar;