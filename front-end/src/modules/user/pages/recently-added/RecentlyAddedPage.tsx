import React, { useEffect } from 'react'
import MediaSlider from '../../components/slider/MediaSlider'
import SectionTop from '../../components/section/SectionTop';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { fetchMovies } from '../../../admin/store/movieSlice';
import { fetchGenres } from '../../../admin/store/genreSlice';
import { Genre } from '../../../admin/services/genreService';
import { Movie } from '../../../admin/services/movieService';
import { useNavigate } from 'react-router';


const RecentlyAddedPage: React.FC = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { response: genresResponse, loading: genresLoading } = useSelector((state: RootState) => state.genre);
    const { response: moviesResponse, loading: moviesLoading } = useSelector((state: RootState) => state.movie);

    useEffect(() => {
        dispatch(fetchMovies({ page: 1, keyword: '' }));
        dispatch(fetchGenres({ page: 1, keyword: '' }));
    }, [dispatch]);

    const genres = (genresResponse?.data) || [] as Genre[];
    const movies = (moviesResponse?.data || []) as Movie[];

    const handleMovieDetail = (movieId: number) => {
        navigate(`/recently-added/${movieId}`);
    }

    return (
        <>
            <SectionTop title="Recently Added" description="Movies move us like nothing else can, whether they’re scary, funny, dramatic, romantic or anywhere in-between. So many titles, so much to experience." />
            {/* <MediaSlider 
                title="New Arrivals" 
                movies={movies} 
                slidesPerView={5} 
                onClick={handleMovieDetail}
            /> */}
        </>
    )
}

export default RecentlyAddedPage