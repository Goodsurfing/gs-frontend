import cn from "classnames";
import { memo, useEffect, useState } from "react";
import ProfileInput from "@/components/ProfileInput/ProfileInput";

import { useLocale } from "@/app/providers/LocaleProvider";

import { useGetProfileInfoQuery } from "@/entities/Profile";
import { useUpdateProfileInfoMutation } from "@/entities/Profile/api/profileApi";

import { getProfileInfoPageUrl } from "@/shared/config/routes/AppUrls";
import { BASE_URL } from "@/shared/constants/api";
import uploadFile from "@/shared/hooks/files/useUploadFile";

import styles from "./ProfileInfoFormAvatar.module.scss";
import { getMediaContent } from "@/shared/lib/getMediaContent";

interface ProfileInfoFormAvatarProps {
    className?: string;
}

export const ProfileInfoFormAvatar = memo(
    (props: ProfileInfoFormAvatarProps) => {
        const { className } = props;

        const { data } = useGetProfileInfoQuery();
        const [updateProfileInfo] = useUpdateProfileInfoMutation();
        const [avatar, setAvatar] = useState<string | undefined>();
        const { locale } = useLocale();

        const handleImageUpload = (file?: File) => {
            if (file) {
                uploadFile(file.name, file)
                    .then(async (result) => {
                        await updateProfileInfo({
                            image: `${BASE_URL}${result?.["@id"].slice(1)}`,
                            locale,
                        }).unwrap();
                    })
                    .catch(() => {});
            }
        };

        useEffect(() => {
            if (data) {
                const { image } = data;

                if (
                    typeof image === "object"
                    && image !== null
                    && "contentUrl" in image
                ) {
                    setAvatar(getMediaContent(image.contentUrl));
                }
            }
        }, [data]);

        return (
            <div className={cn(className, styles.wrapper)}>
                <ProfileInput
                    fileClassname={styles.fileInput}
                    className={className}
                    id="profile-file"
                    src={avatar ?? undefined}
                    setFile={handleImageUpload}
                    route={getProfileInfoPageUrl(locale)}
                />
            </div>
        );
    },
);
