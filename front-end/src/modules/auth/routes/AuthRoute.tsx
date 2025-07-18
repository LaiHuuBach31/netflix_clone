import { Children } from "react";
import LoginPage from "../pages/login/LoginPage";
import ChoosePlanPage from "../pages/register/ChoosePlanPage";
import PaymentPage from "../pages/register/PaymentPage";
import SignUpPage from "../pages/register/SignUpPage";
import WelcomePage from "../pages/register/WelcomePage";
import GuestRoute from "../../../routes/GuestRoute";
import SubscriptionExtension from "../pages/subscription/SubscriptionExtension";

const AuthRoute = [
    {
        element: <GuestRoute />,
        children: [
            { path: '/login', element: <LoginPage /> },
            { path: '/welcome', element: <WelcomePage /> },
            { path: '/signup', element: <SignUpPage /> },
            { path: '/signup/password', element: <ChoosePlanPage /> },
            { path: '/signup/plan', element: <ChoosePlanPage /> },
            { path: '/signup/payment', element: <PaymentPage /> },
            { path: '/subscription-extension', element: <SubscriptionExtension /> },
        ]
    }
]

export default AuthRoute;