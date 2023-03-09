import React, { FC } from "react";
import { Controller } from "react-hook-form";

import Input from "@/components/ui/Input/Input";

import facebookLogo from "@/assets/icons/social-icons/facebook-mini-logo.svg";
import instagramLogo from "@/assets/icons/social-icons/instagram-mini-logo.svg";
import telegramLogo from "@/assets/icons/social-icons/telegram-mini-logo.svg";
import vkLogo from "@/assets/icons/social-icons/vk-mini-logo.svg";

import styles from "./HostMainInfoSocial.module.scss";

interface HostMainInfoSocial {
    control: any;
}

const HostMainInfoSocial: FC<HostMainInfoSocial> = ({ control }) => {
    return (
        <div className={styles.socialMedia}>
            <Controller
                control={control}
                name="vk"
                defaultValue=""
                render={({ field }) => (
                    <Input
                        className={styles.vk}
                        img={vkLogo}
                        label="Вконтакте"
                        id="vk"
                        value={field.value}
                        onChange={(e) => field.onChange(e)}
                    />
                )}
            />
            <Controller
                control={control}
                name="facebook"
                defaultValue=""
                render={({ field }) => (
                    <Input
                        className={styles.facebook}
                        img={facebookLogo}
                        label="Facebook"
                        id="facebook"
                        value={field.value}
                        onChange={(e) => field.onChange(e)}
                    />
                )}
            />
            <Controller
                control={control}
                name="instagram"
                defaultValue=""
                render={({ field }) => (
                    <Input
                        className={styles.instagram}
                        img={instagramLogo}
                        label="Instagram"
                        id="instagram"
                        value={field.value}
                        onChange={(e) => field.onChange(e)}
                    />
                )}
            />
            <Controller
                control={control}
                name="telegram"
                defaultValue=""
                render={({ field }) => (
                    <Input
                        className={styles.telegram}
                        img={telegramLogo}
                        label="Telegram"
                        id="telegram"
                        value={field.value}
                        onChange={(e) => field.onChange(e)}
                    />
                )}
            />
        </div>
    );
};

export default React.memo(HostMainInfoSocial);
