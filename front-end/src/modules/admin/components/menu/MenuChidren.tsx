import React from "react";
import { Button, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Menu } from "../../services/menuService";

interface MenuWithChildren extends Menu {
  children?: MenuWithChildren[];
}

interface MenuChidrenProps {
  isModalOpen: boolean;
  onClose: () => void;
  parentName: string;
  menus: MenuWithChildren[];
  onEdit: (menu: Menu) => void;
  onDelete: (id: number) => void;
}

const MenuItemRow: React.FC<{
  menu: MenuWithChildren;
  level: number;
  onEdit: (menu: Menu) => void;
  onDelete: (id: number, closeModal: () => void) => void;
}> = ({ menu, level, onEdit, onDelete }) => {
  const indent = "— ".repeat(level);
  const marginLeft = `${level * 30}px`;

  const handleDelete = () => {
    onDelete(menu.id, () => {}); 
  };
  
  return (
    <>
      <tr key={menu.id}>
        <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-black text-start">
          <span style={{ marginLeft, display: "inline-block" }}>
            {indent} {menu.title}
          </span>
        </td>
        <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-black">
          {menu.is_active ? "Active" : "Inactive"}
        </td>
        <td className="px-6 py-4 text-center whitespace-nowrap text-sm">
          <button
            className="text-indigo-400 hover:text-indigo-300 mr-2"
            onClick={() => onEdit(menu)}
          >
            <EditOutlined style={{ fontSize: 18 }} />
          </button>
          <button
            className="text-red-400 hover:text-red-300"
            onClick={handleDelete}
          >
            <DeleteOutlined style={{ fontSize: 18 }} />
          </button>
        </td>
      </tr>
      {menu.children &&
        menu.children.map((child) => (
          <MenuItemRow
            key={child.id}
            menu={child}
            level={level + 1}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
    </>
  );
};

const MenuChidren: React.FC<MenuChidrenProps> = ({
  isModalOpen,
  onClose,
  parentName,
  menus,
  onEdit,
  onDelete,
}) => {
  const handleDelete = (id: number, closeModal: () => void) => {
    onClose();
    onDelete(id);
  };
  return (
    <Modal
      title={`Children of Menu: ${parentName}`}
      open={isModalOpen}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 text-start!">
            {menus.map((menu) => (
              <MenuItemRow
                key={menu.id}
                menu={menu}
                level={0}
                onEdit={onEdit}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default MenuChidren;