import React, { FC, memo } from "react";

import { Host } from "@/entities/Host";
import styles from "./HostPageContent.module.scss";

interface HostPageContentProps {
    host: Host;
}

export const HostPageContent: FC<HostPageContentProps> = memo((props: HostPageContentProps) => {
    const { host } = props;
    return (
        <div className={styles.wrapper}>HostPageContent</div>
    );
});
