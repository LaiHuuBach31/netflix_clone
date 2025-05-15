import { useForm } from 'antd/es/form/Form';
import React from 'react'
import { AppDispatch } from '../../../../store';
import { useDispatch } from 'react-redux';
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';
import { ErrorResponse } from '../../services/planService';
import { Button, Form, Input, InputNumber, Modal } from 'antd';
import { createPlan } from '../../store/planSlice';
import TextArea from 'antd/es/input/TextArea';

interface PlanAddProps {
    isModalOpen: boolean;
    onClose: () => void;
}

type FieldType = {
    name: string;
    price: number;
    duration_days: number,
    description: string
};

const PlanAdd: React.FC<PlanAddProps> = ({ isModalOpen, onClose }) => {
    const [form] = useForm<FieldType>();
    const dispatch = useDispatch<AppDispatch>();

    const onFinish = (values: FieldType) => {

        const planData = {
            name: values.name,
            price: values.price,
            duration_days: values.duration_days,
            description: values.description,
        }

        dispatch(createPlan(planData))
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
                    : error.message || "Failed to create plan";
                showErrorToast(detailedError);
            });

    }

    const handleOk = () => {
        form.submit();
    };

    return (
        <Modal
            title="Add New Plan"
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
                name="add_plan"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ status: true }}
                autoComplete="off"
                onFinish={onFinish}
            >
                <Form.Item<FieldType>
                    label="Plan Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input plan name!' }]}
                >
                    <Input className="p-2 " />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Plan Price"
                    name="price"
                    
                    rules={[{ required: true, message: 'Please input plan price!' }]}
                >
                    <InputNumber className="w-full p-1 " />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Plan Duration Days"
                    name="duration_days"
                    rules={[{ required: true, message: 'Please input plan duration days!' }]}
                >
                    <InputNumber className="w-full p-1 " />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Plan Description"
                    name="description"
                >
                    <TextArea className="p-2 " />
                </Form.Item>

            </Form>
        </Modal>
    )
}

export default PlanAdd