import cn from "classnames";
import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import { Host } from "../../model/types/host";
import styles from "./HostDescriptionCard.module.scss";

interface HostDescriptionCardProps {
    className?: string;
    host: Host;
}

export const HostDescriptionCard: FC<HostDescriptionCardProps> = memo(
    (props: HostDescriptionCardProps) => {
        const {
            className,
            host: { description },
        } = props;
        const { t } = useTranslation("host");
        return (
            <div className={cn(className, styles.wrapper)}>
                <h3>{t("personalHost.Об организации")}</h3>
                <p className={styles.description}>{description || ""}</p>
            </div>
        );
    },
);
