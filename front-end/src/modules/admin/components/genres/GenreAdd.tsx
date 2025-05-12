import { Button, Form, Input, Modal, Radio } from "antd";
import { useForm } from "antd/es/form/Form";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { createGenre } from "../../store/genreSlice";
import { ErrorResponse } from "../../services/genreService"; 
import { showErrorToast, showSuccessToast } from "../../../../utils/toast";

interface GenreAddProps {
    isModalOpen: boolean;
    onClose: () => void;
}

type FieldType = {
    name: string;
    status: boolean;
};

const GenreAdd: React.FC<GenreAddProps> = ({ isModalOpen, onClose }) => {

    const [form] = useForm<FieldType>();
    const dispatch = useDispatch<AppDispatch>();

    const onFinish = (values: FieldType) => {

        const genreData = {
            name: values.name,
            status: values.status,
        }

        dispatch(createGenre(genreData))
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
                    : error.message || "Failed to create genre";
                showErrorToast(detailedError);
            });

    }

    const handleOk = () => {
        form.submit();
    };

    return (
        <Modal
            title="Add New Genre"
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
                name="add_genre"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ status: true }}
                autoComplete="off"
                onFinish={onFinish}
            >
                <Form.Item<FieldType>
                    label="Genre Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input genre name!' }]}
                >
                    <Input className="p-2 " />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Genre Status"
                    name="status"
                >
                    <Radio.Group
                    >
                        <Radio value={true}>Active</Radio>
                        <Radio value={false}>Inactive</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default GenreAdd;