import React, { FC, useEffect, useState } from "react";
import {
    Controller, FormProvider, SubmitHandler, useForm,
} from "react-hook-form";
import cn from "classnames";
import { getProfileReadonly, profileActions } from "@/entities/Profile";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import Button from "@/shared/ui/Button/Button";
import ProfileInput from "@/components/ProfileInput/ProfileInput";
import { getVolunteerPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import {
    AdminUser, adminUserAdapter, AdminUserFields, useUpdateAdminUserMutation,
} from "@/entities/Admin";
import styles from "./AdminUserInfoForm.module.scss";
import { adminUserApiAdapter } from "@/entities/Admin/lib/adminAdapters";
import { ErrorType } from "@/types/api/error";
import { getErrorText } from "@/shared/lib/getErrorText";
import uploadFile from "@/shared/hooks/files/useUploadFile";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { ProfileInfoFormContent } from "@/features/ProfileInfo";

interface AdminUserInfoFormProps {
    className?: string;
    user: AdminUser;
    userId: string;
}

export const AdminUserInfoForm: FC<AdminUserInfoFormProps> = (props) => {
    const { className, user, userId } = props;

    const form = useForm<AdminUserFields>({
        mode: "onChange",
        defaultValues: adminUserAdapter(user),
    });
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();

    const [updateUser] = useUpdateAdminUserMutation();

    const { handleSubmit, reset, control } = form;

    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<AdminUserFields> = async (data) => {
        setToast(undefined);
        const formattedData = adminUserApiAdapter(data);
        await updateUser({ id: userId, body: formattedData })
            .unwrap()
            .then(() => {
                setToast({
                    text: "Данные успешно изменены",
                    type: HintType.Success,
                });
            })
            .catch((error: ErrorType) => {
                setToast({
                    text: getErrorText(error),
                    type: HintType.Error,
                });
            });
        dispatch(profileActions.setReadonly(true));
    };

    useEffect(() => {
        const adapter = adminUserAdapter(user);
        reset(adapter);
    }, [user, reset]);

    const isLocked = useAppSelector(getProfileReadonly);

    const onReadonlyChange = () => {
        dispatch(profileActions.setReadonly(!isLocked));
        // if (!isLocked) {
        //     reset(adminUserAdapter(user));
        //     setAvatar({ id: user.image.id, imagePath: user.image.contentUrl });
        // } else {
        //     reset();
        //     setAvatar({ id: user.image.id, imagePath: user.image.contentUrl });
        // }
    };

    const handleImageUpload = async (
        file: File | undefined,
        onChange: (value: { id: string; imagePath: string } | undefined) => void,
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
                    imagePath: result.contentUrl ?? "",
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
        <FormProvider {...form} control={control}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <div className={styles.formWrapper}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={cn(styles.wrapper, className)}
                >
                    <ProfileInfoFormContent />
                    <div className={styles.submitBtn}>
                        <Button
                            disabled={isLocked}
                            type="submit"
                            variant="FILL"
                            size="MEDIUM"
                            color="BLUE"
                        >
                            Сохранить
                        </Button>
                    </div>
                    <button
                        className={styles.stateButton}
                        type="button"
                        onClick={onReadonlyChange}
                    >
                        {isLocked ? "Редактировать" : "Отмена"}
                    </button>
                </form>
                <Controller
                    name="profileAvatar"
                    control={control}
                    render={({ field }) => (
                        <ProfileInput
                            fileClassname={styles.fileInput}
                            className={className}
                            id="profile-file"
                            src={getMediaContent(field.value?.imagePath)}
                            setFile={(file?: File) => handleImageUpload(file, field.onChange)}
                            route={getVolunteerPersonalPageUrl(locale, userId)}
                        />
                    )}
                />
            </div>
        </FormProvider>
    );
};
