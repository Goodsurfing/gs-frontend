import { memo } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { useGetProfileInfoQuery } from "@/entities/Profile";

import { getProfileRolePageUrl } from "@/shared/config/routes/AppUrls";
import Preloader from "@/shared/ui/Preloader/Preloader";

interface PrivateRouteVolunteerGuardProps {
    children: JSX.Element;
}

export const PrivateRouteVolunteerGuard = memo(
    ({ children }: PrivateRouteVolunteerGuardProps) => {
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

        if (data.volunteer) {
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
