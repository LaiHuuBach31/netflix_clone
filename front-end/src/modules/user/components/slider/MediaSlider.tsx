import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import React, { useRef } from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { MovieDetail, MovieItem } from '../../../admin/services/movieService';

interface MediaSliderProps {
    id?: string;
    title?: string;
    movies: MovieItem[];
    showIndex?: boolean;
    slidesPerView?: number;
    spaceBetween?: number;
    height?: number;
    onClick?: (slug: string) => void;
};


const MediaSlider: React.FC<MediaSliderProps> = ({ id, title, movies, showIndex = false, slidesPerView = 7, spaceBetween = 30, height = 149.286, onClick }) => {

    const swiperRef = useRef<SwiperRef>(null);

    const handlePrev = () => {
        if (swiperRef.current) swiperRef.current.swiper.slidePrev();
    };

    const handleNext = () => {
        if (swiperRef.current) swiperRef.current.swiper.slideNext();
    };

    return (
        <>
            <h1 className="mb-3 font-extrabold text-[20px] text-white-600">{title}</h1>

            {movies.length > 0 && (
                <>
                    <div
                        className="swiper-button-prev-custom absolute top-[50%] left-0 -translate-x-full -translate-y-1/2 z-10 text-3xl cursor-pointer text-gray-600"
                        onClick={handlePrev}
                        id={`prev-${id}`}
                    >
                        <LeftOutlined />
                    </div>
                    <div
                        className="swiper-button-next-custom absolute top-[50%] right-0 translate-x-full -translate-y-1/2 z-10 text-3xl cursor-pointer text-gray-600"
                        onClick={handleNext}
                        id={`next-${id}`}
                    >
                        <RightOutlined />
                    </div>
                </>
            )}
            <Swiper
                ref={swiperRef}
                spaceBetween={spaceBetween}
                slidesPerView={slidesPerView}
                // navigation={{
                //     nextEl: '.swiper-button-next-custom',
                //     prevEl: '.swiper-button-prev-custom',
                // }}
                modules={[Pagination, Navigation]}
                className="mySwiper "
            >
                {movies.map((movie, index) => (
                    <SwiperSlide key={movie._id}>
                        <div className={`relative overflow-hidden rounded-xl`}
                            style={{ height: `${height}px` }}
                            onClick={() => onClick && onClick(movie.slug)}
                        >
                            <img
                                className="rounded-xl transition-transform duration-500 transform hover:scale-110 w-full h-full object-cover"
                                // style={{ maxHeight: `${Number(height)}px` }}
                                src={`https://img.ophim.live/uploads/movies/${movie.poster_url}`}
                                alt={movie.name}
                            />
                            {showIndex && (
                                <span className="absolute top-2 left-2 text-5xl font-extrabold text-black drop-shadow-[3px_3px_0_rgba(255,255,255,1)] shadow-lg">
                                    {index + 1}
                                </span>
                            )}
                        </div>
                        <p className="text-center mt-2 text-sm text-white-600" >{movie.name}</p>
                    </SwiperSlide>
                ))}

            </Swiper>
        </>
    );
};

export default MediaSlider;
