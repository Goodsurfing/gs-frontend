import Input from "@/components/ui/Input/Input";
import React, { FC } from "react";

import styles from './HostMainInfoContent.module.scss';
import RegistrationOfHostMap from "./RegistratoinOfHostMap/RegistrationOfHostMap";

const HostMainInfoContent = () => {
    return (
        <div className={styles.wrapper}>
            <RegistrationOfHostMap />
        </div>
    )
};

export default HostMainInfoContent;
