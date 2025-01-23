import { AuthProvider } from "@/routes/model/guards/AuthProvider";
import { PrivateRouteGuard } from "@/routes/model/guards/PrivateRouteGuard";
import { PrivateRouteVolunteerGuard } from "@/routes/model/guards/PrivateRouteVolunteerGuard";

import { FavoriteOffersPage } from "@/pages/FavoriteOffersPage";
import { MessengerPage } from "@/pages/MessengerPage";
import { OfferLayoutPage } from "@/pages/OfferLayoutPage/OfferLayoutPage";
import { ProfileLayoutPage } from "@/pages/ProfileLayoutPage";
import { ProfileResetPasswordPage } from "@/pages/ProfileResetPasswordPage";
import { VolunteerLayoutPage } from "@/pages/VolunteerLayoutPage";

import { AppRoutes } from "./AppRoutes";

export const AuthRoutes = {
    [AppRoutes.PROFILE]: (
        <PrivateRouteGuard>
            <ProfileLayoutPage />
        </PrivateRouteGuard>
    ),
    [AppRoutes.PROFILE_RESET_PASSWORD]: (
        <AuthProvider>
            <ProfileResetPasswordPage />
        </AuthProvider>
    ),
    [AppRoutes.VOLUNTEER]: (
        <PrivateRouteGuard>
            <PrivateRouteVolunteerGuard>
                <VolunteerLayoutPage />
            </PrivateRouteVolunteerGuard>
        </PrivateRouteGuard>
    ),
    [AppRoutes.OFFERS]: (
        <PrivateRouteGuard>
            <AuthProvider>
                <OfferLayoutPage />
            </AuthProvider>
        </PrivateRouteGuard>
    ),
    [AppRoutes.MESSENGER]: (
        <PrivateRouteGuard>
            <AuthProvider>
                <MessengerPage />
            </AuthProvider>
        </PrivateRouteGuard>
    ),
    [AppRoutes.FAVORITE_OFFERS]: (
        <PrivateRouteGuard>
            <AuthProvider>
                <FavoriteOffersPage />
            </AuthProvider>
        </PrivateRouteGuard>
    ),
};
