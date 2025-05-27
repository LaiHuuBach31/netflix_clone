import React, { useEffect } from 'react'
import { ErrorResponse, Role } from '../../services/roleService';
import { useForm } from 'antd/es/form/Form';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { updateRole } from '../../store/roleSlice';
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';
import { Button, Form, Input, Modal } from 'antd';

interface RoleEditProps {
    isModalOpen: boolean;
    onClose: () => void;
    role: Role;
}

type FieldType = {
    name: string;
};

const RoleEdit: React.FC<RoleEditProps> = ({ isModalOpen, onClose, role }) => {
    const [form] = useForm<FieldType>();
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.role);

    useEffect(() => {
        if (isModalOpen && role) {
            form.setFieldsValue({
                name: role.name,
            });
        }
    }, [isModalOpen, role, form]);

    const onFinish = (values: FieldType) => {
        console.log(values);
        
        dispatch(updateRole({ id: role.id, data: values }))
            .unwrap()
            .then((result) => {
                showSuccessToast(result.message);
                onClose();
            })
            .catch((error: ErrorResponse) => {
                const errorDetails = error.errors ? Object.values(error.errors).flat() : [];
                const detailedError = errorDetails.length
                    ? errorDetails[0]
                    : error.message || "Failed to update genre";
                showErrorToast(detailedError);
            });
    };

    const handleOk = () => {
        form.submit();
    };

    return (
        <Modal
            title="Edit Role"
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
                <Button
                    key="update"
                    type="primary"
                    onClick={handleOk}
                    loading={loading}
                >
                    Update
                </Button>,
            ]}
        >
            <Form
                form={form}
                name="edit_role"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
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
    );
}

export default RoleEdit