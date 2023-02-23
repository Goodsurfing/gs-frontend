import React, { FC } from "react";

import styles from "./HostMainInfoContent.module.scss";
import YMapWithAddress from "@/components/Ymaps/YMapWithAddress/YMapWithAddress";

const HostMainInfoContent: FC = () => {
    return (
        <div className={styles.wrapper}>
            <YMapWithAddress />
        </div>
    );
};

export default HostMainInfoContent;
