import { memo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import cn from "classnames";
import ProfileInput from "@/components/ProfileInput/ProfileInput";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getHostPersonalPageUrl, getHostRegistrationUrl } from "@/shared/config/routes/AppUrls";

import styles from "./HostDescriptionAvatar.module.scss";
import uploadFile from "@/shared/hooks/files/useUploadFile";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { HostDescriptionFormFields } from "../../model/types/hostDescription";
import { BASE_URL } from "@/shared/constants/api";

interface HostDescriptionAvatarProps {
    className?: string;
    hostId?: string;
}

export const HostDescriptionAvatar = memo(
    (props: HostDescriptionAvatarProps) => {
        const { className, hostId } = props;
        const { locale } = useLocale();
        const [toast, setToast] = useState<ToastAlert>();
        const {
            control,
        } = useFormContext<HostDescriptionFormFields>();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                        id: `${BASE_URL}${result?.["@id"].slice(1)}`,
                        contentUrl: result.contentUrl,
                    };
                    onChange(avatarData);
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
                    name="avatar"
                    control={control}
                    render={({ field }) => (
                        <div className={styles.avatarWrapper}>
                            <ProfileInput
                                fileClassname={styles.fileInput}
                                className={className}
                                id="profile-file"
                                src={getMediaContent(field.value?.contentUrl)}
                                setFile={(file?: File) => handleImageUpload(file, field.onChange)}
                                route={hostId ? getHostPersonalPageUrl(locale, hostId)
                                    : getHostRegistrationUrl(locale)}
                            />
                            {field.value && (
                                <button
                                    className={styles.deleteAvatar}
                                    type="button"
                                    onClick={() => {
                                        field.onChange(null);
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
