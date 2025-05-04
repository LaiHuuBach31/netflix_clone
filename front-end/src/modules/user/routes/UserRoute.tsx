import UserLayout from "../../../layout/UserLayout";
import DetailPage from "../pages/detail/DetailPage";
import FavoritePage from "../pages/favourite/FavoritePage";
import HomePage from "../pages/home/HomePage";
import MoviesPage from "../pages/movies/MoviesPage";
import ProfilePage from "../pages/profile/ProfilePage";
import RecentlyAddedPage from "../pages/recently-added/RecentlyAddedPage";
import TVShowPage from "../pages/tv-show/TVShowPage";

const UserRoute = [{
    path: '/',
    element: <UserLayout />,
    children: [
        {index: true, element: <HomePage /> },
        {path: '/profile', element: <ProfilePage /> },
        {path: '/favourite', element: <FavoritePage /> },
        {path: '/movies', element: <MoviesPage /> },
        {path: '/movies/:id', element: <DetailPage /> },
        {path: '/tv-show', element: <TVShowPage /> },
        {path: '/recently-added', element: <RecentlyAddedPage /> },
    ]
}]

export default UserRoute;