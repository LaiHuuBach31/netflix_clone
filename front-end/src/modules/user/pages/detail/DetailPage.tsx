import { Button, Rate, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import SectionHeader from '../../components/section/SectionHeader'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { fetchMovieById, setSelectedMovie, setSelectedOMovie, showMovieDetail } from '../../../admin/store/movieSlice';
import { HeartOutlined } from '@ant-design/icons';
import { createFavourite, deleteFavourite, fetchFavourites } from '../../../admin/store/favouriteSlice';
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';

const DetailPage: React.FC = () => {

    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { selectedOMovie: movie, loading: moviesLoading, fetchingSlug } = useSelector((state: RootState) => state.movie);
    const { response: favouriteResponse } = useSelector((state: RootState) => state.favourite);


    useEffect(() => {
        if (slug) {
            dispatch(showMovieDetail(slug));
        }

        return () => {
            dispatch(setSelectedOMovie(null));
        };
    }, [dispatch, slug]);

    let userId: number | null = null;
    const user = localStorage.getItem('user');
    if (user) {
        try {
            const parsedUser = JSON.parse(user);
            userId = parsedUser.id;
        } catch (error) {
            console.error('Error parsing user from localStorage:', error);
        }
    }

    const isFavourite = userId && slug && favouriteResponse?.data
        ? favouriteResponse.data.some((fav) => fav.user_id == userId && fav.movie_id == movie?._id)
        : false;


    const handleAddMovieFavourite = () => {
        if (userId && movie?.slug) {
            dispatch(createFavourite({ user_id: userId, movie_id: movie?.slug })).unwrap()
                .then((result) => {
                    showSuccessToast(result.message);
                })
                .catch((error: any) => {
                    const errorDetails = error.errors ? Object.values(error.errors).flat() : [];
                    const detailedError = errorDetails.length
                        ? errorDetails[0]
                        : error.message || "Login failed";
                    showErrorToast(detailedError);
                });
        } else {
            showErrorToast('Faild');
        }
    }

    const handleWatchNow = () => {
       navigate(`/watch-movie/${slug}`);
    }
    

    return (
        <>
            <div style={{ flex: 1, padding: '0 100px' }}>

                {/* <SectionHeader title="Detail" /> */}

                <div className="text-white py-8 px-6">
                    <div className="flex flex-col md:flex-row gap-6">

                        <div className="w-full md:w-[200px] flex-shrink-0">
                            <div className="relative">
                                <div>
                                    <img
                                        src={`https://img.ophim.live/uploads/movies/${movie?.thumb_url}`} alt=""
                                    />
                                </div>
                                <div className="absolute bottom-1 left-1 text-xs bg-black/50 text-white px-1 rounded">
                                    {movie?.lang}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold">
                                    {movie?.name}
                                </h1>
                                <p className="text-sm italic text-gray-400">
                                    {movie?.name}
                                </p>
                            </div>

                            {
                                movie?.content && (
                                    <p className="text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: movie.content }} />
                                )
                            }

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-1 text-sm">
                                <span><strong>Type:</strong> {movie?.type}</span>
                                <span><strong>Produced:</strong> {movie?.year}</span>
                                <span>
                                    <strong>Country: </strong>
                                    {movie?.country.map((coun, index) => (
                                        <Tag key={index} >
                                            {coun.name}
                                        </Tag>
                                    ))}
                                </span>
                                <span><strong>Status:</strong> trailer</span>
                                <span><strong>Date update:</strong> {movie?.modified.time} </span>
                                <span><strong>Episode:</strong> {movie?.episode_current}</span>
                                <span>
                                    <strong>Genre: </strong>
                                    {movie?.category.map((cat, index) => (
                                        <Tag key={index} >
                                            {cat.name}
                                        </Tag>
                                    ))}
                                </span>
                                <span><strong>Duration:</strong> {movie?.time}</span>
                                <span><strong>Quality:</strong> {movie?.quality}</span>
                                <span><strong>Views:</strong> {movie?.view}</span>
                            </div>

                            {/* <div className="flex items-center gap-2 text-yellow-400">
                                <Rate allowHalf disabled defaultValue={5} className="text-[18px]" />
                                <span className="text-sm text-white">1.029 Votes</span>
                            </div> */}

                            <div className="flex gap-2 pt-2">
                                <Button className="bg-red-600 text-white font-bold hover:bg-red-700">WATCH TRAILER</Button>
                                {/* <Link to="/watch-movie"> */}
                                <Button className="bg-red-600 text-white font-bold hover:bg-red-700" onClick={handleWatchNow}>WATCH NOW</Button>
                                {/* </Link> */}
                                <Button
                                    className={`font-bold ${isFavourite ? 'bg-red-500 text-white-500cd' : 'bg-white text-red-500'}`}
                                    onClick={handleAddMovieFavourite}
                                >
                                    <HeartOutlined />
                                </Button>

                            </div>
                        </div>
                    </div>

                    <div className="mt-12 border-t border-[#3b3b5b] pt-6">
                        <h3 className="text-white font-bold uppercase text-sm">COMMENT</h3>
                        <p className="text-sm text-gray-400 mt-2">NO COMMENT</p>
                    </div>

                    <div className="mt-12 border-t border-[#3b3b5b] pt-6">
                        <h3 className="text-white font-bold uppercase text-sm">YOU MIGHT LIKE...</h3>
                        <p className="text-sm text-gray-400 mt-2">
                            No suitable movies yet
                        </p>
                        <Button className="mt-2 bg-red-600 text-white font-bold">LOGIN</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailPage