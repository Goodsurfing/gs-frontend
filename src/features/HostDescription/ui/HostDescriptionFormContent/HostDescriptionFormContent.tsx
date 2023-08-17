import { memo } from "react";
import cn from "classnames";

import {
    HostDescriptionOrganization,
} from "../HostDescriptionOrganization/HostDescriptionOrganization";
import {
    HostDescriptionSocial,
} from "../HostDescriptionSocial/HostDescriptionSocial";

import {
    HostDescriptionAvatar,
} from "../HostDescriptionAvatar/HostDescriptionAvatar";

import styles from "./HostDescriptionFormContent.module.scss";

interface HostDescriptionFormContentProps {
    className?: string;
}

export const HostDescriptionFormContent = memo((props: HostDescriptionFormContentProps) => {
    const { className } = props;

    return (
        <>
            <div className={styles.mainSection}>
                <HostDescriptionOrganization />
                <HostDescriptionSocial />
            </div>
            <HostDescriptionAvatar />
        </>
    );
});
