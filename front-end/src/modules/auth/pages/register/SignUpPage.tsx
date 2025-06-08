import { Button, Form, Input, Upload, UploadFile, UploadProps } from 'antd';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderRegister from './HeaderRegister';
import ImgCrop from 'antd-img-crop';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { useForm } from 'antd/es/form/Form';
import { deleteFile, uploadImage } from '../../../admin/store/uploadSlice';
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';
import { registerAsync } from '../../../../store/slices/authSlice';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

type FieldType = {
    name: string;
    avatar: string;
    email: string;
    password: string;
};

const SignUpPage:React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [form] = useForm<FieldType>();
    const { imageUrl, videoUrl, loading } = useSelector((state: RootState) => state.upload);
    const [avatarList, setAvatarList] = useState<UploadFile[]>([]);
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const abortControllerRef = useRef<AbortController | null>(null);

    const handleAvatarChange: UploadProps['onChange'] = async ({ fileList }) => {
        setAvatarList(fileList);
        if (fileList.length > 0 && fileList[0].originFileObj) {
            const formData = new FormData();
            formData.append('file', fileList[0].originFileObj as File);
            abortControllerRef.current = new AbortController();
            const signal = abortControllerRef.current.signal;

            try {
                const result = await dispatch(uploadImage(formData, { signal })).unwrap();
                setAvatarList([{ ...fileList[0], url: result.data, status: 'done' }]);
                setAvatarUrl(result.data);
                showSuccessToast(result.message);
            } catch (error: any) {
                showErrorToast(error.message || 'Failed to upload avatar');
                if (imageUrl) {
                    await dispatch(deleteFile(imageUrl)).unwrap();
                }
                setAvatarList([{ ...fileList[0], status: 'error' }]);
            }
        }
    };

    const handleSignUp = async () => {
        try {
            await dispatch(
                registerAsync({
                    avatar: avatarUrl,
                    name,
                    email,
                    password,
                })
            ).unwrap();
            showSuccessToast('Registration successful!');
            navigate('/signup/plan');
        } catch (error: any) {
            const errorDetails = error.errors ? Object.values(error.errors).flat() : [];
            const detailedError = errorDetails.length
                ? errorDetails[0]
                : error.message || "Failed to create genre";
            showErrorToast(detailedError);

        }
    };

    return (
        <>
            <HeaderRegister />

            <div
                className="flex flex-col items-center justify-center h-screen text-white"
                style={{ backgroundColor: 'black' }}
            >
                <h1 className="text-3xl font-bold mb-10">Create your account</h1>
                <div className="flex flex-col items-center w-full max-w-md">
                    <Form.Item<FieldType>
                        label=""
                        name="avatar"
                        className="mb-8 text-center"
                    >
                        <ImgCrop rotationSlider>
                            <Upload
                                listType="picture-card"
                                fileList={avatarList}
                                onChange={handleAvatarChange}
                                beforeUpload={() => false}
                                maxCount={1}
                                className="mx-auto"
                            >
                                {avatarList.length < 1 && <span className="text-white">+ Upload</span>}
                            </Upload>
                        </ImgCrop>
                    </Form.Item>

                    <Form
                        name="sign_up"
                        onFinish={handleSignUp}
                        layout="vertical"
                        className="w-full"
                    >
                        <Form.Item<FieldType>
                            label={<span className="text-white">Name</span>}
                            name="name"
                            rules={[{ required: true, message: 'Please input name!' }]}
                            className="mb-6"
                        >
                            <Input
                                className="w-full p-3 border border-gray-600 rounded text-black"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label={<span className="text-white">Email</span>}
                            name="email"
                            rules={[
                                { required: true, message: 'Please input your Email!' },
                                { type: 'email', message: 'Please enter a valid Email address!' },
                            ]}
                            className="mb-6"
                        >
                            <Input
                                prefix={<UserOutlined className="text-gray-500" />}
                                placeholder="Enter your email"
                                className="w-full p-3 border border-gray-600 rounded text-black"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label={<span className="text-white">Password</span>}
                            name="password"
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                            className="mb-6"
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-500" />}
                                placeholder="Enter your password"
                                className="w-full p-3 border border-gray-600 rounded text-black"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                block
                                type="primary"
                                htmlType="submit"
                                size="large"
                                className="bg-red-600 hover:bg-red-700 border-none p-4 rounded text-white"
                                loading={loading}
                            >
                                Sign Up
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default SignUpPage;