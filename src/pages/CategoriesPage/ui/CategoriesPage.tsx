import React from "react";

import { useTranslation } from "react-i18next";
import { CategoriesWidget } from "@/widgets/CategoriesWidget";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import styles from "./CategoriesPage.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getCategoriesPageUrl } from "@/shared/config/routes/AppUrls";
import { PageSeo } from "@/shared/ui/SeoHelmet";

const CategoriesPage = () => {
    const { t } = useTranslation();
    const { locale } = useLocale();

    return (
        <MainPageLayout>
            <PageSeo section="categories" path={getCategoriesPageUrl(locale)} />
            <div className={styles.wrapper}>
                <h2 className={styles.title}>{t("category-offer.Выбирайте по интересам")}</h2>
                <CategoriesWidget className={styles.container} locale={locale} />
            </div>
        </MainPageLayout>
    );
};

export default CategoriesPage;
