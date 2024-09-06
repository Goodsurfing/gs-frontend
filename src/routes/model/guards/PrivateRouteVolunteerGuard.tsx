import { memo } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { useGetProfileInfoQuery } from "@/entities/Profile";

import { getProfileRolePagePageUrl } from "@/shared/config/routes/AppUrls";

interface PrivateRouteVolunteerGuardProps {
    children: JSX.Element;
}

export const PrivateRouteVolunteerGuard = memo(
    ({ children }: PrivateRouteVolunteerGuardProps) => {
        const { locale } = useLocale();
        const location = useLocation();

        const { data } = useGetProfileInfoQuery();

        if (data?.volunteer) {
            return children;
        }

        return (
            <Navigate
                replace
                to={getProfileRolePagePageUrl(locale)}
                state={{ from: location }}
            />
        );
    },
);
