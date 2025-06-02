import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { DeleteOutlined, DownloadOutlined, EditOutlined, PlusOutlined, SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { User } from "../../services/userService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { debounce } from "lodash";
import { clearImportErrors, deleteUser, exportUsers, fetchUsers, importUsers } from "../../store/userSlice";
import { showErrorToast, showSuccessToast, showWarningToast } from "../../../../utils/toast";
import { Button, Modal } from "antd";
import UserAdd from "./UserAdd";
import UserEdit from "./UserEdit";
import AssignRole from "./AssignRole";
import { saveAs } from "file-saver";
import * as XLSX from 'xlsx';

const UsersTable = () => {
	const [searchUser, setSearchUser] = useState("");
	const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
	const [userToDeleteId, setUserToDeleteId] = useState<number | null>(null);
	const [isAssignRoleModal, setIsAssignRoleModal] = useState<boolean>(false);
	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
	const dispatch = useDispatch<AppDispatch>();
	const { response, loading, error, importErrors } = useSelector((state: RootState) => state.user);
	const [currentPage, setCurrentPage] = useState(1);
	const [file, setFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const debouncedFetchUsers = useCallback(
		debounce((page, keyword) => {
			dispatch(fetchUsers({ page, keyword }));
		}, 500),
		[dispatch]
	);

	useEffect(() => {
		debouncedFetchUsers(currentPage, searchUser);
		return () => {
			debouncedFetchUsers.cancel();
		};
	}, [currentPage, searchUser, debouncedFetchUsers]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchUser(e.target.value);
		setCurrentPage(1);
	};

	// pagination
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handlePrevious = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleNext = () => {
		if (response && currentPage < response.last_page) {
			setCurrentPage(currentPage + 1);
		}
	};

	const renderPageNumbers = () => {
		if (!response) return null;

		const pages = [];
		const maxPagesToShow = 3;
		const totalPages = response.last_page;

		if (currentPage > 2) {
			pages.push(
				<button
					key={1}
					onClick={() => handlePageChange(1)}
					className={`pagination-btn ${currentPage === 1 ? "active" : ""}`}
				>
					1
				</button>
			);
			if (currentPage > 3) {
				pages.push(<span key="start-ellipsis" className="pagination-ellipsis">...</span>);
			}
		}

		let startPage = Math.max(1, currentPage - 1);
		let endPage = Math.min(totalPages, currentPage + 1);

		if (endPage - startPage < maxPagesToShow - 1 && endPage < totalPages) {
			startPage = Math.max(1, endPage - maxPagesToShow + 1);
		}
		if (startPage > 1) {
			startPage = Math.max(1, currentPage - 1);
		}

		for (let i = startPage; i <= endPage; i++) {
			pages.push(
				<button
					key={i}
					onClick={() => handlePageChange(i)}
					className={`pagination-btn ${i === currentPage ? "active" : ""}`}
				>
					{i}
				</button>
			);
		}

		if (currentPage < totalPages) {
			if (endPage < totalPages - 1) {
				pages.push(<span key="end-ellipsis" className="pagination-ellipsis">...</span>);
			}
			if (endPage < totalPages) {
				pages.push(
					<button
						key={totalPages}
						onClick={() => handlePageChange(totalPages)}
						className={`pagination-btn ${currentPage === totalPages ? "active" : ""}`}
					>
						{totalPages}
					</button>
				);
			}
		}

		return pages;
	};

	// add
	const showModalAdd = () => {
		setIsAddModalOpen(true);
	};

	const handleAddModalClose = () => {
		setIsAddModalOpen(false);
	};

	// edit
	const showEditModal = (user: User) => {
		setSelectedUser(user);
		setIsEditModalOpen(true);
	};

	const handleEditModalClose = () => {
		setIsEditModalOpen(false);
		setSelectedUser(null);
	};

	// Delete
	const showDeleteConfirmModal = (id: number) => {
		setUserToDeleteId(id);
		setIsDeleteConfirmModalOpen(true);
	};

	const handleDeleteConfirm = () => {
		if (userToDeleteId) {
			dispatch(deleteUser(userToDeleteId))
				.unwrap()
				.then(() => {
					showSuccessToast('User deleted successfully');
				})
			dispatch(fetchUsers({ page: currentPage, keyword: searchUser }));
		}
		setIsDeleteConfirmModalOpen(false);

		setUserToDeleteId(null);
	};

	const handleDeleteCancel = () => {
		setIsDeleteConfirmModalOpen(false);
		setUserToDeleteId(null);
	};

	// assign role
	const showAssignRoleModal = (user: User) => {
		setSelectedUser(user);
		setIsAssignRoleModal(true);
	}

	const handleAssignRoleModalClose = () => {
		setIsAssignRoleModal(false);
		setSelectedUser(null);
	}

	const handleExport = () => {
		dispatch(exportUsers())
			.unwrap()
			.then((response) => {
				saveAs(response.file, 'users.xlsx');
				showSuccessToast('Export successful');
			})
			.catch((error) => {
				showErrorToast(error.message || 'Failed to export users');
			});
	};

	const handleImport = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const generateErrorExcelFile = (errors: any[]) => {
		const worksheet = XLSX.utils.aoa_to_sheet(errors);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Errors");

		const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
		const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
		saveAs(blob, "import_errors.xlsx");
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0] || null;
		setFile(selectedFile);

		if (selectedFile) {
			dispatch(importUsers(selectedFile))
				.unwrap()
				.then((response) => {
					console.log('response');
					console.log(response);

					if (response.status) {
						showSuccessToast(response.message || 'Users imported successfully');
						dispatch(fetchUsers({ page: currentPage, keyword: searchUser }));
					}
				})	
				.catch((error) => {
					showErrorToast(error.message || 'Failed to import users');
				})
				.finally(() => {
					setFile(null);
					if (fileInputRef.current) fileInputRef.current.value = '';
				});
		} else {
			showWarningToast('Please select a file');
		}
	};

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className="flex justify-between items-center mb-6 items-center">
				<h2 className="text-xl font-semibold text-gray-100">User List</h2>

				<div className="relative">
					<input
						type="text"
						placeholder="Search user..."
						className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						onChange={handleSearch}
						value={searchUser}
					/>
					<SearchOutlined className="absolute left-3 top-2.5 text-gray-400" style={{ fontSize: 18 }} />
				</div>

				<div>
					<button className="bg-[#2b3e59] px-5 py-2 font-semibold rounded-lg" onClick={showModalAdd}>
						Add +
					</button>
					<button className="bg-[#2b3e59] px-5 py-2 mx-2 font-semibold rounded-lg" onClick={handleExport}>
						Export <DownloadOutlined />
					</button>
					<button className="bg-[#2b3e59] px-5 py-2 font-semibold rounded-lg" onClick={handleImport}>
						Import <UploadOutlined />
					</button>
					<input
						ref={fileInputRef}
						id="importFileInput"
						type="file"
						accept=".xlsx, .xls"
						onChange={handleFileChange}
						className="hidden"
					/>
				</div>

			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Avater
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Name
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Email
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Role
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Status
							</th>
							<th className='px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Assign Role
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Actions
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-700'>
						{response?.data.map((user) => (
							<motion.tr
								key={user.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-6 py-4 whitespace-nowrap'>
									<img src={user.avatar ?? 'https://cdn01.justjared.com/wp-content/uploads/headlines/2023/04/netflix-secret-menu-evergreen.jpg'} alt="" width={80} />
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='flex items-center'>
										<div className='flex-shrink-0 h-10 w-10'>
											<div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold'>
												{user.name.charAt(0)}
											</div>
										</div>
										<div className='ml-4'>
											<div className='text-sm font-medium text-gray-100'>{user.name}</div>
										</div>
									</div>
								</td>

								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-300'>{user.email}</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100'>
										{Array.isArray(user.roles) && user.roles.length > 0 ? user.roles.map(role => role.name).join(", ") : "No Role"}
									</span>
								</td>

								<td className='px-6 py-4 whitespace-nowrap'>
									<span
										className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
											${user.status == true
												? "bg-green-800 text-green-100"
												: "bg-red-800 text-red-100"
											}`}
									>
										{user.status == true ? 'Active' : 'InActive'}
									</span>
								</td>

								<td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">
									<button className="text-indigo-400 hover:text-indigo-300 mr-2"
										onClick={() => showAssignRoleModal(user)}
									>
										<PlusOutlined style={{ fontSize: 18 }} />
									</button>
								</td>

								<td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">
									<button className="text-indigo-400 hover:text-indigo-300 mr-2"
										onClick={() => showEditModal(user)}
									>
										<EditOutlined style={{ fontSize: 18 }} />
									</button>
									<button className="text-red-400 hover:text-red-300"
										onClick={() => showDeleteConfirmModal(user.id)}
									>
										<DeleteOutlined style={{ fontSize: 18 }} />
									</button>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
				{response && response.data && response.data.length > 0 && (
					<div className="pagination">
						<button
							onClick={handlePrevious}
							disabled={currentPage === 1}
							className="pagination-btn"
						>
							«
						</button>
						{renderPageNumbers()}
						<button
							onClick={handleNext}
							disabled={currentPage === response.last_page}
							className="pagination-btn"
						>
							»
						</button>
					</div>
				)}
			</div>
			<UserAdd isModalOpen={isAddModalOpen} onClose={handleAddModalClose} />
			{
				selectedUser !== null && (
					<UserEdit
						isModalOpen={isEditModalOpen}
						onClose={handleEditModalClose}
						user={selectedUser}
					/>
				)
			}

			<AssignRole
				isModalOpen={isAssignRoleModal}
				user={selectedUser}
				onClose={handleAssignRoleModalClose}
			/>

			<Modal
				title="Confirm Deletion"
				open={isDeleteConfirmModalOpen}
				onOk={handleDeleteConfirm}
				onCancel={handleDeleteCancel}
				okText="Yes"
				cancelText="No"
				closable
				footer={[
					<Button key="cancel" onClick={handleDeleteCancel}>
						No
					</Button>,
					<Button
						key="confirm"
						type="primary"
						onClick={handleDeleteConfirm}
						loading={loading}
					>
						Yes
					</Button>,
				]}
			>
				<p>Are you sure you want to delete this user?</p>
			</Modal>



		</motion.div>
	);
};
export default UsersTable;
