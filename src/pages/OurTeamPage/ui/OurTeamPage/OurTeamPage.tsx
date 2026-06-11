import React from "react";

import { useTranslation } from "react-i18next";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getOurTeamPageUrl } from "@/shared/config/routes/AppUrls";
import { getSeoUrl } from "@/shared/lib/getSeoUrl";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { SeoHelmet } from "@/shared/ui/SeoHelmet";
import { MainPageLayout } from "@/widgets/MainPageLayout";

import { Founders } from "../Founders/Founders";
import { GoodsurfingTeam } from "../GoodsurfingTeam/GoodsurfingTeam";
import { Header } from "../Header/Header";
import styles from "./OurTeamPage.module.scss";

const OurTeamPage = () => {
    const { locale } = useLocale();
    const { t, ready } = useTranslation("our-team");

    return (
        <MainPageLayout>
            {ready && (
                <SeoHelmet
                    title={t("seo.title")}
                    description={t("seo.description")}
                    canonicalUrl={getSeoUrl(getOurTeamPageUrl(locale))}
                    keywords={t("seo.keywords")}
                    ogTitle={t("seo.ogTitle")}
                    ogDescription={t("seo.ogDescription")}
                />
            )}
            <div className={styles.wrapper}>
                <Header />
                <div className={styles.content}>
                    <Founders />
                    <GoodsurfingTeam />
                    <ButtonLink
                        className={styles.button}
                        path="https://forms.yandex.ru/u/696e118d84227c5fcdfb5933/"
                        type="primary"
                        size="MEDIUM"
                        target="_blank"
                    >
                        {t("Хочу в команду")}
                    </ButtonLink>
                </div>
            </div>
        </MainPageLayout>
    );
};

export default OurTeamPage;
