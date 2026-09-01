import React from "react";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import { MainPageLayout } from "@/widgets/MainPageLayout";
import { Header } from "../Header/Header";
import { FindOffer } from "../FindOffer/FindOffer";
import { SeasonalWork } from "../SeasonalWork/SeasonalWork";
import { useLocale } from "@/app/providers/LocaleProvider";
import { OffersSlider } from "@/widgets/OffersSlider";
import { HowItWorkContainer } from "@/pages/MainPage";
import styles from "./FindJobPage.module.scss";

// Категория "Оплачиваемая работа" — тот же id, что уже используется для
// её карточки на главной (src/shared/data/categories, path "?category=13").
// Стабильного code/slug у категорий на бэке нет, только числовой id.
const PAID_WORK_CATEGORY_ID = 13;

const FindJobPage = () => {
    const { t } = useTranslation("find-job");
    const { locale } = useLocale();

    return (
        <MainPageLayout>
            <div className={styles.wrapper}>
                <Header />
                <div className={styles.content}>
                    <h2 className={styles.title}>{t("Как это работает?")}</h2>
                    <HowItWorkContainer className={cn(styles.howItWork, styles.container)} />
                    <h2 className={styles.title}>{t("Интересные вакансии")}</h2>
                    <OffersSlider
                        className={styles.container}
                        categoryIds={[PAID_WORK_CATEGORY_ID]}
                    />
                </div>
                <FindOffer locale={locale} />
                <div className={styles.content}>
                    <SeasonalWork />
                </div>
            </div>
        </MainPageLayout>
    );
};

export default FindJobPage;
