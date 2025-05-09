import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { checkAuth, refreshAccessToken } from './store/slices/authSlice';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import AppRoute from './routes';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
    const { loading, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp === undefined || decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken && !isAuthenticated && !loading) {
    dispatch(checkAuth());
        }

    const interval = setInterval(() => {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken && isTokenExpired(accessToken)) {
        dispatch(refreshAccessToken());
      }
    }, 60000);

    return () => clearInterval(interval);
    }, [dispatch, isAuthenticated, loading]);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken && !isTokenExpired(accessToken)) {
      const decoded = jwtDecode<JwtPayload>(accessToken);
      const expireAt = decoded.exp! * 1000;
      const timeToRefresh = expireAt - Date.now() - 5 * 60 * 1000;
      if (timeToRefresh > 0) {
        const timeoutId = setTimeout(() => {
          dispatch(refreshAccessToken());
        }, timeToRefresh);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <AppRoute />
    </div>
  );
};

export default App;


