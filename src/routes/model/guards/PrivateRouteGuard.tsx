import { ReactNode, memo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useLocale } from "@/routes/ui/useLocale/useLocale";
import { useAppSelector } from "@/shared/hooks/redux";
import { getSignInPageUrl } from "../services/AppUrls/AppUrls";
import { getUserAuthData } from "@/entities/User";

interface PrivateRouteGuardProps {
    children: ReactNode;
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
