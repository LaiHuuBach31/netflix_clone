import React, { useEffect } from 'react'
import './favouritePage.css';
import { Button, Col, Rate, Row, Select, Tag } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Option } from 'antd/es/mentions';
import SectionHeader from '../../components/section/SectionHeader';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import useSelection from 'antd/es/table/hooks/useSelection';
import { deleteFavourite, fetchFavourites } from '../../../admin/store/favouriteSlice';
import { showSuccessToast } from '../../../../utils/toast';


function FavouritePage() {

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { response: favouriteResponse, loading: favoriteLoading } = useSelector((state: RootState) => state.favourite);

  useEffect(() => {
    dispatch(fetchFavourites({ page: 1, keyword: '' }));
  }, [dispatch]);
  
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
  
  const movieFavourites = favouriteResponse?.data.filter((movie) => movie.user_id == userId) || [];

  const handleDeleteMovieFavourite = (movieId: number) => {
    dispatch(deleteFavourite(movieId))
      .then((response => {
        showSuccessToast('Delete Success');
        dispatch(fetchFavourites({ page: 1, keyword: '' }));
      }))
      .catch(() => {
        showSuccessToast('Delete Faild');
      });
  }

  const handleMovieDetail = (movieId : number) => {
    navigate(`/favourite/${movieId}`);
  }

  return (
    <>
      <div className='favorite' style={{ flex: 1, padding: '0 100px' }}>

        <SectionHeader title="Favorite" showSelect={true} />

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {movieFavourites.map((movieFavorite) => (
            <div key={movieFavorite.id} className="relative text-white" onClick={() => handleMovieDetail(movieFavorite.movie_id)}>
              <img
                src={movieFavorite?.movie?.thumbnail}
                alt={movieFavorite?.movie?.title}
                className="w-full h-[220px] object-cover rounded-md"
              />
              <div
                className={`absolute top-1 left-1 px-1.5 py-0.5 text-xs font-bold text-white rounded-sm bg-red-500`}
              >
                HOT
              </div>
              <CloseCircleOutlined
                className="absolute top-1 right-1 text-red-500 text-xl cursor-pointer"
                onClick={() => handleDeleteMovieFavourite(movieFavorite.id)}
              />
              <p className="text-sm text-center mt-2 font-medium line-clamp-2 min-h-[3rem]">
                {movieFavorite.movie.title}
              </p>
            </div>
          ))}
        </div>

      </div>
    </>
  )
}

export default FavouritePage