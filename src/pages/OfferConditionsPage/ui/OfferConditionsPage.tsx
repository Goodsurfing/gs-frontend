import { useTranslation } from "react-i18next";
import { Text } from "@/shared/ui/Text/Text";

import styles from "./OfferConditionsPage.module.scss";

export const OfferConditionsPage = () => {
    const { t } = useTranslation("offer-conditions");

    return (
        <div className={styles.wrapper}>
            <Text
                gap={40}
                titleSize="h2"
                textSize="primary"
                title={t("Чем вы готовы обеспечить волонтёра")}
                text={t("Волонтёр помогает вам и будет делать это лучше, если ему будет комфортно. Создавая лучшие условия вы привлекаете лучших волонтёров.")}
            />
        </div>
    );
};
