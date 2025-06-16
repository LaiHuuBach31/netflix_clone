import React, { useEffect, useRef, useState } from 'react';
import './WatchMoviePage.css';
import { AppDispatch, RootState } from '../../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { showMovieDetail } from '../../../admin/store/movieSlice';
import { Button } from 'antd';
import Hls from 'hls.js';

const WatchMoviePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedOMovie: movie, loading: moviesLoading } = useSelector((state: RootState) => state.movie);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);
  const [activeEpisode, setActiveEpisode] = useState<string | null>(null); // Theo dõi tập đang active

  useEffect(() => {
    if (slug) {
      dispatch(showMovieDetail(slug));
    }
  }, [dispatch, slug]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && selectedEpisode) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(selectedEpisode);
        hls.attachMedia(video);
        video.play().catch((error) => console.error('Auto play failed:', error));
        return () => {
          hls.destroy();
        };
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = selectedEpisode;
        video.play().catch((error) => console.error('Auto play failed:', error));
      }
    }
  }, [selectedEpisode]);

  const handleEpisodeClick = (link_m3u8: string, episodeName: string) => {
    setSelectedEpisode(link_m3u8);
    setActiveEpisode(episodeName); 
  };

  if (moviesLoading || !movie) {
    return <div className="text-white text-center py-6">Loading...</div>;
  }

  return (
    <div className="watch-movie-page">
      <h1 className="text-2xl font-bold text-white mb-4">Watch Movie: {movie?.name}</h1>

      <video
        ref={videoRef}
        controls
        autoPlay={!!selectedEpisode} 
        width="100%"
        height="auto"
        poster={movie?.poster_url ? `https://img.ophim.live/uploads/movies/${movie.poster_url}` : undefined} 
      />

      <div className="movie-info">
        <div className="episode-info flex items-center flex-wrap gap-2 mt-5">
          {movie?.episodes && movie.episodes.length > 0 ? (
            movie.episodes.map((server, serverIndex) =>
              server.server_data.map((episode, episodeIndex) => {
                const episodeName = episode.name === 'Full' ? 'Full' : `Episode ${episodeIndex + 1}`;
                return (
                  <div key={`${serverIndex}-${episodeIndex}`} className="episode-item">
                    <Button
                      className={`watch-episode-button ${activeEpisode === episodeName ? 'active' : ''}`}
                      onClick={() => handleEpisodeClick(episode.link_m3u8, episodeName)}
                    >
                      <span className="episode-title">
                        {episode.name === 'Full' ? (
                          <span className="full-episode">Full</span>
                        ) : (
                          `Episode ${episodeIndex + 1}`
                        )}
                      </span>
                    </Button>
                  </div>
                );
              })
            )
          ) : (
            <button className="episode-button">Full</button>
          )}
        </div>
      </div>

      <div className="mt-12 border-t border-[#3b3b5b] pt-6">
        <h3 className="text-white font-bold uppercase text-sm">COMMENT</h3>
        <p className="text-sm text-gray-400 mt-2">NO COMMENT</p>
      </div>
      
    </div>
  );
};

export default WatchMoviePage;