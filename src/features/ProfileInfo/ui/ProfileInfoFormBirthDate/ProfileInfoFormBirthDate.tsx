import { memo } from "react";
import cn from "classnames";

import { useAppSelector } from "@/shared/hooks/redux";

import { getProfileReadonly } from "@/entities/Profile";

import styles from "./ProfileInfoFormBirthDate.module.scss";

interface ProfileInfoFormBirthDateProps {
    className?: string;
}

export const ProfileInfoFormBirthDate = memo((props: ProfileInfoFormBirthDateProps) => {
    const { className } = props;
    const isLocked = useAppSelector(getProfileReadonly);
    return (
        <div className={cn(className, styles.wrapper)} />
    );
});
