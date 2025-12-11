import cn from "classnames";
import { memo, useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ErrorType } from "@/types/api/error";

import {
    Profile,
    getProfileReadonly,
    profileActions,
} from "@/entities/Profile";
import { useUpdateProfileInfoMutation } from "@/entities/Profile/api/profileApi";

import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import { getErrorText } from "@/shared/lib/getErrorText";
import Button from "@/shared/ui/Button/Button";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";

import { profileFormApiAdapter } from "../../lib/profileFormApiAdapter";
import { profileInfoFormAdapter } from "../../lib/profileInfoFormAdapter";
import type { ProfileInfoFields } from "../../model/types/profileInfo";
import { ProfileInfoFormAvatar } from "../ProfileInfoFormAvatar/ProfileInfoFormAvatar";
import { ProfileInfoFormContent } from "../ProfileInfoFormContent/ProfileInfoFormContent";
import styles from "./ProfileInfoForm.module.scss";

interface ProfileInfoFormProps {
    className?: string;
    profile: Profile;
}

export const ProfileInfoForm = memo((props: ProfileInfoFormProps) => {
    const { className, profile } = props;
    const { t } = useTranslation("profile");
    const form = useForm<ProfileInfoFields>({
        mode: "onChange",
        defaultValues: profileInfoFormAdapter(profile),
    });
    const [toast, setToast] = useState<ToastAlert>();

    const [updateProfile] = useUpdateProfileInfoMutation();

    const { handleSubmit, reset, control } = form;

    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<ProfileInfoFields> = async (data) => {
        setToast(undefined);
        const formattedData = profileFormApiAdapter(data);
        await updateProfile({ userId: profile.id, profileData: formattedData })
            .unwrap()
            .then(() => {
                setToast({
                    text: t("info.Данные успешно изменены"),
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
        reset(profileInfoFormAdapter(profile));
    }, [profile, reset]);

    const isLocked = useAppSelector(getProfileReadonly);

    const onReadonlyChange = () => {
        dispatch(profileActions.setReadonly(!isLocked));
        if (!isLocked) {
            reset(profileInfoFormAdapter(profile));
        } else {
            reset();
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
                            {t("info.Сохранить")}
                        </Button>
                    </div>
                    <button
                        className={styles.stateButton}
                        type="button"
                        onClick={onReadonlyChange}
                    >
                        {isLocked ? t("info.Редактировать") : t("info.Отмена")}
                    </button>
                </form>
                <ProfileInfoFormAvatar userId={profile.id} />
            </div>
        </FormProvider>
    );
});
