import React from 'react'
import './profilePage.css';

import { useState } from 'react';
import { LockOutlined, MailOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Flex, Form, Image, Input, Row, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const ProfilePage: React.FC = () => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    const uploadButton = (
        <button className='text-[gray] border-none bg-none' type="button">
            <PlusOutlined />
            <div className='mt-2' >Upload</div>
        </button>
    );

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
    };

    return (
        <>
            <div className='profile mt-8' style={{ flex: 1, padding: '0 300px' }}>
                <Row className='bg-black bg-opacity-10 w-full text-white rounded-xl'>
                    <Col span={9}>
                        <div className="flex flex-col  items-center h-full text-center pt-12">
                            <div className="items-center">
                                <Upload
                                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                                    listType="picture-circle"
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                    onChange={handleChange}
                                >
                                    {fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                                {previewImage && (
                                    <Image
                                        wrapperStyle={{ display: 'none' }}
                                        preview={{
                                            visible: previewOpen,
                                            onVisibleChange: (visible) => setPreviewOpen(visible),
                                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                        }}
                                        src={previewImage}
                                    />
                                )}
                            </div>

                            <div className="text-[gray] mt-8">
                                <p className="text-[15px] font-bold">Avatar Name</p>
                                <p className="text-[15px] font-bold">Email Name</p>
                            </div>
                        </div>
                    </Col>

                    <Col
                        span={15}
                        className="flex justify-center relative pt-12"
                    >
                        <Form
                            className='w-96'
                            name="login"
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: 'Please input your Username!' }]}
                            >
                                <Input className="w-full p-4 border-none" prefix={<UserOutlined />} placeholder="Username" />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                rules={[{ required: true, message: 'Please input your Email!' }]}
                            >
                                <Input className="w-full p-4 border-none" prefix={<MailOutlined />} placeholder="Email" />
                            </Form.Item>

                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: 'Please input your Username!' }]}
                            >
                                <Input className="w-full p-4 border-none" prefix={<UserOutlined />} placeholder="Username" />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                rules={[{ required: true, message: 'Please input your Email!' }]}
                            >
                                <Input className="w-full p-4 border-none" prefix={<MailOutlined />} placeholder="Email" />
                            </Form.Item>
                            
                        
                            <Form.Item>
                                <Button className='bg-[red] font-semibold' type="primary" htmlType="submit">
                                    Update
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>


                </Row>

            </div>

        </>
    );
};

export default ProfilePage