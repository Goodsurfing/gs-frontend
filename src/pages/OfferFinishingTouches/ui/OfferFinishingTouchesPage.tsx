import { memo } from "react";

import { useTranslation } from "react-i18next";

import { useParams } from "react-router-dom";
import { Text } from "@/shared/ui/Text/Text";

import { OfferFinishingTouches } from "@/widgets/Offer";
import styles from "./OfferFinishingTouchesPage.module.scss";

export const OfferFinishingTouchesPage = memo(() => {
    const { t } = useTranslation("offer");
    const { id } = useParams<{ id: string; }>();

    return (
        <div className={styles.wrapper}>
            <Text titleSize="h2" title={t("finishingTouches.Требования к участнику")} />
            {id && <OfferFinishingTouches offerId={id} className={styles.form} />}
        </div>
    );
});
