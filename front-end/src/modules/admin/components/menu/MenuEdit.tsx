import React, { useEffect, useMemo } from 'react'
import { Menu } from '../../services/menuService';
import { useForm } from 'antd/es/form/Form';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { Button, Form, Input, Modal, Radio, Select } from 'antd';
import { fetchMenus, updateMenu } from '../../store/menuSlice';
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';
import { ErrorResponse } from '../../services/genreService';

interface MenuEditProps {
  isModalOpen: boolean;
  onClose: () => void;
  menu: Menu;
}

interface FieldType {
  title: string;
  parent_id: number;
  order: number;
  is_active: boolean;
}

const MenuEdit: React.FC<MenuEditProps> = ({ isModalOpen, onClose, menu }) => {

  const [form] = useForm<FieldType>();
  const dispatch = useDispatch<AppDispatch>();
  const { response } = useSelector((state: RootState) => state.menu);

  useEffect(() => {
    if (menu) {
      form.setFieldsValue({
        title: menu.title,
        parent_id: menu.parent_id || 0,
        order: menu.order,
        is_active: !!menu.is_active
      })
    }
  }, [menu, form]);

  const onFinish = (values: FieldType) => {
    if (!menu) return;
    const updatedMenuData = {
      id: menu.id,
      title: values.title,
      parent_id: values.parent_id,
      order: values.order,
      is_active: values.is_active,
    };
    dispatch(updateMenu({ id: menu.id, data: updatedMenuData }))
      .unwrap()
      .then((result) => {
        showSuccessToast(result.message || "Menu updated successfully");
        dispatch(fetchMenus({ page: 1, keyword: '' }));
        onClose();
      })
      .catch((error: ErrorResponse) => {
        const errorDetails = error.errors ? Object.values(error.errors).flat() : [];
        const detailedError = errorDetails.length
          ? errorDetails[0]
          : error.message || "Failed to update menu";
        showErrorToast(detailedError);
      });
  }

  const handleOk = () => {
    form.submit();
  }

 const parentMenuOptions = useMemo(() => {
        if (!response?.data) return [{ value: 0, label: "No Parent" }];

        const currentParent = menu.parent_id
            ? response.data.find((m: Menu) => m.id === menu.parent_id)
            : null;

        const options = response.data
            .filter((m: Menu) => m.id !== menu.id)
            .map((m: Menu) => ({
                value: m.id,
                label: m.title,
            }));

        const finalOptions = [{ value: 0, label: "No Parent" }, ...options];

        if (currentParent && !finalOptions.some(opt => opt.value === currentParent.id)) {
            finalOptions.push({
                value: currentParent.id,
                label: currentParent.title,
            });
        }

        return finalOptions;

    }, [response?.data, menu.id, menu.parent_id]);

  return (
    <Modal
      title="Edit Menu"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={onClose}
      closable
      okText="Update"
      cancelText="Cancel"
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="update" type="primary" onClick={handleOk}>
          Update
        </Button>,
      ]}
    >
      <Form
        form={form}
        name="edit_menu"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        autoComplete="off"
        onFinish={onFinish}
      >
        <Form.Item<FieldType>
          label="Menu Name"
          name="title"
          rules={[{ required: true, message: 'Please input menu title!' }]}
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
            style={{ width: '100%' }}
            placeholder="Select parent menu"
            options={parentMenuOptions}
            allowClear
            dropdownStyle={{ minWidth: '200px' }}
          />
        </Form.Item>

        <Form.Item<FieldType>
          label="Menu Order"
          name="order"
          rules={[{ required: true, message: 'Please input menu order!' }]}
        >
          <Input type="number" className="p-2" />
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
}

export default MenuEdit