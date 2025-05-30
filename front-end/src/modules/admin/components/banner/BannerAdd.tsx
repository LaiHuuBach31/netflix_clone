import { Button, Form, Input, Modal, Radio, Select, Upload, UploadFile, UploadProps, Spin } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useForm } from 'antd/es/form/Form';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';
import { deleteFile, uploadImage } from '../../store/uploadSlice';
import { createBanner } from '../../store/bannerSlice';
import { fetchMovies } from '../../store/movieSlice';
import VirtualList from 'rc-virtual-list';

interface BannerAddProps {
    isModalOpen: boolean;
    onClose: () => void;
}

type FieldType = {
    title: string;
    image: string;
    movie_id: number;
    is_active: boolean;
};

const BannerAdd: React.FC<BannerAddProps> = ({ isModalOpen, onClose }) => {
    const [form] = useForm<FieldType>();
    const dispatch = useDispatch<AppDispatch>();
    const [banner, setBanner] = useState<UploadFile | null>(null);
    const { imageUrl } = useSelector((state: RootState) => state.upload);
    const { response, loading: movieLoading, error: movieError } = useSelector((state: RootState) => state.movie);
    const [movieOptions, setMovieOptions] = useState<{ value: number; label: string }[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreMovies, setHasMoreMovies] = useState(true);
    const [lastPageMovies, setLastPageMovies] = useState<number | null>(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const selectRef = useRef<any>(null);
    const listRef = useRef<any>(null);

    useEffect(() => {
        if (isModalOpen) {
            setMovieOptions([]);
            setCurrentPage(1);
            setHasMoreMovies(true);
            setLastPageMovies(null);
            setSearchKeyword('');
            form.resetFields();
            dispatch(fetchMovies({ page: 1, keyword: '' }));
        }
    }, [dispatch, isModalOpen]);

    useEffect(() => {
        if (response && !movieLoading) {
            setLastPageMovies(response.last_page);
            const newOptions = response.data.map((movie: any) => ({
                value: movie.id,
                label: movie.title,
            }));
            setMovieOptions((prev) => {
                const existingIds = new Set(prev.map((opt) => opt.value));
                const filteredNewOptions = newOptions.filter((opt) => !existingIds.has(opt.value));
                return [...prev, ...filteredNewOptions];
            });
            setHasMoreMovies(response.current_page < response.last_page);
        } else if (movieError) {
            showErrorToast('Failed to load movies: ' + (movieError.message || 'Unknown error'));
        }
    }, [response, movieLoading, movieError]);

    useEffect(() => {
        if (movieOptions.length > 0 && searchKeyword) {
            const filtered = movieOptions.filter((option) =>
                option.label.toLowerCase().includes(searchKeyword.toLowerCase())
            );
            setMovieOptions(filtered);
            if (listRef.current) listRef.current.scrollTo({ top: 0 });
        }
    }, [searchKeyword]);

    const loadMoreMovies = useCallback(() => {
        if (movieLoading || !hasMoreMovies) return;
        if (lastPageMovies && currentPage > lastPageMovies) {
            setHasMoreMovies(false);
            return;
        }
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        dispatch(fetchMovies({ page: nextPage, keyword: searchKeyword }));
    }, [movieLoading, hasMoreMovies, currentPage, lastPageMovies, dispatch, searchKeyword]);

    const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 5 && hasMoreMovies && !movieLoading) {
            loadMoreMovies();
        }
    };

    const handleSearch = (value: string) => {
        setSearchKeyword(value);
        setCurrentPage(1);
        setMovieOptions([]);
        setHasMoreMovies(true);
        dispatch(fetchMovies({ page: 1, keyword: value }));
    };

    const handleBannerChange: UploadProps['onChange'] = async ({ fileList }) => {
        if (fileList.length > 0) {
            const file = fileList[0];
            setBanner({ ...file, status: 'uploading' });
            if (file.originFileObj) {
                const previewUrl = URL.createObjectURL(file.originFileObj);
                form.setFieldsValue({ image: previewUrl });
                try {
                    const formData = new FormData();
                    formData.append('file', file.originFileObj);
                    const result = await dispatch(uploadImage(formData)).unwrap();
                    showSuccessToast(result.message);
                    if (result.data) {
                        setBanner({ ...file, url: result.data, status: 'done' });
                        form.setFieldsValue({ image: result.data });
                    } else {
                        setBanner({ ...file, status: 'error' });
                        showErrorToast('Failed to upload banner: No URL returned');
                    }
                } catch (error: any) {
                    if (imageUrl) await dispatch(deleteFile(imageUrl)).unwrap();
                    setBanner({ ...file, status: 'error' });
                    showErrorToast(error.message || 'Failed to upload banner');
                }
            }
        } else {
            setBanner(null);
            form.setFieldsValue({ image: '' });
        }
    };

    const onFinish = async (values: FieldType) => {
        try {
            await dispatch(createBanner(values)).unwrap();
            showSuccessToast('Banner created successfully!');
            form.resetFields();
            setBanner(null);
            onClose();
        } catch (error: any) {
            showErrorToast(error.message || 'Failed to create banner');
            if (values.image) await dispatch(deleteFile(values.image)).unwrap();
            form.resetFields();
        }
    };

    const handleOk = () => form.submit();

    const handleSelect = (value: number) => {
        form.setFieldsValue({ movie_id: value });
        if (selectRef.current) selectRef.current.blur();
    };

    const renderItem = (item: { value: number; label: string }) => (
        <div key={item.value} style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={() => handleSelect(item.value)}>
            {item.label}
        </div>
    );

    return (
        <Modal
            title="Add New Banner"
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
                name="add_banner"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ is_active: true }}
                autoComplete="off"
                onFinish={onFinish}
            >
                <Form.Item<FieldType> label="Banner Title" name="title" rules={[{ required: true, message: 'Please input banner title!' }]}>
                    <Input className="p-2" />
                </Form.Item>
                <Form.Item<FieldType> label="Banner Image" name="image" rules={[{ required: true, message: 'Please upload banner!' }]}>
                    <ImgCrop rotationSlider>
                        <Upload listType="picture-card" fileList={banner ? [banner] : []} onChange={handleBannerChange} beforeUpload={() => false} maxCount={1}>
                            {banner ? null : '+ Upload'}
                        </Upload>
                    </ImgCrop>
                </Form.Item>
                <Form.Item<FieldType> label="Movie" name="movie_id" rules={[{ required: true, message: 'Please select movie!' }]}>
                    <Select
                        ref={selectRef}
                        showSearch
                        className="[&_.ant-select-selector]:p-2"
                        style={{ width: '100%' }}
                        placeholder="Select movie"
                        allowClear
                        disabled={movieError !== null}
                        onSearch={handleSearch}
                        filterOption={false}
                        suffixIcon={movieLoading ? <Spin size="small" /> : null}
                        dropdownRender={(menu) => (
                            <VirtualList ref={listRef} data={movieOptions} height={300} itemHeight={32} itemKey="value" onScroll={handlePopupScroll}>
                                {renderItem}
                            </VirtualList>
                        )}
                        onChange={(value) => form.setFieldsValue({ movie_id: value })}
                    >
                        {movieOptions.map((item) => (
                            <Select.Option key={item.value} value={item.value}>
                                {item.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item<FieldType> label="Banner Status" name="is_active">
                    <Radio.Group>
                        <Radio value={true}>Active</Radio>
                        <Radio value={false}>Inactive</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BannerAdd;