import { AuthProvider } from "@/routes/model/guards/AuthProvider";
import { PrivateRouteGuard } from "@/routes/model/guards/PrivateRouteGuard";

import { MessengerPage } from "@/pages/MessengerPage";
import { OfferDescriptionPage } from "@/pages/OfferDescriptionPage";
import { ProfileResetPasswordPage } from "@/pages/ProfileResetPasswordPage";
import { VolunteerLayoutPage } from "@/pages/VolunteerLayoutPage";

import { AppRoutes } from "./AppRoutes";

export const AuthRoutes = {
    [AppRoutes.PROFILE_RESET_PASSWORD]: (
        <PrivateRouteGuard>
            <AuthProvider>
                <ProfileResetPasswordPage />
            </AuthProvider>
        </PrivateRouteGuard>
    ),
    [AppRoutes.VOLUNTEER]: (
        <PrivateRouteGuard>
            {/* <PrivateRouteVolunteerGuard> */}
            <VolunteerLayoutPage />
            {/* </PrivateRouteVolunteerGuard> */}
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
