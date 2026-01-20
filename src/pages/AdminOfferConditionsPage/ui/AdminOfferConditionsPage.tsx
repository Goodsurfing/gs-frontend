import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Text } from "@/shared/ui/Text/Text";

import { AdminOfferConditions } from "@/widgets/Admin";
import styles from "./AdminOfferConditionsPage.module.scss";

export const AdminOfferConditionsPage = () => {
    const { t } = useTranslation("offer");
    const { id } = useParams<{ id: string }>();

    return (
        <div className={styles.wrapper}>
            <Text
                gap={40}
                titleSize="h2"
                textSize="primary"
                title={t("conditions.Чем вы готовы обеспечить волонтёра")}
                text={t("conditions.Волонтёр помогает вам и будет делать это лучше, если ему будет комфортно. Создавая лучшие условия вы привлекаете лучших волонтёров.")}
            />
            {id && <AdminOfferConditions offerId={id} className={styles.form} />}
        </div>
    );
};
