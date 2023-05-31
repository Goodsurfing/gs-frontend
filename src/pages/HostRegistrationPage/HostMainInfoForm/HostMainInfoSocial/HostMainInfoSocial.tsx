import facebookLogo from "assets/icons/social-icons/facebook-mini-logo.svg";
import instagramLogo from "assets/icons/social-icons/instagram-mini-logo.svg";
import telegramLogo from "assets/icons/social-icons/telegram-mini-logo.svg";
import vkLogo from "assets/icons/social-icons/vk-mini-logo.svg";
import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";

import { Input } from "shared/ui/Input";

import {
  IHostInfoForm,
  IHostMainInfoSocialForm,
} from "../../HostMainInfoPage/HostMainInfoForm/HostMainInfoForm.interface";

import styles from "./HostMainInfoSocial.module.scss";

interface HostMainInfoSocial {
    control: Control<IHostInfoForm>;
    data: IHostMainInfoSocialForm;
}

const HostMainInfoSocial: FC<HostMainInfoSocial> = ({ control, data }) => (
    <div className={styles.socialMedia}>
        <Controller
            control={control}
            name="vk"
            defaultValue={data.vk || ""}
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
            defaultValue={data.facebook || ""}
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
            defaultValue={data.instagram || ""}
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
            defaultValue={data.telegram || ""}
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

export default React.memo(HostMainInfoSocial);