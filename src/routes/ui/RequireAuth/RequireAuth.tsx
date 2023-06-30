import { FC } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { RoutePath } from "../../config/RouterConfig";

export interface RequireAuthProps {
    children: JSX.Element;
}

export const RequireAuth: FC<RequireAuthProps> = ({ children }) => {
    const location = useLocation();
    // if (!auth) {
    //     return <Navigate to={RoutePath.main} state={{ from: location }} replace />;
    // }

    return children;
};
