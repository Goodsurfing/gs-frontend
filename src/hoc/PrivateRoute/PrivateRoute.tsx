import React, { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSelector } from "@/hooks/redux";

import { AppRoutesEnum } from "@/routes/types";

interface PrivateRouteProps {
    Component: FC;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ Component }) => {
    const navigate = useNavigate();
    const { token } = useAppSelector((state) => state.login);

    useEffect(() => {
        if (!token) {
            return navigate(AppRoutesEnum.SIGNIN);
        }
    }, [token, navigate]);

    return <Component />;
};

export default PrivateRoute;
