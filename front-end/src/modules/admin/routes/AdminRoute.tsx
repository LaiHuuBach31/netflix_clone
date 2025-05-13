import AdminLayout from "../../../layout/AdminLayout";
import PrivateRoute from "../../../routes/ProtectedRoute";
import OverviewPage from "../pages/OverviewPage";
import UsersPage from "../pages/UsersPage";
import OrdersPage from "../pages/OrdersPage";
import SettingsPage from "../pages/SettingsPage";
import GenrePage from "../pages/GenrePage";
import MenuPage from "../pages/MenuPage";


const AdminRoute = [
  {
    path: '/admin',
    element: <PrivateRoute />, 
    children: [
      {
        element: <AdminLayout />,  
        children: [
          { index: true, element: <OverviewPage /> },  
          { path: 'genres', element: <GenrePage /> },              
          { path: 'menus', element: <MenuPage /> },              
          { path: 'users', element: <UsersPage /> },  
          { path: 'orders', element: <OrdersPage /> }, 
          { path: 'settings', element: <SettingsPage /> },
        ]
      }
    ]
  }
];

export default AdminRoute;
