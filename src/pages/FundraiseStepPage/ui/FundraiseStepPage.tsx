import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import styles from "./FundraiseStepPage.module.scss";

const FundraiseStepPage = () => {
    const { t } = useTranslation(["host", "translation"]);
    const { step } = useParams<{ step: string }>();

    const title = useMemo(() => {
        const map: Record<string, string> = {
            where: t("main.sidebar.Где", { ns: "translation" }),
            when: t("main.sidebar.Когда", { ns: "translation" }),
            amount: t("main.sidebar.Сколько", { ns: "translation" }),
            description: t("main.sidebar.Описание", { ns: "translation" }),
            "auto-messages": t("main.sidebar.Настройка автоматических сообщений", {
                ns: "translation",
            }),
        };

        return map[step ?? ""] || t("main.sidebar.Где", { ns: "translation" });
    }, [step, t]);

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.description}>
                {t("hostFundraiseWelcome.stepPlaceholder")}
            </p>
        </div>
    );
};

export default FundraiseStepPage;
