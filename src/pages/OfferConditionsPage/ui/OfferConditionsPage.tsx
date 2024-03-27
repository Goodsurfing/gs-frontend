import { useTranslation } from "react-i18next";
import { Text } from "@/shared/ui/Text/Text";

import styles from "./OfferConditionsPage.module.scss";
import { OfferConditionsForm } from "@/features/OfferConditions";

export const OfferConditionsPage = () => {
    const { t } = useTranslation("offer");

    return (
        <div className={styles.wrapper}>
            <Text
                gap={40}
                titleSize="h2"
                textSize="primary"
                title={t("conditions.Чем вы готовы обеспечить волонтёра")}
                text={t("conditions.Волонтёр помогает вам и будет делать это лучше, если ему будет комфортно. Создавая лучшие условия вы привлекаете лучших волонтёров.")}
            />
            <OfferConditionsForm className={styles.form} />
        </div>
    );
};
