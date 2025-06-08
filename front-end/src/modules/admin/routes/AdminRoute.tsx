import AdminLayout from "../../../layout/AdminLayout";
import OverviewPage from "../pages/OverviewPage";
import UsersPage from "../pages/UsersPage";
import SettingsPage from "../pages/SettingsPage";
import GenrePage from "../pages/GenrePage";
import MenuPage from "../pages/MenuPage";
import PlanPage from "../pages/PlanPage";
import MoviePage from "../pages/MoviePage";
import RolePage from "../pages/RolePage";
import BannerPage from "../pages/BannerPage";
import SubscriptionPage from "../pages/SubscriptionPage";
import WatchHistoryPage from "../pages/WatchHistoryPage";
import RatingPage from "../pages/RatingPage";
import FavouritePage from "../pages/FavouritePage";
import ProtectedRoute from "../../../routes/ProtectedRoute";


const AdminRoute = [
  {
    path: '/admin',
    element: <ProtectedRoute />, 
    children: [
      {
        element: <AdminLayout />,  
        children: [
          { index: true, element: <OverviewPage /> },  
          { path: 'genres', element: <GenrePage /> },              
          { path: 'menus', element: <MenuPage /> },              
          { path: 'plans', element: <PlanPage /> },              
          { path: 'movies', element: <MoviePage /> },              
          { path: 'users', element: <UsersPage /> },  
          { path: 'roles', element: <RolePage /> },  
          { path: 'banners', element: <BannerPage /> },  
          { path: 'subscriptions', element: <SubscriptionPage /> },  
          { path: 'watch-history', element: <WatchHistoryPage /> },  
          { path: 'ratings', element: <RatingPage /> },  
          { path: 'favourites', element: <FavouritePage /> },  
          // { path: 'orders', element: <OrdersPage /> }, 
          { path: 'settings', element: <SettingsPage /> },
        ]
      }
    ]
  }
];

export default AdminRoute;
