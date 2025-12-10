import React, { FC, useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import cn from "classnames";
import { getProfileReadonly, profileActions } from "@/entities/Profile";
import { ProfileInfoFields, ProfileInfoFormContent } from "@/features/ProfileInfo";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import Button from "@/shared/ui/Button/Button";
import ProfileInput from "@/components/ProfileInput/ProfileInput";
import { getVolunteerPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { AdminUser, adminUserAdapter, useUpdateAdminUserMutation } from "@/entities/Admin";
import styles from "./AdminUserInfoForm.module.scss";
import { adminUserApiAdapter } from "@/entities/Admin/lib/adminAdapters";
import { ErrorType } from "@/types/api/error";
import { getErrorText } from "@/shared/lib/getErrorText";
import uploadFile from "@/shared/hooks/files/useUploadFile";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { BASE_URL } from "@/shared/constants/api";

interface AdminUserInfoFormProps {
    className?: string;
    user: AdminUser;
    userId: string;
}

export const AdminUserInfoForm: FC<AdminUserInfoFormProps> = (props) => {
    const { className, user, userId } = props;

    const form = useForm<ProfileInfoFields>({
        mode: "onChange",
        defaultValues: adminUserAdapter(user),
    });
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [avatar, setAvatar] = useState<{ id: string; imagePath?: string; } | undefined>();

    const [updateUser] = useUpdateAdminUserMutation();

    const { handleSubmit, reset, control } = form;

    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<ProfileInfoFields> = async (data) => {
        setToast(undefined);
        const formattedData = adminUserApiAdapter(data, avatar?.id);
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
        // reset to profileInfoFormAdapter(profile)
        const adapter = adminUserAdapter(user);
        reset(adapter);
        setAvatar({ id: user.imagePath, imagePath: user.imagePath });
    }, [user, reset]);

    const isLocked = useAppSelector(getProfileReadonly);

    const onReadonlyChange = () => {
        dispatch(profileActions.setReadonly(!isLocked));
        if (!isLocked) {
            reset(adminUserAdapter(user));
            setAvatar({ id: user.imagePath, imagePath: user.imagePath });
        } else {
            reset();
            setAvatar(undefined);
        }
    };

    const handleImageUpload = async (file?: File) => {
        if (file) {
            await uploadFile(file.name, file)
                .then(async (result) => {
                    setAvatar({
                        id: `${BASE_URL}${result?.["@id"].slice(1)}`,
                        imagePath: getMediaContent(result?.contentUrl),
                    });
                    dispatch(profileActions.setReadonly(false));
                })
                .catch(() => {
                    setToast({
                        text: "Произошла ошибка при загрузке изображения",
                        type: HintType.Error,
                    });
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
                <ProfileInput
                    fileClassname={styles.fileInput}
                    className={className}
                    id="profile-file"
                    src={avatar?.imagePath ?? undefined}
                    setFile={handleImageUpload}
                    route={getVolunteerPersonalPageUrl(locale, userId)}
                />
            </div>
        </FormProvider>
    );
};
