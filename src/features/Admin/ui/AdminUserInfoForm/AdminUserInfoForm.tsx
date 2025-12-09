import React, { FC, useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import cn from "classnames";
import { getProfileReadonly, profileActions } from "@/entities/Profile";
import { ProfileInfoFields, ProfileInfoFormContent } from "@/features/ProfileInfo";
import { ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import Button from "@/shared/ui/Button/Button";
import ProfileInput from "@/components/ProfileInput/ProfileInput";
import { getVolunteerPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { AdminUser, adminUserAdapter } from "@/entities/Admin";
import styles from "./AdminUserInfoForm.module.scss";

interface AdminUserInfoFormProps {
    className?: string;
    user: AdminUser;
    userId: string;
}

export const AdminUserInfoForm: FC<AdminUserInfoFormProps> = (props) => {
    const { className, user, userId } = props;

    const form = useForm<ProfileInfoFields>({
        mode: "onChange",
        // defaultValues: profileInfoFormAdapter(profile),
    });
    const { locale } = useLocale();
    const [toast] = useState<ToastAlert>();

    const { handleSubmit, reset, control } = form;

    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<ProfileInfoFields> = async () => {
        // add update user profile
        dispatch(profileActions.setReadonly(true));
    };

    useEffect(() => {
        // reset to profileInfoFormAdapter(profile)
        const adapter = adminUserAdapter(user);
        reset(adapter);
    }, [user, reset]);

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
                <ProfileInput
                    fileClassname={styles.fileInput}
                    className={className}
                    id="profile-file"
                    src={undefined}
                    setFile={() => {}}
                    route={getVolunteerPersonalPageUrl(locale, userId)}

                />
            </div>
        </FormProvider>
    );
};
