import { useForm } from 'antd/es/form/Form';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { createMovie } from '../../store/movieSlice';
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';
import { ErrorResponse } from '../../services/movieService';
import { Button, Form, Input, InputNumber, Modal, Upload, Checkbox, Radio } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import ImgCrop from 'antd-img-crop';
import { UploadFile, UploadProps } from 'antd';
import { clearUploadState, deleteFile, uploadImage, uploadVideo } from '../../store/uploadSlice';

interface MovieAddProps {
    isModalOpen: boolean;
    onClose: () => void;
}

type FieldType = {
    title: string;
    thumbnail: string;
    video_url: string;
    release_year: number;
    is_featured: boolean;
    description: string;
};

const MovieAdd: React.FC<MovieAddProps> = ({ isModalOpen, onClose }) => {
    const [form] = useForm<FieldType>();
    const dispatch = useDispatch<AppDispatch>();
    const { imageUrl, videoUrl, loading, error } = useSelector((state: RootState) => state.upload);
    const [thumbnailList, setThumbnailList] = useState<UploadFile[]>([]);
    const [videoList, setVideoList] = useState<UploadFile[]>([]);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (!isModalOpen) {
            setThumbnailList([]);
            setVideoList([]);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
            dispatch(clearUploadState());
        }
    }, [isModalOpen, dispatch]);

    useEffect(() => {
        if (imageUrl) {
            form.setFieldsValue({ thumbnail: imageUrl });
            setThumbnailList([{ ...thumbnailList[0], url: imageUrl, status: 'done' }]);
        }
        if (videoUrl) {
            form.setFieldsValue({ video_url: videoUrl });
            setVideoList([{ ...videoList[0], url: videoUrl, status: 'done' }]);
        }
    }, [imageUrl, videoUrl, form]);

    const handleThumbnailChange: UploadProps['onChange'] = async ({ fileList }) => {
        setThumbnailList(fileList);
        if (fileList.length > 0 && fileList[0].originFileObj) {
            const formData = new FormData();
            formData.append('file', fileList[0].originFileObj as File);
            abortControllerRef.current = new AbortController();
            const signal = abortControllerRef.current.signal;

            try {
                const result = await dispatch(uploadImage(formData, { signal })).unwrap();
                setThumbnailList([{ ...fileList[0], url: result.data, status: 'done' }]);
                showSuccessToast(result.message);
            } catch (error: any) {
                showErrorToast(error.message || 'Failed to upload thumbnail');
                if (imageUrl) {
                    await dispatch(deleteFile(imageUrl)).unwrap();
                }
                setThumbnailList([{ ...fileList[0], status: 'error' }]);
            }
        }
    };

    const handleVideoChange: UploadProps['onChange'] = async ({ fileList }) => {
        setVideoList(fileList);
        if (fileList.length > 0 && fileList[0].originFileObj) {
            const formData = new FormData();
            formData.append('file', fileList[0].originFileObj as File);
            abortControllerRef.current = new AbortController();
            const signal = abortControllerRef.current.signal;

            try {
                const result = await dispatch(uploadVideo(formData, { signal })).unwrap();
                setVideoList([{ ...fileList[0], url: result.data, status: 'done' }]);
                showSuccessToast(result.message)
            } catch (error: any) {
                showErrorToast(error.message || 'Failed to upload video');
                if (videoUrl) {
                    await dispatch(deleteFile(videoUrl)).unwrap();
                }
                setVideoList([{ ...fileList[0], status: 'error' }]);
            }
        }
    };

    const onFinish = (values: FieldType) => {
        const movieData = {
            title: values.title,
            thumbnail: values.thumbnail,
            video_url: values.video_url,
            release_year: values.release_year,
            is_featured: values.is_featured,
            description: values.description,
        };

        dispatch(createMovie(movieData))
            .unwrap()
            .then((result) => {
                showSuccessToast(result.message);
                form.resetFields();
                setThumbnailList([]);
                setVideoList([]);
                onClose();
            })
            .catch(async (error: ErrorResponse) => {
                const errorDetails = error.errors ? Object.values(error.errors).flat() : [];
                const detailedError = errorDetails.length
                    ? errorDetails[0]
                    : error.message || 'Failed to create movie';
                showErrorToast(detailedError);

                if (values.thumbnail) {
                    await dispatch(deleteFile(values.thumbnail)).unwrap();
                }

                if (values.video_url) {
                    await dispatch(deleteFile(values.video_url));
                }

                form.resetFields();
                setThumbnailList([]);
                setVideoList([]);
            });
    };

    const handleOk = () => {
        form.submit();
    };

    return (
        <Modal
            title="Add New Movie"
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
                <Button key="create" type="primary" onClick={handleOk} loading={loading}>
                    Create
                </Button>,
            ]}
        >
            <Form
                form={form}
                name="add_movie"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ is_featured: false }}
                autoComplete="off"
                onFinish={onFinish}
            >
                <Form.Item<FieldType>
                    label="Movie Name"
                    name="title"
                    rules={[{ required: true, message: 'Please input movie name!' }]}
                >
                    <Input className="p-2" />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Thumbnail"
                    name="thumbnail"
                    rules={[{ required: true, message: 'Please upload a thumbnail!' }]}
                >
                    <ImgCrop rotationSlider>
                        <Upload
                            listType="picture-card"
                            fileList={thumbnailList}
                            onChange={handleThumbnailChange}
                            beforeUpload={() => false}
                            maxCount={1}
                        >
                            {thumbnailList.length < 1 && '+ Upload'}
                        </Upload>
                    </ImgCrop>
                </Form.Item>

                <Form.Item<FieldType>
                    label="Video"
                    name="video_url"
                    rules={[{ required: true, message: 'Please upload a video!' }]}
                >
                    <Upload
                        listType="picture-card"
                        fileList={videoList}
                        onChange={handleVideoChange}
                        beforeUpload={() => false}
                        maxCount={1}
                        accept="video/mp4,video/mov,video/avi,video/mkv"
                    >
                        {videoList.length < 1 && '+ Upload Video'}
                    </Upload>
                </Form.Item>

                <Form.Item<FieldType>
                    label="Release Year"
                    name="release_year"
                    rules={[{ required: true, message: 'Please input release year!' }]}
                >
                    <InputNumber className="w-full p-1" min={1900} />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Featured"
                    name="is_featured"
                >
                    <Radio.Group
                    >
                        <Radio value={true}>Featured</Radio>
                        <Radio value={false}>Not Featured</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item<FieldType>
                    label="Description"
                    name="description"
                >
                    <TextArea className="p-2" rows={4} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default MovieAdd;