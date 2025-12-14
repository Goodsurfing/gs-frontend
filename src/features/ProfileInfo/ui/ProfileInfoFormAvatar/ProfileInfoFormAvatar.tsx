import cn from "classnames";
import { memo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import ProfileInput from "@/components/ProfileInput/ProfileInput";

import { useLocale } from "@/app/providers/LocaleProvider";

import { profileActions } from "@/entities/Profile";

import { getVolunteerPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import uploadFile from "@/shared/hooks/files/useUploadFile";

import { getMediaContent } from "@/shared/lib/getMediaContent";
import { ProfileInfoFields } from "../../model/types/profileInfo";
import { useAppDispatch } from "@/shared/hooks/redux";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import styles from "./ProfileInfoFormAvatar.module.scss";

interface ProfileInfoFormAvatarProps {
    className?: string;
    userId: string;
}

export const ProfileInfoFormAvatar = memo(
    (props: ProfileInfoFormAvatarProps) => {
        const { className, userId } = props;

        const {
            control,
        } = useFormContext<ProfileInfoFields>();
        const { locale } = useLocale();
        const dispatch = useAppDispatch();
        const [toast, setToast] = useState<ToastAlert>();

        const handleImageUpload = async (
            file: File | undefined,
            onChange: (value: { id: string; contentUrl: string } | undefined) => void,
        ) => {
            if (!file) {
                onChange(undefined);
                return;
            }

            try {
                const result = await uploadFile(file.name, file);
                if (result) {
                    const avatarData = {
                        id: result.id,
                        contentUrl: result.contentUrl ?? "",
                    };
                    onChange(avatarData);
                    dispatch(profileActions.setReadonly(false));
                }
            } catch {
                setToast({
                    text: "Произошла ошибка при загрузке изображения",
                    type: HintType.Error,
                });
            }
        };

        return (
            <div className={cn(className, styles.wrapper)}>
                {toast && <HintPopup text={toast.text} type={toast.type} />}
                <Controller
                    name="profileAvatar"
                    control={control}
                    render={({ field }) => (
                        <div className={styles.avatarWrapper}>
                            <ProfileInput
                                fileClassname={styles.fileInput}
                                className={className}
                                id="profile-file"
                                src={getMediaContent(field.value?.contentUrl)}
                                setFile={(file?: File) => handleImageUpload(file, field.onChange)}
                                route={getVolunteerPersonalPageUrl(locale, userId)}
                            />
                            {field.value && (
                                <button
                                    className={styles.deleteAvatar}
                                    type="button"
                                    onClick={() => {
                                        field.onChange(null);
                                        dispatch(profileActions.setReadonly(false));
                                    }}
                                >
                                    Удалить изображение
                                </button>
                            )}
                        </div>
                    )}
                />
            </div>
        );
    },
);
