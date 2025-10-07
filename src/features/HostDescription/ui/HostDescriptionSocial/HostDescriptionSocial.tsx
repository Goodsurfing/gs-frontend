import { memo } from "react";
import { useFormContext } from "react-hook-form";
import cn from "classnames";

import { InputControl } from "@/shared/ui/InputControl/InputControl";

import {
    facebookIcon,
    instaIcon,
    telegramIcon,
    vkIcon,
} from "@/shared/data/icons/socialIcons";

import styles from "./HostDescriptionSocial.module.scss";

interface HostDescriptionSocialProps {
    className?: string;
}

export const HostDescriptionSocial = memo((props: HostDescriptionSocialProps) => {
    const { className } = props;
    const { control } = useFormContext();
    return (
        <div className={cn(styles.wrapper, className)}>
            <InputControl
                label="Вконтакте"
                img={vkIcon}
                id="vk"
                name="socialMedia.vk"
                control={control}
                type="url"
            />
            <InputControl
                label="Facebook"
                img={facebookIcon}
                id="fb"
                name="socialMedia.facebook"
                control={control}
                type="url"
            />
            <InputControl
                className={styles.telegram}
                label="Instagram"
                img={instaIcon}
                id="inst"
                name="socialMedia.instagram"
                control={control}
                type="url"
            />
            <InputControl
                className={styles.instagram}
                label="Telegram"
                img={telegramIcon}
                id="tg"
                name="socialMedia.telegram"
                control={control}
                type="url"
            />
        </div>
    );
});
