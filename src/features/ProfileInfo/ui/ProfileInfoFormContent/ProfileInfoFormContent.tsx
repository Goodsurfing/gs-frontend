import { memo } from "react";

import cn from "classnames";

import { ProfileInfoFormAbout } from "../ProfileInfoFormAbout/ProfileInfoFormAbout";
import { ProfileInfoFormSocial } from "../ProfileInfoFormSocial/ProfileInfoFormSocial";
import { ProfileInfoFormBirthDate } from "../ProfileInfoFormBirthDate/ProfileInfoFormBirthDate";

import styles from "./ProfileInfoFormContent.module.scss";
import { ProfileInfoFormGender } from "../ProfileInfoFormGender/ProfileInfoFormGender";
import { ProfileInfoFormAvatar } from "../ProfileInfoFormAvatar/ProfileInfoFormAvatar";
import { ProfileInfoFormLocale } from "../ProfileInfoFormLocale/ProfileInfoFormLocale";
import { ProfileInfoFormContacts } from "../ProfileInfoFormContacts/ProfileInfoFormContacts";
import { ProfileInfoFormAboutMe } from "../ProfileInfoFormAboutMe/ProfileInfoFormAboutMe";

interface ProfileInfoFormContentProps {
    className?: string;
}

export const ProfileInfoFormContent = memo((props: ProfileInfoFormContentProps) => {
    const { className } = props;

    return (
        <div className={cn(className, styles.wrapper)}>
            <div className={styles.main}>
                <ProfileInfoFormAbout />
                <ProfileInfoFormBirthDate />
                <ProfileInfoFormGender />
                <ProfileInfoFormLocale />
                <ProfileInfoFormContacts />
                <ProfileInfoFormAboutMe />
                <ProfileInfoFormSocial />
            </div>
            <div className={styles.avatar}>
                <ProfileInfoFormAvatar />
            </div>
        </div>
    );
});
