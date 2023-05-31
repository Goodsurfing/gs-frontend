import React, { FC } from "react";

import HostMainInfoForm from "../HostMainInfoForm/HostMainInfoForm";

import styles from "./HostRegistrationPage.module.scss";

const HostRegistrationPage: FC = () => (
    <div className={styles.wrapper}>
        <HostMainInfoForm />
    </div>
);

export default HostRegistrationPage;
