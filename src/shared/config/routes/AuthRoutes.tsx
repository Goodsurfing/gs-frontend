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
        <ProfileResetPasswordPage />
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
            <OfferLayoutPage />
        </PrivateRouteGuard>
    ),
    [AppRoutes.MESSENGER]: (
        <PrivateRouteGuard>
            <MessengerPage />
        </PrivateRouteGuard>
    ),
    [AppRoutes.FAVORITE_OFFERS]: (
        <PrivateRouteGuard>
            <FavoriteOffersPage />
        </PrivateRouteGuard>
    ),
};
