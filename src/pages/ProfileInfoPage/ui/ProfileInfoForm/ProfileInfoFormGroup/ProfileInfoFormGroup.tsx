import cn from "classnames";
import React, { FC, PropsWithChildren } from "react";

import styles from "./ProfileInfoFormGroup.module.scss";

interface ProfileInfoFormGroupProps {
    className: string;
}

const ProfileInfoFormGroup: FC<
PropsWithChildren<ProfileInfoFormGroupProps>
> = ({ className, children }) => (
    <div className={styles.wrapper}>
        <div className={cn(styles.content, className)}>{children}</div>
    </div>
);

export default ProfileInfoFormGroup;
