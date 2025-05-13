import React, { useEffect, useMemo } from "react";
import { Button, Modal, Tree } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { fetchMenus } from "../../store/menuSlice";
import { Menu } from "../../services/menuService";

interface MenuChidrenProps {
  isModalOpen: boolean;
  onClose: () => void;
  parentId: number;
}

const MenuChidren: React.FC<MenuChidrenProps> = ({ isModalOpen, onClose, parentId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { response } = useSelector((state: RootState) => state.menu);

  useEffect(() => {
    if (isModalOpen) {
      dispatch(fetchMenus({ page: 1, keyword: "" }));
    }
  }, [isModalOpen, dispatch]);

  // Hàm đệ quy để lấy con và cháu
  const getChildren = (parentId: number, menus: Menu[]): any[] => {
    return menus
      .filter((menu) => menu.parent_id === parentId)
      .map((menu) => ({
        title: menu.title,
        key: menu.id,
        children: getChildren(menu.id, menus),
      }));
  };

  const buildTreeData = useMemo(() => {
    if (!response?.data) return [];
    const treeData: any[] = [];
    // Lấy menu cha dựa trên parentId
    const parentMenu = response.data.find((menu) => menu.id === parentId);
    if (parentMenu) {
      const children = getChildren(parentMenu.id, response.data);
      treeData.push({
        title: parentMenu.title,
        key: parentMenu.id,
        children: children,
      });
    }
    return treeData;
  }, [response?.data, parentId]);

  const handleOk = () => {
    onClose();
  };

  return (
    <Modal
      title="Menu Children"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={onClose}
      closable
      okText="Close"
      cancelText="Cancel"
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="close" type="primary" onClick={handleOk}>
          Close
        </Button>,
      ]}
    >
      <Tree
        treeData={buildTreeData}
        defaultExpandAll
        showLine={{ showLeafIcon: false }}
        style={{ marginTop: 16 }}
      />
    </Modal>
  );
};

export default MenuChidren;