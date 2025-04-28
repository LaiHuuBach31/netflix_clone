import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import React from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface MediaSliderProps {
    title: string;
    movies: {
        id: number;
        title: string;
        image: string;
    }[];
    showIndex?: boolean;
    slidesPerView?: number;
    spaceBetween?: number;
    height?: number;
};


const MediaSlider: React.FC<MediaSliderProps> = ({ title, movies, showIndex = false, slidesPerView = 7, spaceBetween = 30, height = 149.286 }) => {
    return (
        <>
            <h1 className="mb-3 font-extrabold text-[30px]">{title}</h1>

            <div className="swiper-button-prev-custom absolute top-[60%] left-0 -translate-x-full -translate-y-1/2 z-10 text-3xl cursor-pointer text-gray-600">
                <LeftOutlined />
            </div>

            <div className="swiper-button-next-custom absolute top-[60%] right-0 translate-x-full -translate-y-1/2 z-10 text-3xl cursor-pointer text-gray-600">
                <RightOutlined />
            </div>

            <Swiper
                spaceBetween={spaceBetween}
                slidesPerView={slidesPerView}
                navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                }}
                modules={[Pagination, Navigation]}
                className="mySwiper "
            >
                {movies.map((movie, index) => (
                    <SwiperSlide key={movie.id}>
                        <div className={`relative overflow-hidden rounded-xl h-[${height}px]`}>
                            <img
                                className=" rounded-xl transition-transform duration-500 transform hover:scale-110 w-full h-full"
                                src={movie.image}
                                alt={movie.title}
                            />
                            {showIndex && (
                                <span className="absolute top-2 left-2 text-5xl font-extrabold text-black drop-shadow-[3px_3px_0_rgba(255,255,255,1)] shadow-lg">
                                    {index + 1}
                                </span>
                            )}
                        </div>
                        <p className="text-center mt-2 text-sm">{movie.title}</p>
                    </SwiperSlide>
                ))}

            </Swiper>
        </>
    );
};

export default MediaSlider;
