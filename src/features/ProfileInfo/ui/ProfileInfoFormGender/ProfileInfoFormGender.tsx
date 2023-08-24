import { memo } from "react";
import cn from "classnames";

import { Controller, useFormContext } from "react-hook-form";
import styles from "./ProfileInfoFormGender.module.scss";
import { SelectComponent } from "@/shared/ui/Select/Select";
import { getProfileReadonly } from "@/entities/Profile";
import { useAppSelector } from "@/shared/hooks/redux";

interface ProfileInfoFormGenderProps {
    className?: string;
}

export const ProfileInfoFormGender = memo((props: ProfileInfoFormGenderProps) => {
    const { className } = props;

    const isLocked = useAppSelector(getProfileReadonly);

    const { control } = useFormContext();
    return (
        <div className={cn(className, styles.wrapper)}>
            <Controller
                name=""
                control={control}
                render={({ field }) => (
                    <SelectComponent
                        value={field.value}
                        label="Пол"
                        disabled={isLocked}
                        className={styles.genderDropdown}
                    >
                        {}
                    </SelectComponent>
                )}
            />
        </div>
    );
});
