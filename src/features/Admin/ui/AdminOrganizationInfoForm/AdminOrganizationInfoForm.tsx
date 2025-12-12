import React, { FC, useState } from "react";
import {
    Controller,
    DefaultValues, FormProvider, SubmitHandler, useForm,
} from "react-hook-form";
import cn from "classnames";
import {
    HostDescriptionFormFields, HostDescriptionOrganization, HostDescriptionSocial,
} from "@/features/HostDescription";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import styles from "./AdminOrganizationInfoForm.module.scss";
import Button from "@/shared/ui/Button/Button";
import { AdminOrganization } from "@/entities/Admin";
import ProfileInput from "@/components/ProfileInput/ProfileInput";
import uploadFile from "@/shared/hooks/files/useUploadFile";
import { getHostPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { Image } from "@/types/media";
import { getMediaContent } from "@/shared/lib/getMediaContent";

interface AdminOrganizationInfoFormProps {
    className?: string;
    organizationId: string;
    organization: AdminOrganization;
}

const defaultValues: DefaultValues<HostDescriptionFormFields> = {
    address: "",
    mainInfo: {
        aboutInfo: "",
        organization: "",
        shortOrganization: "",
        website: "",
    },
    socialMedia: {
        facebook: "",
        instagram: "",
        telegram: "",
        vk: "",
    },
    type: {
        organizationType: "ИП",
        otherOrganizationType: "",
    },
};

export const AdminOrganizationInfoForm: FC<AdminOrganizationInfoFormProps> = (props) => {
    const { organization, className } = props;

    const [toast, setToast] = useState<ToastAlert>();
    const { locale } = useLocale();

    const form = useForm<HostDescriptionFormFields>({
        mode: "onChange",
        defaultValues,
    });

    const {
        handleSubmit,
        control,
    } = form;

    const onSubmit: SubmitHandler<HostDescriptionFormFields> = async () => {
        // update host data
    };

    const handleImageUpload = async (
        file: File | undefined,
        onAvatarChange: (image: Image | null) => void,
    ) => {
        setToast(undefined);

        if (!file) {
            onAvatarChange(null);
            return;
        }

        try {
            const result = await uploadFile(file.name, file);
            if (result) {
                onAvatarChange({
                    id: result.id,
                    contentUrl: result.contentUrl,
                });
            } else {
                throw new Error("Invalid upload response");
            }
        } catch (error) {
            setToast({
                text: "Произошла ошибка при загрузке изображения",
                type: HintType.Error,
            });
            onAvatarChange(null);
        }
    };

    return (
        <FormProvider {...form}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <form
                className={cn(styles.formWrapper, className)}
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className={styles.form}>
                    <div className={styles.mainSection}>
                        <HostDescriptionOrganization />
                        <HostDescriptionSocial />
                    </div>
                    <Controller
                        control={control}
                        name="avatar"
                        render={({ field }) => (
                            <div className={styles.avatarWrapper}>
                                <ProfileInput
                                    fileClassname={styles.fileInput}
                                    className={className}
                                    id="host-file"
                                    src={getMediaContent(field.value?.contentUrl)}
                                    setFile={(file) => handleImageUpload(file, field.onChange)}
                                    route={getHostPersonalPageUrl(locale, organization.id)}
                                />
                                <button
                                    className={styles.deleteAvatar}
                                    type="button"
                                    onClick={() => field.onChange(null)}
                                >
                                    Удалить изображение
                                </button>
                            </div>
                        )}
                    />
                </div>
                <div>
                    <Button type="submit" color="BLUE" size="MEDIUM" variant="FILL">
                        Сохранить
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};
