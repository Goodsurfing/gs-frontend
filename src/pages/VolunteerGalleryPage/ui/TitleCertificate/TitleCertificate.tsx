import cn from "classnames";
import React, { FC, memo } from "react";

import styles from "./TitleCertificate.module.scss";

interface TitleCertificateProps {
    className?: string;
}

export const TitleCertificate: FC<TitleCertificateProps> = memo(
    (props: TitleCertificateProps) => {
        const { className } = props;

        return (
            <div className={cn(className, styles.wrapper)}>
                <h2>Дипломы и сертификаты</h2>
                <p className={styles.description}>
                    Сюда вы можете добавить ваши дипломы и сертификаты, которые
                    подтверждают ваш опыт и навыки.
                </p>
            </div>
        );
    },
);
