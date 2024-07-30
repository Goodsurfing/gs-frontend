import { AuthProvider } from "@/routes/model/guards/AuthProvider";

import { ProfileResetPasswordPage } from "@/pages/ProfileResetPasswordPage";

import { AppRoutes } from "./AppRoutes";
import { PrivateRouteGuard } from "@/routes/model/guards/PrivateRouteGuard";
import { OfferDescriptionPage } from "@/pages/OfferDescriptionPage";
import { MessengerPage } from "@/pages/MessengerPage";

export const AuthRoutes = {
    [AppRoutes.PROFILE_RESET_PASSWORD]: (
        <PrivateRouteGuard>
            <AuthProvider>
                <ProfileResetPasswordPage />
            </AuthProvider>
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
