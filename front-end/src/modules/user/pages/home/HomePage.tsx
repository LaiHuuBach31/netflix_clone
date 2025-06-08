import { CaretLeftOutlined, CaretRightOutlined, CloseOutlined, DesktopOutlined, DownCircleOutlined, LeftOutlined, LockOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Card, Carousel, Col, Collapse, Input, Row, Space } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

import React, { useEffect, useState } from 'react';
import './homePage.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Banner from '../../components/banner/Banner';
import QnA from '../../components/q&a/QnA';
import MediaSlider from '../../components/slider/MediaSlider';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { fetchMovies } from '../../../admin/store/movieSlice';
import { Movie } from '../../../admin/services/movieService';
import { useNavigate } from 'react-router';

const HomePage: React.FC = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { response: moviesResponse, loading: moviesLoading } = useSelector((state: RootState) => state.movie);

  useEffect(() => {
    let user = localStorage.getItem('user');
    let access_token = localStorage.getItem('access_token');
    let refresh_token = localStorage.getItem('refresh_token');
    if(user && access_token && refresh_token) {
      dispatch(fetchMovies({ }));
    }
  }, [dispatch]);

  const movies = (moviesResponse?.data?.filter((movie) => movie.is_featured == true) || []) as Movie[];

  const handleMovieDetail = (movieId: number) => {
    navigate(`/home/${movieId}`);
  }

  return (
    <>

      <Banner />

      <div
        className="media-slider mt-[60px] text-white relative"
        style={{ flex: 1, padding: '0 100px' }}
      >
        {moviesLoading ? (
          <div>Loading...</div>
        ) : (
          <MediaSlider 
            title="Trending Now" 
            movies={movies} 
            showIndex={true}
            onClick={handleMovieDetail}
          />
        )}
      </div>

      <div className="reason-join my-[50px] text-red-100 relative" style={{ flex: 1, padding: '0 100px' }}>
        <h1 className="mb-3 font-[1000] text-[30px]">More Reasons to Join</h1>
        <Row gutter={24}>
          <Col span={6}>
            <Card title={<span className="text-white">Enjoy on your TV</span>} variant="borderless" className='h-[200px] bg-[rgb(85,82,65,0.17)]'>
              <div className='text-[gray]'>
                Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more
              </div>
              <div>
                {/* <DesktopOutlined className='text-[35px]' /> */}
              </div>
            </Card>
            <div>

            </div>
          </Col>
          <Col span={6}>
            <Card title={<span className="text-white">Download your shows to watch offline</span>} variant="borderless" className='h-[200px] bg-[rgb(85,82,65,0.17)]'>
              <div className='text-[gray]'>
                Save your favorites easily and always have something to watch.
              </div>
              <div>
                {/* <DownCircleOutlined className='text-[35px]' /> */}
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card title={<span className="text-white">Watch everywhere</span>} variant="borderless" className='h-[200px] bg-[rgb(85,82,65,0.17)]'>
              <div className='text-[gray]'>
                Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.
              </div>
              <div>

              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card title={<span className="text-white">Create profiles for kids</span>} variant="borderless" className='h-[200px] bg-[rgb(85,82,65,0.17)]'>
              <div className='text-[gray]'>
                Send kids on adventures with their favorite characters in a space made just for them — free with your membership.
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <div className="qna my-[50px] text-red-100 relative" style={{ flex: 1, padding: '0 100px' }}>
        <h1 className="mb-3 font-[1000] text-[30px]">Frequently Asked Questions</h1>
        <QnA />
      </div>

      <div className="reason-join my-[50px] text-red-100 " style={{ flex: 1, padding: '0 100px' }}>
        <div className="flex justify-center w-full h-full flex items-center px-10 text-center">
          <div className="w-[50%] text-white">
            <p className="mb-3 text-[18px]">
              Ready to watch? Enter your email to create or restart your membership.
            </p>
            <div className="flex">
              <Input
                placeholder="Email address"
                className="flex-1 h-12 bg-[rgb(85,84,79,0.5)] placeholder:text-gray-400 placeholder-transparent border-none rounded-full px-4 py-2 focus:border-gray focus:bg-[rgb(85,84,79,0.5)] hover:bg-[rgb(85,84,79,0.5)]"
                style={{ color: 'inherit' }}
              />
              <Button
                type="primary"
                className="h-12 bg-[red] text-white font-semibold rounded-full px-6 py-2 ml-2 custom-button-start"
              >
                Get Started <RightOutlined />
              </Button>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default HomePage;