import { Button, Form, Input, Modal, Radio, Upload, UploadFile, UploadProps } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useForm } from 'antd/es/form/Form';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';
import { deleteFile, uploadImage } from '../../store/uploadSlice';
import { createUser } from '../../store/userSlice';
import { ErrorResponse } from '../../services/userService';

interface UserAddProps {
    isModalOpen: boolean;
    onClose: () => void;
}

type FieldType = {
    name: string,
    email: string,
    password: string,
    avatar: string,
    status: boolean,
};

const UserAdd: React.FC<UserAddProps> = ({ isModalOpen, onClose }) => {

    const [form] = useForm<FieldType>();
    const dispatch = useDispatch<AppDispatch>();
    const [avatar, setAvatar] = useState<UploadFile | null>(null);
    const { imageUrl } = useSelector((state: RootState) => state.upload);

    const handleAvatarChange: UploadProps['onChange'] = async ({ fileList }) => {
        if (fileList.length > 0) {
            const file = fileList[0];
            setAvatar({ ...file, status: 'uploading' });

            if (file.originFileObj) {
                const previewUrl = URL.createObjectURL(file.originFileObj);

                form.setFieldsValue({ avatar: previewUrl });

                try {
                    const formData = new FormData();
                    formData.append('file', file.originFileObj);
                    const result = await dispatch(uploadImage(formData)).unwrap();
                    showSuccessToast(result.message);
                    if (result.data) {
                        setAvatar({ ...file, url: result.data, status: 'done' });
                        form.setFieldsValue({ avatar: result.data });
                    } else {
                        setAvatar({ ...file, status: 'error' });
                        form.setFieldsValue({ avatar: previewUrl });
                        showErrorToast('Failed to upload avatar: No URL returned');
                    }
                } catch (error: any) {
                    if (imageUrl) {
                        await dispatch(deleteFile(imageUrl)).unwrap();
                    }
                    setAvatar({ ...file, status: 'error' });
                    showErrorToast(error.message || 'Failed to upload avatar');
                }

            }
        } else {
            setAvatar(null);
            form.setFieldsValue({ avatar: '' });
        }
    }

    const onFinish = async (values: FieldType) => {
        console.log('values.avatar', values.avatar);
        
        const payload = {
            name: values.name,
            email: values.email,
            password: values.password,
            avatar: values.avatar,
            status: values.status,
        };
        console.log('payload', payload);

        await dispatch(createUser(payload)).unwrap()
            .then((result) => {
                showSuccessToast(result.message || 'User created successfully!');
                form.resetFields();
                setAvatar(null);
                onClose();
            })
            .catch(async (error: ErrorResponse) => {
                const errorDetails = error.errors ? Object.values(error.errors).flat() : [];
                const detailedError = errorDetails.length
                    ? errorDetails[0]
                    : error.message || 'Failed to create movie';
                showErrorToast(detailedError);

                if (values.avatar) {
                    await dispatch(deleteFile(values.avatar)).unwrap();
                }

                form.resetFields();
            });
    }

    const handleOk = () => {
        form.submit();
    }

    return (
        <Modal
            title="Add New User"
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
                name="add_user"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ status: true }}
                autoComplete="off"
                onFinish={onFinish}
            >
                <Form.Item<FieldType>
                    label="Avatar"
                    name="avatar"
                    rules={[{ required: true, message: 'Please upload an avatar!' }]}
                >
                    <ImgCrop rotationSlider>
                        <Upload
                            listType="picture-card"
                            fileList={avatar ? [avatar] : []}
                            onChange={handleAvatarChange}
                            beforeUpload={() => false}
                            maxCount={1}
                        >
                            {avatar ? null : '+ Upload'}
                        </Upload>
                    </ImgCrop>
                </Form.Item>

                <Form.Item<FieldType>
                    label="User Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input user name!' }]}
                >
                    <Input className="p-2 " />
                </Form.Item>

                <Form.Item<FieldType>
                    label="User Email"
                    name="email"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ]}
                >
                    <Input className="p-2 " />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input password!' }]}
                >
                    <Input.Password className="p-2" placeholder="Enter password" />
                </Form.Item>

                <Form.Item<FieldType>
                    label="User Status"
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
    )
}

export default UserAdd