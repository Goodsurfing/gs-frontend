import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";
import Input from "@/shared/ui/Input/Input";

import facebookLogo from "@/shared/assets/icons/social-icons/facebook-mini-logo.svg";
import instagramLogo from "@/shared/assets/icons/social-icons/instagram-mini-logo.svg";
import telegramLogo from "@/shared/assets/icons/social-icons/telegram-mini-logo.svg";
import vkLogo from "@/shared/assets/icons/social-icons/vk-mini-logo.svg";

import {
    IHostInfoForm,
    IHostMainInfoSocialForm,
} from "../HostMainInfoForm/HostMainInfoForm.interface";
import styles from "./HostMainInfoSocial.module.scss";

interface HostMainInfoSocialProps {
    control: Control<IHostInfoForm>;
    data: IHostMainInfoSocialForm;
}

const HostMainInfoSocial: FC<HostMainInfoSocialProps> = ({ control, data }) => {
    return (
        <div className={styles.socialMedia}>
            <Controller
                control={control}
                name="vk"
                defaultValue={data.vk || ""}
                render={({ field }) => {
                    return (
                        <Input
                            className={styles.vk}
                            img={vkLogo}
                            label="Вконтакте"
                            id="vk"
                            value={field.value}
                            onChange={(e) => { return field.onChange(e); }}
                        />
                    );
                }}
            />
            <Controller
                control={control}
                name="facebook"
                defaultValue={data.facebook || ""}
                render={({ field }) => {
                    return (
                        <Input
                            className={styles.facebook}
                            img={facebookLogo}
                            label="Facebook"
                            id="facebook"
                            value={field.value}
                            onChange={(e) => { return field.onChange(e); }}
                        />
                    );
                }}
            />
            <Controller
                control={control}
                name="instagram"
                defaultValue={data.instagram || ""}
                render={({ field }) => {
                    return (
                        <Input
                            className={styles.instagram}
                            img={instagramLogo}
                            label="Instagram"
                            id="instagram"
                            value={field.value}
                            onChange={(e) => { return field.onChange(e); }}
                        />
                    );
                }}
            />
            <Controller
                control={control}
                name="telegram"
                defaultValue={data.telegram || ""}
                render={({ field }) => {
                    return (
                        <Input
                            className={styles.telegram}
                            img={telegramLogo}
                            label="Telegram"
                            id="telegram"
                            value={field.value}
                            onChange={(e) => { return field.onChange(e); }}
                        />
                    );
                }}
            />
        </div>
    );
};

export default React.memo(HostMainInfoSocial);
