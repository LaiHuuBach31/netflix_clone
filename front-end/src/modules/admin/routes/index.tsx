import AdminLayout from "../../../layout/AdminLayout";
import PrivateRoute from "../../../components/PrivateRoute";
import OverviewPage from "../pages/OverviewPage";
import UsersPage from "../pages/UsersPage";
import OrdersPage from "../pages/OrdersPage";
import SettingsPage from "../pages/SettingsPage";
import GenrePage from "../pages/GenrePage";


const adminRoutes = [
  {
    path: '/admin',
    element: <PrivateRoute />, 
    children: [
      {
        element: <AdminLayout />,  
        children: [
          { index: true, element: <OverviewPage /> },  
          { path: 'genres', element: <GenrePage /> },  
          { path: 'users', element: <UsersPage /> },  
          { path: 'orders', element: <OrdersPage /> }, 
          { path: 'settings', element: <SettingsPage /> },
        ]
      }
    ]
  }
];

export default adminRoutes;
