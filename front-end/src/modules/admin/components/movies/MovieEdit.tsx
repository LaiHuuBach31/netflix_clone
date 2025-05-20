import React, { useEffect, useState } from 'react';
import { Movie } from '../../services/movieService';
import { Button, Form, Input, InputNumber, Modal, Radio, Upload, UploadFile, UploadProps } from 'antd';
import ImgCrop from 'antd-img-crop';
import TextArea from 'antd/es/input/TextArea';
import { useForm } from 'antd/es/form/Form';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';
import { uploadImage, deleteFile, uploadVideo } from '../../store/uploadSlice';
import { updateMovie } from '../../store/movieSlice';

interface MovieEditProps {
  isModalOpen: boolean;
  movie: Movie;
  onClose: () => void;
}

interface FieldType {
  title: string;
  thumbnail: string;
  video_url: string;
  release_year: number;
  is_featured: boolean;
  description: string;
}

const MovieEdit: React.FC<MovieEditProps> = ({ isModalOpen, movie, onClose }) => {
  const [form] = useForm<FieldType>();
  const dispatch = useDispatch<AppDispatch>();
  const { imageUrl, videoUrl, loading, error } = useSelector((state: RootState) => state.upload);
  const [thumbnailList, setThumbnailList] = useState<UploadFile[]>([]);
  const [videoList, setVideoList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (isModalOpen && movie) {
      form.setFieldsValue({
        title: movie.title,
        thumbnail: movie.thumbnail,
        video_url: movie.video_url,
        release_year: movie.release_year,
        is_featured: movie.is_featured === true,
        description: movie.description,
      });

      setThumbnailList([
        {
          uid: '-1',
          name: movie.thumbnail.split('/').pop() || 'thumbnail.jpg',
          status: 'done',
          url: movie.thumbnail,
        },
      ]);

      setVideoList([
        {
          uid: '-2',
          name: movie.video_url.split('/').pop() || 'video.mp4',
          status: 'done',
          url: movie.video_url,
        },
      ]);

    }
  }, [isModalOpen, movie, form]);

  const handleThumbnailChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setThumbnailList(newFileList);

    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const formData = new FormData();
      formData.append('file', newFileList[0].originFileObj as File);

      const file = newFileList[0].originFileObj;
      const previewUrl = URL.createObjectURL(file);
      setThumbnailList([{ ...newFileList[0], url: previewUrl, status: 'uploading' }]);

      dispatch(uploadImage(formData))
        .unwrap()
        .then((result) => {
          setThumbnailList([{ ...newFileList[0], url: result.data, status: 'done' }]);
          form.setFieldsValue({ thumbnail: result.data });
          showSuccessToast(result.message);
        })
        .catch((error: any) => {
          showErrorToast(error.message || 'Failed to upload thumbnail');
          if (imageUrl) {
            dispatch(deleteFile(imageUrl)).unwrap();
          }
          setThumbnailList([{ ...newFileList[0], status: 'error' }]);
        });
    }
  };

  const handleVideoChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setVideoList(newFileList);

    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const formData = new FormData();
      formData.append('file', newFileList[0].originFileObj as File);

      const file = newFileList[0].originFileObj;
      const previewUrl = URL.createObjectURL(file);
      setVideoList([{ ...newFileList[0], url: previewUrl, status: 'uploading' }]);

      dispatch(uploadVideo(formData))
        .unwrap()
        .then((result) => {
          setVideoList([{ ...newFileList[0], url: result.data, status: 'done' }]);
          form.setFieldsValue({ video_url: result.data });
          showSuccessToast(result.message);
        })
        .catch((error: any) => {
          showErrorToast(error.message || 'Failed to upload video');
          if (videoUrl) {
            dispatch(deleteFile(videoUrl)).unwrap();
          }
          setVideoList([{ ...newFileList[0], status: 'error' }]);
        });
    }
  };

  const onFinish = (values: FieldType) => {
    dispatch(updateMovie({ id: movie.id, data: values }))
      .unwrap()
      .then((result) => {
        showSuccessToast(result.message);
        onClose();
      })
      .catch((error: any) => {
        showErrorToast(error.message || 'Failed to update movie');
      });
  };

  const handleOk = () => {
    form.submit();
  };

  return (
    <Modal
      title="Edit Movie"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={onClose}
      closable
      okText="Update"
      cancelText="Cancel"
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="update" type="primary" onClick={handleOk} loading={loading}>
          Update
        </Button>,
      ]}
    >
      <Form
        form={form}
        name="edit_movie"
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
          </div>
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

export default MovieEdit;