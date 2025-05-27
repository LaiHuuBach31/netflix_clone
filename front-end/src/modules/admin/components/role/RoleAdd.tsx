import { useForm } from 'antd/es/form/Form';
import React from 'react'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store';
import { createRole } from '../../store/roleSlice';
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';
import { ErrorResponse } from '../../services/roleService';
import { Button, Form, Input, Modal } from 'antd';

interface RoleAddProps {
    isModalOpen: boolean;
    onClose: () => void;
}

type FieldType = {
    name: string;
    price: number;
    duration_days: number,
    description: string
};

const RoleAdd: React.FC<RoleAddProps> = ({ isModalOpen, onClose }) => {
    const [form] = useForm<FieldType>();
    const dispatch = useDispatch<AppDispatch>();

    const onFinish = (values: FieldType) => {

        const roleData = {
            name: values.name,
        }

        dispatch(createRole(roleData))
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
                    : error.message || "Failed to create role";
                showErrorToast(detailedError);
            });

    }

    const handleOk = () => {
        form.submit();
    };

    return (
        <Modal
            title="Add New Role"
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
                name="add_role"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ status: true }}
                autoComplete="off"
                onFinish={onFinish}
            >
                <Form.Item<FieldType>
                    label="Role Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input role name!' }]}
                >
                    <Input className="p-2 " />
                </Form.Item>

            </Form>
        </Modal>
    )
}

export default RoleAdd