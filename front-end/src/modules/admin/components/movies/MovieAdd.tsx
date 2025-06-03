import { useForm } from 'antd/es/form/Form';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { createMovie } from '../../store/movieSlice';
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';
import { ErrorResponse } from '../../services/movieService';
import { Button, Form, Input, InputNumber, Modal, Radio, Select, Spin, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import ImgCrop from 'antd-img-crop';
import { UploadFile, UploadProps } from 'antd';
import { clearUploadState, deleteFile, uploadImage, uploadVideo } from '../../store/uploadSlice';
import VirtualList from 'rc-virtual-list';
import { fetchGenres } from '../../store/genreSlice'; 
import { Genre } from '../../services/genreService'; 

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
    genre_id: number;
};

const MovieAdd: React.FC<MovieAddProps> = ({ isModalOpen, onClose }) => {
    const [form] = useForm<FieldType>();
    const dispatch = useDispatch<AppDispatch>();
    const { imageUrl, videoUrl, loading, error } = useSelector((state: RootState) => state.upload);
    const { response: genreResponse, loading: genreLoading } = useSelector((state: RootState) => state.genre); 
    const [thumbnailList, setThumbnailList] = useState<UploadFile[]>([]);
    const [videoList, setVideoList] = useState<UploadFile[]>([]);
    const [genreOption, setGenreOption] = useState<{ value: number; label: string }[]>([]); 
    const [currentPageGenre, setCurrentPageGenre] = useState<number>(1);
    const [hasMoreGenre, setHasMoreGenre] = useState<boolean>(true);
    const [lastPageGenre, setLastPageGenre] = useState<number | null>(null);
    const [searchKeywordGenre, setSearchKeywordGenre] = useState('');
    const genreSelectRef = useRef<any>(null);
    const listRef = useRef<any>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (!isModalOpen) {
            setThumbnailList([]);
            setVideoList([]);
            setGenreOption([]);
            setCurrentPageGenre(1);
            setHasMoreGenre(true);
            setLastPageGenre(null);
            setSearchKeywordGenre('');
            form.resetFields();
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
            dispatch(clearUploadState());
        } else {
            dispatch(fetchGenres({ page: 1, keyword: '' }));
        }
    }, [isModalOpen, dispatch, form]);

    useEffect(() => {
        if (genreResponse && !genreLoading) {
            setLastPageGenre(genreResponse.last_page);
            const newGenreOptions = genreResponse.data.map((genre: Genre) => ({
                value: genre.id,
                label: genre.name,
            }));

            setGenreOption((prev) => {
                const existingIds = new Set(prev.map((opt) => opt.value));
                const filterGenreOptions = newGenreOptions.filter((opt) => !existingIds.has(opt.value));
                return [...prev, ...filterGenreOptions];
            });

            setHasMoreGenre(genreResponse.current_page < genreResponse.last_page);
        }
    }, [genreResponse, genreLoading]);

    useEffect(() => {
        if (imageUrl) {
            form.setFieldsValue({ thumbnail: imageUrl });
            setThumbnailList([{ ...thumbnailList[0], url: imageUrl, status: 'done' }]);
        }
        if (videoUrl) {
            form.setFieldsValue({ video_url: videoUrl });
            setVideoList([{ ...videoList[0], url: videoUrl, status: 'done' }]);
        }
    }, [imageUrl, videoUrl, form, thumbnailList, videoList]);

    const loadMoreGenre = useCallback(() => {
        if (genreLoading || !hasMoreGenre) return;
        if (lastPageGenre && currentPageGenre > lastPageGenre) {
            setHasMoreGenre(false);
            return;
        }
        const nextPage = currentPageGenre + 1;
        setCurrentPageGenre(nextPage);
        dispatch(fetchGenres({ page: nextPage, keyword: searchKeywordGenre }));
    }, [genreLoading, hasMoreGenre, currentPageGenre, lastPageGenre, searchKeywordGenre, dispatch]);

    const handleGenrePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 5 && hasMoreGenre && !genreLoading) {
            loadMoreGenre();
        }
    };

    const handleSearchGenre = (value: string) => {
        setSearchKeywordGenre(value);
        setCurrentPageGenre(1);
        setGenreOption([]);
        setHasMoreGenre(true);
        dispatch(fetchGenres({ page: 1, keyword: value }));
    };

    const handleSelectGenre = (value: number) => {
        form.setFieldsValue({ genre_id: value });
        if (genreSelectRef.current) genreSelectRef.current.blur();
    };

    const renderItem = (item: { value: number; label: string }) => (
        <div key={item.value} style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={() => handleSelectGenre(item.value)}>
            {item.label}
        </div>
    );

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
                showSuccessToast(result.message);
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
            genre_id: values.genre_id,
        };

        dispatch(createMovie(movieData))
            .unwrap()
            .then((result) => {
                showSuccessToast(result.message);
                form.resetFields();
                setThumbnailList([]);
                setVideoList([]);
                setGenreOption([]);
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
                    await dispatch(deleteFile(values.video_url)).unwrap();
                }

                form.resetFields();
                setThumbnailList([]);
                setVideoList([]);
                setGenreOption([]);
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
                    label="Genre"
                    name="genre_id"
                    rules={[{ required: true, message: 'Please select a genre!' }]}
                >
                    <Select
                        ref={genreSelectRef}
                        showSearch
                        className="[&_.ant-select-selector]:p-2"
                        style={{ width: '100%' }}
                        placeholder="Select genre"
                        allowClear
                        onSearch={handleSearchGenre}
                        filterOption={false}
                        suffixIcon={genreLoading ? <Spin size="small" /> : null}
                        dropdownRender={() => (
                            <VirtualList
                                ref={listRef}
                                data={genreOption}
                                height={200}
                                itemHeight={32}
                                itemKey="value"
                                onScroll={handleGenrePopupScroll}
                            >
                                {renderItem}
                            </VirtualList>
                        )}
                        onChange={(value) => form.setFieldsValue({ genre_id: value })}
                    >
                        {genreOption.map((item) => (
                            <Select.Option key={item.value} value={item.value}>
                                {item.label}
                            </Select.Option>
                        ))}
                    </Select>
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
                    <Radio.Group>
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