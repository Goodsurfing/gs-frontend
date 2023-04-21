import Input from "@/UI/Input/Input";
import facebookLogo from "@assets/icons/social-icons/facebook-mini-logo.svg";
import instaLogo from "@assets/icons/social-icons/instagram-mini-logo.svg";
import telegramLogo from "@assets/icons/social-icons/telegram-mini-logo.svg";
import vkLogo from "@assets/icons/social-icons/vk-mini-logo.svg";
import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";

import { ISoicalFormGroup, IUserInfoForm } from "../ProfileInfoForm.interface";
import styles from "./SocialFormGroup.module.scss";

interface ISocialFormGroup {
    control: Control<IUserInfoForm>;
    isLocked: boolean;
    data: ISoicalFormGroup;
}

const SocialFormGroup: FC<ISocialFormGroup> = ({ control, isLocked, data }) => {
    return (
        <div className={styles.social}>
            <Controller
                control={control}
                name="vk"
                defaultValue="https://vk.com/"
                render={({ field }) => {
                    return (
                        <Input
                            id="vk-profile"
                            onChange={(e) => {
                                return field.onChange(e);
                            }}
                            value={field.value}
                            label="Вконтакте"
                            img={vkLogo}
                            name={field.name}
                            placeholder="https://vk.com/"
                            type="text"
                            disabled={isLocked}
                        />
                    );
                }}
            />
            <Controller
                control={control}
                name="facebook"
                defaultValue="https://facebook.com/"
                render={({ field }) => {
                    return (
                        <Input
                            id="facebook-profile"
                            onChange={(e) => {
                                return field.onChange(e);
                            }}
                            value={field.value}
                            label="Facebook"
                            img={facebookLogo}
                            name={field.name}
                            placeholder="https://facebook.com/"
                            type="text"
                            disabled={isLocked}
                        />
                    );
                }}
            />
            <Controller
                control={control}
                name="instagram"
                defaultValue="https://instagram.com/"
                render={({ field }) => {
                    return (
                        <Input
                            id="facebook-profile"
                            onChange={(e) => {
                                return field.onChange(e);
                            }}
                            value={field.value}
                            label="Instagram"
                            img={instaLogo}
                            name={field.name}
                            placeholder="https://instagram.com/"
                            type="text"
                            disabled={isLocked}
                        />
                    );
                }}
            />
            <Controller
                control={control}
                name="telegram"
                defaultValue="https://t.me/"
                render={({ field }) => {
                    return (
                        <Input
                            id="facebook-profile"
                            onChange={(e) => {
                                return field.onChange(e);
                            }}
                            value={field.value}
                            label="Telegram"
                            img={telegramLogo}
                            name={field.name}
                            placeholder="https://t.me/kuro_mukade"
                            type="text"
                            disabled={isLocked}
                        />
                    );
                }}
            />
        </div>
    );
};

export default SocialFormGroup;
