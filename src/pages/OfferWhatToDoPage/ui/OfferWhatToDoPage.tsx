import { useTranslation } from "react-i18next";
import { OfferWhatToDoForm } from "@/features/OfferWhatToDo";
import { Text } from "@/shared/ui/Text/Text";
import styles from "./OfferWhatToDoPage.module.scss";

export const OfferWhatToDoPage = () => {
    const { t } = useTranslation("offer");
    return (
        <div className={styles.wrapper}>
            <Text
                gap={40}
                titleSize="h2"
                textSize="primary"
                title={t("whatToDo.Расскажите, чем нужно будет заниматься")}
                text={t("whatToDo.Подробно опишите, чем нужно будет заниматься — чем больше информации, тем лучше.")}
            />
            <OfferWhatToDoForm />
        </div>
    );
};
