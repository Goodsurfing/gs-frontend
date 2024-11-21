import { memo, useState } from "react";
import ProfileInput from "@/components/ProfileInput/ProfileInput";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getProfileInfoPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./HostDescriptionAvatar.module.scss";
import { Host, useUpdateHostMutation } from "@/entities/Host";
import uploadFile from "@/shared/hooks/files/useUploadFile";
import { BASE_URL } from "@/shared/constants/api";

interface HostDescriptionAvatarProps {
    className?: string;
    host: Host;
}

export const HostDescriptionAvatar = memo(
    (props: HostDescriptionAvatarProps) => {
        const { className, host } = props;
        const [avatar] = useState<string | undefined>();
        const { locale } = useLocale();

        const [updateHost] = useUpdateHostMutation();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const handleImageUpload = (file?: File) => {
            if (file) {
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
