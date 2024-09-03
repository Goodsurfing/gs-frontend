import cn from "classnames";
import { memo, useState } from "react";
import ProfileInput from "@/components/ProfileInput/ProfileInput";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getProfileReadonly } from "@/entities/Profile";

import { getProfileInfoPageUrl } from "@/shared/config/routes/AppUrls";
import { useAppSelector } from "@/shared/hooks/redux";

import styles from "./ProfileInfoFormAvatar.module.scss";

interface ProfileInfoFormAvatarProps {
    className?: string;
}

export const ProfileInfoFormAvatar = memo(
    (props: ProfileInfoFormAvatarProps) => {
        const { className } = props;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const isLocked = useAppSelector(getProfileReadonly);
        const [avatar, setAvatar] = useState<File>();
        const { locale } = useLocale();

        return (
            <div className={cn(className, styles.wrapper)}>
                <ProfileInput
                    fileClassname={styles.fileInput}
                    className={className}
                    id="profile-file"
                    file={avatar}
                    setFile={setAvatar}
                    route={getProfileInfoPageUrl(locale)}
                />
            </div>
        );
    },
);
