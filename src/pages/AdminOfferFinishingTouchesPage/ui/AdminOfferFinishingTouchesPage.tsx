import { memo } from "react";

import { useTranslation } from "react-i18next";

import { useParams } from "react-router-dom";
import { Text } from "@/shared/ui/Text/Text";
import { AdminFinishingTouches } from "@/widgets/Admin";

import styles from "./AdminOfferFinishingTouchesPage.module.scss";

export const AdminOfferFinishingTouchesPage = memo(() => {
    const { t } = useTranslation("offer");
    const { id } = useParams<{ id: string; }>();

    return (
        <div className={styles.wrapper}>
            <Text titleSize="h2" title={t("finishingTouches.Требования к участнику")} />
            {id && <AdminFinishingTouches offerId={id} className={styles.form} />}
        </div>
    );
});
