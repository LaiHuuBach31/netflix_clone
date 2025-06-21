import React, { useEffect } from 'react';
import SectionHeader from '../../components/section/SectionHeader';
import SectionTop from '../../components/section/SectionTop';
import MediaSlider from '../../components/slider/MediaSlider';
import SectionEnd from '../../components/section/SectionEnd';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { getAllGenres, getMovieByGenre } from '../../../admin/store/genreSlice';
import { GenreItem } from '../../../admin/services/genreService';
import { useNavigate } from 'react-router-dom';
import { MovieItem } from '../../../admin/services/movieService';
import { showInfoToast } from '../../../../utils/toast';

const MoviesPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { oResponse, oMovieResponse: oMovieByGenerResponse, loading: genresLoading } = useSelector(
        (state: RootState) => state.genre
    );
    const { loading: moviesLoading } = useSelector((state: RootState) => state.movie);

    const genres = (oResponse?.data?.items || []) as GenreItem[];
    const moviesByGenre = oMovieByGenerResponse || {};

    useEffect(() => {
        dispatch(getAllGenres());
        console.log('Fetching all genres...');

    }, [dispatch]);

    useEffect(() => {
        if (genres.length > 0) {
            genres.forEach((genre) => {
                dispatch(getMovieByGenre({ slug: genre.slug, page: 1 }));
            });
        }
    }, [dispatch, genres.length]);

    const handleMovieDetail = (slug: string) => {
        navigate(`/movies/${slug}`);
    };

    // if (genresLoading || moviesLoading) {
    //     showInfoToast('Loading movies, please wait...');
    //     return <div className="text-white text-center py-10">Loading...</div>;
    // }

    return (
        <div

        >
            <SectionTop
                title="Movies"
                description="Movies move us like nothing else can, whether they’re scary, funny, dramatic, romantic or anywhere in-between. So many titles, so much to experience."
            />

            {genres.map((genre) => {   
                if(genre.slug === 'phim-18') {
                    return null;  
                }             
                const genreMovies = moviesByGenre[genre.slug]?.data.items || [];
                const filteredMovies = genreMovies.filter((movie) =>
                    movie.category.some((cat) => cat.slug === genre.slug)
                );

                return (
                    <div
                        key={genre.slug}
                        className="media-slider mt-[60px] text-[white] !relative mt-[20px]"
                    >
                        <MediaSlider
                            id={`slider-${genre.slug}`}
                            title={genre.name}
                            movies={filteredMovies}
                            slidesPerView={5}
                            spaceBetween={10}
                            height={150}
                            onClick={handleMovieDetail}
                        />
                    </div>
                );
            })}
            <SectionEnd />
        </div>
    );
};

export default MoviesPage;