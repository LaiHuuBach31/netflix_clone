import { Button, Form, Input, Modal, Radio } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { updateGenre } from "../../store/genreSlice";
import { showErrorToast, showSuccessToast } from "../../../../utils/toast";
import { ErrorResponse, Genre } from "../../services/genreService";

interface GenreEditProps {
    isModalOpen: boolean;
    onClose: () => void;
    genre: Genre; 
}

type FieldType = {
    name: string;
    status: boolean;
};

const GenreEdit: React.FC<GenreEditProps> = ({ isModalOpen, onClose, genre }) => {
    const [form] = useForm<FieldType>();
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.genre);

    useEffect(() => {
        if (isModalOpen && genre) {
            form.setFieldsValue({
                name: genre.name,
                status: genre.status == true ? true : false,
            });
        }
    }, [isModalOpen, genre, form]);

    const onFinish = (values: FieldType) => {
        dispatch(updateGenre({ id: genre.id, data: values }))
            .unwrap()
            .then((result) => {
                showSuccessToast(result.message);
                onClose();
            })
            .catch((error: ErrorResponse) => {
                if (error.errors && typeof error.errors === "object") {
                    const formErrors = Object.keys(error.errors)
                        .filter((key) => key in values)
                        .map((key) => ({
                            name: key as keyof FieldType,
                            errors: error.errors![key],
                        }));
                    console.log("Form errors:", formErrors);
                    form.setFields(formErrors);
                }

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
            title="Edit Genre"
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
                name="edit_genre"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                autoComplete="off"
                onFinish={onFinish}
            >
                <Form.Item<FieldType>
                    label={
                        <span>
                            Genre Name <span className="text-red-500">*</span>
                        </span>
                    }
                    name="name"
                    rules={[
                        { required: true, message: "Please input genre name!" },
                    ]}
                >
                    <Input
                        className="p-2"
                        placeholder="Enter genre name"
                    />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Genre Status"
                    name="status"
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

export default GenreEdit;