import { memo } from "react";
import cn from "classnames";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import vkIcon from "@/shared/assets/icons/social-icons/vk-mini-logo.svg";
import fbIcon from "@/shared/assets/icons/social-icons/facebook-mini-logo.svg";
import instIcon from "@/shared/assets/icons/social-icons/instagram-mini-logo.svg";
import tgIcon from "@/shared/assets/icons/social-icons/telegram-mini-logo.svg";
import { InputControl } from "@/shared/ui/InputControl/InputControl";
import { useAppSelector } from "@/shared/hooks/redux";

import { getProfileReadonly } from "@/entities/Profile";

import styles from "./ProfileInfoFormSocial.module.scss";

interface ProfileInfoFormSocialProps {
    className?: string;
}

export const ProfileInfoFormSocial = memo((props: ProfileInfoFormSocialProps) => {
    const { className } = props;
    const isLocked = useAppSelector(getProfileReadonly);
    const { t } = useTranslation();
    const { control } = useFormContext();
    return (
        <div className={cn(className, styles.wrapper)}>
            <InputControl
                label={t("VK")}
                disabled={isLocked}
                name="social.vk"
                control={control}
                img={vkIcon}
            />
            <InputControl
                label={t("Facebook")}
                disabled={isLocked}
                name="social.facebook"
                control={control}
                img={fbIcon}
            />
            <InputControl
                label={t("Instagram")}
                disabled={isLocked}
                name="social.instagram"
                control={control}
                img={instIcon}
            />
            <InputControl
                label={t("Telegram")}
                disabled={isLocked}
                name="social.telegram"
                control={control}
                img={tgIcon}
            />
        </div>
    );
});
