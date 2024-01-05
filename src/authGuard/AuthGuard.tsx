import { Navigate } from "react-router-dom";
import LoginPage from "../components/LoginPage/LoginPage";
import Utils from "../utils/utils";

const AuthGuard = ({ children }: any) => {
    if (Utils.isUserLoggedIn() && window.location.pathname === "/login") {
        return <Navigate to={"/dashboard"} />;
    }

    if (!Utils.isUserLoggedIn()) {
        return <LoginPage />;
    }

    if (Utils.isUserLoggedIn()) {
        return children
    }
};

export default AuthGuard;
