import cn from "classnames";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getMembershipPageUrl } from "@/shared/config/routes/AppUrls";
import { formatStatNumber } from "@/shared/lib/formatStat";
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
                    title={formatStatNumber(today.volunteerCount ?? 0, locale)}
                    description={t("гудсёрферов")}
                />
                <GoodsurfingNowItem
                    title={formatStatNumber(today.vacancyCountryCount ?? 0, locale)}
                    description={t("стран")}
                />
                <GoodsurfingNowItem
                    title={formatStatNumber(today.vacancyCount ?? 0, locale)}
                    description={t("вакансий")}
                />
                <GoodsurfingNowItem
                    title={formatStatNumber(today.reviewCount ?? 0, locale)}
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
