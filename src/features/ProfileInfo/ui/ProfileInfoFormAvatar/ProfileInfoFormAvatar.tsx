import { memo } from "react";
import cn from "classnames";

import { getProfileReadonly } from "@/entities/Profile";
import { useAppSelector } from "@/shared/hooks/redux";

import styles from "./ProfileInfoFormAvatar.module.scss";

interface ProfileInfoFormAvatarProps {
    className?: string;
}

export const ProfileInfoFormAvatar = memo((props: ProfileInfoFormAvatarProps) => {
    const { className } = props;
    const isLocked = useAppSelector(getProfileReadonly);

    return (
        <div className={cn(className, styles.wrapper)} />
    );
});
