import { memo } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { getSignInPageUrl } from "@/shared/config/routes/AppUrls";
import { useAppSelector } from "@/shared/hooks/redux";

import { getUserAuthData } from "@/entities/User";
import { useLocale } from "@/app/providers/LocaleProvider";

interface PrivateRouteGuardProps {
    children: JSX.Element;
}

export const PrivateRouteGuard = memo(({ children }: PrivateRouteGuardProps) => {
    const { locale } = useLocale();
    const location = useLocation();

    const authData = useAppSelector(getUserAuthData);

    if (authData) {
        return children;
    }

    return <Navigate replace to={getSignInPageUrl(locale)} state={{ from: location }} />;
});
