import React, { useEffect, useState } from 'react'
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
import { showErrorToast, showSuccessToast } from '../../../../utils/toast';
import { showMovieDetail } from '../../../admin/store/movieSlice';
import { log } from 'console';


function FavouritePage() {

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { response: favouriteResponse, loading: favoriteLoading } = useSelector((state: RootState) => state.favourite);
  const [favouriteMovies, setFavouriteMovies] = useState<any[]>([]);
  const [loadingMovies, setLoadingMovies] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchFavourites({ page: 1, keyword: '' }));
  }, [dispatch]);

  useEffect(() => {
    if (favouriteResponse?.data) {
      setLoadingMovies(true);
      const fetchMovieDetails = async () => {
        try {
          const movieDetails = await Promise.all(

            favouriteResponse.data.map(async (fav: any) => {
              const response = await dispatch(showMovieDetail(fav.movie_id));
              return { ...fav, movieData: response.payload };
            })
          );
          setFavouriteMovies(movieDetails);
        } catch (error) {
          console.error('Failed to fetch movie details:', error);
          showErrorToast('Failed to load movie details');
        } finally {
          setLoadingMovies(false);
        }
      };
      fetchMovieDetails();
    }
  }, [favouriteResponse]);


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

  const handleDeleteMovieFavourite = (movieId: number) => {
    dispatch(deleteFavourite(movieId)).unwrap()
      .then((response => {
        console.log(response);
        showSuccessToast('Delete Success');
        dispatch(fetchFavourites({ page: 1, keyword: '' }));
      }))
      .catch((error: any) => {
        const errorDetails = error.errors ? Object.values(error.errors).flat() : [];
        const detailedError = errorDetails.length
          ? errorDetails[0]
          : error.message || "Failed to create genre";
        showErrorToast(detailedError);
      });
  }

  const handleMovieDetail = (slug: string) => {
    navigate(`/movies/${slug}`);
  }

  return (
    <>
      <div className='favorite' style={{ flex: 1, padding: '0 100px' }}>

        <SectionHeader title="Favorite" showSelect={true} />

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {favouriteMovies.map((movieFavorite) => (

            <div key={movieFavorite.id} className="relative text-white">
              <img
                src={`https://img.ophim.live/uploads/movies/${movieFavorite?.movieData?.data?.item?.thumb_url}`}
                alt={movieFavorite?.movieData?.data?.item.name}
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
              <p
                className="text-sm text-center mt-2 font-medium line-clamp-2 min-h-[3rem] hover:text-red-500 cursor-pointer"
                onClick={() => handleMovieDetail(movieFavorite?.movieData?.data?.item.slug)}
              >
                {movieFavorite?.movieData?.data?.item.name}
              </p>

            </div>
          ))}
        </div>

      </div>
    </>
  )
}

export default FavouritePage