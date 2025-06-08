import { Button, Rate, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import SectionHeader from '../../components/section/SectionHeader'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { fetchMovieById, setSelectedMovie } from '../../../admin/store/movieSlice';
import { HeartOutlined } from '@ant-design/icons';
import { createFavourite, deleteFavourite, fetchFavourites } from '../../../admin/store/favouriteSlice';
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';

const DetailPage: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { selectedMovie: movie, loading: moviesLoading, fetchingId } = useSelector((state: RootState) => state.movie);
    const { response: favouriteResponse } = useSelector((state: RootState) => state.favourite);


    useEffect(() => {
        if (id) {
            dispatch(fetchMovieById(Number(id)));
        }

        return () => {
            dispatch(setSelectedMovie(null));
        };
    }, [dispatch, id]);


    // if (moviesLoading || fetchingId === Number(id)) {
    //     return <div className="text-white text-center py-6">Loading...</div>;
    // }


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

    const isFavourite = userId && id && favouriteResponse?.data
            ? favouriteResponse.data.some((fav) => fav.user_id == userId && fav.movie_id == Number(id))
            : false;
                
    const handleAddMovieFavourite = () => {
        if (userId && id) {
            // if(favourite){
            //     dispatch(deleteFavourite(favourite[0].id))
            //         .unwrap()
            //         .then(() => {
            //             showSuccessToast('Removed from favourites');
            //             dispatch(fetchFavourites({ page: 1, keyword: '' })); 
            //         })
            //         .catch(() => {
            //             showErrorToast('Failed to remove from favourites');
            //         });
            // } else{
            dispatch(createFavourite({ user_id: userId, movie_id: Number(id) })).unwrap()
                .then((result) => {
                    showSuccessToast(result.message);
                })
                .catch(() => {
                    showErrorToast('Already exists in the list');
                });
            // }
        } else {
            showErrorToast('Faild');
        }
    }

    return (
        <>
            <div style={{ flex: 1, padding: '0 100px' }}>

                <SectionHeader title="Detail" />

                <div className="text-white py-8 px-6">
                    <div className="flex flex-col md:flex-row gap-6">

                        <div className="w-full md:w-[200px] flex-shrink-0">
                            <div className="relative">
                                <div>
                                    <img src={movie?.thumbnail} alt="" height={100} />
                                </div>
                                <div className="absolute bottom-1 left-1 text-xs bg-black/50 text-white px-1 rounded">
                                    Vietsub
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold">
                                    {movie?.title}
                                </h1>
                                <p className="text-sm italic text-gray-400">
                                    {movie?.title}
                                </p>
                            </div>

                            <p className="text-sm text-gray-300">
                                {movie?.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-1 text-sm">
                                <span><strong>Type:</strong> single</span>
                                <span><strong>Produced:</strong> 2025</span>
                                <span><strong>Country:</strong> Global</span>
                                <span><strong>Status:</strong> trailer</span>
                                <span><strong>Date update:</strong> {movie?.release_year}</span>
                                <span><strong>Episode:</strong> Trailer</span>
                                <span><strong>Genre:</strong> <Tag color="green">{movie?.genre?.name}</Tag></span>
                                <span><strong>Duration:</strong> 147 phút</span>
                                <span><strong>Quality:</strong> HD</span>
                                <span><strong>Views:</strong> 10000</span>
                            </div>

                            <div className="flex items-center gap-2 text-yellow-400">
                                <Rate allowHalf disabled defaultValue={5} className="text-[18px]" />
                                <span className="text-sm text-white">1.029 Votes</span>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button className="bg-red-600 text-white font-bold hover:bg-red-700">WATCH TRAILER</Button>
                                <Button className="bg-red-600 text-white font-bold hover:bg-red-700">WATCH NOW</Button>
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
                        <Button className="mt-2 bg-red-600 text-white font-bold">LOGIN</Button>
                    </div>

                    <div className="mt-12 border-t border-[#3b3b5b] pt-6">
                        <h3 className="text-white font-bold uppercase text-sm">YOU MIGHT LIKE...</h3>
                        <p className="text-sm text-gray-400 mt-2">
                            No suitable movies yet
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailPage