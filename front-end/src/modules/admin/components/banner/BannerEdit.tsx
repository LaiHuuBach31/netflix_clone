import React, { useEffect, useState } from 'react'
import { Banner, CreatePayload } from '../../services/bannerService';
import { Button, Form, Input, Modal, Radio, Select, Spin, Upload, UploadFile, UploadProps } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useForm } from 'antd/es/form/Form';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { deleteFile, uploadImage } from '../../store/uploadSlice';
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';
import { updateBanner } from '../../store/bannerSlice';
import { fetchMovies } from '../../store/movieSlice';
import { Movie } from '../../services/movieService';

interface BannerEditProps {
  isModalOpen: boolean;
  banner: Banner;
  onClose: () => void;
}

type FieldType = {
  title: string;
  image: string;
  movie_id: number;
  is_active: boolean;
};

const BannerEdit: React.FC<BannerEditProps> = ({ isModalOpen, banner, onClose }) => {

  const [form] = useForm<FieldType>();
  const dispatch = useDispatch<AppDispatch>();
  const [bannerImage, setBannerImage] = useState<UploadFile | null>(null);
  const { imageUrl } = useSelector((state: RootState) => state.upload);
  const { response: movieResponse, loading: movieLoading, error } = useSelector((state: RootState) => state.movie);
  const [movieOptions, setMovieOptions] = useState<{ value: number; label: string }[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreMovies, setHasMoreMovies] = useState(false);
  const [lastPageMovies, setLastPageMovies] = useState<number | null>(null);

  useEffect(() => {
    if (isModalOpen && banner) {
      form.setFieldsValue({
        title: banner.title,
        image: banner.image,
        movie_id: banner.movie_id,
        is_active: !!banner.is_active,
      })

      if (banner.image) {
        setBannerImage({
          uid: '-1',
          name: 'banner-image',
          status: 'done',
          url: banner.image,
        });
      } else {
        setBannerImage(null);
      }

      setMovieOptions([]);
      setCurrentPage(1);
      setHasMoreMovies(true);
      setLastPageMovies(null);
      setSearchKeyword('');
      dispatch(fetchMovies({ page: 1, keyword: '' }));
    }
  }, [dispatch, isModalOpen, banner]);

  useEffect(() => {
    if (movieResponse && !movieLoading) {
      setLastPageMovies(movieResponse.last_page);
      const newOptions = movieResponse.data.slice(0, 10).map((movie: Movie) => ({
        value: movie.id,
        label: movie.title,
      }));

      setMovieOptions((prev) => {
        const existingIds = new Set(prev.map((opt) => opt.value));
        const filteredNewOptions = newOptions.filter((opt) => !existingIds.has(opt.value));
        if (banner.movie_id && !existingIds.has(banner.id) && !filteredNewOptions.some((opt) => opt.value === banner.movie_id)) {
          const selectedMovie = movieResponse.data.find((movie: Movie) => movie.id === banner.movie_id);
          if (selectedMovie) {
            filteredNewOptions.unshift({
              value: selectedMovie.id,
              label: selectedMovie.title,
            })
          }
        }
        return [...prev, ...filteredNewOptions];
      });
      setHasMoreMovies(movieResponse.current_page < movieResponse.last_page);
    } else if (error) {
      showErrorToast('Failed to load movies: ' + (error.message || 'Unknown error'));
    }
  }, [movieResponse, movieLoading, error, banner.movie_id]);

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
      setBannerImage({ ...file, status: 'uploading' });
      if (file.originFileObj) {
        const previewUrl = URL.createObjectURL(file.originFileObj);
        form.setFieldsValue({ image: previewUrl });
        try {
          const formData = new FormData();
          formData.append('file', file.originFileObj);
          const result = await dispatch(uploadImage(formData)).unwrap();
          showSuccessToast(result.message);
          if (result.data) {
            setBannerImage({ ...file, url: result.data, status: 'done' });
            form.setFieldsValue({ image: result.data });
          } else {
            setBannerImage({ ...file, status: 'error' });
            showErrorToast('Failed to upload banner: No URL returned');
          }
        } catch (error: any) {
          if (imageUrl) await dispatch(deleteFile(imageUrl)).unwrap();
          setBannerImage({ ...file, status: 'error' });
          showErrorToast(error.message || 'Failed to upload banner');
        }
      }
    } else {
      setBannerImage(null);
      form.setFieldsValue({ image: '' });
    }
  };

  const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.scrollTop + target.offsetHeight > target.scrollHeight - 5 && hasMoreMovies && !movieLoading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      dispatch(fetchMovies({ page: nextPage, keyword: searchKeyword }));
    }
  }

  const onFinish = async (values: FieldType) => {
    try {
      const payload: CreatePayload = {
        title: values.title,
        image: values.image || banner.image,
        movie_id: values.movie_id,
        is_active: values.is_active,
      }
      dispatch(updateBanner({ id: banner.id, data: payload })).unwrap();
      showSuccessToast('Banner updated successfully!');
      form.resetFields();
      setBannerImage(banner.image ? { url: banner.image, status: 'done' } as UploadFile : null);
      onClose();
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to update banner');
      if (values.image && values.image !== banner.image) await dispatch(deleteFile(values.image)).unwrap();
      form.resetFields();
    }
  }
  const handleOk = () => {
    form.submit();
  }

  return (
    <Modal
      title="Edit New Banner"
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
        <Button key="update" type="primary" onClick={handleOk}>
          Create
        </Button>,
      ]}
    >
      <Form
        form={form}
        name="edit_banner"
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
            <Upload listType="picture-card" fileList={bannerImage ? [bannerImage] : []} onChange={handleBannerChange} beforeUpload={() => false} maxCount={1}>
              {banner ? null : '+ Upload'}
            </Upload>
          </ImgCrop>
        </Form.Item>
        <Form.Item<FieldType> label="Movie" name="movie_id" rules={[{ required: true, message: 'Please select movie!' }]}>
          <Select
            showSearch
            className="[&_.ant-select-selector]:p-2"
            style={{ width: '100%' }}
            placeholder="Select movie"
            allowClear
            onSearch={handleSearch}
            filterOption={false}
            suffixIcon={movieLoading ? <Spin size="small" /> : null}
            onPopupScroll={handlePopupScroll}
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
}

export default BannerEdit