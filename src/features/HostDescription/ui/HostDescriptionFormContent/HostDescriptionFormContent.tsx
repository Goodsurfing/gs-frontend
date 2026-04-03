import { memo } from "react";

import { Host } from "@/entities/Host";
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
            <HostDescriptionAvatar hostId={host?.id} />
        </>
    );
});
