import React, { useEffect } from 'react'
import SectionTop from '../../components/section/SectionTop'
import MediaSlider from '../../components/slider/MediaSlider'
import SectionEnd from '../../components/section/SectionEnd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { fetchMovies } from '../../../admin/store/movieSlice';
import { fetchGenres } from '../../../admin/store/genreSlice';
import { Genre } from '../../../admin/services/genreService';
import { Movie } from '../../../admin/services/movieService';
import { useNavigate } from 'react-router';


const TVShowPage: React.FC = () => {

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
        navigate(`/tv-show/${movieId}`);
    }

    return (
        <>
            <SectionTop title="TV Shows" description="These days, the small screen has some very big things to offer. From sitcoms to dramas to travel and talk shows, these are all the best programs on TV." />

            <div className='media-slider mt-[60px] text-[white] text-white !relative mt-[20px]'>
                {/* <MediaSlider
                    title="Drama Movies Based on Books"
                    movies={movies}
                    slidesPerView={5}
                    spaceBetween={10}
                    height={150}
                    onClick={handleMovieDetail}
                /> */}
            </div>

            <SectionEnd />

        </>
    )
}

export default TVShowPage