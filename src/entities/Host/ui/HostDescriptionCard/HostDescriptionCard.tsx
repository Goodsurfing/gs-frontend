import cn from "classnames";
import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import { Host } from "../../model/types/host";
import { Text } from "@/shared/ui/Text/Text";
import styles from "./HostDescriptionCard.module.scss";

interface HostDescriptionCardProps {
    className?: string;
    host: Host;
}

export const HostDescriptionCard: FC<HostDescriptionCardProps> = memo(
    (props: HostDescriptionCardProps) => {
        const {
            className,
            host: {
                description,
            },
        } = props;
        const { t } = useTranslation("host");
        return (
            <div id="1" className={cn(className, styles.wrapper)}>
                <Text title={t("personalHost.Об организации")} titleSize="h3" />
                <p className={styles.description}>{description || t("personalHost.Организатор не указал данную информацию")}</p>
            </div>
        );
    },
);
