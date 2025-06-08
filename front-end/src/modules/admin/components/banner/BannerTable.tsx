import React, { useCallback, useEffect, useState } from 'react'
import { Banner } from '../../services/bannerService';
import { AppDispatch, RootState } from '../../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import { deleteBanner, fetchBanners } from '../../store/bannerSlice';
import { showSuccessToast } from '../../../../utils/toast';
import { motion } from 'framer-motion';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import BannerAdd from './BannerAdd';
import BannerEdit from './BannerEdit';
import { Button, Modal } from 'antd';

const BannerTable: React.FC = () => {
    const [searchBanner, setSearchBanner] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
    const [bannerToDeleteId, setBannerToDeleteId] = useState<number | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const { response, loading, error } = useSelector((state: RootState) => state.banner);
    const [currentPage, setCurrentPage] = useState(1);

    const debouncedFetchBanners = useCallback(
        debounce((page, keyword) => {
            dispatch(fetchBanners({ page, keyword }));
        }, 500),
        [dispatch]
    );

    useEffect(() => {
        debouncedFetchBanners(currentPage, searchBanner);
        return () => {
            debouncedFetchBanners.cancel();
        };
    }, [currentPage, searchBanner, debouncedFetchBanners]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchBanner(e.target.value);
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
    const showEditModal = (banner: Banner) => {
        setSelectedBanner(banner);
        setIsEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
        setSelectedBanner(null);
    };

    // Delete
    const showDeleteConfirmModal = (id: number) => {
        setBannerToDeleteId(id);
        setIsDeleteConfirmModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        
        if (bannerToDeleteId) {
            dispatch(deleteBanner(bannerToDeleteId))
                .unwrap()
                .then(() => {
                    showSuccessToast('Banner deleted successfully');
                })
            dispatch(fetchBanners({ page: currentPage, keyword: searchBanner }));
        }
        setIsDeleteConfirmModalOpen(false);

        setBannerToDeleteId(null);
    };

    const handleDeleteCancel = () => {
        setIsDeleteConfirmModalOpen(false);
        setBannerToDeleteId(null);
    };

    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex justify-between items-center mb-6 items-center">
                <h2 className="text-xl font-semibold text-gray-100">Banners List</h2>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search Banners..."
                        className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleSearch}
                        value={searchBanner}
                    />
                    <SearchOutlined className="absolute left-3 top-2.5 text-gray-400" style={{ fontSize: 18 }} />
                </div>

                <button className="bg-[#2b3e59] px-5 py-2 font-semibold rounded-lg" onClick={showModalAdd}>
                    Add
                </button>

            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700 items-center">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Index
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Image
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Movie
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-700">
                        {response?.data.map((banner, key) => (
                            <motion.tr
                                key={banner.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <td className="px-6 py-3 text-center">{key + 1}</td>
                                <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-100">
                                    {banner.title}
                                </td>
                                 <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-100">
                                    <div className='flex justify-center items-center'>
                                        <img src={banner.image} alt="" width={100}/>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-100">
                                   {banner.movie?.title} 
                                </td>
                                <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-100">
                                    {banner.is_active ? 'Active' : 'InActive'}
                                </td>
                                <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">
                                    <button className="text-indigo-400 hover:text-indigo-300 mr-2"
                                        onClick={() => showEditModal(banner)}
                                    >
                                        <EditOutlined style={{ fontSize: 18 }} />
                                    </button>
                                    <button className="text-red-400 hover:text-red-300"
                                        onClick={() => showDeleteConfirmModal(banner.id)}
                                    >
                                        <DeleteOutlined style={{ fontSize: 18 }} />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
                {response && response.data.length > 0 && (
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

            <BannerAdd isModalOpen={isAddModalOpen} onClose={handleAddModalClose} />
            {
                selectedBanner !== null && (
                    <BannerEdit
                        isModalOpen={isEditModalOpen}
                        onClose={handleEditModalClose}
                        banner={selectedBanner}
                    />
                )
            }

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
                <p>Are you sure you want to delete this banner?</p>
            </Modal>

        </motion.div>
    );
};

export default BannerTable