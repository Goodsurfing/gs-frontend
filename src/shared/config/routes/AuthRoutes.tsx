import { AuthProvider } from "@/routes/model/guards/AuthProvider";
import { PrivateRouteGuard } from "@/routes/model/guards/PrivateRouteGuard";
import { PrivateRouteVolunteerGuard } from "@/routes/model/guards/PrivateRouteVolunteerGuard";

import { MessengerPage } from "@/pages/MessengerPage";
import { OfferDescriptionPage } from "@/pages/OfferDescriptionPage";
import { ProfileResetPasswordPage } from "@/pages/ProfileResetPasswordPage";
import { VolunteerLayoutPage } from "@/pages/VolunteerLayoutPage";

import { AppRoutes } from "./AppRoutes";
import { ProfileLayoutPage } from "@/pages/ProfileLayoutPage";

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
    [AppRoutes.OFFERS_DESCRIPTION]: (
        <PrivateRouteGuard>
            <AuthProvider>
                <OfferDescriptionPage />
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
};
