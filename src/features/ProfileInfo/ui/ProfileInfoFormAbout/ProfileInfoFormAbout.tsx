import { memo } from "react";
import { useFormContext } from "react-hook-form";
import cn from "classnames";

import { InputControl } from "@/shared/ui/InputControl/InputControl";
import { useAppSelector } from "@/shared/hooks/redux";

import { getProfileReadonly } from "@/entities/Profile";

import styles from "./ProfileInfoFormAbout.module.scss";

interface ProfileInfoFormAboutProps {
    className?: string;
}

export const ProfileInfoFormAbout = memo((props: ProfileInfoFormAboutProps) => {
    const { className } = props;

    const isLocked = useAppSelector(getProfileReadonly);

    const { control } = useFormContext();

    return (
        <div className={cn(className, styles.wrapper)}>
            <InputControl
                disabled={isLocked}
                label="Имя"
                control={control}
                name="about."
            />
            <InputControl
                disabled={isLocked}
                label="Фамилия"
                control={control}
                name=""
            />
        </div>
    );
});
