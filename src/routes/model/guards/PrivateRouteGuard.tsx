import { memo } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { getAdminSignInPageUrl, getSignInPageUrl } from "@/shared/config/routes/AppUrls";
import { useAppSelector } from "@/shared/hooks/redux";

import { getUserAuthData } from "@/entities/User";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getAdminAuthData } from "@/entities/Admin";
import { RootState } from "@/store/store";

type RoleRoute = "admin" | "user";

interface PrivateRouteGuardProps {
    children: JSX.Element;
    roleRoute?: RoleRoute;
}

export const PrivateRouteGuard = memo((props: PrivateRouteGuardProps) => {
    const { children, roleRoute = "user" } = props;
    const { locale } = useLocale();
    const location = useLocation();

    const roleAuthData: Record<RoleRoute, (state: RootState) => unknown> = {
        user: getUserAuthData,
        admin: getAdminAuthData,
    };

    const signInMap: Record<RoleRoute, (locale: string) => string> = {
        user: getSignInPageUrl,
        admin: getAdminSignInPageUrl,
    };

    const authData = useAppSelector(roleAuthData[roleRoute]);

    if (authData) {
        return children;
    }

    return <Navigate replace to={signInMap[roleRoute](locale)} state={{ from: location }} />;
});
