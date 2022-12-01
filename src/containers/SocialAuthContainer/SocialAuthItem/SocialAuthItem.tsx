import React, { FC } from "react";

import styles from "./SocialAuthItem.module.scss";

interface SocialAuthItemProps {
    title: string;
    icon: string;
    color: string;
}

const SocialAuthItem: FC<SocialAuthItemProps> = ({ title, icon, color }) => {
    return (
        <div className={styles.item} style={{ backgroundColor: color }}>
            <div className={styles.icon}>
                <img src={icon} alt={title} />
            </div>
            <div className={styles.title}>
                <span>{title}</span>
            </div>
        </div>
    );
};

export default SocialAuthItem;
