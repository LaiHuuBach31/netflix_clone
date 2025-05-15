import { Button, Form, Input, Modal, Radio, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { createMenu } from "../../store/menuSlice";
import { ErrorResponse, Menu } from "../../services/menuService";
import { showErrorToast, showSuccessToast } from "../../../../utils/toast";

interface MenuWithChildren extends Menu {
  children?: MenuWithChildren[];
}

interface MenuAddProps {
  isModalOpen: boolean;
  onClose: () => void;
}

type FieldType = {
  title: string;
  parent_id: number;
  order: number;
  is_active: boolean;
};

const MenuAdd: React.FC<MenuAddProps> = ({ isModalOpen, onClose }) => {
  const [form] = useForm<FieldType>();
  const dispatch = useDispatch<AppDispatch>();
  const { response } = useSelector((state: RootState) => state.menu);

  const onFinish = (values: FieldType) => {
    const menuData = {
      title: values.title,
      parent_id: values.parent_id || 0,
      order: values.order,
      is_active: values.is_active,
    };

    dispatch(createMenu(menuData))
      .unwrap()
      .then((result) => {
        showSuccessToast(result.message);
        form.resetFields();
        onClose();
      })
      .catch((error: ErrorResponse) => {
        const errorDetails = error.errors ? Object.values(error.errors).flat() : [];
        const detailedError = errorDetails.length
          ? errorDetails[0]
          : error.message || "Failed to create menu";
        showErrorToast(detailedError);
      });
  };

  const handleOk = () => {
    form.submit();
  };

  const buildMenuTree = (parentId: number, menus: Menu[]): MenuWithChildren[] => {
    return menus
      .filter((menu) => menu.parent_id === parentId)
      .map((menu) => ({
        ...menu,
        children: buildMenuTree(menu.id, menus),
      }));
  };

  const flattenMenuWithIndent = (
    menus: MenuWithChildren[],
    level: number = 0,
    indentChar: string = "— "
  ): { value: number; label: string }[] => {
    let options: { value: number; label: string }[] = [];
    menus.forEach((menu) => {
      const indent = indentChar.repeat(level);
      options.push({
        value: menu.id,
        label: `${indent}${menu.title}`,
      });
      if (menu.children && menu.children.length > 0) {
        options = options.concat(flattenMenuWithIndent(menu.children, level + 1, indentChar));
      }
    });
    return options;
  };

  const parentMenuOptions = useMemo(() => {
    if (!response?.data) return [];

    const menuTree = buildMenuTree(0, response.data);

    const options = flattenMenuWithIndent(menuTree);

    return [{ value: 0, label: "No Parent" }, ...options];
  }, [response?.data]);

  return (
    <Modal
      title="Add New Menu"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={onClose}
      closable
      okText="Create"
      cancelText="Cancel"
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="create" type="primary" onClick={handleOk}>
          Create
        </Button>,
      ]}
    >
      <Form
        form={form}
        name="add_menu"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ is_active: true }}
        autoComplete="off"
        onFinish={onFinish}
      >
        <Form.Item<FieldType>
          label="Menu Name"
          name="title"
          rules={[{ required: true, message: "Please input menu title!" }]}
        >
          <Input className="p-2" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Menu Parent"
          name="parent_id"
          rules={[{ required: false }]}
        >
          <Select
            className="[&_.ant-select-selector]:p-2"
            style={{ width: "100%" }}
            placeholder="Select parent menu"
            options={parentMenuOptions}
            allowClear
          />
        </Form.Item>

        <Form.Item<FieldType>
          label="Menu Order"
          name="order"
          rules={[{ required: true, message: "Please input menu order!" }]}
        >
          <Input className="p-2" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Menu Status"
          name="is_active"
        >
          <Radio.Group>
            <Radio value={true}>Active</Radio>
            <Radio value={false}>Inactive</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MenuAdd;