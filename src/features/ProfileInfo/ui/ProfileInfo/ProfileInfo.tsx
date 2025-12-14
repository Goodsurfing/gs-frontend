import { memo } from "react";

import cn from "classnames";

import { useTranslation } from "react-i18next";
import { ProfileInfoForm } from "../ProfileInfoForm/ProfileInfoForm";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import { ProfileInfoVerifyEmail } from "../ProfileInfoVerifyEmail/ProfileInfoVerifyEmail";

interface ProfileInfoProps {
    className?: string;
}

export const ProfileInfo = memo((props: ProfileInfoProps) => {
    const { className } = props;
    const { t } = useTranslation("profile");
    const {
        myProfile, profileIsLoading, profileIsError,
    } = useAuth();

    if (profileIsLoading) {
        return (
            <div className={cn(className)}>
                <MiniLoader />
            </div>
        );
    }

    if (profileIsError || !myProfile) {
        return (
            <div className={cn(className)}>
                {t("info.Произошла ошибка")}
            </div>
        );
    }

    return (
        <div className={cn(className)}>
            {!myProfile.isVerified && (
                <ProfileInfoVerifyEmail />
            )}
            <div>
                {myProfile && <ProfileInfoForm profile={myProfile} />}
            </div>
        </div>
    );
});
