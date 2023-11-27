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
    const { t } = useTranslation("about-me");
    const isLocked = useAppSelector(getProfileReadonly);
    const { control } = useFormContext();
    return (
        <div className={cn(className, styles.wrapper)}>
            <TextAreaControl
                disabled={isLocked}
                control={control}
                name="aboutMe"
                label={t("Расскажите о себе")}
            />
        </div>
    );
});
