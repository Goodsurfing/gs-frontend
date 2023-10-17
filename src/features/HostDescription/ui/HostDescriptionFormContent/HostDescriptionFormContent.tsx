import { memo } from "react";

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
