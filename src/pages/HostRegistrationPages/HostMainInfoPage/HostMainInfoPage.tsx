import React, { FC } from "react";

import HostMainInfoForm from "./HostMainInfoForm/HostMainInfoForm";
import styles from "./HostMainInfoPage.module.scss";

const HostMainInfoPage: FC = () => {

    return (
        <div className={styles.wrapper}>
            <HostMainInfoForm />
        </div>
    );
};

export default HostMainInfoPage;
