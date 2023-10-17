import { memo, useState } from "react";
import ProfileInput from "@/components/ProfileInput/ProfileInput";

import styles from "./HostDescriptionAvatar.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getProfileInfoPageUrl } from "@/shared/config/routes/AppUrls";

interface HostDescriptionAvatarProps {
    className?: string;
}

export const HostDescriptionAvatar = memo((props: HostDescriptionAvatarProps) => {
    const { className } = props;
    const [avatar, setAvatar] = useState<File>();
    const { locale } = useLocale();
    return (
        <ProfileInput
            fileClassname={styles.fileInput}
            className={className}
            id="host-file"
            file={avatar}
            setFile={setAvatar}
            route={getProfileInfoPageUrl(locale)}
        />
    );
});
