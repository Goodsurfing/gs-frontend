import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Text } from "@/shared/ui/Text/Text";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { AdminOfferWhatToDo } from "@/widgets/Admin";
import styles from "./AdminOfferWhatToDoPage.module.scss";

export const AdminOfferWhatToDoPage = () => {
    const { t, ready } = useTranslation("offer");
    const { id } = useParams<{ id: string }>();

    if (!ready) {
        return (
            <div className={styles.wrapper}>
                <MiniLoader />
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <Text
                gap={40}
                titleSize="h2"
                textSize="primary"
                title={t("whatToDo.Расскажите, чем нужно будет заниматься")}
                text={t("whatToDo.Подробно опишите, чем нужно будет заниматься — чем больше информации, тем лучше.")}
            />
            {id && <AdminOfferWhatToDo offerId={id} />}
        </div>
    );
};
