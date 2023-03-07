import React from "react";

import Input from "@/components/ui/Input/Input";

import facebookLogo from "@/assets/icons/social-icons/facebook-mini-logo.svg";
import instagramLogo from "@/assets/icons/social-icons/instagram-mini-logo.svg";
import telegramLogo from "@/assets/icons/social-icons/telegram-mini-logo.svg";
import vkLogo from "@/assets/icons/social-icons/vk-mini-logo.svg";

import styles from "./HostMainInfoSocial.module.scss";

const HostMainInfoSocial = () => {
    return (
        <div className={styles.socialMedia}>
            <Input img={vkLogo} label="Вконтакте" id="vk" />
            <Input
                className={styles.facebook}
                img={facebookLogo}
                label="Facebook"
                id="facebook"
            />
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
    );
};

export default React.memo(HostMainInfoSocial);
