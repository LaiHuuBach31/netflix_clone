import React, { use, useEffect } from 'react'
import SectionHeader from '../../components/section/SectionHeader'
import SectionTop from '../../components/section/SectionTop'
import MediaSlider from '../../components/slider/MediaSlider'
import { Button } from 'antd';
import SectionEnd from '../../components/section/SectionEnd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { fetchMovies, getAllMovies } from '../../../admin/store/movieSlice';
import { fetchGenres, getAllGenres, getMovieByGenre } from '../../../admin/store/genreSlice';
import { Genre, GenreItem } from '../../../admin/services/genreService';
import { useNavigate } from 'react-router-dom';
import { MovieItem } from '../../../admin/services/movieService';


const MoviesPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { response: genresResponse, oResponse: oGenresResponse, oMovieResponse: oMovieByGenerResponse, loading: genresLoading } = useSelector((state: RootState) => state.genre);
    const { response: moviesResponse, oResponse: oMoviesResponse, loading: moviesLoading } = useSelector((state: RootState) => state.movie);

    // useEffect(() => {
    //     dispatch(fetchMovies({ page: 1, keyword: '' }));
    //     dispatch(fetchGenres({ page: 1, keyword: '' }));
    // }, [dispatch]);

    // const genres = (genresResponse?.data || []) as Genre[];
    // const movies = (moviesResponse?.data || []) as Movie[];

    // const handleMovieDetail = (movieId: number) => {
    //     navigate(`/movies/${movieId}`);
    // }

    useEffect(() => {
        dispatch(getAllGenres());
    }, [dispatch]);

    const genres = (oGenresResponse?.data.items || []) as GenreItem[];
    const movies = (oMovieByGenerResponse?.data?.items || []) as MovieItem[];
    console.log(movies);
    

    useEffect(() => {
        genres.forEach((genre) => {
            dispatch(getMovieByGenre({ slug: genre.slug, page: 1 }));
        });
    }, [dispatch]);

    const handleMovieDetail = (slug: string) => {
        navigate(`/movies/${slug}`);
    }

    return (
        <>
            <SectionTop title="Movies" description="Movies move us like nothing else can, whether they’re scary, funny, dramatic, romantic or anywhere in-between. So many titles, so much to experience." />

            {/* {
                genres.map((genre) => (
                    <div className='media-slider mt-[60px] text-[white] text-white !relative mt-[20px]'>
                        <MediaSlider 
                            title={genre.name} 
                            movies={movies.filter((movie) => movie.genre_id == genre.id)} 
                            slidesPerView={5} 
                            spaceBetween={10} 
                            height={150} 
                            onClick={handleMovieDetail}
                        />
                    </div>
                ))
            } */}

            {genres.map((genre) => {
                const genreMovies = movies.filter((movie) =>
                    movie.category.some((cat) => cat.slug === genre.slug)
                );
                
                return (
                    <div
                        key={genre.id}
                        className="media-slider mt-[60px] text-[white] !relative mt-[20px]"
                    >
                        <SectionHeader title={genre.name} />
                        <MediaSlider
                            title={genre.name}
                            movies={genreMovies}
                            slidesPerView={5}
                            spaceBetween={10}
                            height={150}
                            onClick={handleMovieDetail}
                        />
                    </div>
                );
            })}
            <SectionEnd />
        </>
    )
}

export default MoviesPage