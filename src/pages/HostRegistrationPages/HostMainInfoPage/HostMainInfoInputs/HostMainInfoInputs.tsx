import React from "react";

import Dropdown from "@/components/ui/Dropdown/Dropdown";
import Input from "@/components/ui/Input/Input";
import Textarea from "@/components/ui/Textarea/Textarea";

import facebookLogo from "@/assets/icons/social-icons/facebook-mini-logo.svg";
import instagramLogo from "@/assets/icons/social-icons/instagram-mini-logo.svg";
import telegramLogo from "@/assets/icons/social-icons/telegram-mini-logo.svg";
import vkLogo from "@/assets/icons/social-icons/vk-mini-logo.svg";

import styles from "./HostMainInfoInputs.module.scss";

const HostMainInfoInputs = () => {
    return (
        <div className={styles.wrapper}>
            <Input
                id="organization-name"
                className={styles.organization}
                label="Название организации"
            />
            <Textarea
                className={styles.description}
                label="Опишите организацию в одно предложение"
            />
            <div className={styles.organizationTypeWrapper}>
                <Dropdown
                    label="Тип организации"
                    organizations={["ООО", "ОАО", "ООПТ"]}
                />
                <Input
                    id="organization-other"
                    className={styles.other}
                    label="Другое"
                />
            </div>
            <Input
                label="Сайт организации"
                className={styles.website}
                id="organization-website"
            />
            <Textarea
                id="organization-website"
                className={styles.website}
                description="Расскажите о вас, вашей команде и почему волонтёры должны выбрать вас для участия"
                label="Сайт организации"
            />
            <div className={styles.socialMedia}>
                <Input img={vkLogo} label="Вконтакте" id="vk" />
                <Input className={styles.facebook} img={facebookLogo} label="Facebook" id="facebook" />
                <Input
                    className={styles.instagram}
                    img={instagramLogo}
                    label="Instagram"
                    id="instagram"
                />
                <Input
                    className={styles.telegram}
                    img={telegramLogo}
                    label="Telegram"
                    id="telegram"
                />
            </div>
        </div>
    );
};

export default HostMainInfoInputs;
