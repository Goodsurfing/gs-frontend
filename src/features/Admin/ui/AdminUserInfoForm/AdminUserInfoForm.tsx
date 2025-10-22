import React, { FC, useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import cn from "classnames";
import styles from "./AdminUserInfoForm.module.scss";
import { getProfileReadonly, Profile, profileActions } from "@/entities/Profile";
import { ProfileInfoFields, ProfileInfoFormAvatar, ProfileInfoFormContent } from "@/features/ProfileInfo";
import { ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import Button from "@/shared/ui/Button/Button";

interface AdminUserInfoFormProps {
    className?: string;
    profile: Profile;
}

export const AdminUserInfoForm: FC<AdminUserInfoFormProps> = (props) => {
    const { className, profile } = props;

    const form = useForm<ProfileInfoFields>({
        mode: "onChange",
        // defaultValues: profileInfoFormAdapter(profile),
    });
    const [toast] = useState<ToastAlert>();

    const { handleSubmit, reset, control } = form;

    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<ProfileInfoFields> = async () => {
        // add update user profile
        dispatch(profileActions.setReadonly(true));
    };

    useEffect(() => {
        // reset to profileInfoFormAdapter(profile)
    }, [profile, reset]);

    const isLocked = useAppSelector(getProfileReadonly);

    const onReadonlyChange = () => {
        dispatch(profileActions.setReadonly(!isLocked));
        if (!isLocked) {
            // reset to profileInfoFormAdapter(profile)
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
                <ProfileInfoFormAvatar userId={profile.id} />
            </div>
        </FormProvider>
    );
};
