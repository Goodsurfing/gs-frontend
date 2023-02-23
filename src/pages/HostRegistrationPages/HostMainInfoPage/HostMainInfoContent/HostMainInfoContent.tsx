import React, { FC } from "react";

import styles from "./HostMainInfoContent.module.scss";
import RegistrationOfHostMap from "./RegistratoinOfHostMap/RegistrationOfHostMap";

const HostMainInfoContent: FC = () => {
    return (
        <div className={styles.wrapper}>
            <RegistrationOfHostMap />
        </div>
    );
};

export default HostMainInfoContent;
