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
                disabled={isLocked}
                name=""
                control={control}
                img={vkIcon}
            />
            <InputControl
                disabled={isLocked}
                name=""
                control={control}
                img={fbIcon}
            />
            <InputControl
                disabled={isLocked}
                name=""
                control={control}
                img={instIcon}
            />
            <InputControl
                disabled={isLocked}
                name=""
                control={control}
                img={tgIcon}
            />
        </div>
    );
});
