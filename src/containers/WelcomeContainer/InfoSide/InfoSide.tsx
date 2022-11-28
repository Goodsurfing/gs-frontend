import React, { FC } from "react";

import InfoHeader from "@/containers/WelcomeContainer/InfoSide/InfoHeader/InfoHeader";

import styles from "./InfoSide.module.scss";

const InfoSide: FC = () => {
    return (
        <div className={styles.wrapper}>
            <InfoHeader />
        </div>
    );
};

export default InfoSide;
