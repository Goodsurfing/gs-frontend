import { AuthProvider } from "@/routes/model/guards/AuthProvider";

import { ProfileResetPasswordPage } from "@/pages/ProfileResetPasswordPage";

import { AppRoutes } from "./AppRoutes";
import { PrivateRouteGuard } from "@/routes/model/guards/PrivateRouteGuard";

export const AuthRoutes = {
    [AppRoutes.PROFILE_RESET_PASSWORD]: (
        <PrivateRouteGuard>
            <AuthProvider>
                <ProfileResetPasswordPage />
            </AuthProvider>
        </PrivateRouteGuard>
    ),
};
