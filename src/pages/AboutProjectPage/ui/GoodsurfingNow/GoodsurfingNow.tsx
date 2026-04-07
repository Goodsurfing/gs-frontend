import cn from "classnames";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getMembershipPageUrl } from "@/shared/config/routes/AppUrls";
import Button from "@/shared/ui/Button/Button";

import { GoodsurfingNowItem } from "../GoodsurfingNowItem/GoodsurfingNowItem";
import styles from "./GoodsurfingNow.module.scss";

interface GoodsurfingNowProps {
    className?: string;
    today: {
        volunteerCount: number;
        vacancyCountryCount: number;
        vacancyCount: number;
        reviewCount: number;
    }
}

export const GoodsurfingNow: FC<GoodsurfingNowProps> = (props) => {
    const { className, today } = props;
    const { t } = useTranslation("about-project");
    const navigate = useNavigate();
    const { locale } = useLocale();

    const handleNavigateToRole = () => {
        navigate(getMembershipPageUrl(locale));
    };

    return (
        <section className={cn(className)}>
            <h2 className={styles.title}>{t("ГудСёрфинг сегодня")}</h2>
            <div className={styles.content}>
                <GoodsurfingNowItem
                    title={today.volunteerCount.toString() ?? "0"}
                    description={t("гудсёрферов")}
                />
                <GoodsurfingNowItem
                    title={today.vacancyCountryCount.toString() ?? "0"}
                    description={t("стран")}
                />
                <GoodsurfingNowItem
                    title={today.vacancyCount.toString() ?? "0"}
                    description={t("вакансий")}
                />
                <GoodsurfingNowItem
                    title={today.reviewCount.toString() ?? "0"}
                    description={t("отзывов")}
                />
            </div>
            <Button
                className={styles.button}
                color="BLUE"
                size="MEDIUM"
                variant="FILL"
                onClick={handleNavigateToRole}
            >
                {t("Присоединиться")}
            </Button>
        </section>
    );
};
