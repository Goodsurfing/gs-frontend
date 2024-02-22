import cn from "classnames";
import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import styles from "./TitleCertificate.module.scss";

interface TitleCertificateProps {
    className?: string;
}

export const TitleCertificate: FC<TitleCertificateProps> = memo(
    (props: TitleCertificateProps) => {
        const { className } = props;
        const { t } = useTranslation("volunteer");
        return (
            <div className={cn(className, styles.wrapper)}>
                <h2>{t("volunteer-gallery.Дипломы и сертификаты")}</h2>
                <p className={styles.description}>
                    {t("volunteer-gallery.Сюда вы можете добавить ваши дипломы и сертификаты, которые подтверждают ваш опыт и навыки.")}
                </p>
            </div>
        );
    },
);
