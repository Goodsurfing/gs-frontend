import { memo } from "react";

import { useTranslation } from "react-i18next";

import { Text } from "@/shared/ui/Text/Text";

import styles from "./OfferFinishingTouchesPage.module.scss";
import { OfferFinishingTouchesForm } from "@/features/OfferFinishingTouches";

export const OfferFinishingTouchesPage = memo(() => {
    const { t } = useTranslation("finishing-touches");
    return (
        <div className={styles.wrapper}>
            <Text titleSize="h1" title={t("Требования к участнику")} />
            <OfferFinishingTouchesForm />
        </div>
    );
});
