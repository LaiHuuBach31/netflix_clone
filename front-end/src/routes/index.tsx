import { useRoutes } from "react-router-dom";
import UserRoute from "../modules/user/routes/UserRoute";
import AdminRoute from "../modules/admin/routes/AdminRoute";
import AuthRoute from "../modules/auth/routes/AuthRoute";
import ForbiddenPage from "../components/errors/ForbiddenPage";

const AppRoute = () => {
    const routes = useRoutes([
        ...AuthRoute,
        ...UserRoute,
        ...AdminRoute,
        {
            path: "/403",
            element: <ForbiddenPage />, 
        },
       
    ]);
    return routes;
}

export default AppRoute;