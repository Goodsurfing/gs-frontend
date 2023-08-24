import { memo } from "react";
import { useFormContext } from "react-hook-form";

import cn from "classnames";

import { InputControl } from "@/shared/ui/InputControl/InputControl";
import { useAppSelector } from "@/shared/hooks/redux";

import { getProfileReadonly } from "@/entities/Profile";

import styles from "./ProfileInfoFormContacts.module.scss";

interface ProfileInfoFormContactsProps {
    className?: string;
}

export const ProfileInfoFormContacts = memo((props: ProfileInfoFormContactsProps) => {
    const { className } = props;
    const { control } = useFormContext();
    const isLocked = useAppSelector(getProfileReadonly);
    return (
        <div className={cn(className, styles.wrapper)}>
            <InputControl disabled={isLocked} control={control} name="" label="E-mail" />
            <InputControl disabled={isLocked} control={control} name="" label="Телефон" />
        </div>
    );
});
