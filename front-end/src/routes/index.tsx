import { useRoutes } from "react-router-dom";
import userRoutes from "../modules/user/routes";
import adminRoutes from "../modules/admin/routes";
import authRoutes from "../modules/auth/routes";

const AppRoute = () => {
    const routes = useRoutes([
        ...authRoutes,
        ...userRoutes,
        ...adminRoutes
    ])
    return routes
}

export default AppRoute;