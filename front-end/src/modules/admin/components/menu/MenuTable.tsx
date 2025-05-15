import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    DeleteOutlined,
    EditOutlined,
    PlusSquareOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { deleteMenu, fetchMenus } from "../../store/menuSlice";
import { debounce } from "lodash";
import { Menu } from "../../services/menuService";
import MenuAdd from "./MenuAdd";
import MenuEdit from "./MenuEdit";
import MenuChidren from "./MenuChidren";
import { Button, Modal } from "antd";
import { showSuccessToast } from "../../../../utils/toast";

interface MenuWithChildren extends Menu {
    children?: MenuWithChildren[];
}

const MenuTable: React.FC = () => {
    const [searchMenu, setSearchMenu] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
    const [menuToDeleteId, setMenuToDeleteId] = useState<number | null>(null);
    const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const { response } = useSelector((state: RootState) => state.menu);

    console.log('response', response);
    

    const debounceFetchMenus = useCallback(
        debounce((page, keyword) => {
            dispatch(fetchMenus({ page, keyword }));
        }, 500),
        [dispatch]
    );

    useEffect(() => {
        debounceFetchMenus(currentPage, searchMenu);
        return () => {
            debounceFetchMenus.cancel();
        };        
    }, [currentPage, searchMenu, debounceFetchMenus]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchMenu(e.target.value);
        setCurrentPage(1);
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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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
                pages.push(
                    <span key="start-ellipsis" className="pagination-ellipsis">
                        ...
                    </span>
                );
            }
        }

        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(totalPages, currentPage + 1);

        if (endPage - startPage < maxPagesToShow && endPage < totalPages) {
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

        if (currentPage < totalPages - 1) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <span key="end-ellipsis" className="pagination-ellipsis">
                        ...
                    </span>
                );
            }
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

        return pages;
    };

    // Add
    const showModalAdd = () => {
        setIsAddModalOpen(true);
    };

    const handleAddModalClose = () => {
        setIsAddModalOpen(false);
    };

    // Edit
    const showEditModal = (menu: Menu) => {
        setSelectedMenu(menu);
        setIsEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
        setSelectedMenu(null);
    };

    // Delete
    const showDeleteConfirmModal = (id: number) => {
        setMenuToDeleteId(id);
        setIsDeleteConfirmModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (menuToDeleteId) {
            dispatch(deleteMenu(menuToDeleteId))
                .unwrap()
                .then(() => {
                    showSuccessToast("Menu deleted successfully");
                })
                .catch((error) => console.error("Delete failed:", error));
            dispatch(fetchMenus({ page: currentPage, keyword: searchMenu }));
        }
        setIsDeleteConfirmModalOpen(false);
        setMenuToDeleteId(null);
    };

    const handleDeleteCancel = () => {
        setIsDeleteConfirmModalOpen(false);
        setMenuToDeleteId(null);
    };

    // Children
    const showChildren = (parentId: number) => {
        setSelectedParentId(parentId);
    };

    // Tree
    const buildMenuTree = (parentId: number, menus: Menu[]): MenuWithChildren[] => {
        return menus
            .filter((menu) => menu.parent_id === parentId)
            .map((menu) => ({
                ...menu,
                children: buildMenuTree(menu.id, menus),
            }));
    };

    const getChildren = (parentId: number): MenuWithChildren[] => {
        if (!response?.data) return [];
        return buildMenuTree(parentId, response.data);
    };

    const getParentName = (parentId: number): string => {
        if (!response?.data) return "Unknown";
        const parentMenu = response.data.find((menu) => menu.id === parentId);
        return parentMenu ? parentMenu.title : "Unknown";
    };

    const hasDescendants = (parentId: number): boolean => {
        const children = getChildren(parentId);
        return children.length > 0;
    };

    const hasChildrenToDelete = menuToDeleteId ? hasDescendants(menuToDeleteId) : false;

    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex justify-between items-center mb-6 items-center">
                <h2 className="text-xl font-semibold text-gray-100">Menu List</h2>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search menus..."
                        className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleSearch}
                        value={searchMenu}
                    />
                    <SearchOutlined
                        className="absolute left-3 top-2.5 text-gray-400"
                        style={{ fontSize: 18 }}
                    />
                </div>

                <button
                    className="bg-[#2b3e59] px-5 py-2 font-semibold rounded-lg"
                    onClick={showModalAdd}
                >
                    Add
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700 items-center">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                .
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Order
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Name
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
                        {response?.data
                            .filter((menu) => menu.parent_id === 0)
                            .map((menu, key) => (
                                <motion.tr
                                    key={menu.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <td className="px-6 py-3 text-center">
                                        {hasDescendants(menu.id) && (
                                            <button
                                                className="text-green-400 hover:text-green-300"
                                                onClick={() => showChildren(menu.id)}
                                            >
                                                <PlusSquareOutlined />
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-3 text-center">{key + 1}</td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-100">
                                        {menu.title}
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-100">
                                        {menu.is_active ? "Active" : "Inactive"}
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">
                                        <button
                                            className="text-indigo-400 hover:text-indigo-300 mr-2"
                                            onClick={() => showEditModal(menu)}
                                        >
                                            <EditOutlined style={{ fontSize: 18 }} />
                                        </button>
                                        <button
                                            className="text-red-400 hover:text-red-300"
                                            onClick={() => showDeleteConfirmModal(menu.id)}
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

            <MenuAdd isModalOpen={isAddModalOpen} onClose={handleAddModalClose} />

            {selectedMenu !== null && (
                <MenuEdit
                    isModalOpen={isEditModalOpen}
                    onClose={handleEditModalClose}
                    menu={selectedMenu}
                />
            )}

            {selectedParentId !== null && (
                <MenuChidren
                    isModalOpen={selectedParentId !== null}
                    onClose={() => setSelectedParentId(null)}
                    parentName={getParentName(selectedParentId)}
                    menus={getChildren(selectedParentId)}
                    onEdit={showEditModal}
                    onDelete={showDeleteConfirmModal}
                />
            )}

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
                    <Button key="confirm" type="primary" onClick={handleDeleteConfirm}>
                        Yes
                    </Button>,
                ]}
            >
                <p>Are you sure you want to delete this menu?</p>
                {hasChildrenToDelete && (
                    <p className="text-red-500 mt-2">
                        Note: This menu has submenus, and they will also be deleted.
                    </p>
                )}
            </Modal>
        </motion.div>
    );
};

export default MenuTable;