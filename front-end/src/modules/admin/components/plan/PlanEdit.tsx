import React, { useEffect } from 'react'
import { ErrorResponse, Plan } from '../../services/planService';
import { Button, Form, Input, InputNumber, Modal } from 'antd';
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';
import { useForm } from 'antd/es/form/Form';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { updatePlan } from '../../store/planSlice';
import TextArea from 'antd/es/input/TextArea';


interface PlanEditProps {
    isModalOpen: boolean;
    onClose: () => void;
    plan: Plan;
}

type FieldType = {
    name: string;
    price: number;
    duration_days: number,
    description: string
};

const PlanEdit: React.FC<PlanEditProps> = ({ isModalOpen, onClose, plan }) => {
    const [form] = useForm<FieldType>();
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.genre);

    useEffect(() => {
        if (isModalOpen && plan) {
            form.setFieldsValue({
                name: plan.name,
                price: plan.price,
                duration_days: plan.duration_days,
                description: plan.description,
            });
        }
    }, [isModalOpen, plan, form]);

    const onFinish = (values: FieldType) => {
        
        dispatch(updatePlan({ id: plan.id, data: values }))
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
            title="Edit Plan"
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
                name="edit_plan"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
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
    );
}

export default PlanEdit