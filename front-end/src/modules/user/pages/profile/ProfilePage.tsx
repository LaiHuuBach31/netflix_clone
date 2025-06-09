import React, { useEffect, useRef, useState } from 'react';
import './profilePage.css';
import { LockOutlined, MailOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Col, Form, Image, Input, message, Row, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { User } from '../../../admin/services/userService';
import { deleteFile, uploadImage } from '../../../admin/store/uploadSlice';
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';
import { updateProfile } from '../../../../store/slices/authSlice';
import ImgCrop from 'antd-img-crop';

const ProfilePage: React.FC = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch<AppDispatch>();
    const { imageUrl, loading, error } = useSelector((state: RootState) => state.upload);
    const [avatarList, setAvatarList] = useState<UploadFile[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                form.setFieldsValue({
                    username: parsedUser.name,
                    email: parsedUser.email,
                    avatar: parsedUser.avatar || '',
                });
                if (parsedUser.avatar) {
                    setAvatarList([{ uid: '-1', name: 'avatar.jpg', url: parsedUser.avatar, status: 'done' }]);
                }
            } catch (error) {
                console.error('Failed to parse user data:', error);
                localStorage.removeItem('user');
                setUser(null);
                setAvatarList([]);
                form.resetFields();
            }
        }
    }, [form]);

    useEffect(() => {
        if (imageUrl && !loading) {
            form.setFieldsValue({ avatar: imageUrl }); 
            setAvatarList([{ uid: '-1', name: 'avatar.jpg', url: imageUrl, status: 'done' }]);
        }
        if (error) {
            showErrorToast(error.message || 'Failed to upload avatar');
            setAvatarList(avatarList.filter(file => file.status !== 'uploading'));
        }
    }, [imageUrl, loading, error, form, avatarList]);

    const handleUploadAvatar: UploadProps['onChange'] = async ({ fileList }) => {
        setAvatarList(fileList);
        if (fileList.length > 0 && fileList[0].originFileObj) {
            const formData = new FormData();
            formData.append('file', fileList[0].originFileObj as File);
            abortControllerRef.current = new AbortController();
            const signal = abortControllerRef.current.signal;

            try {
                const result = await dispatch(uploadImage(formData, { signal })).unwrap();
                setAvatarList([{ uid: '-1', name: 'avatar.jpg', url: result.data, status: 'done' }]);
                showSuccessToast(result.message);
                form.setFieldsValue({ avatar: result.data });
            } catch (error: any) {
                showErrorToast(error.message || 'Failed to upload avatar');
                if (imageUrl) {
                    await dispatch(deleteFile(imageUrl)).unwrap();
                }
                setAvatarList([{ ...fileList[0], status: 'error' }]);
            }
        }
    };

    const onFinishProfile = async (values: { username: string; email: string; avatar?: string }) => {
        const avatar = avatarList.length > 0 ? avatarList[0].url || avatarList[0].preview : user?.avatar || values.avatar;
        dispatch(updateProfile({
            name: values.username,
            email: values.email,
            avatar,
        })).unwrap().then((response) => {
            showSuccessToast(response.message);
            const updatedUser = response.data;
            // setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }).catch((error: any) => {
            const errorDetails = error.errors ? Object.values(error.errors).flat() : [];
            const detailedError = errorDetails.length
                ? errorDetails[0]
                : error.message || 'Update failed';
            showErrorToast(detailedError);
        });
    };

    return (
        <div className="profile mt-8" style={{ flex: 1, padding: '0 300px' }}>
            <Row className="bg-black bg-opacity-10 w-full text-white rounded-xl">
                <Col span={9}>
                    <div className="flex flex-col items-center h-full text-center pt-12">
                        <div className="items-center">
                            <Form.Item
                                name="avatar"
                                valuePropName="fileList"
                                getValueFromEvent={(e) => e.fileList}
                                rules={[{ required: false }]} 
                            >
                                <ImgCrop rotationSlider>
                                    <Upload
                                        listType="picture-card"
                                        fileList={avatarList}
                                        onChange={handleUploadAvatar}
                                        beforeUpload={() => false}
                                        maxCount={1}
                                    >
                                        {avatarList.length < 1 && '+ Upload'}
                                    </Upload>
                                </ImgCrop>
                            </Form.Item>
                        </div>

                        <div className="text-gray-400">
                            <p className="text-[15px] font-bold">{user?.name || 'No Name'}</p>
                            <p className="text-[15px] font-bold">{user?.email || 'No Email'}</p>
                        </div>
                    </div>
                </Col>

                <Col span={15} className="flex justify-center relative pt-12">
                    <Form
                        form={form}
                        className="w-96"
                        name="profile"
                        onFinish={onFinishProfile}
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Please input your Username!' }]}
                        >
                            <Input
                                className="w-full p-4 border-none bg-transparent text-white custom-input"
                                prefix={<UserOutlined />}
                                placeholder="Username"
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: 'Please input your Email!', type: 'email' }]}
                        >
                            <Input
                                className="w-full p-4 border-none bg-transparent text-white custom-input"
                                prefix={<MailOutlined />}
                                placeholder="Email"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button className="bg-red-600 font-semibold w-full" type="primary" htmlType="submit">
                                Update Profile
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

export default ProfilePage;