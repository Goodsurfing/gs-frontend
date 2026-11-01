import { ReactNode, memo } from "react";

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
    /** GS-188: блок под аватаром (баннер консультации). */
    aside?: ReactNode;
}

export const HostDescriptionFormContent = memo((props: HostDescriptionFormContentProps) => {
    const { host, aside } = props;

    return (
        <>
            <div className={styles.mainSection}>
                <HostDescriptionOrganization />
                <HostDescriptionSocial />
            </div>
            <div className={styles.side}>
                <HostDescriptionAvatar hostId={host?.id} />
                {aside}
            </div>
        </>
    );
});
