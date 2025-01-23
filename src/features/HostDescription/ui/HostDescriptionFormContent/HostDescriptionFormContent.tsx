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
import { Host } from "@/entities/Host";

interface HostDescriptionFormContentProps {
    host?: Host;
}

export const HostDescriptionFormContent = memo((props: HostDescriptionFormContentProps) => {
    const { host } = props;

    return (
        <>
            <div className={styles.mainSection}>
                <HostDescriptionOrganization />
                <HostDescriptionSocial />
            </div>
            <HostDescriptionAvatar host={host} />
        </>
    );
});
