import UserLayout from "../../../layout/UserLayout";
import ProtectedRoute from "../../../routes/ProtectedRoute";
import DetailPage from "../pages/detail/DetailPage";
import WatchMoviePage from "../pages/detail/WatchMoviePage";
import FavoritePage from "../pages/favourite/FavouritePage";
import HomePage from "../pages/home/HomePage";
import MoviesPage from "../pages/movies/MoviesPage";
import ProfilePage from "../pages/profile/ProfilePage";
import RecentlyAddedPage from "../pages/recently-added/RecentlyAddedPage";
import TVShowPage from "../pages/tv-show/TVShowPage";

const UserRoute = [{
    path: '/',
    element: <UserLayout />,
    children: [
        { index: true, element: <HomePage /> },
        {
            path: '/home',
            children: [
                { index: true, element: <HomePage /> },
                { path: ':slug', element: <DetailPage /> },
            ],
        },
        { path: '/profile', element: <ProfilePage /> },
        {
            path: '/favourite',
            element: <ProtectedRoute />,
            children: [
                { index: true, element: <FavoritePage /> },
                { path: ':slug', element: <DetailPage /> },
            ]
        },
        {
            path: '/movies',
            element: <ProtectedRoute />,
            children: [
                { index: true, element: <MoviesPage /> },
                { path: ':slug', element: <DetailPage /> },
            ]
        },
        {
            path: '/tv-show',
            element: <ProtectedRoute />,
            children: [
                { index: true, element: <TVShowPage /> },
                { path: ':slug', element: <DetailPage /> },
            ]
        },
        {
            path: '/recently-added',
            element: <ProtectedRoute />,
            children: [
                { index: true, element: <RecentlyAddedPage /> },
                { path: ':slug', element: <DetailPage /> },
            ]
        },
        {
            path: '/watch-movie/:slug',
            element: <ProtectedRoute />,
            children: [{ path: ':slug', element: <WatchMoviePage /> }],
        },
    ]
}]

export default UserRoute;