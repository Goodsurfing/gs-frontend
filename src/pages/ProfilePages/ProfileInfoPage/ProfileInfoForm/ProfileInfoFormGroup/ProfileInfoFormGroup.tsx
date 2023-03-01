import cn from "classnames";
import React, { FC, PropsWithChildren } from "react";

import styles from "./ProfileInfoFormGroup.module.scss";

interface ProfileInfoFormGroupProps {
    title?: string;
    className: string;
}

const ProfileInfoFormGroup: FC<
    PropsWithChildren<ProfileInfoFormGroupProps>
> = ({ title, className, children }) => {
    return (
        <div className={styles.wrapper}>
            <span className={styles.title}>{title}</span>
            <div className={cn(styles.content, className)}>{children}</div>
        </div>
    );
};

export default ProfileInfoFormGroup;
