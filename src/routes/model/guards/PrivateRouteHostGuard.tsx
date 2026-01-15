import { memo } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { useGetProfileInfoQuery } from "@/entities/Profile";

import { getProfileRolePageUrl } from "@/shared/config/routes/AppUrls";
import Preloader from "@/shared/ui/Preloader/Preloader";

interface PrivateRouteHostGuardProps {
    children: JSX.Element;
}

export const PrivateRouteHostGuard = memo(
    ({ children }: PrivateRouteHostGuardProps) => {
        const { locale } = useLocale();
        const location = useLocation();
        const { data, isLoading, isError } = useGetProfileInfoQuery();

        if (isLoading) {
            return <Preloader />;
        }

        if (isError || !data) {
            return (
                <Navigate
                    replace
                    to={getProfileRolePageUrl(locale)}
                    state={{ from: location }}
                />
            );
        }

        if (data.hostId) {
            return children;
        }

        return (
            <Navigate
                replace
                to={getProfileRolePageUrl(locale)}
                state={{ from: location }}
            />
        );
    },
);
