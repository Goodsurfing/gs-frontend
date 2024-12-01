import { memo, useEffect, useState } from "react";
import ProfileInput from "@/components/ProfileInput/ProfileInput";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getHostPersonalPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./HostDescriptionAvatar.module.scss";
import { Host, useUpdateHostMutation } from "@/entities/Host";
import uploadFile from "@/shared/hooks/files/useUploadFile";
import { BASE_URL } from "@/shared/constants/api";
import { getMediaContent } from "@/shared/lib/getMediaContent";

interface HostDescriptionAvatarProps {
    className?: string;
    host?: Host;
}

export const HostDescriptionAvatar = memo(
    (props: HostDescriptionAvatarProps) => {
        const { className, host } = props;
        const [avatar, setAvatar] = useState<string | undefined>();
        const { locale } = useLocale();

        const [updateHost] = useUpdateHostMutation();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const handleImageUpload = (file?: File) => {
            if (file && host) {
                uploadFile(file.name, file)
                    .then(async (result) => {
                        await updateHost({
                            id: host.id,
                            body: {
                                avatar: `${BASE_URL}${result?.["@id"].slice(1)}`,
                            },
                        }).unwrap();
                    })
                    .catch(() => {});
            }
        };

        useEffect(() => {
            if (host) {
                setAvatar(getMediaContent(host.avatar));
            }
        }, [host]);

        return (
            <ProfileInput
                fileClassname={styles.fileInput}
                className={className}
                id="host-file"
                src={avatar}
                setFile={handleImageUpload}
                route={getHostPersonalPageUrl(locale, host?.id)}
            />
        );
    },
);
