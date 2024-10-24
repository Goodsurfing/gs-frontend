import cn from "classnames";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";
import Button from "@/shared/ui/Button/Button";

import styles from "./Mission.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getNPOPageUrl } from "@/shared/config/routes/AppUrls";

interface MissionProps {
    className?: string;
}

export const Mission: FC<MissionProps> = (props: MissionProps) => {
    const { className } = props;
    const { t } = useTranslation("about-project");
    const navigate = useNavigate();
    const { locale } = useLocale();

    const handleNavigateToRole = () => {
        navigate(getNPOPageUrl(locale));
    };

    return (
        <section className={cn(className, styles.wrapper)}>
            <h2 className={styles.title}>{t("Миссия ГудСёрфинга")}</h2>
            <p className={styles.description}>
                {t(
                    "Миccия Гудсёрфинга – развитие выездного добровольчества",
                )}
            </p>
            <Button
                className={styles.button}
                color="BLUE"
                size="MEDIUM"
                variant="FILL"
                onClick={handleNavigateToRole}
            >
                {t("О некоммерческой организации")}
            </Button>
        </section>
    );
};
