import cn from "classnames";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getMembershipPageUrl } from "@/shared/config/routes/AppUrls";
import Button from "@/shared/ui/Button/Button";

import { GoodsurfingNowItem } from "../GoodsurfingNowItem/GoodsurfingNowItem";
import { useGetGoodsurfingTodayQuery } from "@/entities/Admin/api/adminApi";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import styles from "./GoodsurfingNow.module.scss";

interface GoodsurfingNowProps {
    className?: string;
}

export const GoodsurfingNow: FC<GoodsurfingNowProps> = (props) => {
    const { className } = props;
    const { t } = useTranslation("about-project");
    const navigate = useNavigate();
    const { locale } = useLocale();
    const { data, isLoading } = useGetGoodsurfingTodayQuery();

    const handleNavigateToRole = () => {
        navigate(getMembershipPageUrl(locale));
    };

    return (
        <section className={cn(className, styles.wrapper)}>
            <h2 className={styles.title}>{t("ГудСёрфинг сегодня")}</h2>
            {isLoading && <MiniLoader />}
            <div className={styles.content}>
                <GoodsurfingNowItem
                    title={data?.volunteerCount.toString() ?? "0"}
                    description={t("гудсёрферов")}
                />
                <GoodsurfingNowItem
                    title={data?.vacancyCountryCount.toString() ?? "0"}
                    description={t("стран")}
                />
                <GoodsurfingNowItem
                    title={data?.vacancyCount.toString() ?? "0"}
                    description={t("вакансий")}
                />
                <GoodsurfingNowItem
                    title={data?.reviewCount.toString() ?? "0"}
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
