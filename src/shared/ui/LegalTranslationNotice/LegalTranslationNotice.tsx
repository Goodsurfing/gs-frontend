import cn from "classnames";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import styles from "./LegalTranslationNotice.module.scss";

interface LegalTranslationNoticeProps {
    className?: string;
}

/**
 * Плашка над переводом юридического документа: юридическую силу имеет
 * только русская версия, перевод — для удобства.
 */
export const LegalTranslationNotice: FC<LegalTranslationNoticeProps> = ({ className }) => {
    const { t } = useTranslation();
    return (
        <p className={cn(styles.notice, className)} role="note">
            {t("Это неофициальный перевод для удобства Юридическую силу имеет только версия документа на русском языке")}
        </p>
    );
};
