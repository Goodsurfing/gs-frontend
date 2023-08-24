import { memo } from "react";
import cn from "classnames";

import { useAppSelector } from "@/shared/hooks/redux";
import { getProfileReadonly } from "@/entities/Profile";

import styles from "./ProfileInfoFormAboutMe.module.scss";

interface ProfileInfoFormAboutMeProps {
    className?: string;
}

export const ProfileInfoFormAboutMe = memo((props: ProfileInfoFormAboutMeProps) => {
    const { className } = props;
    const isLocked = useAppSelector(getProfileReadonly);
    return (
        <div className={cn(className, styles.wrapper)} />
    );
});
