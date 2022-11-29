import React, { FC } from "react";

import styles from "./HowItWorkItem.module.scss";

interface HowItWorkItemProps {
    title: string;
    text: string;
    image: string;
}

const HowItWorkItem: FC<HowItWorkItemProps> = ({ title, text, image }) => {
    return (
        <div className={styles.item}>
            <div className={styles.text}>
                <h4>{title}</h4>
                <p>{text}</p>
            </div>
            <img src={image} alt={title} />
        </div>
    );
};

export default HowItWorkItem;
