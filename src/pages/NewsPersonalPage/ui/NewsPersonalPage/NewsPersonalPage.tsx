import React from "react";
import { MainPageLayout } from "@/widgets/MainPageLayout";
import styles from "./NewsPersonalPage.module.scss";
import { Navigation } from "@/features/Article";
import { getNewsPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

const NewsPersonalPage = () => {
    const { locale } = useLocale();
    return (
        <MainPageLayout>
            <div className={styles.wrapper}>
                <Navigation mainLink={getNewsPageUrl(locale)} nameMain="Новости" nameArticle="Тест1" />
            </div>
        </MainPageLayout>
    );
};

export default NewsPersonalPage;
