import React, { FC } from "react";

import { socialAuthData } from "@/containers/SocialAuthContainer/SocialAuth.data";
import SocialAuthItem from "@/containers/SocialAuthContainer/SocialAuthItem/SocialAuthItem";

import styles from "./SocialAuthContainer.module.scss";

const SocialAuthContainer: FC = () => {
    return (
        <div className={styles.wrapper}>
            {socialAuthData &&
                socialAuthData.map((item, index) => {
                    return <SocialAuthItem key={index} {...item} />;
                })}
        </div>
    );
};

export default SocialAuthContainer;
