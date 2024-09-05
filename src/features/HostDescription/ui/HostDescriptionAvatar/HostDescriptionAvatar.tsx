import { memo, useState } from "react";
import ProfileInput from "@/components/ProfileInput/ProfileInput";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getProfileInfoPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./HostDescriptionAvatar.module.scss";

interface HostDescriptionAvatarProps {
    className?: string;
}

export const HostDescriptionAvatar = memo(
    (props: HostDescriptionAvatarProps) => {
        const { className } = props;
        const [avatar] = useState<string>();
        const { locale } = useLocale();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const handleImageUpload = (file?: File) => {};

        return (
            <ProfileInput
                fileClassname={styles.fileInput}
                className={className}
                id="host-file"
                src={avatar}
                setFile={handleImageUpload}
                route={getProfileInfoPageUrl(locale)}
            />
        );
    },
);
