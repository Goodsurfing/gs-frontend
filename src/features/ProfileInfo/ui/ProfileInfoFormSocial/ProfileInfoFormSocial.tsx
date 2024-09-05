import { memo } from "react";
import cn from "classnames";
import { useFormContext } from "react-hook-form";

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
    const { control } = useFormContext();
    return (
        <div className={cn(className, styles.wrapper)}>
            <InputControl
                label="VK"
                disabled={isLocked}
                name="social.vk"
                control={control}
                img={vkIcon}
            />
            <InputControl
                label="Facebook"
                disabled={isLocked}
                name="social.facebook"
                control={control}
                img={fbIcon}
            />
            <InputControl
                label="Instagram"
                disabled={isLocked}
                name="social.instagram"
                control={control}
                img={instIcon}
            />
            <InputControl
                label="Telegram"
                disabled={isLocked}
                name="social.telegram"
                control={control}
                img={tgIcon}
            />
        </div>
    );
});
