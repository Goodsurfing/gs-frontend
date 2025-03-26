import { memo } from "react";
import cn from "classnames";
import { useFormContext } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/shared/hooks/redux";
import { TextAreaControl } from "@/shared/ui/TextAreaControl/TextAreaControl";

import { getProfileReadonly } from "@/entities/Profile";

import styles from "./ProfileInfoFormAboutMe.module.scss";

interface ProfileInfoFormAboutMeProps {
    className?: string;
}

export const ProfileInfoFormAboutMe = memo((props: ProfileInfoFormAboutMeProps) => {
    const { className } = props;
    const { t } = useTranslation("profile");
    const isLocked = useAppSelector(getProfileReadonly);
    const { control } = useFormContext();
    return (
        <div className={cn(className, styles.wrapper)}>
            <TextAreaControl
                disabled={isLocked}
                control={control}
                name="aboutMe"
                label={t("info.Расскажите о себе")}
                maxLength={1000}
                description="Не более 1000 знаков"
            />
        </div>
    );
});
